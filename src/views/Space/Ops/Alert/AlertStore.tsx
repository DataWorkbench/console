import { createContext, useContext, useRef } from 'react'
import { makeAutoObservable, set } from 'mobx'
import { PbmodelAlertPolicy } from 'types/types'

export class AlertStore {
  showMonitor = false //  job alert

  showAddMonitor = false // job add alert

  showAddMonitorDetail = false // alert detail

  showAddMonitorForm = false // alert form

  // 监控对象 有值的时候, 表单显示字符串
  monitorObject?: number

  // 绑定作业 有值的时候,表单字段不显示
  jobs?: string[]

  // selectedData?: Record<string, any> = undefined
  selectedMonitor?: Partial<PbmodelAlertPolicy> = {}

  selectedList?: PbmodelAlertPolicy[] = []

  disabledIds: string[] = []

  getQueryListKey?: () => string

  jobDetail?: Partial<Record<'jobId' | 'jobName' | 'spaceId' | 'regionId' | 'jobType', any>> = {}

  constructor() {
    makeAutoObservable(this)
  }

  set = (params: { [key: string]: any }) => {
    set(this, { ...params })
  }
}

export const AlertContext = createContext<AlertStore>({} as AlertStore)
export const useAlertStore = () => useContext(AlertContext)

export const AlertStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const store = useRef(new AlertStore())
  return <AlertContext.Provider value={store.current}>{children}</AlertContext.Provider>
}

export default AlertStore
