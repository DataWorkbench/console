import DataReleaseDetail from 'views/Space/Ops/DataIntegration/DataRelease/DataReleaseDetail'
import { AlertStore, AlertContext } from '../../Alert/AlertStore'
import { DataReleaseContext, DataReleaseStore } from './store'

const DataRelease = (props: Record<string, any>) => {
  const { id } = props
  return (
    <DataReleaseContext.Provider value={new DataReleaseStore()}>
      <AlertContext.Provider value={new AlertStore()}>
        <DataReleaseDetail id={id} />
      </AlertContext.Provider>
    </DataReleaseContext.Provider>
  )
}

export default DataRelease
