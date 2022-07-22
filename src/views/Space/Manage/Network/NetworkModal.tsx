import { observer } from 'mobx-react-lite'
import { Form } from '@QCFE/lego-ui'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import { useCallback, useRef, useState } from 'react'
import {
  getAllVxnetsKey,
  getRoutersKey,
  useQueryDescribeRouters,
  useQueryDescribeRoutersAllVxnets
} from 'hooks'
import { flatten } from 'lodash-es'
import { useImmer } from 'use-immer'
import tw, { css, styled } from 'twin.macro'
import { useQueryClient } from 'react-query'
import { useDebounce } from 'react-use'
import { AffixLabel, FlexBox, HelpCenterLink, Modal, SelectWithRefresh, TextLink } from 'components'

interface ISpaceEditProps {
  spaceId: string
  regionId: string
  vpcId?: string
  xnetId?: string
  regionName: string
  onClose: () => void
  actionName?: string
  onOk: (v: Record<string, any>) => void
  confirmLoading: boolean
}

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
  `
])

const WarnWrapper = styled('div')(() => [
  tw`w-full border rounded border-info-border bg-info-bg mt-2 px-4 py-2 text-info`
])

export const NetworkFormItem = (
  props: Pick<ISpaceEditProps, 'spaceId' | 'vpcId' | 'regionId' | 'regionName' | 'xnetId'>
) => {
  const { spaceId, vpcId, regionId, regionName, xnetId } = props

  const [params, setParams] = useImmer<{
    router_id?: string
    vxnet_id?: string
  }>({
    router_id: vpcId,
    vxnet_id: xnetId
  })

  const [xnetSearch, setXnetSearch] = useState('')
  const [routerSearch, setRouterSearch] = useState('')
  const [routerSearch1, setRouterSearch1] = useState(routerSearch)
  useDebounce(
    () => {
      setRouterSearch1(routerSearch)
    },
    300,
    [routerSearch]
  )

  const routersRet = useQueryDescribeRouters({
    offset: 0,
    limit: 10,
    regionId,
    spaceId,
    search_word: routerSearch1
  })
  const vxnetsRet = useQueryDescribeRoutersAllVxnets({
    // offset: 0,
    // limit: 200,
    router: params.router_id || '',
    regionId
  })

  const queryClient = useQueryClient()
  const routers = flatten(routersRet.data?.pages.map((page) => page.router_set || []))

  const vxnets = vxnetsRet?.data?.router_vxnet_set || []
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
    refetctNetwork(getAllVxnetsKey)
  }, [refetctNetwork])

  const renderVpcWarn = () => {
    if (regionName) {
      return (
        <WarnWrapper>
          <div>
            1. 当前工作空间所在区域为 <b>{regionName}</b>，仅支持使用
            <b>{regionName}</b>
            VPC
          </div>
          <div>2. 不支持使用免费型 VPC</div>
        </WarnWrapper>
      )
    }
    return null
  }

  const renderVxnetWarn = () => (
    <WarnWrapper>
      <div>
        详情请查看
        <HelpCenterLink href="/intro/restriction/" isIframe={false}>
          私有网络限制
        </HelpCenterLink>
      </div>
    </WarnWrapper>
  )

  return (
    <>
      <SelectWithRefresh
        label={<AffixLabel>VPC 网络</AffixLabel>}
        placeholder="请选择 VPC"
        validateOnBlur
        name="router_id"
        onRefresh={refectRouters}
        value={params.router_id}
        options={routers.map(({ router_id, router_name }) => ({
          value: router_id,
          label: router_name
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
        // onChange={searchRouter}
        searchable
        onInputChange={(v: string) => {
          setRouterSearch(v)
        }}
        openOnClick
        isLoadingAtBottom
        isLoading={routersRet.isFetching}
        onMenuScrollToBottom={() => {
          if (routersRet.hasNextPage) {
            routersRet.fetchNextPage()
          }
        }}
        bottomTextVisible
        help={
          <>
            如需选择新的 VPC，您可以
            <TextLink href="/iaas/vpc/create" target="_blank" hasIcon>
              新建 VPC 网络
            </TextLink>
            {renderVpcWarn()}
          </>
        }
        onChange={(v: string) => {
          setParams((draft) => {
            draft.router_id = v
            draft.vxnet_id = ''
          })
        }}
        searchAb
        schemas={[
          {
            rule: {
              required: true,
              isExisty: false
            },
            status: 'error',
            help: (
              <>
                <span>不能为空,</span>
                <span tw="text-neut-8 ml-2">如需选择新的 VPC，您可以</span>
                <TextLink href="/iaas/vpc/create" target="_blank" hasIcon>
                  新建 VPC 网络
                </TextLink>
                {renderVpcWarn()}
              </>
            )
          }
        ]}
      />

      {params.router_id && params.router_id !== vpcId && (
        <SelectWithRefresh
          label={<AffixLabel>私有网络</AffixLabel>}
          placeholder="请选择私有网络"
          validateOnBlur
          name="vxnet_id"
          value={params.vxnet_id}
          key={params.router_id}
          onRefresh={refectVxnets}
          options={vxnets
            .map(({ vxnet_id, vxnet_name }) => ({
              value: vxnet_id,
              label: vxnet_name
            }))
            .filter((v) => v.value.includes(xnetSearch) || v.label.includes(xnetSearch))}
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
          // isLoadingAtBottom
          searchable
          onInputChange={(v: string) => {
            setXnetSearch(v)
          }}
          openOnClick
          schemas={[
            {
              rule: {
                required: true,
                isExisty: false
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
                  {renderVxnetWarn()}
                </>
              )
            }
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
              {renderVxnetWarn()}
            </>
          }
        />
      )}
    </>
  )
}

const NetworkModal = observer((props: ISpaceEditProps) => {
  const {
    spaceId,
    vpcId,
    regionId,
    regionName,
    onClose,
    xnetId,
    actionName = '更换',
    onOk,
    confirmLoading
  } = props

  const form = useRef<Form>()

  return (
    <Modal
      title={`${actionName} VPC`}
      // @ts-ignore
      closable
      visible
      width={800}
      onOk={() => {
        if (form.current?.validateFields()) {
          onOk({
            ...form.current?.getFieldsValue(),
            spaceId
          })
        }
      }}
      onCancel={onClose}
      confirmLoading={confirmLoading}
      appendToBody
      okText={actionName}
      cancelText="取消"
    >
      <FormWrapper>
        <Form ref={form} tw="max-w-[100%]!">
          <NetworkFormItem
            vpcId={vpcId}
            xnetId={xnetId}
            regionId={regionId}
            regionName={regionName}
            spaceId={spaceId}
          />
        </Form>
      </FormWrapper>
    </Modal>
  )
})

export default NetworkModal
