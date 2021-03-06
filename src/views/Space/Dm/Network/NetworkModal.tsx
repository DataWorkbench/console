import { useCallback, useRef } from 'react'
import { Form } from '@QCFE/lego-ui'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import { observer } from 'mobx-react-lite'
import tw, { styled, css } from 'twin.macro'
import { useImmer } from 'use-immer'
import { useQueryClient } from 'react-query'
import { assign, flatten } from 'lodash-es'
import { useParams } from 'react-router-dom'
import {
  Modal,
  FlexBox,
  AffixLabel,
  SelectWithRefresh,
  TextLink,
  HelpCenterLink,
} from 'components'

import {
  useStore,
  useMutationNetwork,
  getNetworkKey,
  useQueryDescribeRouters,
  useQueryDescribeRoutersVxnets,
  getRoutersKey,
  getVxnetsKey,
} from 'hooks'

import { nameMatchRegex } from 'utils/convert'

const { TextField } = Form

const FormWrapper = styled('div')(() => [
  css`
    ${tw`w-[686px] overflow-auto `}
    form.is-horizon-layout {
      ${tw`pl-0`}
      > .field {
        > .label {
          ${tw`pr-2`}
        }
        > .control {
          &,
          & > input {
            ${tw`w-[416px] max-w-[416px]`}
          }
        }
        .select {
          ${tw`w-[416px] max-w-[416px]`}
        }
        > .help {
          ${tw`w-[420px] flex-wrap`}
        }
      }
    }
  `,
])

const WarnWrapper = styled('div')(() => [
  tw`w-full border rounded border-[#F5C414] bg-[rgba(254, 249, 195, 0.1)] mt-2 px-4 py-2 text-[#FACC15]`,
])

const defaultParams = {
  name: '',
  router_id: '',
  vxnet_id: '',
}

const NetworkModal = observer(
  ({
    opNetwork,
    appendToBody = false,
  }: {
    opNetwork?: typeof defaultParams & { id?: string }
    appendToBody?: boolean
  }) => {
    const {
      dmStore: { setNetWorkOp, networkOp },
      globalStore: { curRegionInfo },
    } = useStore()
    const [params, setParams] = useImmer(opNetwork || defaultParams)

    const { regionId } = useParams<{ regionId: string }>()
    const formRef = useRef<Form>(null)
    const queryClient = useQueryClient()
    const routersRet = useQueryDescribeRouters({
      offset: 0,
      limit: 10,
    })
    const vxnetsRet = useQueryDescribeRoutersVxnets({
      offset: 0,
      limit: 200,
      router: params.router_id || '',
    })
    const mutation = useMutationNetwork()
    const routers = flatten(
      routersRet.data?.pages.map((page) => page.router_set || [])
    )
    const vxnets = flatten(
      vxnetsRet.data?.pages.map((page) => page.router_vxnet_set || [])
    )

    const handleOk = () => {
      const form = formRef.current
      if (form?.validateFields()) {
        const paramsData = assign(
          {
            op: networkOp,
            ...params,
          },
          opNetwork && { network_id: opNetwork.id }
        )
        mutation.mutate(paramsData, {
          onSuccess: () => {
            setNetWorkOp('')
            queryClient.invalidateQueries(getNetworkKey())
          },
        })
      }
    }

    const refetctNetwork = useCallback(
      (getKey: () => any) => {
        queryClient.invalidateQueries(getKey())
      },
      [queryClient]
    )

    const refectRouters = useCallback(() => {
      refetctNetwork(getRoutersKey)
    }, [refetctNetwork])

    const refectVxnets = useCallback(() => {
      refetctNetwork(getVxnetsKey)
    }, [refetctNetwork])

    const renderVpcWarn = () => {
      if (curRegionInfo) {
        const { name } = curRegionInfo
        return (
          <WarnWrapper>
            <div>
              1. ????????????????????????????????? <b>{name}</b>??????????????????<b>{name}</b>
              VPC
            </div>
            <div>
              2. ???????????????????????? VPC?????????????????? VPC
              ????????????????????????????????????????????????????????? VPC ????????????????????????
            </div>
          </WarnWrapper>
        )
      }
      return null
    }

    const renderVxnetWarn = () => (
      <WarnWrapper>
        <div>
          ???????????????
          <HelpCenterLink href="/intro/restriction/" isIframe={false}>
            ??????????????????
          </HelpCenterLink>
        </div>
      </WarnWrapper>
    )

    return (
      <Modal
        title={`${networkOp === 'create' ? '??????' : '??????'}??????`}
        confirmLoading={mutation.isLoading}
        visible
        onOk={handleOk}
        onCancel={() => setNetWorkOp('')}
        width={800}
        draggable
        okText={networkOp === 'create' ? '??????' : '??????'}
        appendToBody={appendToBody}
      >
        <FlexBox tw="h-full overflow-hidden">
          <FormWrapper>
            <Form ref={formRef}>
              <TextField
                autoComplete="off"
                label={<AffixLabel>????????????</AffixLabel>}
                placeholder="?????????????????????"
                name="name"
                validateOnBlur
                value={params.name}
                onChange={(v: string) => {
                  setParams((draft) => {
                    draft.name = v
                  })
                }}
                schemas={[
                  {
                    rule: {
                      required: true,
                      matchRegex: nameMatchRegex,
                      maxLength: 128,
                      minLength: 2,
                    },
                    status: 'error',
                    help: '???????????????????????? 2???128 ????????????????????????????????????_???,????????????_???????????????',
                  },
                ]}
              />
              <SelectWithRefresh
                label={<AffixLabel>VPC ??????</AffixLabel>}
                placeholder="????????? VPC"
                validateOnBlur
                name="router_id"
                onRefresh={refectRouters}
                value={params.router_id}
                options={routers.map(({ router_id, router_name }) => ({
                  value: router_id,
                  label: router_name,
                }))}
                optionRenderer={(option: { label: string; value: string }) => (
                  <FlexBox tw="items-center">
                    <Icon name="vpc" tw="mr-2.5" size={18} />
                    <div>
                      <div>{option.label || option.value}</div>
                      <div tw="text-neut-8">{option.value}</div>
                    </div>
                  </FlexBox>
                )}
                onChange={(v: string) => {
                  setParams((draft) => {
                    draft.router_id = v
                    draft.vxnet_id = ''
                  })
                }}
                isLoadingAtBottom
                isLoading={routersRet.isFetching}
                searchable={false}
                onMenuScrollToBottom={() => {
                  if (routersRet.hasNextPage) {
                    routersRet.fetchNextPage()
                  }
                }}
                bottomTextVisible
                help={
                  <>
                    ?????????????????? VPC????????????
                    <TextLink href="/iaas/vpc/create" target="_blank" hasIcon>
                      ?????? VPC ??????
                    </TextLink>
                    {renderVpcWarn()}
                  </>
                }
                schemas={[
                  {
                    rule: {
                      required: true,
                      isExisty: false,
                    },
                    status: 'error',
                    help: (
                      <>
                        <span>????????????,</span>
                        <span tw="text-neut-8 ml-2">
                          ?????????????????? VPC????????????
                        </span>
                        <TextLink
                          href="/iaas/vpc/create"
                          target="_blank"
                          hasIcon
                        >
                          ?????? VPC ??????
                        </TextLink>
                        {renderVpcWarn()}
                      </>
                    ),
                  },
                ]}
              />

              <SelectWithRefresh
                label={<AffixLabel>????????????</AffixLabel>}
                placeholder="?????????????????????"
                validateOnBlur
                name="vxnet_id"
                value={params.vxnet_id}
                key={params.router_id}
                onRefresh={refectVxnets}
                options={vxnets.map(({ vxnet_id, vxnet_name }) => ({
                  value: vxnet_id,
                  label: vxnet_name,
                }))}
                optionRenderer={(option: { label: string; value: string }) => (
                  <FlexBox tw="items-center">
                    <Icon name="network" tw="mr-2.5" size={18} type="light" />
                    <div>
                      <div>{option.label || option.value}</div>
                      <div tw="text-neut-8">{option.value}</div>
                    </div>
                  </FlexBox>
                )}
                onChange={(v: string) => {
                  setParams((draft) => {
                    draft.vxnet_id = v
                  })
                }}
                isLoading={vxnetsRet.isFetching}
                isLoadingAtBottom
                searchable={false}
                onMenuScrollToBottom={() => {
                  if (vxnetsRet.hasNextPage) {
                    vxnetsRet.fetchNextPage()
                  }
                }}
                bottomTextVisible
                schemas={[
                  {
                    rule: {
                      required: true,
                      isExisty: false,
                    },
                    status: 'error',
                    help: (
                      <>
                        ????????????, <span tw="text-neut-8 ml-2">?????????</span>
                        <TextLink
                          href={
                            params.router_id
                              ? `/${regionId}/routers/${params.router_id}`
                              : `/${regionId}/vxnets`
                          }
                          target="_blank"
                          rel="noreferrer"
                          hasIcon
                          // className="link"
                        >
                          ??????????????????
                        </TextLink>
                        {renderVxnetWarn()}
                      </>
                    ),
                  },
                ]}
                help={
                  <>
                    ?????????
                    <TextLink
                      href={
                        params.router_id
                          ? `/${regionId}/routers/${params.router_id}`
                          : `/${regionId}/vxnets`
                      }
                      target="_blank"
                      // tw="text-green-11"
                      rel="noreferrer"
                      hasIcon
                      // className="link"
                    >
                      ??????????????????
                    </TextLink>
                    {renderVxnetWarn()}
                  </>
                }
              />
            </Form>
          </FormWrapper>
        </FlexBox>
      </Modal>
    )
  }
)

export default NetworkModal
