import { Form, InputNumber, Select } from '@QCFE/qingcloud-portal-ui'
import { FlexBox, Modal, ModalContent } from 'components/index'
import { Checkbox, Field, Label } from '@QCFE/lego-ui'
import { observer } from 'mobx-react-lite'
import tw, { css } from 'twin.macro'
import AdduserField from 'views/Space/Ops/Alert/Monitor/AdduserField'

const { TextField, TextAreaField } = Form

interface IMonitorAddProps {
  onCancel: () => void
}

const formStyle = {
  wrapper: tw`pl-0!`,
  itemWrapper: tw`w-full h-12 bg-neut-17 rounded-[2px] items-center pl-4`,
  textarea: css`
    & textarea.textarea {
      ${tw`min-w-[500px]!`}
    }
  `,
}

const MonitorAddFormModal = observer((props: IMonitorAddProps) => {
  const { onCancel } = props
  return (
    <Modal
      visible
      width={800}
      orient="fullright"
      onOk={onCancel}
      onCancel={onCancel}
      title="创建告警策略"
      appendToBody
    >
      <ModalContent>
        <Form css={formStyle.wrapper}>
          <TextField
            label="名称"
            name="name"
            labelClassName="label-required"
            placeholder="请输入告警策略名称"
          />
          <Field>
            <Label tw="label-required">监控对象</Label>
            <span>流式计算作业</span>
          </Field>
          <Field>
            <Label tw="label-required mt-2 items-baseline!	">监控项</Label>
            {(() => (
              <div tw="w-[640px]">
                <FlexBox css={formStyle.itemWrapper} tw="mb-2">
                  <Checkbox tw="w-[180px]">作业实例失败数</Checkbox>
                  <Select
                    options={[
                      { label: '>', value: '>' },
                      { label: '<', value: '<' },
                      { label: '=', value: '=' },
                      { label: '>=', value: '>=' },
                      { label: '<=', value: '<=' },
                    ]}
                    placeholder="请选择"
                    tw="mr-3 w-[84px]"
                  />
                  <InputNumber isMini min={0} tw="w-24" placeholder="请输入" />
                </FlexBox>
                <FlexBox css={formStyle.itemWrapper}>
                  <Checkbox tw="w-[180px]">作业实例运行时超时</Checkbox>
                  <Select
                    options={[
                      { label: '>', value: '>' },
                      { label: '<', value: '<' },
                      { label: '=', value: '=' },
                      { label: '>=', value: '>=' },
                      { label: '<=', value: '<=' },
                    ]}
                    placeholder="请选择"
                    tw="mr-3 w-[84px]"
                  />
                  <InputNumber
                    min={0}
                    showButton={false}
                    placeholder="请输入"
                    tw="w-24"
                  />
                  <span tw="ml-2">秒</span>
                </FlexBox>
              </div>
            ))()}
          </Field>
          <Field>
            <Label tw="label-required">触发规则</Label>
            <span>触发任意一项监控项</span>
          </Field>
          <Field>
            <Label tw="label-required">触发行为</Label>
            <span>发送通知</span>
          </Field>
          {/* <Field> */}
          {/*  <Label tw="label-required">消息接收人</Label> */}
          {/*  {(() => { */}
          {/*    return <Select options={[]} placeholder="请选择消息接收人" /> */}
          {/*  })()} */}
          {/* </Field> */}
          <AdduserField label="消息接受人" labelClasName="label-required" />
          <TextAreaField
            label="策略描述"
            placeholder="请输入策略描述"
            css={formStyle.textarea}
            schemas={[
              {
                rules: [
                  {
                    maxLength: 1024,
                  },
                ],

                help: '策略描述不能超过1024个字符',
                status: 'error',
              },
            ]}
          />
        </Form>
      </ModalContent>
    </Modal>
  )
})

export default MonitorAddFormModal
