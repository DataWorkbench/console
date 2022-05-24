import { useParams } from 'react-router-dom'
// import RealTime from './RealTime'
// import Network from './Network'
// import Resource from './Resource'
import Cluster from './Cluster/index'
// import Udf from './Udf'
import { Sider } from '../Sider'

function Dts() {
  const { mod } = useParams<{ mod: string }>()

  return (
    <div tw="flex-1 flex h-full w-full">
      <Sider funcMod="dts" />
      <div tw="flex-1 w-full">
        服务器监控
        {/* {(mod === 'realtime' || !mod) && <RealTime />}
        {mod === 'network' && <Network />}
        {mod === 'resource' && <Resource />}
        {mod === 'udf' && <Udf />} */}
        {(mod === 'cluster' || !mod) && <Cluster />}
      </div>
    </div>
  )
}

export default Dts
