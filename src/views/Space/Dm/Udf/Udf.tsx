import { useEffect } from 'react'
import { PageTab, localstorage } from '@QCFE/qingcloud-portal-ui'
import { Tabs } from '@QCFE/lego-ui'
import { observer } from 'mobx-react-lite'
import { FlexBox } from 'components'
import { useStore } from 'stores'
import { HorizonTabs } from 'views/Space/Dm/styled'
import { getHelpCenterLink } from 'utils'
import UdfTable from './UdfTable'
import UdfModal from './UdfModal'

const { TabPanel } = Tabs

const pageTabsData = [
  {
    title: '函数管理',
    description:
      '提供自定义函数包的管理，在Flink计算中，结合自定义的函数包，将扩充自定义数据计算类型。',
    icon: 'textarea',
    helpLink: getHelpCenterLink('/manual/data_development/function/summary/'),
  },
]

const Udf = observer(() => {
  const {
    dmStore,
    dmStore: { op, setUdfType, udfType },
  } = useStore()

  useEffect(() => {
    const storageKey = `DM_${udfType}_COLUMN_SETTINGS`
    dmStore.set({
      udfSelectedRows: [],
      udfStorageKey: storageKey,
      udfColumnSettings: localstorage.getItem(storageKey) || [],
    })
  }, [udfType, dmStore])

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
