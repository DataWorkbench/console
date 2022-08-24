import { useParams } from 'react-router-dom'
import { ContentBox } from 'components'
import { useEffect } from 'react'
import { useStore } from 'stores/index'
import Setting from './Setting'
import { Sider } from '../Sider'
import Network from './Network/index'
import Member from './Member'
import PermissionList from './Permissions'

function Manage() {
  const { mod } = useParams<{ mod: string }>()
  const { workSpaceStore } = useStore()
  useEffect(() => {
    workSpaceStore.set({ showHeaderNav: false })
    return () => {
      workSpaceStore.set({ showHeaderNav: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div tw="flex-1 flex h-full">
      <Sider funcMod="manage" />
      <ContentBox tw="flex-1 overflow-y-auto p-5">
        {mod === 'setting' && <Setting />}
        {(mod === 'network' || !mod) && <Network />}
        {mod === 'members' && <Member />}
        {mod === 'permissions' && <PermissionList />}
      </ContentBox>
    </div>
  )
}

export default Manage
