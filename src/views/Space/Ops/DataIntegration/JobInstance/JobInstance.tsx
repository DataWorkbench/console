import { AlertContext, AlertStore } from '../../Alert/AlertStore'
import DataJobInstanceDetail from './DataJobInstanceDetail'

const DataRelease = (props: Record<string, any>) => {
  const { id } = props

  return (
    <AlertContext.Provider value={new AlertStore()}>
      <DataJobInstanceDetail id={id} />
    </AlertContext.Provider>
  )
}

export default DataRelease
