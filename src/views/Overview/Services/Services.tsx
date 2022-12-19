import { Card, CardHeader, CardContent, FlexBox } from 'components'
import { useStore } from 'stores'
import tw, { css } from 'twin.macro'
import Flow from './Flow'
import FlowCell from './FlowCell'

const Content = tw(CardContent)`py-2.5 pt-0 flex font-medium text-sm text-neut-15 space-x-4`
const Main = tw.div`border border-green-4 border-dashed h-[244px] rounded-sm bg-green-0 px-12 2xl:px-[68px] flex pt-12 flex-1`
const Sider = tw.div`bg-[#F8FCFF] rounded-[6px]  flex justify-center h-[244px] w-[440px]`

function Services() {
  const {
    overViewStore: { items }
  } = useStore()
  const flowItems = items.slice(0, 5)
  const opsItem = items.slice(-1)[0]
  return (
    <Card>
      <CardHeader
        tw="border-neut-2"
        hasPrex={false}
        title={
          <>
            <span
              css={css`
                font-weight: 700;
                font-size: 20px;
                line-height: 27px;
                letter-spacing: -0.03em;
                color: #333333;
              `}
            >
              服务内容
            </span>
          </>
        }
      />
      <Content>
        <Main
          css={css`
            background: #f8fcff;
            border: 1px dashed #057ce4;
            border-radius: 6px;
          `}
        >
          <Flow items={flowItems} />
        </Main>
        <Sider>
          <FlexBox tw="relative mt-12 w-full justify-center">
            <FlowCell item={opsItem} placement="right" />
          </FlexBox>
        </Sider>
      </Content>
    </Card>
  )
}

export default Services
