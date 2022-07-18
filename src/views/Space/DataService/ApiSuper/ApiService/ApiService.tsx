import { PageTab } from '@QCFE/qingcloud-portal-ui'
import { FlexBox } from 'components'
import { getHelpCenterLink } from 'utils'
import ApiGroupTable from './ApiGroupTable'

const pageTabsData = [
  {
    title: 'API 服务组',
    description:
      '具体说明内容待定具体说明内容待定具体说明内容待定具体说明内容待定具体说明内容待定具体说明内容待定具体说明内容待定具体说明内容待定。',
    icon: 'q-apps3Duotone',
    helpLink: getHelpCenterLink('/manual/data_development/network/create_network/')
  }
]

const Network = () => (
  <FlexBox orient="column" tw="p-5 min-h-full overflow-y-auto">
    <PageTab tabs={pageTabsData} />
    <div tw="flex flex-1 bg-neut-16 px-5 pt-3">
      <ApiGroupTable />
    </div>
  </FlexBox>
)

export default Network
