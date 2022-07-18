import { Icon } from '@QCFE/qingcloud-portal-ui'
import { FlexBox } from 'components/index'
import tw, { styled } from 'twin.macro'
import dayjs from 'dayjs'
import { range } from 'lodash-es'
import { useImmer } from 'use-immer'
import { useEffect, useState } from 'react'

const Title = styled.div`
  ${tw`flex items-center text-white gap-2`}
`

const Context = styled.div`
  ${tw`leading-[20px]`}
  & > div {
    ${tw`not-last:border-b border-neut-15 not-last:pb-4`}
  }
`

const Param = styled.div`
  ${tw`inline-block leading-[20px] h-5 px-3 rounded-[2px]`}
`

const Grid = styled.div`
  ${tw`grid gap-2 mt-3 pl-6`}
  & {
    grid-template-columns: 84px 1fr;
    & > div:nth-of-type(2n + 1) {
      ${tw`text-neut-8`}
    }
    & > div:nth-of-type(2n) {
      ${tw`text-white`}
    }
  }
`

const periodTypes = [
  { value: 'minute', label: '分钟' },
  { value: 'hour', label: '小时' },
  { value: 'day', label: '日' },
  { value: 'week', label: '周' },
  { value: 'month', label: '月' },
  { value: 'year', label: '年' }
]

const concurrencys = {
  1: {
    value: 1,
    label: '“允许”(同一时间，允许运行多个作业实例)'
  },
  2: {
    value: 2,
    label:
      '“禁止”(同一时间，只允许运行一个作业实例运行,如果到达调度周期的执行时间点时上一个实例还没有运行完成,则放弃本次实例的运行)'
  },
  3: {
    value: 3,
    label:
      '“替换“(同一时间，只允许运行一个作业实例，如果到达调度周期的执行点时上一个实例还没运行完成,则将这个实例终止,然后启动新的实例)'
  }
}

const schedulePolicy = {
  1: {
    value: 1,
    label: '重复执行'
  },
  2: {
    value: 2,
    label: '按时间执行'
  },
  3: {
    value: 3,
    label: '立即执行'
  }
}

const hourOpts = range(0, 24).map((v) => ({
  value: v.toString(),
  label: `${v}时`
}))
// const minuOpts = range(5, 60, 5).map((v) => ({
//   value: v.toString(),
//   label: v,
// }))

const yearOpts = range(1, 13).map((v) => ({
  value: v.toString(),
  label: `${v}月`
}))

const monthOpts = range(1, 32).map((v) => ({
  value: v.toString(),
  label: `每月${v}号`
}))

type TPeriodType = 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'

const Schedule = ({ data }: { data: Record<string, any> }) => {
  const [defCurDate] = useState(dayjs().hour(0).minute(20).toDate())
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
    parameters?: { key: string; value: string }[] | null
    parametersStr?: string
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
    parameters: null,
    parametersStr: ''
    // immediately: false,
  })

  const [periodData, setPeriodData] = useImmer({
    minute: {
      startHour: 0,
      stampMinu: 5,
      endHour: 23
    },
    hour: {
      tp: 1,
      startHour: 0,
      stampMinu: 5,
      endHour: 23,
      hours: ['0']
    },
    day: {
      scheDate: defCurDate
    },
    week: {
      weekly: ['1'],
      scheDate: defCurDate
    },
    month: {
      daily: ['1'],
      scheDate: defCurDate
    },
    year: {
      monthly: ['1'],
      daily: ['1'],
      scheDate: defCurDate
    }
  })

  useEffect(() => {
    if (data) {
      const { period_type: periodType } = data
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
        draft.parameters = data.parameters
        draft.parametersStr = data.parameters
          ? data.parameters
              .map((item: { key: string; value: string }) => `${item.key}=${item.value}`)
              .join('\r\n')
          : ''
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
              ;[draft.hour.startHour, draft.hour.endHour] = hourRange.split('-')
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
  }, [data, setParams, setPeriodData])

  console.log(params, periodData)

  return (
    <div tw="w-full py-5">
      <Context>
        <div>
          <Title>
            <Icon name="q-terminalBoxFill" type="light" />
            <span>调度参数信息</span>
          </Title>
          <div tw="mt-3">
            {data?.parameters?.length > 0 ? (
              data?.parameters?.map(({ key, value }: Record<string, string>) => (
                <FlexBox tw="not-last:mb-2 gap-2 text-white pl-6">
                  <Param tw="bg-[#2193d34d]">{key}</Param>=<Param tw="bg-line-dark">{value}</Param>
                </FlexBox>
              ))
            ) : (
              <FlexBox tw="not-last:mb-2 gap-2  pl-6">
                <span> 未设置 </span>
              </FlexBox>
            )}
          </div>
        </div>
        <div tw="mt-4">
          <Title>
            <Icon name="q-loadingCircleFill" type="light" />
            <span>调度策略信息</span>
          </Title>
          <Grid>
            <div>调度策略：</div>
            <div>{schedulePolicy[data?.schedule_policy as 1]?.label}</div>

            {data?.schedule_policy === 1 && (
              <>
                <div>生效时间：</div>
                <div>
                  <span>{dayjs(data?.started * 1000).format('YYYY-MM-DD HH:mm')}</span>
                  <span>至</span>
                  <span>{dayjs(data?.ended * 1000).format('YYYY-MM-DD HH:mm')}</span>
                </div>
                <div>调度周期：</div>
                <div>{periodTypes.find((i) => i.value === data?.period_type)?.label}</div>
                {data?.period_type === 'year' && (
                  <>
                    <div>指定月份：</div>
                    <div>
                      {yearOpts
                        .filter((i) => periodData.year.monthly.includes(i.value))
                        .map((i) => i.label)
                        .join('、')}
                    </div>
                    <div>指定时间：</div>
                    <div>
                      {monthOpts
                        .filter((i) => periodData.year.daily.includes(i.value))
                        .map((i) => i.label)
                        .join('、')}
                    </div>
                    <div>定时调度时间：</div>
                    <div>{dayjs(periodData.year.scheDate.getTime()).format('HH:mm')}</div>
                  </>
                )}
                {data?.period_type === 'month' && (
                  <>
                    <div>指定时间：</div>
                    <div>
                      {monthOpts
                        .filter((i) => periodData.month.daily.includes(i.value))
                        .map((i) => i.label)
                        .join('、')}
                    </div>
                    <div>定时调度时间：</div>
                    <div>{dayjs(periodData.month.scheDate.getTime()).format('HH:mm')}</div>
                  </>
                )}
                {data?.period_type === 'week' && (
                  <>
                    <div>指定时间：</div>
                    <div>
                      {[
                        { label: '星期日', value: 0 },
                        { label: '星期一', value: 1 },
                        { label: '星期二', value: 2 },
                        { label: '星期三', value: 3 },
                        { label: '星期四', value: 4 },
                        { label: '星期五', value: 5 },
                        { label: '星期六', value: 6 }
                      ]
                        .filter((i) => periodData.week.weekly.includes(i.value.toString()))
                        .map((i) => i.label)
                        .join('、')}
                    </div>
                    <div>定时调度时间：</div>
                    <div>{dayjs(periodData.week.scheDate.getTime()).format('HH:mm')}</div>
                  </>
                )}
                {data?.period_type === 'day' && (
                  <>
                    <div>定时调度时间：</div>
                    <div>{dayjs(periodData.day.scheDate.getTime()).format('HH:mm')}</div>
                  </>
                )}
                {data?.period_type === 'hour' && periodData.hour.tp === 1 && (
                  <>
                    <div>开始时间:</div>
                    <div>
                      <span>{`${periodData.hour.startHour} 时`}</span>
                      <span>至</span>
                      <span>{`${periodData.hour.endHour} 时`}</span>
                    </div>

                    <div>时间间隔:</div>
                    <div>{`${periodData.hour.stampMinu} 小时`} </div>
                  </>
                )}

                {data?.period_type === 'hour' && periodData.hour.tp === 2 && (
                  <>
                    <div>指定时间:</div>
                    <div>
                      {hourOpts
                        .filter((i) => periodData.hour.hours.includes(i.value.toString()))
                        .map((i) => i.label)
                        .join('、')}
                    </div>
                  </>
                )}

                {data?.period_type === 'minute' && (
                  <>
                    <div>开始时间:</div>
                    <div>
                      <span>{`${periodData.minute.startHour} 时`}</span>
                      <span>至</span>
                      <span>{`${periodData.minute.endHour} 时`}</span>
                    </div>

                    <div>时间间隔:</div>
                    <div>{`${periodData.minute.stampMinu} 分钟`} </div>
                  </>
                )}
                <div>cron 表达式：</div>
                <div>{data?.express}</div>
                <div>并发策略：</div>
                <div>
                  {data?.concurrency_policy && concurrencys[data?.concurrency_policy as 1].label}
                </div>
                <div>超时时间：</div>
                <div>{data?.timeout === 0 ? '永不超时' : `${data?.timeout} 分钟`}</div>
              </>
            )}
            {data?.schedule_policy !== 1 && (
              <>
                <div>执行时间：</div>
                <div>{dayjs(data?.executed * 1000).format('YYYY-MM-DD HH:mm:ss')}</div>
                <div>并发策略：</div>
                <div>
                  {data?.concurrency_policy && concurrencys[data?.concurrency_policy as 1].label}
                </div>
                <div>超时时间：</div>
                <div>{data?.timeout === 0 ? '永不超时' : `${data?.timeout} 分钟`}</div>
              </>
            )}
          </Grid>
        </div>
      </Context>
    </div>
  )
}

export default Schedule
