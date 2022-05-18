import { observer } from 'mobx-react-lite'
import { Collapse, Form, RadioButton } from '@QCFE/lego-ui'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import { nameMatchRegex, strlen } from 'utils/convert'
import { useCallback, useRef, useState } from 'react'
import {
  getAllVxnetsKey,
  getRoutersKey,
  MutationWorkSpaceParams,
  useQueryDescribeRouters,
  useQueryDescribeRoutersAllVxnets,
} from 'hooks'
import { flatten, throttle } from 'lodash-es'
import { useImmer } from 'use-immer'
import tw, { css, styled } from 'twin.macro'
import { useQueryClient } from 'react-query'
import { useDebounce } from 'react-use'
import {
  AffixLabel,
  Center,
  FlexBox,
  HelpCenterLink,
  Modal,
  SelectWithRefresh,
  TextLink,
} from 'components'
import { isDarkTheme } from 'utils/theme'

interface ISpaceEditProps {
  curSpaceOpt: 'create' | 'update'
  curSpace?: Record<string, any>
  region: Record<string, any>
  onClose: () => void
  onOk: (data: MutationWorkSpaceParams) => void
  confirmLoading: boolean
}

const { TextField, RadioGroupField, TextAreaField } = Form

const { CollapseItem } = Collapse

const Root = styled.div`
  .collapse-item-content > .field {
    ${tw`block pl-6 max-w-[550px]`}
  }

  .collapse-item-content {
    ${tw`pl-0`}
  }
`
const WarnWrapper = styled('div')(() => [
  tw`w-full border rounded border-[#F5C414] bg-[rgba(254, 249, 195, 0.1)] mt-2 px-4 py-2 text-[#FACC15]`,
])

const CollapseWrapper = styled(Collapse)(() => [
  tw`w-full border-0`,
  css`
    .collapse-item > .collapse-item-label {
      box-shadow: inset 0px -1px 0px #e4ebf1;

      ${tw`border-0 h-[52px] flex items-center justify-between`}
      .icon {
        ${tw`relative top-0 right-0`}
      }
    }
  `,
])

const SpaceEditModal = observer((props: ISpaceEditProps) => {
  const { curSpaceOpt, curSpace, region, onClose, onOk, confirmLoading } = props
  const regionId = region.id

  const [params, setParams] = useImmer(
    curSpaceOpt === 'create' ? { router_id: '', vxnet_id: '' } : { ...curSpace }
  )

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
  const searchRouter = useDebounce((search: string) => {
    setRouterSearch(search)
  }, 300)
  const routersRet = useQueryDescribeRouters({
    offset: 0,
    limit: 10,
    regionId,
    search_word: routerSearch1,
  })
  const vxnetsRet = useQueryDescribeRoutersAllVxnets({
    // offset: 0,
    // limit: 200,
    router: params.router_id || '',
    regionId,
  })

  const queryClient = useQueryClient()
  const routers = flatten(
    routersRet.data?.pages.map((page) => page.router_set || [])
  )

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
    if (region) {
      const { name } = region
      return (
        <WarnWrapper>
          <div>
            1. 当前工作空间所在区域为 <b>{name}</b>，仅支持使用<b>{name}</b>
            VPC
          </div>
          <div>
            2. 不支持使用免费型 VPC（由于免费型 VPC
            不具备公网访问能力，暂时不支持在免费型 VPC 中创建计算集群）
          </div>
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

  const form = useRef<Form>()
  const handleOk = () => {
    if (['create', 'update'].includes(curSpaceOpt)) {
      if (form.current?.validateForm()) {
        const fields = form.current.getFieldsValue()
        const params1 = {
          regionId,
          op: curSpaceOpt,
          ...fields,
        }
        if (curSpaceOpt === 'update') {
          params1.spaceId = curSpace?.id
        }
        onOk(params1)
      }
    }
  }

  return (
    <Modal
      title={`${curSpaceOpt === 'create' ? '创建' : '修改'}工作空间`}
      // @ts-ignore
      closable
      visible
      width={800}
      orient="fullright"
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={confirmLoading}
      okText={curSpaceOpt === 'create' ? '创建' : '修改'}
      cancelText="取消"
    >
      <Root>
        <Form ref={form} layout="vertical" tw="max-w-[100%]!">
          <CollapseWrapper defaultActiveKey={['p0', 'p1']}>
            <CollapseItem
              key="p0"
              label={
                <Center tw="gap-2">
                  <Icon
                    name="file"
                    size={20}
                    type={isDarkTheme() ? 'light' : 'dark'}
                  />
                  <span>基本信息</span>
                </Center>
              }
            >
              {curSpaceOpt === 'create' && (
                <RadioGroupField
                  name="regionId"
                  label="区域"
                  defaultValue={regionId}
                >
                  <RadioButton value={regionId}>
                    <Icon name="zone" />
                    {region.name}
                  </RadioButton>
                </RadioGroupField>
              )}
              <TextField
                name="name"
                autoComplete="off"
                label="工作空间名称"
                validateOnChange
                placeholder="字母、数字或下划线（_）"
                labelClassName="medium"
                schemas={[
                  {
                    rule: {
                      required: true,
                      matchRegex: nameMatchRegex,
                    },
                    help: '字母、数字或下划线（_）,不能以（_）开始结尾',
                    status: 'error',
                  },
                  {
                    rule: (value: string) => {
                      const l = strlen(value)
                      return l >= 2 && l <= 128
                    },
                    help: '最小长度2,最大长度128',
                    status: 'error',
                  },
                ]}
                defaultValue={curSpaceOpt === 'create' ? '' : curSpace?.name}
              />
              <TextAreaField
                name="desc"
                label="工作空间描述"
                placeholder="请填写工作空间的描述"
                rows="5"
                validateOnChange
                schemas={[
                  {
                    rule: (value: string) => strlen(value) <= 1024,
                    help: '超过最大长度1024字节',
                    status: 'error',
                  },
                ]}
                defaultValue={
                  curSpaceOpt === 'create' ? '' : curSpace?.desc || '暂无描述'
                }
              />
            </CollapseItem>
            <CollapseItem
              key="p1"
              label={
                <Center tw="gap-2">
                  <Icon
                    name="earth"
                    size={20}
                    type={isDarkTheme() ? 'light' : 'dark'}
                  />
                  <span>网络信息</span>
                </Center>
              }
            >
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
                    <Icon name="vpc" tw="mr-2.5" size={18} />
                    <div>
                      <div>{option.label || option.value}</div>
                      <div tw="text-neut-8">{option.value}</div>
                    </div>
                  </FlexBox>
                )}
                onChange={searchRouter}
                searchable
                onInputChange={throttle((v: string) => {
                  setRouterSearch(v)
                }, 400)}
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
                searchAb
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
                        >
                          新建 VPC 网络
                        </TextLink>
                        {renderVpcWarn()}
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
                options={vxnets
                  .map(({ vxnet_id, vxnet_name }) => ({
                    value: vxnet_id,
                    label: vxnet_name,
                  }))
                  .filter(
                    (v) =>
                      v.value.includes(xnetSearch) ||
                      v.label.includes(xnetSearch)
                  )}
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
                        {renderVxnetWarn()}
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
                    {renderVxnetWarn()}
                  </>
                }
              />
            </CollapseItem>
          </CollapseWrapper>
        </Form>
      </Root>
    </Modal>
  )
})

export default SpaceEditModal
