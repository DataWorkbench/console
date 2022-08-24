import { PageTab } from '@QCFE/qingcloud-portal-ui'
import { FlexBox } from 'components'
import { getHelpCenterLink } from 'utils'
import ClusterTable from './ClusterTable'

const pageTabsData = [
  {
    title: '服务集群',
    description: '数据服务的 API 调用运行时所使用的计算资源，以集群的形式展现。',
    icon: 'q-dockerHubDuotone',
    helpLink: getHelpCenterLink('/manual/data_service/service_cluster/create_cluster/')
  }
]

const Network = () => (
  <FlexBox orient="column" tw="p-5 h-full overflow-auto">
    <PageTab tabs={pageTabsData} />
    <div tw="flex flex-1 bg-neut-16 px-5 pt-3">
      <ClusterTable />
    </div>
  </FlexBox>
)

export default Network
