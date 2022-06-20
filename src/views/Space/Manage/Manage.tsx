import { useParams } from 'react-router-dom'
import { ContentBox } from 'components'
import Setting from './Setting'
import { Sider } from '../Sider'
import Network from './Network/index'
import Member from './Member'
import PermissionList from './Permissions'

function Manage() {
  const { mod } = useParams<{ mod: string }>()
  return (
    <div tw="flex-1 flex h-full">
      <Sider funcMod="manage" />
      <ContentBox tw="flex-1 overflow-y-auto">
        {mod === 'setting' && <Setting />}
        {(mod === 'network' || !mod) && <Network />}
        {mod === 'member' && <Member />}
        {mod === 'permissions' && <PermissionList />}
      </ContentBox>
    </div>
  )
}

export default Manage
