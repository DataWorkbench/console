import { useParams } from 'react-router-dom'
import ServiceDev from './ServiceDev'
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
      <div tw="flex-1 h-full">
        {(mod === 'cluster' || !mod) && <Cluster />}
        {mod === 'serviceDev' && <ServiceDev />}
        {/*  {mod === 'network' && <Network />}
        {mod === 'resource' && <Resource />}
        {mod === 'udf' && <Udf />} */}
      </div>
    </div>
  )
}

export default Dts
