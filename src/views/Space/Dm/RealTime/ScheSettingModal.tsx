import tw, { css, styled } from 'twin.macro'
import { Collapse, Icon, Form, Field, Label, Control } from '@QCFE/lego-ui'
import { DarkModal, FlexBox } from 'components'
import { useWindowSize } from 'react-use'

const {
  TextField,
  DatePickerField,
  ToggleField,
  SliderField,
  NumberField,
  SelectField,
} = Form
const { CollapseItem } = Collapse

const DarkCollapse = styled(Collapse)(() => [
  css`
    ${tw`text-white w-full border-0`}
    .collapse-item-label {
      ${tw`bg-neut-17 text-white border-neut-13 border-t-0`}
      > span {
        svg {
          color: #fff;
        }
      }
    }
    .collapse-item-content {
      ${tw`bg-neut-16`}
    }
  `,
])

interface IScheSettingModal {
  visible?: boolean
  onCancel?: () => void
}

const ScheSettingModal = ({ visible, onCancel }: IScheSettingModal) => {
  const { width } = useWindowSize()
  return (
    <DarkModal
      orient="fullright"
      appendToBody
      onCancel={onCancel}
      // closable={false}
      title="运行参数配置"
      width={width > 1600 ? 800 : width / 2}
      visible={visible}
    >
      <div>
        <DarkCollapse defaultActiveKey={['p1', 'p2']}>
          <CollapseItem
            key="p1"
            label={
              <FlexBox tw="items-center space-x-1">
                <Icon name="record" tw="(relative top-0 left-0)!" type="dark" />
                <span>基础属性</span>
              </FlexBox>
            }
          >
            <Form layout="horizon">
              <TextField name="name" label="业务名称" />
              <TextField name="id" label="业务 ID" />
              <TextField name="desc" label="业务描述" />
              <TextField name="param" label="参数" />
            </Form>
          </CollapseItem>
          <CollapseItem
            key="p2"
            label={
              <FlexBox tw="items-center space-x-1">
                <Icon name="clock" tw="(relative top-0 left-0)!" type="dark" />
                <span>调度策略</span>
              </FlexBox>
            }
          >
            <Form layout="horizon">
              <DatePickerField
                name="p0"
                label="生效时间"
                mode="range"
                dateFormat="Y-m-d"
              />
              <TextField name="id" label="* 依赖策略" />
              <ToggleField
                name="p1"
                label="*重跑策略"
                onText="是"
                offText="否"
                defaultValue
                help="出错自动重跑"
              />
              <SliderField
                name="p2"
                label="出错重跑最大次数"
                hasTooltip
                defaultValue={20}
                markDots
                min={1}
                max={99}
                marks={{
                  1: '1',
                  20: '20',
                  40: '40',
                  60: '60',
                  80: '80',
                  99: '99',
                }}
                hasInput
              />
              <NumberField isMini name="p3" label="* 出错重跑间隔" />
              <NumberField isMini name="p4" label="超时时间" />
              <SelectField
                name="p5"
                label="* 调度周期"
                value="day"
                options={[
                  { value: 'minute', label: '分钟' },
                  { value: 'hour', label: '小时' },
                  { value: 'day', label: '日' },
                  { value: 'month', label: '月' },
                  { value: 'year', label: '年' },
                ]}
              />
              <TextField label="* 定时调度时间" />
              <Field>
                <Label>cron 表达式</Label>
                <Control>00 06 45 ** ？</Control>
              </Field>
            </Form>
          </CollapseItem>
        </DarkCollapse>
      </div>
    </DarkModal>
  )
}

export default ScheSettingModal
