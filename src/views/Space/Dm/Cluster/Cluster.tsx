import { PageTab } from '@QCFE/qingcloud-portal-ui'
import { FlexBox } from 'components/Box'
import { getHelpCenterLink } from 'utils'
import ClusterTable from './ClusterTable'

const pageTabsData = [
  {
    title: '计算集群',
    description:
      '提供全托管式的Flink集群管理，在计算集群中，您只需关注所需计算资源的大小、并发度。',
    icon: 'pod',
    helpLink: getHelpCenterLink(
      '/manual/data_development/flink_cluster/create_cluster/'
    ),
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
