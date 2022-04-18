import { createContext, useContext } from 'react'
import { makeAutoObservable, set } from 'mobx'

export class AlarmsStore {
  showMonitor = false

  showAddMonitor = false

  showAddMonitorDetail = false

  showAddMonitorForm = false

  selectedData?: Record<string, any> = undefined

  selectedList?: Record<string, any>[] = []

  constructor() {
    makeAutoObservable(this)
  }

  set = (params: { [key: string]: any }) => {
    set(this, { ...params })
  }
}

export const AlarmsContext = createContext<AlarmsStore>({} as AlarmsStore)
export const useAlarmsStore = () => useContext(AlarmsContext)

export default AlarmsStore
