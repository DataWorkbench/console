import { PageTab } from '@QCFE/qingcloud-portal-ui'
import { FlexBox } from 'components'
import { getHelpCenterLink } from 'utils'
import NetworkTable from './NetworkTable'

const pageTabsData = [
  {
    title: '网络配置',
    description:
      '	提供VPN与Vxnet绑定服务，统一管理您的网络配置。为了保障您的数据安全，如您需要在内网中访问数据源、需要进行相应的VPC和Vxnet路径指定和绑定。',
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
