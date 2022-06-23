import { createContext, useContext, useRef } from 'react'
import { makeAutoObservable, set } from 'mobx'

export class AlertStore {
  showMonitor = false

  showAddMonitor = false

  showAddMonitorDetail = false

  showAddMonitorForm = false

  // 监控对象 有值的时候, 表单显示字符串
  monitorObject?: number

  // 绑定作业 有值的时候,表单字段不显示
  jobs?: string[]

  selectedData?: Record<string, any> = undefined

  selectedList?: Record<string, any>[] = []

  constructor() {
    makeAutoObservable(this)
  }

  set = (params: { [key: string]: any }) => {
    set(this, { ...params })
  }
}

export const AlertContext = createContext<AlertStore>({} as AlertStore)
export const useAlertStore = () => useContext(AlertContext)

export const AlertStoreProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const store = useRef(new AlertStore())
  return (
    <AlertContext.Provider value={store.current}>
      {children}
    </AlertContext.Provider>
  )
}

export default AlertStore
