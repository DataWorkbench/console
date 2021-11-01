import { Card, CardHeader, CardContent, FlexBox } from 'components'
import { useStore } from 'stores'
import tw from 'twin.macro'
import Flow from './Flow'
import FlowCell from './FlowCell'

const Content = tw(
  CardContent
)`py-2.5 flex font-medium text-sm text-neut-15 space-x-4`
const Main = tw.div`border border-green-4 border-dashed h-[300px] rounded-sm bg-green-0 px-12 2xl:px-[68px] flex items-center flex-1`
const Sider = tw.div`border border-[#BAE6FD] border-dashed rounded-sm bg-[#ECFBFF] flex justify-center min-w-[200px] w-2/12`

function Services() {
  const {
    overViewStore: { items },
  } = useStore()
  const flowItems = items.slice(0, 5)
  const opsItem = items.slice(-1)[0]
  return (
    <Card>
      <CardHeader
        tw="border-b border-neut-2"
        hasPrex={false}
        title={
          <>
            &#127775;<span tw="ml-2">服务内容</span>
          </>
        }
      />
      <Content>
        <Main>
          <Flow items={flowItems} />
        </Main>
        <Sider>
          <FlexBox tw="relative mt-20 w-full justify-center">
            <FlowCell item={opsItem} placement="right" />
          </FlexBox>
        </Sider>
      </Content>
    </Card>
  )
}

export default Services
