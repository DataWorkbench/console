import { Icon } from '@QCFE/qingcloud-portal-ui'
import { FlexBox } from 'components'
import tw, { styled } from 'twin.macro'
import dayjs from 'dayjs'

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

const periodType = [
  { value: 'minute', label: '分钟' },
  { value: 'hour', label: '小时' },
  { value: 'day', label: '日' },
  { value: 'week', label: '周' },
  { value: 'month', label: '月' },
  { value: 'year', label: '年' },
]

const concurrencys = {
  1: {
    value: 1,
    label: '“允许”(同一时间，允许运行多个作业实例)',
  },
  2: {
    value: 2,
    label:
      '“禁止”(同一时间，只允许运行一个作业实例运行,如果到达调度周期的执行时间点时上一个实例还没有运行完成,则放弃本次实例的运行)',
  },
  3: {
    value: 3,
    label:
      '“替换“(同一时间，只允许运行一个作业实例，如果到达调度周期的执行点时上一个实例还没运行完成,则将这个实例终止,然后启动新的实例)',
  },
}

const schedulePolicy = {
  1: {
    value: 1,
    label: '重复执行',
  },
  2: {
    value: 2,
    label: '按时间执行',
  },
  3: {
    value: 3,
    label: '立即执行',
  },
}

const Schedule = ({ data }: { data: Record<string, any> }) => {
  console.log(data)
  return (
    <div tw="w-full">
      <Context>
        <div>
          <Title>
            <Icon name="q-terminalBoxFill" type="light" />
            <span>调度参数信息</span>
          </Title>
          <div tw="mt-3">
            {data?.parameters?.map(({ key, value }: Record<string, string>) => (
              <FlexBox tw="not-last:mb-2 gap-2 text-white pl-6">
                <Param tw="bg-[#2193d34d]">{key}</Param>=
                <Param tw="bg-line-dark">{value}</Param>
              </FlexBox>
            ))}
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
            <div>生效时间：</div>
            <div>
              {dayjs(data?.started * 1000).format('YYYY-MM-DD HH:mm:ss')}
            </div>
            <div>调度周期：</div>
            <div>
              {periodType.find((i) => i.value === data?.period_type)?.label}
            </div>
            {data?.schedule_policy === 2 && (
              <>
                <div>定时调度时间：</div>
                <div>
                  {dayjs(data?.executed * 1000).format('YYYY-MM-DD HH:mm:ss')}
                </div>
              </>
            )}
            {/* {data?.schedule_policy === 1 && ( */}
            <>
              <div>cron 表达式：</div>
              <div>{data?.express}</div>
            </>
            {/* )} */}
            <div>并发策略：</div>
            <div>
              {data?.concurrency_policy &&
                concurrencys[data?.concurrency_policy as 1].label}
            </div>
            <div>超时时间：</div>
            <div>
              {data?.timeout === 0 ? '永不超时' : `${data?.timeout} 分钟`}
            </div>
          </Grid>
        </div>
      </Context>
    </div>
  )
}

export default Schedule
