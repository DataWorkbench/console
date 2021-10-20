import { useState } from 'react'
import tw, { css, styled } from 'twin.macro'
import {
  Collapse,
  Icon,
  Form,
  Field,
  Label,
  Control,
  Toggle,
} from '@QCFE/lego-ui'
import { DarkModal, FlexBox } from 'components'
import { useImmer } from 'use-immer'
import { useWindowSize } from 'react-use'

const { TextField, DatePickerField, SliderField, NumberField, SelectField } =
  Form
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

const FormWrapper = styled(Form)(() => [
  css`
    &.is-horizon-layout {
      ${tw`pl-5`}
      > .field {
        > .label {
          width: 120px;
        }
        > .control {
          ${tw`w-auto`}
        }
        > .help {
          ${tw`ml-3 text-white`}
        }

        &.toggle-field {
          ${tw`items-center`}
        }
        &.slider-field {
          > div.control {
            ${tw`max-w-none`}
            .slider {
              ${tw`w-96`}
            }
          }
        }
        &.select-field {
          div.select {
            ${tw`w-32`}
          }
        }
      }
    }
  `,
])

const SmallDatePickerField = styled(DatePickerField)(() => [
  css`
    .control {
      > input {
        ${tw`w-32!`}
      }
    }
  `,
])

interface IScheSettingModal {
  visible?: boolean
  onCancel?: () => void
}

const ScheSettingModal = ({ visible, onCancel }: IScheSettingModal) => {
  const [params, setParams] = useImmer({
    concurrencyPolicy: '',
    started: 0,
    ended: 0,
    express: '',
    retryLimit: 2,
    retryInterval: 2,
    retryPolicy: 1,
    timeout: 0,
  })
  const [period, setPeriod] = useState('day')
  const { width } = useWindowSize()

  const calcExpress = (d: Date[]) => {
    if (period === 'day') {
      if (d.length > 0) {
        const h = d[0].getHours()
        const m = d[0].getMinutes()
        setParams((draft) => {
          draft.express = `00 ${h > 9 ? h : `0${h}`} ${
            m > 9 ? m : `0${m}`
          } ** ?`
        })
      }
    }
  }
  return (
    <DarkModal
      orient="fullright"
      appendToBody
      onCancel={onCancel}
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
            <FormWrapper layout="horizon">
              <TextField name="name" label="业务名称" />
              <TextField name="id" label="业务 ID" />
              <TextField name="desc" label="业务描述" />
              <TextField name="param" label="参数" />
            </FormWrapper>
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
            <FormWrapper layout="horizon">
              <DatePickerField
                name="p0"
                label="生效时间"
                mode="range"
                enableTime
                dateFormat="Y-m-d H:i"
                onChange={(d: Date[]) => {
                  if (d.length > 0) {
                    setParams((draft) => {
                      draft.started = d[0].getTime()
                      if (d.length > 1) {
                        draft.ended = d[1].getTime()
                      }
                    })
                  }
                }}
              />
              <SelectField
                name="p0"
                label="* 依赖策略"
                value={params.concurrencyPolicy}
                onChange={(v: string) => {
                  setParams((draft) => {
                    draft.concurrencyPolicy = v
                  })
                }}
                options={[
                  { value: '1', label: 'allow' },
                  { value: '2', label: 'forbid' },
                  { value: '3', label: 'replace' },
                ]}
              />
              <Field>
                <Label>* 重跑策略</Label>
                <Control tw="w-auto!">
                  <Toggle
                    checked={params.retryPolicy === 2}
                    onChange={(checked: boolean) => {
                      setParams((draft) => {
                        draft.retryPolicy = checked ? 2 : 1
                      })
                    }}
                  />
                </Control>
                <div tw="inline-flex items-center ml-3">出错自动重跑</div>
              </Field>
              <SliderField
                name="p2"
                label="出错重跑最大次数"
                hasTooltip
                value={params.retryLimit}
                markDots
                min={1}
                max={99}
                onChange={(v: string) => {
                  setParams((draft) => {
                    draft.retryLimit = +v
                  })
                }}
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
              <NumberField
                isMini
                name="p3"
                label="* 出错重跑间隔"
                value={params.retryInterval}
                help="分钟"
              />
              <NumberField
                isMini
                name="p4"
                label="超时时间"
                value={params.timeout}
                help="分钟"
              />
              <SelectField
                name="p5"
                label="* 调度周期"
                value={period}
                onChange={(v) => setPeriod(v)}
                options={[
                  { value: 'minute', label: '分钟' },
                  { value: 'hour', label: '小时' },
                  { value: 'day', label: '日' },
                  { value: 'month', label: '月' },
                  { value: 'year', label: '年' },
                ]}
              />
              {(() => {
                if (period === 'day') {
                  return (
                    <SmallDatePickerField
                      name="p6"
                      label="* 定时调度时间"
                      dateFormat="H:i"
                      noCalendar
                      enableTime
                      onChange={calcExpress}
                    />
                  )
                }
                if (period === 'minute') {
                  return (
                    <>
                      <SmallDatePickerField
                        name="p6"
                        label="* 开始时间"
                        dateFormat="i"
                        noCalendar
                        enableTime
                        onChange={calcExpress}
                      />
                      <SmallDatePickerField
                        name="p7"
                        label="* 时间间隔"
                        dateFormat="i"
                        noCalendar
                        enableTime
                        onChange={calcExpress}
                        help="分钟"
                      />
                      <SmallDatePickerField
                        name="p8"
                        label="* 结束时间"
                        dateFormat="i"
                        noCalendar
                        enableTime
                        onChange={calcExpress}
                      />
                    </>
                  )
                }
                return null
              })()}

              <Field>
                <Label>cron 表达式</Label>
                <Control>{params.express}</Control>
              </Field>
            </FormWrapper>
          </CollapseItem>
        </DarkCollapse>
      </div>
    </DarkModal>
  )
}

export default ScheSettingModal
