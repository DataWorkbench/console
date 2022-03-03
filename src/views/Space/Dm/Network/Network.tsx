import { PageTab } from '@QCFE/qingcloud-portal-ui'
import { FlexBox } from 'components'
import { getHelpCenterLink } from 'utils'
import NetworkTable from './NetworkTable'

const pageTabsData = [
  {
    title: '网络配置',
    description:
      '提供 VPC（专属私有网络 ） 与 VxNet（私有网络） 的绑定服务，统一管理您的网络配置。为了保障您的数据安全，建议您在内网中访问数据源。',
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
