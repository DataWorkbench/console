import { useRef } from 'react'
import {
  Collapse,
  Control,
  Field,
  Form,
  Icon,
  Label,
  InputNumber,
} from '@QCFE/lego-ui'
import { Modal, FlexBox, Center, KVTextAreaField } from 'components'
import tw, { styled, css } from 'twin.macro'
import { useStore } from 'hooks'

const { CollapseItem } = Collapse
const { TextField, SelectField, NumberField } = Form

const FormWrapper = styled('div')(() => [
  css`
    ${tw`w-[686px]`}
    form.is-horizon-layout {
      ${tw`pl-0`}
      > .field {
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

const RestartWrapper = styled('div')(() => [
  tw`bg-neut-17 ml-24 px-4 py-5`,
  css`
    .field > .label {
      ${tw`w-24 mb-0 mr-4 inline-flex items-center`}
    }
  `,
])

const ClusterModal = () => {
  const baseFormRef = useRef<Form>(null)
  // const resForm = useRef(null)
  // const logForm = useRef(null)
  // const optForm = useRef(null)
  const {
    dmStore: { setOp },
  } = useStore()

  const handleOk = () => {
    const baseForm = baseFormRef.current
    if (baseForm?.validateFields()) {
      // console.log(baseForm?.getFieldsValue())
    }
  }

  return (
    <Modal
      title="创建计算集群"
      orient="fullright"
      visible
      onOk={handleOk}
      onCancel={() => setOp('')}
      width={1000}
    >
      <FlexBox>
        <FormWrapper>
          <Collapse
            defaultActiveKey={['p1', 'p2', 'p3', 'p4', 'p5']}
            tw="border-r!"
          >
            <CollapseItem
              key="p1"
              label={
                <FlexBox tw="items-center space-x-1">
                  <Icon
                    name="record"
                    tw="(relative top-0 left-0)!"
                    type="light"
                  />
                  <span>基础属性</span>
                </FlexBox>
              }
            >
              <Form ref={baseFormRef}>
                <TextField
                  label="* 名称"
                  name="name"
                  placeholder="请输入计算集群名称"
                  validateOnBlur
                  schemas={[
                    {
                      rule: { required: true },
                      status: 'error',
                      help: '不能为空,验证的字符a~z,0-9,_且不能以_开始或者结束',
                    },
                  ]}
                />
                <SelectField
                  name="status"
                  label="* 状态"
                  options={[{}]}
                  help="设置当前集群的期望运行状态"
                />
                <SelectField
                  label="* 版本"
                  name="version"
                  options={[{}]}
                  css={[
                    css`
                      .select-control {
                        ${tw`w-[128px]!`}
                      }
                    `,
                  ]}
                />
                <SelectField
                  name="sche"
                  label="* 重启策略"
                  options={[{}]}
                  help="重启策略是指在发生故障时. 如何处理(重启)任务作业"
                />
                <RestartWrapper>
                  <NumberField name="retrytime" label="* 尝试重启次数" isMini />
                  <NumberField
                    name="retryinterval"
                    label="* 重启时间间隔"
                    isMini
                  />
                </RestartWrapper>
              </Form>
            </CollapseItem>
            <CollapseItem
              key="p2"
              label={
                <FlexBox tw="items-center space-x-1">
                  <Icon
                    name="record"
                    tw="(relative top-0 left-0)!"
                    type="light"
                  />
                  <span>资源配置</span>
                </FlexBox>
              }
            >
              <Form>
                <NumberField label="* Task 数量" isMini />
                <Field>
                  <Label>* Job CU</Label>
                  <Control>
                    <InputNumber isMini defaultValue={2} />
                  </Control>
                  <Center>（每 CU：1核 4G）</Center>
                  <div tw="w-full" className="help">
                    0.5~8
                  </div>
                </Field>
                <Field>
                  <Label>* Task CU</Label>
                  <Control>
                    <InputNumber isMini defaultValue={2} />
                  </Control>
                  <Center>（每 CU：1核 4G）</Center>
                  <div tw="w-full" className="help">
                    0.5~8
                  </div>
                </Field>
              </Form>
            </CollapseItem>
            <CollapseItem
              key="p3"
              label={
                <FlexBox tw="items-center space-x-1">
                  <Icon
                    name="record"
                    tw="(relative top-0 left-0)!"
                    type="light"
                  />
                  <span>网络配置</span>
                </FlexBox>
              }
            >
              <Form>
                <SelectField
                  label="*VPC网络"
                  options={[]}
                  help={<div>如需选择新的 VPC，您可以新建 VPC 网络</div>}
                />
                <SelectField
                  label="* 私有网络"
                  options={[]}
                  help={<div>您可以新建 VPC 网络</div>}
                />
              </Form>
            </CollapseItem>
            <CollapseItem
              key="p4"
              label={
                <FlexBox tw="items-center space-x-1">
                  <Icon
                    name="record"
                    tw="(relative top-0 left-0)!"
                    type="light"
                  />
                  <span>日志配置</span>
                </FlexBox>
              }
            >
              <Form>
                <SelectField
                  label="* 日志级别"
                  options={[]}
                  help={<div>默认与并行度一致</div>}
                />
              </Form>
            </CollapseItem>
            <CollapseItem
              key="p5"
              label={
                <FlexBox tw="items-center space-x-1">
                  <Icon
                    name="record"
                    tw="(relative top-0 left-0)!"
                    type="light"
                  />
                  <span>可选配置</span>
                </FlexBox>
              }
            >
              <Form>
                <KVTextAreaField
                  label="Host别名"
                  title="Hosts 信息"
                  kvs={['IP', 'Hostname']}
                  value={`192.168.3.2 proxy.mgmt.pitrix.yunify.com
                  192.168.2.8 pgpool.mgmt.pitrix.yunify.com
                  
                  `}
                  placeholder={`|请输入 hostname IP，多条配置之间换行输入。例如：
192.168.3.2 proxy.mgmt.pitrix.yunify.com
192.168.2.8 pgpool.mgmt.pitrix.yunify.com`}
                  // onChange={(v) => console.log(v)}
                />
                <KVTextAreaField label="Flick参数" />
              </Form>
            </CollapseItem>
          </Collapse>
        </FormWrapper>
        <div tw="w-80">
          <div>费用预览</div>
        </div>
      </FlexBox>
    </Modal>
  )
}

export default ClusterModal
