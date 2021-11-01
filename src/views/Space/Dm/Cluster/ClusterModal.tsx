import {
  Collapse,
  Control,
  Field,
  Form,
  Icon,
  Label,
  InputNumber,
  RadioButton,
} from '@QCFE/lego-ui'
import { Modal, FlexBox, Center } from 'components'
import tw, { styled, css } from 'twin.macro'
import { useStore } from 'hooks'
import KVTextArea from './KVTextArea'

const { CollapseItem } = Collapse
const { TextField, SelectField, NumberField, RadioGroupField } = Form

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
  const {
    dmStore: { setOp },
  } = useStore()
  return (
    <Modal
      title="创建计算集群"
      orient="fullright"
      visible
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
              <Form>
                <TextField label="* 名称" placeholder="请输入计算集群名称" />
                <SelectField
                  label="* 状态"
                  options={[{}]}
                  help="设置当前集群的期望运行状态"
                />
                <SelectField
                  label="* 版本"
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
                  label="* 重启策略"
                  options={[{}]}
                  help="重启策略是指在发生故障时. 如何处理(重启)任务作业"
                />
                <RestartWrapper>
                  <NumberField label="* 尝试重启次数" isMini />
                  <NumberField label="* 重启时间间隔" isMini />
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
                <RadioGroupField label="Host别名" defaultValue="batch">
                  <RadioButton value="batch">批量输入</RadioButton>
                  <RadioButton value="single">单条输入</RadioButton>
                </RadioGroupField>
                <KVTextArea type="batch" title="Hosts 信息" tw="ml-24" />
                <RadioGroupField label="Flick参数" defaultValue="batch">
                  <RadioButton value="batch">批量输入</RadioButton>
                  <RadioButton value="single">单条输入</RadioButton>
                </RadioGroupField>
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
