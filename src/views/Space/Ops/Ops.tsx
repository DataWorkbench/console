import { useParams } from 'react-router-dom'
// import { OverView } from './OverView'
import DataJobInstance from 'views/Space/Ops/DataIntegration/JobInstance'
import DataRelease from 'views/Space/Ops/DataIntegration/DataRelase'
import { Sider } from '../Sider'
import Release from './Stream/Release'
import Job from './Stream/Job'

export const Ops = () => {
  const { mod } = useParams<{ mod: string }>()
  console.log(mod)
  return (
    <div tw="flex-1 flex h-full">
      <Sider funcMod="ops" />
      <div tw="flex-1 overflow-y-auto">
        {/* {(mod === 'overview' || !mod) && <OverView />} */}
        {(mod === 'release' || !mod) && <Release />}
        {mod === 'job' && <Job />}
        {mod === 'data-release' && <DataRelease />}
        {mod === 'data-job' && <DataJobInstance />}
      </div>
    </div>
  )
}

export default Ops
