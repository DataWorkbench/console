import { observer } from 'mobx-react-lite'
import { Collapse, Form, RadioButton } from '@QCFE/lego-ui'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import { nameMatchRegex, strlen } from 'utils/convert'
import { useRef } from 'react'
import { MutationWorkSpaceParams } from 'hooks'
import tw, { css, styled } from 'twin.macro'
import { Center, Modal } from 'components'
import { isDarkTheme } from 'utils/theme'
import { useWorkSpaceContext } from 'contexts/index'
import { NetworkFormItem } from 'views/Space/Manage/Network/NetworkModal'

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
  `
])

const SpaceEditModal = observer((props: ISpaceEditProps) => {
  const { curSpaceOpt, curSpace, region, onClose, onOk, confirmLoading } = props
  const stateStore = useWorkSpaceContext()
  const regionId = region.id

  const form = useRef<Form>()
  const handleOk = () => {
    if (['create', 'update'].includes(curSpaceOpt)) {
      if (form.current?.validateForm()) {
        const fields = form.current.getFieldsValue()
        const params1 = {
          regionId,
          op: curSpaceOpt,
          ...fields
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
                  <Icon name="file" size={20} type={isDarkTheme() ? 'light' : 'dark'} />
                  <span>基本信息</span>
                </Center>
              }
            >
              {curSpaceOpt === 'create' && (
                <RadioGroupField name="regionId" label="区域" defaultValue={regionId}>
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
                      matchRegex: nameMatchRegex
                    },
                    help: '字母、数字或下划线（_）,不能以（_）开始结尾',
                    status: 'error'
                  },
                  {
                    rule: (value: string) => {
                      const l = strlen(value)
                      return l >= 2 && l <= 128
                    },
                    help: '最小长度2,最大长度128',
                    status: 'error'
                  }
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
                    status: 'error'
                  }
                ]}
                defaultValue={curSpaceOpt === 'create' ? '' : curSpace?.desc || '暂无描述'}
              />
            </CollapseItem>
            {stateStore.platformConfig?.enable_network && curSpaceOpt === 'create' && (
              <CollapseItem
                key="p1"
                label={
                  <Center tw="gap-2">
                    <Icon name="earth" size={20} type={isDarkTheme() ? 'light' : 'dark'} />
                    <span>网络信息</span>
                  </Center>
                }
              >
                <NetworkFormItem
                  spaceId={curSpace?.id}
                  regionId={regionId}
                  regionName={region?.name}
                />
              </CollapseItem>
            )}
          </CollapseWrapper>
        </Form>
      </Root>
    </Modal>
  )
})

export default SpaceEditModal
