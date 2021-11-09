import { PageTab } from '@QCFE/qingcloud-portal-ui'
import { Tabs } from '@QCFE/lego-ui'
import { observer } from 'mobx-react-lite'
import { FlexBox } from 'components'
import { useStore } from 'stores'
import { HorizonTabs } from 'views/Space/Dm/styled'
import UdfTable from './UdfTable'
import UdfModal from './UdfModal'

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

const Udf = observer(() => {
  const {
    dmStore: { op, setUdfType, udfType },
  } = useStore()

  return (
    <FlexBox orient="column" tw="p-5 h-full">
      <PageTab tabs={pageTabsData} />
      <HorizonTabs
        defaultActiveName="UDF"
        activeName={udfType}
        onChange={(name: any) => {
          // console.log(name)
          setUdfType(name)
        }}
      >
        <TabPanel label="UDF" name="UDF">
          <UdfTable tp="UDF" />
        </TabPanel>
        <TabPanel label="UDTF" name="UDTF">
          <UdfTable tp="UDTF" />
        </TabPanel>
        <TabPanel label="UDTTF" name="UDTTF">
          <UdfTable tp="UDTTF" />
        </TabPanel>
      </HorizonTabs>
      {['create', 'detail', 'edit'].includes(op) && <UdfModal />}
    </FlexBox>
  )
})

export default Udf
