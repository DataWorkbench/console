import DataSourceList1 from './DataSourceList'
import { NetworkProvider } from './NetworkProvider'

const DataSourceList = () => {
  return (
    <NetworkProvider>
      <DataSourceList1 />
    </NetworkProvider>
  )
}

export default DataSourceList
