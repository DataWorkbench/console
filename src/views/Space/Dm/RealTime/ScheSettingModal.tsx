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
import { useQueryClient } from 'react-query'
import {
  getFlowKey,
  useMutationStreamJobSchedule,
  useQueryStreamJobSchedule,
} from 'hooks'
import SimpleBar from 'simplebar-react'
import {
  ScheSettingForm,
  SmallDatePicker,
  SmallDatePickerField,
  HorizonFiledsWrapper,
} from './styled'

const {
  TextField,
  // DatePickerField,
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
  origin = '',
  onCancel,
  onSuccess,
}: IScheSettingModal) => {
  const queryClient = useQueryClient()
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
    // immediately: boolean
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
    schedulePolicy: 3,
    executed: null,
    // immediately: false,
  })

  const {
    workFlowStore: { curJob },
  } = useStore()
  const { isFetching } = useQueryStreamJobSchedule(origin, {
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
          draft.schedulePolicy = data.schedule_policy || 3
          draft.executed = data.executed
          // draft.immediately = data.immediately
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
              } else {
                draft.hour.hours = hour.split(',')
                draft.hour.tp = 2
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
          // immediately: params.immediately,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(getFlowKey('StreamJobSchedule'))
            if (onCancel) {
              onCancel()
            }
            if (origin === 'ops') {
              if (onSuccess) onSuccess()
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
      title={`${
        origin === 'ops' ? `?????????????????? ${curJob?.version} ` : ''
      }????????????`}
      width={800}
      visible={visible}
      onOk={save}
      footer={
        <>
          {origin === 'ops' && disabled ? (
            <Button
              type="primary"
              onClick={() => {
                setDisabled(false)
              }}
            >
              ??????
            </Button>
          ) : (
            <>
              <Button onClick={handleCancel}>??????</Button>
              <Button
                type="primary"
                disabled={params.schedulePolicy === 0}
                onClick={save}
                loading={mutation.isLoading}
              >
                ??????
              </Button>
            </>
          )}
        </>
      }
      // confirmLoading={mutation.isLoading}
    >
      <SimpleBar tw="h-full">
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
                  <span>????????????</span>
                </FlexBox>
              }
            >
              <ScheSettingForm layout="horizon">
                <TextField
                  value={curJob?.name}
                  autoComplete="off"
                  disabled
                  name="name"
                  label="????????????"
                />
                <TextField
                  value={curJob?.id}
                  autoComplete="off"
                  disabled
                  name="id"
                  label="?????? ID"
                />
                <TextField
                  value={curJob?.desc}
                  autoComplete="off"
                  disabled
                  name="desc"
                  label="????????????"
                />
              </ScheSettingForm>
            </CollapseItem>
            <CollapseItem
              key="p2"
              label={
                <FlexBox tw="items-center space-x-1">
                  <Icon
                    name="clock"
                    tw="(relative top-0 left-0)!"
                    type="dark"
                  />
                  <span>????????????</span>
                </FlexBox>
              }
            >
              <Loading spinning={isFetching}>
                <ScheSettingForm layout="horizon" ref={formRef}>
                  <RadioGroupField
                    disabled={disabled}
                    name="schedulePolicy"
                    label={<AffixLabel>????????????</AffixLabel>}
                    value={params.schedulePolicy === 1 ? 1 : 2}
                    onChange={(v: number) => {
                      setParams((draft) => {
                        draft.schedulePolicy = v
                      })
                    }}
                    schemas={[
                      {
                        rule: { required: true },
                        help: '?????????????????????',
                        status: 'error',
                      },
                    ]}
                  >
                    <Radio value={2}>????????????</Radio>
                    <Radio value={1}>????????????</Radio>
                  </RadioGroupField>
                  {params.schedulePolicy === 1 && (
                    <>
                      <Field>
                        <Label>
                          <AffixLabel required={false}>????????????</AffixLabel>
                        </Label>
                        <Control tw="items-center space-x-3">
                          <SmallDatePicker
                            dateFormat="Y-m-d H:i"
                            enableTime
                            value={
                              params.started
                                ? new Date(params.started * 1000)
                                : ''
                            }
                            onClear={() => {
                              setParams((draft) => {
                                draft.started = 0
                              })
                            }}
                            onChange={(d: Date[]) => {
                              if (d.length) {
                                setParams((draft) => {
                                  draft.started = Math.floor(
                                    d[0].getTime() / 1000
                                  )
                                  if (draft.started > draft.ended) {
                                    draft.ended = draft.started + 60
                                  }
                                })
                              }
                            }}
                          />
                          <div>???</div>
                          <SmallDatePicker
                            dateFormat="Y-m-d H:i"
                            enableTime
                            value={
                              params.ended ? new Date(params.ended * 1000) : ''
                            }
                            onClear={() => {
                              setParams((draft) => {
                                draft.ended = 0
                              })
                            }}
                            onChange={(d: Date[]) => {
                              if (d.length) {
                                setParams((draft) => {
                                  draft.ended = Math.floor(
                                    d[0].getTime() / 1000
                                  )
                                  if (draft.started > draft.ended) {
                                    draft.started = draft.ended - 60
                                  }
                                })
                              }
                            }}
                          />
                        </Control>
                        <div className="help">
                          ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????
                        </div>
                      </Field>
                      {/* <DatePickerField
                        disabled={disabled}
                        name="timeEffect"
                        label="????????????"
                        mode="range"
                        enableTime
                        value={[
                          params.started ? new Date(params.started * 1000) : '',
                          params.ended ? new Date(params.ended * 1000) : '',
                        ]}
                        dateFormat="Y-m-d H:i"
                        help="??????????????????????????????????????????????????????????????????????????????????????????????????????????????????"
                        onClear={() => {
                          setParams((draft) => {
                            draft.started = 0
                            draft.ended = 0
                          })
                        }}
                        onChange={(d: Date[]) => {
                          if (d && d.length) {
                            setParams((draft) => {
                              draft.started = Math.floor(d[0].getTime() / 1000)
                              if (d.length > 1) {
                                if (d[0] > d[1]) {
                                  draft.ended = draft.started
                                  draft.started = Math.floor(
                                    d[1].getTime() / 1000
                                  )
                                } else {
                                  draft.ended = Math.floor(
                                    d[1].getTime() / 1000
                                  )
                                }
                              }
                            })
                          }
                        }}
                      /> */}

                      <SelectField
                        disabled={disabled}
                        name="schePeriod"
                        label={<AffixLabel>????????????</AffixLabel>}
                        backspaceRemoves={false}
                        value={params.periodType}
                        onChange={(v: TPeriodType) => {
                          setParams((draft) => {
                            draft.periodType = v
                          })
                        }}
                        options={[
                          { value: 'minute', label: '??????' },
                          { value: 'hour', label: '??????' },
                          { value: 'day', label: '???' },
                          { value: 'week', label: '???' },
                          { value: 'month', label: '???' },
                          { value: 'year', label: '???' },
                        ]}
                      />
                      {(() => {
                        const hourOpts = range(0, 24).map((v) => ({
                          value: v,
                          label: `${v}???`,
                        }))
                        const minuOpts = range(5, 60, 5).map((v) => ({
                          value: v,
                          label: v,
                        }))
                        const monthOpts = range(1, 32).map((v) => ({
                          value: v,
                          label: `??????${v}???`,
                        }))
                        const yearOpts = range(1, 13).map((v) => ({
                          value: v,
                          label: `${v}???`,
                        }))
                        let curPeriodData: any = null
                        if (periodType === 'minute') {
                          curPeriodData = periodData[periodType]
                          return (
                            <>
                              <Field>
                                <Label>
                                  <AffixLabel>????????????</AffixLabel>
                                </Label>
                                <Control>
                                  <Select
                                    disabled={disabled}
                                    options={hourOpts}
                                    backspaceRemoves={false}
                                    value={curPeriodData.startHour}
                                    onChange={(v: number) => {
                                      setPeriodData((draft) => {
                                        draft.minute.startHour = v
                                        if (v > draft.minute.endHour) {
                                          draft.minute.endHour = v
                                        }
                                      })
                                    }}
                                  />
                                  {/* <div tw="leading-8 ml-2">???</div> */}
                                </Control>
                                <div className="help">
                                  0~23 ?????????????????? 0 ??? 0 ?????????
                                </div>
                              </Field>
                              <Field>
                                <Label>
                                  <AffixLabel>????????????</AffixLabel>
                                </Label>
                                <Control>
                                  <Select
                                    disabled={disabled}
                                    options={minuOpts}
                                    backspaceRemoves={false}
                                    value={curPeriodData.stampMinu}
                                    onChange={(v: number) =>
                                      setPeriodData((draft) => {
                                        draft.minute.stampMinu = v
                                      })
                                    }
                                  />
                                  <div tw="leading-8 ml-2">??????</div>
                                </Control>
                              </Field>
                              <Field>
                                <Label>
                                  <AffixLabel>????????????</AffixLabel>
                                </Label>
                                <Control>
                                  <Select
                                    disabled={disabled}
                                    backspaceRemoves={false}
                                    options={hourOpts.map((opt) => {
                                      return {
                                        ...opt,
                                        disabled:
                                          opt.value < curPeriodData.startHour,
                                      }
                                    })}
                                    value={curPeriodData.endHour}
                                    onChange={(v: number) =>
                                      setPeriodData((draft) => {
                                        draft.minute.endHour = v
                                      })
                                    }
                                  />
                                  {/* <div tw="leading-8 ml-2">???</div> */}
                                </Control>
                                <div className="help">
                                  0~23 ?????????????????? 59 ??? 59 ?????????
                                </div>
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
                                        <AffixLabel>????????????</AffixLabel>
                                      </Label>
                                      <Control>
                                        <Select
                                          options={hourOpts}
                                          backspaceRemoves={false}
                                          value={curPeriodData.startHour}
                                          onChange={(v: number) => {
                                            setPeriodData((draft) => {
                                              draft.hour.startHour = v
                                              if (v > draft.hour.endHour) {
                                                draft.hour.endHour = v
                                              }
                                            })
                                          }}
                                        />
                                      </Control>
                                      {/* <div tw="leading-8 ml-2">???</div> */}
                                    </Field>
                                    <Field>
                                      <Label>
                                        <AffixLabel>????????????</AffixLabel>
                                      </Label>
                                      <Control>
                                        <Select
                                          backspaceRemoves={false}
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
                                      <div tw="leading-8 ml-2">??????</div>
                                    </Field>
                                    <Field>
                                      <Label>
                                        <AffixLabel>????????????</AffixLabel>
                                      </Label>
                                      <Control>
                                        <Select
                                          backspaceRemoves={false}
                                          options={hourOpts.map((opt) => {
                                            return {
                                              ...opt,
                                              disabled:
                                                opt.value <
                                                curPeriodData.startHour,
                                            }
                                          })}
                                          value={curPeriodData.endHour}
                                          onChange={(v: number) => {
                                            setPeriodData((draft) => {
                                              draft.hour.endHour = v
                                            })
                                          }}
                                        />
                                      </Control>
                                      {/* <div tw="leading-8 ml-2">???</div> */}
                                    </Field>
                                  </>
                                </Radio>
                                <Radio value={2}>
                                  <SelectField
                                    multi
                                    closeOnSelect={false}
                                    label={<AffixLabel>????????????</AffixLabel>}
                                    name="hourlys"
                                    backspaceRemoves={false}
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
                              label={<AffixLabel>??????????????????</AffixLabel>}
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
                                label="????????????"
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
                                  { label: '?????????', value: 0 },
                                  { label: '?????????', value: 1 },
                                  { label: '?????????', value: 2 },
                                  { label: '?????????', value: 3 },
                                  { label: '?????????', value: 4 },
                                  { label: '?????????', value: 5 },
                                  { label: '?????????', value: 6 },
                                ]}
                              />
                              <SmallDatePickerField
                                disabled={disabled}
                                name="scheDate"
                                label={<AffixLabel>??????????????????</AffixLabel>}
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
                                label={<AffixLabel>????????????</AffixLabel>}
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
                                label={<AffixLabel>??????????????????</AffixLabel>}
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
                                label="????????????"
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
                                label="????????????"
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
                                label={<AffixLabel>??????????????????</AffixLabel>}
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
                        <Label>cron ?????????</Label>
                        <Control tw="font-mono">{params.express}</Control>
                      </Field>
                    </>
                  )}
                  {(() => {
                    if (params.schedulePolicy !== 1) {
                      const curDate = new Date()
                      const executedDate = params.executed
                        ? new Date(params.executed * 1000)
                        : curDate
                      return (
                        <>
                          <RadioGroupField
                            disabled={disabled}
                            label={<AffixLabel>????????????</AffixLabel>}
                            value={params.schedulePolicy}
                            name="immediately"
                            onChange={(v: number) => {
                              setParams((draft) => {
                                draft.schedulePolicy = v
                              })
                            }}
                          >
                            <Radio value={3}>?????????????????????</Radio>
                            <Radio value={2}>????????????</Radio>
                          </RadioGroupField>
                          {params.schedulePolicy === 2 && (
                            <Field>
                              <Label />
                              <Control>
                                <DatePicker
                                  disabled={disabled}
                                  dateFormat="Y-m-d H:i:S"
                                  enableTime
                                  enableSeconds
                                  minDate={curDate}
                                  defaultValue={
                                    executedDate < curDate
                                      ? curDate
                                      : executedDate
                                  }
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

                  <SelectField
                    disabled={disabled}
                    name="concurrencyPolicy"
                    backspaceRemoves={false}
                    label={
                      <AffixLabel
                        theme="green"
                        help={
                          <ul tw="leading-5">
                            <li>1. ????????????(?????????????????????????????????????????????)</li>
                            <li>
                              2.
                              ????????????(??????????????????????????????????????????????????????,?????????????????????????????????????????????????????????????????????????????????,??????????????????????????????)
                            </li>
                            <li>
                              3.
                              ????????????(???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????,????????????????????????,
                              ????????????????????????)
                            </li>
                          </ul>
                        }
                      >
                        ????????????
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
                      { value: 1, label: '??????' },
                      { value: 2, label: '??????' },
                      { value: 3, label: '??????' },
                    ]}
                    schemas={[
                      {
                        rule: { required: true, isInteger: true },
                        help: '?????????????????????',
                        status: 'error',
                      },
                    ]}
                  />
                  {false && (
                    <Field>
                      <Label>
                        <AffixLabel>????????????</AffixLabel>
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
                      <div tw="leading-6 ml-2">??????????????????</div>
                    </Field>
                  )}
                  <div css={params.retryPolicy === 1 && tw`hidden`} tw="mb-6">
                    <SliderField
                      key={disabled ? 'initSlider' : 'updateSlider'}
                      disabled={disabled}
                      name="p2"
                      label="????????????????????????"
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
                      inputProps={{ disabled }}
                    />
                    <Field>
                      <Label>
                        <AffixLabel>??????????????????</AffixLabel>
                      </Label>
                      <Control>
                        <InputNumber
                          key={disabled ? 'initInput' : 'updateInput'}
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
                      <div tw="leading-8 ml-2">??????</div>
                    </Field>
                  </div>
                  <Field>
                    <Label>????????????</Label>
                    <Control>
                      <InputNumber
                        key={disabled ? 'initInput' : 'updateInput'}
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
                    <div tw="leading-8 ml-2">??????</div>
                    {params.timeout === 0 && (
                      <div className="help">??????0???????????????</div>
                    )}
                  </Field>
                </ScheSettingForm>
              </Loading>
            </CollapseItem>
          </Collapse>
        </div>
      </SimpleBar>
    </DarkModal>
  )
}

export default ScheSettingModal
