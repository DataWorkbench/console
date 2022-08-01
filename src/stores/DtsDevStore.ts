import { makeAutoObservable, observable, set } from 'mobx'
import { findIndex } from 'lodash-es'
import emitter from 'utils/emitter'
import { PbmodelApiConfig } from 'types/types'
import { DataServiceManageDescribeApiConfigType } from 'types/response'
import { FieldSettingData } from 'views/Space/DataService/ServiceDev/Sync/SyncUtil'
import type RootStore from './RootStore'

type ReqDataSourceProp = PbmodelApiConfig['request_params']['request_params']
type ResDataSourceProp = PbmodelApiConfig['response_params']['response_params']

export interface ApiProps {
  key: string
  api_id: string
  api_name: string
  api_mode: number
  api_path: string
  space_id: string
  status?: number
  group_id?: string
  is_history?: boolean | undefined // 是否是历史数据 true:历史数据 false:当前数据
  version_id?: string // 历史数据的版本id
  [key: string]: any
}

export interface Schema {
  key: string
  field: string
  isRequest: boolean
  isResponse: boolean
  type: string
  isPrimary: boolean
}

class WorkFlowStore {
  rootStore

  curViewJobId: null | string = null

  curApi: null | ApiProps = null

  apiConfigData: DataServiceManageDescribeApiConfigType | null = null

  apiRequestData: null | ReqDataSourceProp = null // 编辑状态api配置

  apiResponseData: null | ResDataSourceProp = null // 编辑状态api配置

  oldApiTableNam: null | string = null // 接口请求出的api 表名称

  fieldSettingData: FieldSettingData[] = []

  curVersion: null | ApiProps = null

  showJobModal = false

  panels: ApiProps[] = []

  showNotify = false

  showClusterSetting = false

  showBaseSetting = false

  showRequestSetting = false

  showTestModal = false

  showClusterErrorTip = false

  showResponseSetting = false

  showVersions = false

  showMonitor = false

  showAddMonitor = false

  showAddMonitorDetail = false

  showAddMonitorForm = false

  isDirty = false

  tabOp: '' | 'switch' | 'close' | 'leave' = ''

  opTabName = '' // api_id: string

  nextApi: null | ApiProps = null

  showSaveJobConfirm = false

  treeData: ApiProps[] = []

  loadedKeys: (string | number)[] = []

  constructor(rootStore: RootStore) {
    makeAutoObservable(this, {
      rootStore: false,
      treeData: observable.ref,
      loadedKeys: observable.ref
    })
    this.rootStore = rootStore
  }

  set(params: { [key: string]: any }) {
    set(this, { ...params })
  }

  setTreeData = (data: ApiProps[]) => {
    this.treeData = data
  }

  addPanel = (panel: ApiProps) => {
    if (this.panels.length === 0) {
      this.panels.push(panel)
      this.curApi = panel
    } else {
      const idx = findIndex(this.panels, (p) => p.key === panel.key)
      if (idx === -1) {
        this.panels.push(panel)
      } else {
        this.panels[idx] = panel
      }
    }
  }

  removePanel = (key: string) => {
    const filterPanels = this.panels.filter((p) => p.key !== key)
    this.panels = filterPanels
    const len = filterPanels.length
    if (len === 0) {
      this.curApi = null
    } else if (this.curApi?.key === key) {
      this.curApi = filterPanels[len - 1]
    }
  }

  switchPanel = () => {
    this.isDirty = false
    this.showSaveJobConfirm = false
    if (this.tabOp === 'close') {
      this.removePanel(this.opTabName)
    } else if (this.tabOp === 'switch') {
      const api = this.panels.find((p) => p.api_id === this.opTabName) || this.nextApi
      if (api) {
        this.curApi = api
      }
    }
    this.resetNeedSave()
  }

  resetNeedSave = () => {
    this.isDirty = false
    this.tabOp = ''
    this.opTabName = ''
    this.showSaveJobConfirm = false
    this.nextApi = null
  }

  showSaveConfirm = (opTabName: string, op: 'switch' | 'close' | 'leave' = 'switch') => {
    this.showSaveJobConfirm = true
    this.opTabName = opTabName
    this.tabOp = op
  }

  hideSaveConfirm = () => {
    emitter.emit('cancelSaveJob')
    this.showSaveJobConfirm = false
    this.opTabName = ''
    this.tabOp = ''
  }

  resetTreeData = () => {
    this.loadedKeys = []
  }

  toggleJobModal = (v?: boolean) => {
    if (typeof v === 'boolean') {
      this.showJobModal = v
    } else {
      this.showJobModal = !this.showJobModal
    }
  }

  setSchemaColumns = (schema: Schema[]) => {
    this.fieldSettingData = schema
  }

  setApiConfigData = (data: DataServiceManageDescribeApiConfigType) => {
    this.apiConfigData = data
  }
}

export default WorkFlowStore
