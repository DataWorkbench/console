import { Icon } from '@QCFE/qingcloud-portal-ui'
import { FlexBox } from 'components'
import tw, { styled } from 'twin.macro'

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
            <FlexBox tw="not-last:mb-2 gap-2 text-white pl-6">
              <Param tw="bg-[#2193d34d]">var1</Param>=
              <Param tw="bg-line-dark">2022/02/15/15/30</Param>
            </FlexBox>
          </div>
        </div>
        <div tw="mt-4">
          <Title>
            <Icon name="q-loadingCircleFill" type="light" />
            <span>调度策略信息</span>
          </Title>
          <Grid>
            <div>调度策略：</div>
            <div>重复执行</div>
            <div>生效时间：</div>
            <div>2022.03.14-2022.03.20</div>
            <div>调度周期：</div>
            <div>日</div>
            <div>定时调度时间：</div>
            <div>06:45</div>
            <div>cron 表达式：</div>
            <div>00 06 45 ** ？</div>
            <div>并发策略：</div>
            <div>并发执行</div>
            <div>超时时间：</div>
            <div>30分钟</div>
          </Grid>
        </div>
      </Context>
    </div>
  )
}

export default Schedule
