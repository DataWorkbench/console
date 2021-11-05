import { PageTab } from '@QCFE/qingcloud-portal-ui'
import { FlexBox } from 'components/Box'
import ClusterTable from './ClusterTable'

const pageTabsData = [
  {
    title: '计算集群',
    description:
      '计算集群文案说明计算集群文案说明计算集群文案说明计算集群文案说明计算集群文案说明计算集群文案说明计算集群文案说明计算集群文案说明计算集群文案说明计算集群文案说明计算集群文案说明计算集群文案说明计算集群文案说明',
    icon: 'pod',
    helpLink: '/compute/vm/',
  },
]

const Cluster = () => {
  return (
    <FlexBox orient="column" tw="p-5 min-h-full">
      <PageTab tabs={pageTabsData} />
      <div tw="flex flex-1 bg-neut-16 px-5 pt-3">
        <ClusterTable />
      </div>
    </FlexBox>
  )
}

export default Cluster
