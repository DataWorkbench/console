import { useState, useEffect, useRef } from 'react'
import tw from 'twin.macro'
import {
  Collapse,
  Icon,
  Form,
  Field,
  Label,
  Control,
  Toggle,
  RadioGroup,
  InputNumber,
  Radio,
  Select,
  Loading,
  DatePicker,
  Button,
} from '@QCFE/lego-ui'
import { DarkModal, FlexBox, AffixLabel } from 'components'
import { useImmer } from 'use-immer'
import { range } from 'lodash-es'
import { useStore } from 'stores'
import dayjs from 'dayjs'
import { useMutationStreamJobSchedule, useQueryStreamJobSchedule } from 'hooks'
import {
  ScheSettingForm,
  SmallDatePickerField,
  HorizonFiledsWrapper,
} from './styled'

const {
  TextField,
  DatePickerField,
  SliderField,
  SelectField,
  RadioGroupField,
} = Form
const { CollapseItem } = Collapse

interface IScheSettingModal {
  visible?: boolean
  origin?: string
  onCancel?: () => void
  onSuccess?: () => void
}

type TPeriodType = 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'

const ScheSettingModal = ({
  visible,
  origin,
  onCancel,
  onSuccess,
}: IScheSettingModal) => {
  const [disabled, setDisabled] = useState(Boolean(origin === 'ops'))

  // const [period, setPeriod] = useState<TPeriodType>('minute')
  const [defCurDate] = useState(dayjs().hour(0).minute(20).toDate())
  // const { regionId, spaceId } = useParams<IUseParms>()
  const [periodData, setPeriodData] = useImmer({
    minute: {
      startHour: 0,
      stampMinu: 5,
      endHour: 23,
    },
    hour: {
      tp: 1,
      startHour: 0,
      stampMinu: 5,
      endHour: 23,
      hours: [0],
    },
    day: {
      scheDate: defCurDate,
    },
    week: {
      weekly: [1],
      scheDate: defCurDate,
    },
    month: {
      daily: [1],
      scheDate: defCurDate,
    },
    year: {
      monthly: [1],
      daily: [1],
      scheDate: defCurDate,
    },
  })
  const [params, setParams] = useImmer<{
    concurrencyPolicy: number | string
    started: number
    ended: number
    express: string
    retryLimit: number
    retryInterval: number
    retryPolicy: number
    timeout: number
    periodType: TPeriodType
    schedulePolicy: number
    executed: number | null
    immediately: boolean
  }>({
    concurrencyPolicy: '',
    started: 0,
    ended: 0,
    express: '*/5 0-23 * * *',
    retryLimit: 2,
    retryInterval: 2,
    retryPolicy: 1,
    timeout: 0,
    periodType: 'minute',
    schedulePolicy: 0,
    executed: null,
    immediately: false,
  })

  const {
    workFlowStore: { curJob },
  } = useStore()
  const { isFetching } = useQueryStreamJobSchedule({
    onSuccess: (data: any) => {
      if (data) {
        const periodType = data.period_type
        const { express } = data
        setParams((draft) => {
          draft.concurrencyPolicy = data.concurrency_policy
          draft.started = data.started
          draft.ended = data.ended
          draft.retryLimit = data.retry_limit
          draft.retryInterval = data.retry_interval
          draft.retryPolicy = data.retry_policy
          draft.periodType = periodType || 'minute'
          draft.timeout = data.timeout
          draft.schedulePolicy = data.schedule_policy
          draft.executed = data.executed
          draft.immediately = data.immediately
        })
        if (express !== '') {
          setPeriodData((draft) => {
            const [minute, hour, daily, monthly, week] = express.split(' ')
            if (periodType === 'minute') {
              ;[, draft.minute.stampMinu] = minute.split('/')
              ;[draft.minute.startHour, draft.minute.endHour] = hour.split('-')
            } else if (periodType === 'hour') {
              if (hour.indexOf('-') > -1) {
                let hourRange
                ;[hourRange, draft.hour.stampMinu] = hour.split('/')
                ;[draft.hour.startHour, draft.hour.endHour] =
                  hourRange.split('-')
              }
            } else if (periodType === 'day') {
              draft.day.scheDate = dayjs().hour(hour).minute(minute).toDate()
            } else if (periodType === 'week') {
              draft.week.scheDate = dayjs().hour(hour).minute(minute).toDate()
              draft.week.weekly = week.split(',')
            } else if (periodType === 'month') {
              draft.month.scheDate = dayjs().hour(hour).minute(minute).toDate()
              draft.month.daily = daily.split(',')
            } else if (periodType === 'year') {
              draft.year.scheDate = dayjs().hour(hour).minute(minute).toDate()
              draft.year.daily = daily.split(',')
              draft.year.monthly = monthly.split(',')
            }
          })
        }
      }
    },
  })
  const mutation = useMutationStreamJobSchedule()

  const formRef = useRef<Form>()

  const { periodType } = params

  useEffect(() => {
    let curPeriod = null
    let express = ''
    let scheDate = null
    let daily = null
    const sortFormatNum = (arr: number[]) =>
      [...arr].sort((a, b) => a - b).join(',')
    if (periodType === 'minute') {
      curPeriod = periodData[periodType]
      express = `*/${curPeriod.stampMinu} ${curPeriod.startHour}-${curPeriod.endHour} * * *`
    } else if (periodType === 'hour') {
      curPeriod = periodData[periodType]
      if (curPeriod.tp === 1) {
        express = `0 ${curPeriod.startHour}-${curPeriod.endHour}/${curPeriod.stampMinu} * * *`
      } else if (curPeriod.hours.length > 0) {
        express = `0 ${sortFormatNum(curPeriod.hours)} * * *`
      }
    } else if (periodType === 'day') {
      curPeriod = periodData[periodType]
      scheDate = curPeriod.scheDate
      express = `${scheDate.getMinutes()} ${scheDate.getHours()} * * *`
    } else if (periodType === 'week') {
      curPeriod = periodData[periodType]
      scheDate = curPeriod.scheDate
      const { weekly } = curPeriod
      express = `${scheDate.getMinutes()} ${scheDate.getHours()} * * ${sortFormatNum(
        weekly
      )}`
    } else if (periodType === 'month') {
      curPeriod = periodData[periodType]
      scheDate = curPeriod.scheDate
      daily = curPeriod.daily
      express = `${scheDate.getMinutes()} ${scheDate.getHours()} ${sortFormatNum(
        daily
      )} * *`
    } else if (periodType === 'year') {
      curPeriod = periodData[periodType]
      scheDate = curPeriod.scheDate
      daily = curPeriod.daily
      const { monthly } = curPeriod
      express = `${scheDate.getMinutes()} ${scheDate.getHours()} ${sortFormatNum(
        daily
      )} ${sortFormatNum(monthly)} *`
    }
    if (express !== '') {
      setParams((draft) => {
        draft.express = express
      })
    }
  }, [periodData, periodType, setParams])

  const handleCancel = () => {
    if (onCancel) onCancel()
    if (origin === 'ops') setDisabled(true)
  }

  const save = () => {
    if (origin === 'ops') {
      if (onCancel) onCancel()
      if (onSuccess) onSuccess()
      return
    }
    if (formRef.current?.validateForm()) {
      mutation.mutate(
        {
          jobId: curJob?.id,
          concurrency_policy: params.concurrencyPolicy,
          ended: params.ended,
          express: params.express,
          retry_interval: params.retryInterval,
          retry_limit: params.retryLimit,
          retry_policy: params.retryPolicy,
          period_type: params.periodType,
          started: params.started,
          timeout: params.timeout,
          schedule_policy: params.schedulePolicy,
          executed: params.executed || dayjs().unix(),
          immediately: params.immediately,
        },
        {
          onSuccess: () => {
            if (onCancel) {
              onCancel()
            }
          },
        }
      )
    }
  }

  return (
    <DarkModal
      orient="fullright"
      onCancel={handleCancel}
      title="调度配置"
      width={800}
      visible={visible}
      onOk={save}
      footer={
        <>
          <Button onClick={handleCancel}>取消</Button>
          {origin === 'ops' && disabled ? (
            <Button
              type="primary"
              onClick={() => {
                setDisabled(false)
              }}
            >
              编辑
            </Button>
          ) : (
            <Button
              type="primary"
              disabled={params.schedulePolicy === 0}
              onClick={save}
              loading={mutation.isLoading}
            >
              确定
            </Button>
          )}
        </>
      }
      // confirmLoading={mutation.isLoading}
    >
      <div>
        <Collapse defaultActiveKey={['p1', 'p2']}>
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
            <ScheSettingForm layout="horizon">
              <TextField
                value={curJob?.name}
                autoComplete="off"
                disabled
                name="name"
                label="业务名称"
              />
              <TextField
                value={curJob?.id}
                autoComplete="off"
                disabled
                name="id"
                label="业务 ID"
              />
              <TextField
                value={curJob?.desc}
                autoComplete="off"
                disabled
                name="desc"
                label="业务描述"
              />
            </ScheSettingForm>
          </CollapseItem>
          <CollapseItem
            key="p2"
            label={
              <FlexBox tw="items-center space-x-1">
                <Icon name="clock" tw="(relative top-0 left-0)!" type="dark" />
                <span>调度设置</span>
              </FlexBox>
            }
          >
            <Loading spinning={isFetching}>
              <ScheSettingForm layout="horizon" ref={formRef}>
                <RadioGroupField
                  disabled={disabled}
                  name="schedulePolicy"
                  label={<AffixLabel>调度策略</AffixLabel>}
                  value={params.schedulePolicy}
                  onChange={(v: number) => {
                    setParams((draft) => {
                      draft.schedulePolicy = v
                    })
                  }}
                  schemas={[
                    {
                      rule: { required: true },
                      help: '请选择调度策略',
                      status: 'error',
                    },
                  ]}
                >
                  <Radio value={2}>执行一次</Radio>
                  <Radio value={1}>重复执行</Radio>
                </RadioGroupField>
                {params.schedulePolicy === 1 && (
                  <>
                    <DatePickerField
                      disabled={disabled}
                      name="timeEffect"
                      label="生效时间"
                      mode="range"
                      enableTime
                      value={[
                        params.started ? new Date(params.started * 1000) : '',
                        params.ended ? new Date(params.ended * 1000) : '',
                      ]}
                      dateFormat="Y-m-d H:i"
                      help="注：调度将在有效日期内生效并自动调度，反之，在有效期外的任务将不会自动调度。"
                      onClear={() => {
                        setParams((draft) => {
                          draft.started = 0
                          draft.ended = 0
                        })
                      }}
                      onChange={(d: Date[]) => {
                        if (d.length > 0) {
                          setParams((draft) => {
                            draft.started = Math.floor(d[0].getTime() / 1000)
                            draft.ended =
                              d.length > 1
                                ? Math.floor(d[1].getTime() / 1000)
                                : 0
                          })
                        }
                      }}
                    />
                    <SelectField
                      disabled={disabled}
                      name="concurrencyPolicy"
                      label={
                        <AffixLabel
                          theme="green"
                          help={
                            <ul tw="leading-5">
                              <li>1. “允许”(即允许多个作业实例同时运行) </li>
                              <li>
                                2. “禁止”(即只允许一个作业实例运行,
                                如果到达调度周期的执行时间点时上一个实例还没有运行完成,
                                则放弃本次实例的运行)
                              </li>
                              <li>
                                3. “替换“(即,
                                只允许一个作业实例运行，如果到达调度周期的执行点时上一个实例还没运行完成,
                                则将这个实例终止, 然后启动新的实例)
                              </li>
                            </ul>
                          }
                        >
                          并发策略
                        </AffixLabel>
                      }
                      value={params.concurrencyPolicy}
                      validateOnChange
                      onChange={(v: number) => {
                        setParams((draft) => {
                          draft.concurrencyPolicy = v
                        })
                      }}
                      options={[
                        { value: 1, label: '允许' },
                        { value: 2, label: '禁止' },
                        { value: 3, label: '替换' },
                      ]}
                      schemas={[
                        {
                          rule: { required: true, isInteger: true },
                          help: '请选择依赖策略',
                          status: 'error',
                        },
                      ]}
                    />

                    <SelectField
                      disabled={disabled}
                      name="schePeriod"
                      label={<AffixLabel>调度周期</AffixLabel>}
                      value={params.periodType}
                      onChange={(v: TPeriodType) => {
                        setParams((draft) => {
                          draft.periodType = v
                        })
                      }}
                      options={[
                        { value: 'minute', label: '分钟' },
                        { value: 'hour', label: '小时' },
                        { value: 'day', label: '日' },
                        { value: 'week', label: '周' },
                        { value: 'month', label: '月' },
                        { value: 'year', label: '年' },
                      ]}
                    />
                    {(() => {
                      const hourOpts = range(0, 24).map((v) => ({
                        value: v,
                        label: `${v}时`,
                      }))
                      const minuOpts = range(5, 60, 5).map((v) => ({
                        value: v,
                        label: v,
                      }))
                      const monthOpts = range(1, 32).map((v) => ({
                        value: v,
                        label: `每月${v}号`,
                      }))
                      const yearOpts = range(1, 13).map((v) => ({
                        value: v,
                        label: `${v}月`,
                      }))
                      let curPeriodData = null
                      if (periodType === 'minute') {
                        curPeriodData = periodData[periodType]
                        return (
                          <>
                            <Field>
                              <Label>
                                <AffixLabel>开始时间</AffixLabel>
                              </Label>
                              <Control>
                                <Select
                                  disabled={disabled}
                                  options={hourOpts}
                                  value={curPeriodData.startHour}
                                  onChange={(v: number) => {
                                    setPeriodData((draft) => {
                                      draft.minute.startHour = v
                                    })
                                  }}
                                />
                                <div tw="leading-8 ml-2">时</div>
                              </Control>
                            </Field>
                            <Field>
                              <Label>
                                <AffixLabel>时间间隔</AffixLabel>
                              </Label>
                              <Control>
                                <Select
                                  disabled={disabled}
                                  options={minuOpts}
                                  value={curPeriodData.stampMinu}
                                  onChange={(v: number) =>
                                    setPeriodData((draft) => {
                                      draft.minute.stampMinu = v
                                    })
                                  }
                                />
                                <div tw="leading-8 ml-2">分钟</div>
                              </Control>
                            </Field>
                            <Field>
                              <Label>
                                <AffixLabel>结束时间</AffixLabel>
                              </Label>
                              <Control>
                                <Select
                                  disabled={disabled}
                                  options={hourOpts}
                                  value={curPeriodData.endHour}
                                  onChange={(v: number) =>
                                    setPeriodData((draft) => {
                                      draft.minute.endHour = v
                                    })
                                  }
                                />
                                <div tw="leading-8 ml-2">时</div>
                              </Control>
                            </Field>
                          </>
                        )
                      }
                      if (periodType === 'hour') {
                        curPeriodData = periodData[periodType]
                        return (
                          <HorizonFiledsWrapper>
                            <RadioGroup
                              disabled={disabled}
                              direction="column"
                              value={curPeriodData.tp}
                              onChange={(v: number) => {
                                setPeriodData((draft) => {
                                  draft.hour.tp = v
                                })
                              }}
                            >
                              <Radio value={1}>
                                <>
                                  <Field>
                                    <Label>
                                      <AffixLabel>开始时间</AffixLabel>
                                    </Label>
                                    <Control>
                                      <Select
                                        options={hourOpts}
                                        value={curPeriodData.startHour}
                                        onChange={(v: number) => {
                                          setPeriodData((draft) => {
                                            draft.hour.startHour = v
                                          })
                                        }}
                                      />
                                    </Control>
                                    <div tw="leading-8 ml-2">时</div>
                                  </Field>
                                  <Field>
                                    <Label>
                                      <AffixLabel>时间间隔</AffixLabel>
                                    </Label>
                                    <Control>
                                      <Select
                                        options={range(1, 24).map((v) => ({
                                          value: v,
                                          label: `${v}`,
                                        }))}
                                        value={curPeriodData.stampMinu}
                                        onChange={(v: number) => {
                                          setPeriodData((draft) => {
                                            draft.hour.stampMinu = v
                                          })
                                        }}
                                      />
                                    </Control>
                                    <div tw="leading-8 ml-2">小时</div>
                                  </Field>
                                  <Field>
                                    <Label>
                                      <AffixLabel>结束时间</AffixLabel>
                                    </Label>
                                    <Control>
                                      <Select
                                        options={hourOpts}
                                        value={curPeriodData.endHour}
                                        onChange={(v: number) => {
                                          setPeriodData((draft) => {
                                            draft.hour.endHour = v
                                          })
                                        }}
                                      />
                                    </Control>
                                    <div tw="leading-8 ml-2">时</div>
                                  </Field>
                                </>
                              </Radio>
                              <Radio value={2}>
                                <SelectField
                                  multi
                                  closeOnSelect={false}
                                  label={<AffixLabel>指定时间</AffixLabel>}
                                  name="hourlys"
                                  value={curPeriodData.hours}
                                  options={hourOpts}
                                  onChange={(v: []) => {
                                    if (v.length > 0) {
                                      setPeriodData((draft) => {
                                        draft.hour.hours = v.sort(
                                          (a, b) => a - b
                                        )
                                      })
                                    }
                                  }}
                                />
                              </Radio>
                            </RadioGroup>
                          </HorizonFiledsWrapper>
                        )
                      }
                      if (periodType === 'day') {
                        curPeriodData = periodData[periodType]
                        return (
                          <SmallDatePickerField
                            disabled={disabled}
                            name="scheDate"
                            label={<AffixLabel>定时调度时间</AffixLabel>}
                            dateFormat="H:i"
                            noCalendar
                            enableTime
                            value={curPeriodData.scheDate}
                            onChange={([d]: Date[]) => {
                              if (d) {
                                setPeriodData((draft) => {
                                  draft.day.scheDate = d
                                })
                              }
                            }}
                          />
                        )
                      }
                      if (periodType === 'week') {
                        curPeriodData = periodData[periodType]
                        return (
                          <>
                            <SelectField
                              disabled={disabled}
                              label="指定时间"
                              name="weekly"
                              multi
                              closeOnSelect={false}
                              value={curPeriodData.weekly}
                              onChange={(v: number[]) => {
                                if (v.length > 0) {
                                  setPeriodData((draft) => {
                                    draft.week.weekly = v
                                  })
                                }
                              }}
                              options={[
                                { label: '星期日', value: 0 },
                                { label: '星期一', value: 1 },
                                { label: '星期二', value: 2 },
                                { label: '星期三', value: 3 },
                                { label: '星期四', value: 4 },
                                { label: '星期五', value: 5 },
                                { label: '星期六', value: 6 },
                              ]}
                            />
                            <SmallDatePickerField
                              disabled={disabled}
                              name="scheDate"
                              label={<AffixLabel>定时调度时间</AffixLabel>}
                              dateFormat="H:i"
                              noCalendar
                              enableTime
                              value={curPeriodData.scheDate}
                              onChange={([d]: Date[]) => {
                                if (d) {
                                  setPeriodData((draft) => {
                                    draft.week.scheDate = d
                                  })
                                }
                              }}
                            />
                          </>
                        )
                      }
                      if (periodType === 'month') {
                        curPeriodData = periodData[periodType]
                        return (
                          <>
                            <SelectField
                              disabled={disabled}
                              label={<AffixLabel>指定时间</AffixLabel>}
                              name="monthDaily"
                              multi
                              closeOnSelect={false}
                              value={curPeriodData.daily}
                              options={monthOpts}
                              onChange={(v: number[]) => {
                                if (v.length > 0) {
                                  setPeriodData((draft) => {
                                    draft.month.daily = v
                                  })
                                }
                              }}
                            />
                            <SmallDatePickerField
                              disabled={disabled}
                              name="scheDate"
                              label={<AffixLabel>定时调度时间</AffixLabel>}
                              dateFormat="H:i"
                              noCalendar
                              enableTime
                              value={curPeriodData.scheDate}
                              onChange={([d]: Date[]) => {
                                if (d) {
                                  setPeriodData((draft) => {
                                    draft.month.scheDate = d
                                  })
                                }
                              }}
                            />
                          </>
                        )
                      }
                      if (periodType === 'year') {
                        curPeriodData = periodData[periodType]
                        return (
                          <>
                            <SelectField
                              disabled={disabled}
                              label="指定月份"
                              name="monthly"
                              multi
                              closeOnSelect={false}
                              value={curPeriodData.monthly}
                              options={yearOpts}
                              onChange={(v: number[]) => {
                                if (v.length > 0) {
                                  setPeriodData((draft) => {
                                    draft.year.monthly = v
                                  })
                                }
                              }}
                            />
                            <SelectField
                              disabled={disabled}
                              label="指定时间"
                              name="daily"
                              multi
                              closeOnSelect={false}
                              value={curPeriodData.daily}
                              options={monthOpts}
                              onChange={(v: number[]) => {
                                if (v.length > 0) {
                                  setPeriodData((draft) => {
                                    draft.year.daily = v
                                  })
                                }
                              }}
                            />
                            <SmallDatePickerField
                              disabled={disabled}
                              name="scheDate"
                              label={<AffixLabel>定时调度时间</AffixLabel>}
                              dateFormat="H:i"
                              noCalendar
                              enableTime
                              value={curPeriodData.scheDate}
                              onChange={([d]: Date[]) => {
                                if (d) {
                                  setPeriodData((draft) => {
                                    draft.year.scheDate = d
                                  })
                                }
                              }}
                            />
                          </>
                        )
                      }
                      return null
                    })()}

                    <Field>
                      <Label>cron 表达式</Label>
                      <Control tw="font-mono">{params.express}</Control>
                    </Field>
                  </>
                )}
                {(() => {
                  if (params.schedulePolicy === 2) {
                    const curDate = new Date()
                    return (
                      <>
                        <RadioGroupField
                          disabled={disabled}
                          label={<AffixLabel>执行时间</AffixLabel>}
                          value={params.immediately}
                          name="immediately"
                          onChange={(v: boolean) => {
                            setParams((draft) => {
                              draft.immediately = v
                            })
                          }}
                        >
                          <Radio value>发布后立即执行</Radio>
                          <Radio value={false}>指定时间</Radio>
                        </RadioGroupField>
                        {!params.immediately && (
                          <Field>
                            <Label />
                            <Control>
                              <DatePicker
                                disabled={disabled}
                                dateFormat="Y-m-d H:i:S"
                                enableTime
                                enableSeconds
                                minDate={curDate}
                                defaultValue={curDate}
                                onChange={(d: Date[]) => {
                                  if (d.length) {
                                    setParams((draft) => {
                                      draft.executed = dayjs(d[0]).unix()
                                    })
                                  }
                                }}
                              />
                            </Control>
                          </Field>
                        )}
                      </>
                    )
                  }
                  return null
                })()}
                <Field>
                  <Label>
                    <AffixLabel>重试策略</AffixLabel>
                  </Label>
                  <Control>
                    <Toggle
                      disabled={disabled}
                      checked={params.retryPolicy === 2}
                      onChange={(checked: boolean) => {
                        setParams((draft) => {
                          draft.retryPolicy = checked ? 2 : 1
                        })
                      }}
                    />
                  </Control>
                  <div tw="leading-6 ml-2">出错自动重跑</div>
                </Field>
                <div css={params.retryPolicy === 1 && tw`hidden`} tw="mb-6">
                  <SliderField
                    disabled={disabled}
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
                  <Field>
                    <Label>* 出错重跑间隔</Label>
                    <Control>
                      <InputNumber
                        disabled={disabled}
                        isMini
                        min={1}
                        max={30}
                        value={params.retryInterval}
                        onChange={(v: number) => {
                          setParams((draft) => {
                            draft.retryInterval = v
                          })
                        }}
                      />
                    </Control>
                    <div tw="leading-8 ml-2">分钟</div>
                  </Field>
                </div>
                <Field>
                  <Label>超时时间</Label>
                  <Control>
                    <InputNumber
                      disabled={disabled}
                      isMini
                      min={0}
                      max={4320}
                      value={params.timeout}
                      onChange={(v: number) => {
                        setParams((draft) => {
                          draft.timeout = v
                        })
                      }}
                    />
                  </Control>
                  <div tw="leading-8 ml-2">分钟</div>
                </Field>
              </ScheSettingForm>
            </Loading>
          </CollapseItem>
        </Collapse>
      </div>
    </DarkModal>
  )
}

export default ScheSettingModal
