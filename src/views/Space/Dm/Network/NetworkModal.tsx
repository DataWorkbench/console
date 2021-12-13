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
          ${tw`w-auto`}
          .select-control {
            ${tw`w-[328px]`}
          }
        }
        > .help {
          ${tw`w-[328px]`}
        }
      }
    }
  `,
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
    appendToBody: boolean
  }) => {
    const {
      dmStore: { setOp, op },
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
            op,
            ...params,
          },
          opNetwork && { network_id: opNetwork.id }
        )
        mutation.mutate(paramsData, {
          onSuccess: () => {
            setOp('')
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

    return (
      <Modal
        title={`${op === 'create' ? '新建' : '修改'}网络`}
        confirmLoading={mutation.isLoading}
        visible
        onOk={handleOk}
        onCancel={() => setOp('')}
        width={680}
        draggable
        okText={op === 'create' ? '新建' : '确认'}
        appendToBody={appendToBody}
      >
        <FlexBox tw="h-full overflow-hidden">
          <FormWrapper>
            <Form ref={formRef}>
              <TextField
                label={<AffixLabel>网络名称</AffixLabel>}
                placeholder="请输入网络名称"
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
                    help: '不能为空，长度为 2～128 位。字母、数字或下划线（_）,不能以（_）开始结尾',
                  },
                ]}
              />
              <SelectWithRefresh
                label={<AffixLabel>VPC 网络</AffixLabel>}
                placeholder="请选择 VPC"
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
                    <Icon name="vpc" tw="mr-2.5" size={18} type="light" />
                    <div>
                      <div>{option.label || '无'}</div>
                      <div tw="text-neut-8">{option.value}</div>
                    </div>
                  </FlexBox>
                )}
                onChange={(v: string) => {
                  setParams((draft) => {
                    draft.router_id = v
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
                    如需选择新的 VPC，您可以
                    <TextLink
                      href="/iaas/vpc/create"
                      target="_blank"
                      // className="link"
                      // tw="text-green-11"
                      hasIcon
                    >
                      新建 VPC 网络
                    </TextLink>
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
                        <span>不能为空,</span>
                        <span tw="text-neut-8 ml-2">
                          如需选择新的 VPC，您可以
                        </span>
                        <TextLink
                          href="/iaas/vpc/create"
                          target="_blank"
                          hasIcon
                          // className="link"
                        >
                          新建 VPC 网络
                        </TextLink>
                      </>
                    ),
                  },
                ]}
              />
              <SelectWithRefresh
                label={<AffixLabel>私有网络</AffixLabel>}
                placeholder="请选择私有网络"
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
                      <div>{option.label || '无'}</div>
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
                        不能为空, <span tw="text-neut-8 ml-2">您可以</span>
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
                          新建私有网络
                        </TextLink>
                      </>
                    ),
                  },
                ]}
                help={
                  <>
                    您可以
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
                      新建私有网络
                    </TextLink>
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
