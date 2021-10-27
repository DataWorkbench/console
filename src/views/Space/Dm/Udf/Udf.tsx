import { PageTab } from '@QCFE/qingcloud-portal-ui'
import { Tabs } from '@QCFE/lego-ui'
import tw, { css, styled } from 'twin.macro'
import { FlexBox } from 'components'
import UdfTable from './UdfTable'

const { TabPanel } = Tabs

const pageTabsData = [
  {
    title: '函数管理',
    description:
      '用户在编辑函数代码时支持类似工程方式的管理，可以创建文件、文件夹并对其进行编辑。如果用户代码是上传zip包的方式，则前端进行相应解压展示，并支持用户在线编辑修改。',
    icon: 'name-space',
    helpLink: '/compute/vm/',
  },
]

const TabsWrapper = styled(Tabs)(
  () => [tw`bg-neut-16 text-neut-8`],
  css`
    .tabs ul {
      ${tw`border-neut-16`}
      > li.is-active {
        ${tw`border-white! text-white`}
      }
    }
  `
)

const Udf = () => {
  return (
    <FlexBox orient="column" tw="p-5 h-full">
      <PageTab tabs={pageTabsData} />
      <TabsWrapper defaultActiveName="account">
        <TabPanel label="UDF" name="account">
          <UdfTable tp="udf" />
        </TabPanel>
        <TabPanel label="UDTF" name="consumptions">
          UDTF
        </TabPanel>
        <TabPanel label="UDTTF" name="security">
          UDTTF
        </TabPanel>
      </TabsWrapper>
    </FlexBox>
  )
}

export default Udf
