import { useParams } from 'react-router-dom'
import useIcon from 'hooks/useHooks/useIcon'
import ServiceDev from './ServiceDev'
import { ApiService, ApiRouters, AuthKey, ApiServiceDetail, AuthKeyDetail } from './ApiSuper'
import Cluster from './Cluster/index'
import { Sider } from '../Sider'
import icons from './icons'

function Dts() {
  const par = useParams<{ mod: string; detail?: string }>()
  useIcon(icons)
  const { mod, detail } = par

  return (
    <div tw="flex-1 flex h-full w-full">
      <Sider funcMod="dts" />
      <div tw="flex-1 overflow-y-auto">
        {(mod === 'cluster' || !mod) && <Cluster />}
        {mod === 'serviceDev' && <ServiceDev />}
        {mod === 'apiService' && !detail && <ApiService />}
        {mod === 'apiService' && detail && <ApiServiceDetail id={detail} />}
        {mod === 'routers' && <ApiRouters />}
        {mod === 'authKey' && !detail && <AuthKey />}
        {mod === 'authKey' && detail && <AuthKeyDetail id={detail} />}
      </div>
    </div>
  )
}

export default Dts
