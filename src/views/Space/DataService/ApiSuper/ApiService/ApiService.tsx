import { PageTab } from '@QCFE/qingcloud-portal-ui'
import { FlexBox } from 'components'
import { getHelpCenterLink } from 'utils'
import ApiGroupTable from './ApiGroupTable'

const pageTabsData = [
  {
    title: 'API 服务组',
    description:
      '通过 API 服务组可以高效、便捷地管理一组相关联的 API。在 API 管理模块可以进行 API 的完整生命周期管理。',
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
