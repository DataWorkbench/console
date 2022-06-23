import { AlertStoreProvider } from '../../Alert/AlertStore'
import DataJobInstanceDetail from './DataJobInstanceDetail'

const DataRelease = (props: Record<string, any>) => {
  const { id } = props

  return (
    <AlertStoreProvider>
      <DataJobInstanceDetail id={id} />
    </AlertStoreProvider>
  )
}

export default DataRelease
