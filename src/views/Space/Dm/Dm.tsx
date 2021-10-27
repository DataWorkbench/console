import { useParams } from 'react-router-dom'
import RealTime from './RealTime'
import Resource from './Resource'
import Udf from './Udf'
import { Sider } from '../Sider'

function Dm() {
  const { mod } = useParams<{ mod: string }>()

  return (
    <div tw="flex-1 flex h-full">
      <Sider funcMod="dm" />
      <div tw="flex-1 overflow-y-auto">
        {(mod === 'realtime' || !mod) && <RealTime />}
        {mod === 'resource' && <Resource />}
        {mod === 'udf' && <Udf />}
      </div>
    </div>
  )
}

export default Dm
