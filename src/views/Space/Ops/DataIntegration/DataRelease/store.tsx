import { createContext, useContext, useRef } from 'react'
import { makeAutoObservable, set } from 'mobx'

export class DataReleaseStore {
  showVersion: boolean = false

  showDataSource: boolean = false

  showOffline: boolean = false

  showResume: boolean = false

  showSuspend: boolean = false

  selectedData?: Record<string, any> = undefined

  datasourceType?: number

  datasourceId?: string

  constructor() {
    makeAutoObservable(this)
  }

  set = (params: { [key: string]: any }) => {
    set(this, { ...params })
  }

  // public data: any = {
  //   data: [],
  //   loading: false,
  //   error: null,
  // }
  //
  // public getData = async (): Promise<void> => {
  //   set(this.data, { loading: true })
  //   try {
  //     const response = await fetch('/api/data-release')
  //     const data = await response.json()
  //     set(this.data, { data, loading: false })
  //   } catch (error) {
  //     set(this.data, { error, loading: false })
  //   }
  // }
}

export const DataReleaseContext = createContext<DataReleaseStore>({} as DataReleaseStore)
export const useDataReleaseStore = () => useContext(DataReleaseContext)

export const DataReleaseStoreProvider: React.FC = ({ children }) => {
  const store = useRef(new DataReleaseStore())
  return <DataReleaseContext.Provider value={store.current}>{children}</DataReleaseContext.Provider>
}

export default DataReleaseStore
