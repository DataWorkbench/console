import { useParams } from 'react-router-dom'
import Setting from './Setting'
import { Sider } from '../Sider'

function Manage() {
  const { mod } = useParams<{ mod: string }>()
  return (
    <div tw="flex-1 flex h-full">
      <Sider funcMod="manage" />
      <div tw="flex-1 overflow-y-auto">
        {(mod === 'setting' || !mod) && <Setting />}
      </div>
    </div>
  )
}

export default Manage
