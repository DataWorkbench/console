import { useRef } from 'react'
import { DataReleaseContext, DataReleaseStore } from './store'
import DataReleaseTable from './DataReleaseTable'

const DataRelase = () => {
  const store = useRef(new DataReleaseStore())
  return (
    <DataReleaseContext.Provider value={store.current}>
      <DataReleaseTable />
    </DataReleaseContext.Provider>
  )
}

export default DataRelase
