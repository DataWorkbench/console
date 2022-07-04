import { PageTab } from '@QCFE/qingcloud-portal-ui'
import { FlexBox } from 'components'
import { getHelpCenterLink } from 'utils'
import ClusterTable from './ClusterTable'

const pageTabsData = [
  {
    title: '服务集群',
    description:
      '服务资源说明文案服务资源说明文案服务资源说明文案服务资源说明文案服务资源说明文案服务资源说明文案服务资源说明文案服务资源说明文案服务资源说明文案。',
    icon: 'q-dockerHubDuotone',
    helpLink: getHelpCenterLink('/manual/data_development/network/create_network/')
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
