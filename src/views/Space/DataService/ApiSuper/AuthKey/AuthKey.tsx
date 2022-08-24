import { PageTab } from '@QCFE/qingcloud-portal-ui'
import { FlexBox } from 'components'
import { getHelpCenterLink } from 'utils'
import AuthKeyTable from './AuthKeyTable'

const pageTabsData = [
  {
    title: '密钥管理',
    description: '密钥用于验证用户的身份，保障服务访问安全。密钥需绑定到 API 上才能生效。',
    icon: 'q-kmsFill',
    helpLink: getHelpCenterLink('/manual/data_service/mgt_api/key/')
  }
]

const Network = () => (
  <FlexBox orient="column" tw="p-5 min-h-full overflow-y-auto">
    <PageTab tabs={pageTabsData} />
    <div tw="flex flex-1 bg-neut-16 px-5 pt-3">
      <AuthKeyTable />
    </div>
  </FlexBox>
)

export default Network
