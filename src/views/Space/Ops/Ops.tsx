import { useParams } from 'react-router-dom'
// import { OverView } from './OverView'
import DataJobInstance from 'views/Space/Ops/DataIntegration/JobInstance'
import DataRelease from 'views/Space/Ops/DataIntegration/DataRelease'
import DataJobInstanceDetail from 'views/Space/Ops/DataIntegration/JobInstance/JobInstance'
import DataReleaseDetail from 'views/Space/Ops/DataIntegration/DataRelease/DataRelease'
import AlertHistory from 'views/Space/Ops/Alert/AlertHistory'
import AlertPolicy from 'views/Space/Ops/Alert/AlertPolicy'
import StreamRelease from 'views/Space/Ops/Stream1/StreamRelease'
import StreamInstance from 'views/Space/Ops/Stream1/StreamInstance'
import useIcon from 'hooks/useHooks/useIcon'
import StreamReleaseDetail from 'views/Space/Ops/Stream1/StreamReleaseDetail'
import StreamInstanceDetail from 'views/Space/Ops/Stream1/StreamInstanceDetail'
import { DataReleaseStoreProvider } from 'views/Space/Ops/DataIntegration/DataRelease/store'
import { Sider } from '../Sider'
import icons from './icons'
// import Release from './Stream/Release'
// import Job from './Stream/Job'

export const Ops = () => {
  useIcon(icons)
  const { mod, detail } = useParams<{ mod: string; detail?: string }>()
  return (
    <div tw="flex-1 flex h-full">
      <Sider funcMod="ops" />
      <div tw="flex-1 overflow-y-auto">
        {/* {(mod === 'overview' || !mod) && <OverView />} */}
        {((mod === 'release' && !detail) || !mod) && (
          <DataReleaseStoreProvider>
            <StreamRelease />
          </DataReleaseStoreProvider>
        )}
        {mod === 'release' && detail && <StreamReleaseDetail id={detail} />}
        {mod === 'job' && !detail && <StreamInstance />}
        {mod === 'job' && detail && <StreamInstanceDetail id={detail} />}
        {mod === 'data-release' && detail && <DataReleaseDetail id={detail} />}
        {mod === 'data-release' && !detail && <DataRelease />}
        {mod === 'data-job' && detail && <DataJobInstanceDetail id={detail!} />}
        {mod === 'data-job' && !detail && <DataJobInstance />}
        {mod === 'alert-policy' && <AlertPolicy />}
        {mod === 'alert-history' && <AlertHistory />}
      </div>
    </div>
  )
}

export default Ops
