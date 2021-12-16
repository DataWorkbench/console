import { PageTab } from '@QCFE/qingcloud-portal-ui'
import { FlexBox } from 'components'
import { getHelpCenterLink } from 'utils'
import NetworkTable from './NetworkTable'

const pageTabsData = [
  {
    title: '网络配置',
    description:
      '计算集群文案说明计算集群文案说明计算集群文案说明计算集群文案说明计算集群文案说明计算集群文案说明计算集群文案说明计算集群文案说明计算集群文案说明计算集群文案说明计算集群文案说明计算集群文案说明计算集群文案说明',
    icon: 'earth',
    helpLink: getHelpCenterLink(
      '/manual/data_development/network/create_network/'
    ),
  },
]

const Network = () => {
  return (
    <FlexBox orient="column" tw="p-5 min-h-full">
      <PageTab tabs={pageTabsData} />
      <div tw="flex flex-1 bg-neut-16 px-5 pt-3">
        <NetworkTable />
      </div>
    </FlexBox>
  )
}

export default Network
