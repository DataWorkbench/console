import { useParams } from 'react-router-dom'
import { ContentBox } from 'components'
import Setting from './Setting'
import { Sider } from '../Sider'
import Member from './Member'
import PermissionList from './Permissions'

function Manage() {
  const { mod } = useParams<{ mod: string }>()
  return (
    <div tw="flex-1 flex h-full">
      <Sider funcMod="upcloud" />
      <ContentBox tw="flex-1 overflow-y-auto ">
        <div tw="p-5">
          {(mod === 'setting' || !mod) && <Setting />}
          {mod === 'member' && <Member />}
          {mod === 'permissions' && <PermissionList />}
        </div>
      </ContentBox>
    </div>
  )
}

export default Manage
