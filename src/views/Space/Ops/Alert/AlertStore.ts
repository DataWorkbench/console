import { createContext, useContext } from 'react'
import { makeAutoObservable, set } from 'mobx'

export class AlertStore {
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
    console.log(params)
    set(this, { ...params })
  }
}

export const AlertContext = createContext<AlertStore>({} as AlertStore)
export const useAlertStore = () => useContext(AlertContext)

export default AlertStore
