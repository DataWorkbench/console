import { useRef } from 'react'
import useIcon from 'hooks/useHooks/useIcon'
import { DataReleaseContext, DataReleaseStore } from './store'
import DataReleaseTable from './DataReleaseTable'
import icons from '../icons'

const DataRelease = () => {
  useIcon(icons)
  const store = useRef(new DataReleaseStore())
  return (
    <DataReleaseContext.Provider value={store.current}>
      <DataReleaseTable />
    </DataReleaseContext.Provider>
  )
}

export default DataRelease
