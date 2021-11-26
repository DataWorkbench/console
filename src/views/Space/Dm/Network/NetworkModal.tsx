import { useRef } from 'react'
import { Form } from '@QCFE/lego-ui'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import { observer } from 'mobx-react-lite'
import tw, { styled, css } from 'twin.macro'
import { useImmer } from 'use-immer'
import { useQueryClient } from 'react-query'
import { assign, flatten } from 'lodash-es'
import {
  useStore,
  useMutationNetwork,
  getNetworkKey,
  useQueryDescribeRouters,
  useQueryDescribeRoutersVxnets,
} from 'hooks'
import { Modal, FlexBox, AffixLabel } from 'components'
import { nameMatchRegex } from 'utils/convert'

const { TextField, SelectField } = Form

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

const ClusterModal = observer(
  ({ opNetwork }: { opNetwork: typeof defaultParams & { id?: string } }) => {
    const {
      dmStore: { setOp, op },
    } = useStore()
    const [params, setParams] = useImmer(opNetwork || defaultParams)

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

    return (
      <Modal
        title={`${op === 'create' ? '创建' : '修改'}网络`}
        confirmLoading={mutation.isLoading}
        visible
        onOk={handleOk}
        onCancel={() => setOp('')}
        width={680}
        draggable
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
                    },
                    status: 'error',
                    help: '不能为空,字母、数字或下划线（_）,不能以（_）开始结尾',
                  },
                ]}
              />
              <SelectField
                label={<AffixLabel>VPC 网络</AffixLabel>}
                placeholder="请选择 VPC"
                validateOnBlur
                name="router_id"
                value={params.router_id}
                options={routers.map(({ router_id, router_name }) => ({
                  value: router_id,
                  label: router_name,
                }))}
                onChange={(v: string) => {
                  setParams((draft) => {
                    draft.router_id = v
                  })
                }}
                isLoadingAtBottom
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
                    <a
                      href="/iaas/vpc/create"
                      target="_blank"
                      tw="text-green-11"
                    >
                      新建 VPC 网络
                      <Icon name="if-external-link" />
                    </a>
                  </>
                }
                schemas={[
                  {
                    rule: {
                      required: true,
                      isExisty: false,
                    },
                    status: 'error',
                    help: '不能为空',
                  },
                ]}
              />
              <SelectField
                label={<AffixLabel>私有网络</AffixLabel>}
                placeholder="请选择私有网络"
                validateOnBlur
                name="vxnet_id"
                value={params.vxnet_id}
                options={vxnets.map(({ vxnet_id, vxnet_name }) => ({
                  value: vxnet_id,
                  label: vxnet_name,
                }))}
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
                    help: '不能为空',
                  },
                ]}
                help={
                  <>
                    您可以
                    <a href="/pek3/vxnets" target="_blank" tw="text-green-11">
                      新建私有网络
                      <Icon name="if-external-link" />
                    </a>
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

export default ClusterModal
