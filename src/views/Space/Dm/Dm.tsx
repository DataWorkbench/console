import { useParams } from 'react-router-dom'
import useIcon from 'hooks/useHooks/useIcon'
import icons from 'views/Space/Ops/icons'
import RealTime from './RealTime'
import Network from './Network'
import Resource from './Resource'
import Cluster from './Cluster'
// import Udf from './Udf'
import { Sider } from '../Sider'

function Dm() {
  const { mod } = useParams<{ mod: string }>()
  useIcon(icons)

  return (
    <div tw="flex-1 flex h-full w-full">
      <Sider funcMod="dm" />
      <div tw="flex-1 w-full">
        {(mod === 'realtime' || !mod) && <RealTime />}
        {mod === 'network' && <Network />}
        {mod === 'resource' && <Resource />}
        {/* {mod === 'udf' && <Udf />} */}
        {mod === 'cluster' && <Cluster />}
      </div>
    </div>
  )
}

export default Dm
