import DataReleaseDetail from 'views/Space/Ops/DataIntegration/DataRelease/DataReleaseDetail'
import qs from 'qs'
import { useHistory, useLocation } from 'react-router-dom'
import emitter from 'utils/emitter'
import { AlertStore, AlertContext } from '../../Alert/AlertStore'
import { DataReleaseContext, DataReleaseStore } from './store'

const DataRelease = (props: Record<string, any>) => {
  const { id } = props
  const history = useHistory()
  const { search } = useLocation()
  const { version } = qs.parse(search.slice(1))
  if (!version) {
    emitter.emit('error', {
      title: `请选择具体版本的已发布作业`,
    })
    setTimeout(() => {
      history.goBack()
    }, 1500)
    return null
  }
  return (
    <DataReleaseContext.Provider value={new DataReleaseStore()}>
      <AlertContext.Provider value={new AlertStore()}>
        <DataReleaseDetail id={id} version={version as string} />
      </AlertContext.Provider>
    </DataReleaseContext.Provider>
  )
}

export default DataRelease
