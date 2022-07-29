import { PageTab } from '@QCFE/qingcloud-portal-ui'
import { FlexBox } from 'components'
import { getHelpCenterLink } from 'utils'
import ApiRoutersTable from './ApiRoutersTable'

const pageTabsData = [
  {
    title: '已发布 API',
    description:
      '开发调试好的数据服务 API，可以一键发布到 API 网关，通过绑定的域名使用 API 工具或代码来调用。',
    icon: 'q-apiDuotone',
    helpLink: getHelpCenterLink('/manual/data_development/network/create_network/')
  }
]

const Network = () => (
  <FlexBox orient="column" tw="p-5 min-h-full overflow-y-auto">
    <PageTab tabs={pageTabsData} />
    <div tw="flex flex-1 bg-neut-16 px-5 pt-3">
      <ApiRoutersTable />
    </div>
  </FlexBox>
)

export default Network
