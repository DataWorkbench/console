import { makeAutoObservable, observable, set } from 'mobx'
import { findIndex } from 'lodash-es'
import emitter from 'utils/emitter'
import { DataServiceManageDescribeApiConfigType } from 'types/response'
import {
  getFieldSettingParamsData,
  FieldSettingData
} from 'views/Space/DataService/ServiceDev/constants'
import type RootStore from './RootStore'

export interface ApiProps {
  key: string
  api_id: string
  api_name: string
  api_mode: number
  api_path: string
  space_id: string
  status?: number
  group_id?: string
  [key: string]: any
}

export interface Schema {
  type: string
  name: string
  is_primary: boolean
}

class WorkFlowStore {
  rootStore

  curViewJobId: null | string = null

  curApi: null | ApiProps = null

  apiConfigData: DataServiceManageDescribeApiConfigType | null = null

  schemaColumns: Schema[] = []

  fieldSettingData: FieldSettingData[] = []

  curVersion: null | ApiProps = null

  showJobModal = false

  panels: ApiProps[] = []

  showNotify = false

  showClusterSetting = false

  showBaseSetting = false

  showRequestSetting = false

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

  setTreeData = (data: ApiProps[]) => {
    this.treeData = data
  }

  addPanel = (panel: ApiProps) => {
    const idx = findIndex(this.panels, (p) => p.api_id === panel.api_id)
    if (idx === -1) {
      this.panels.push(panel)
    } else if (this.panels.length === 0) {
      this.panels.push(panel)
      this.curApi = panel
    } else {
      this.panels[idx] = panel
    }
  }

  removePanel = (apiId: string) => {
    const filterPanels = this.panels.filter((p) => p.api_id !== apiId)
    this.panels = filterPanels
    const len = filterPanels.length
    if (len === 0) {
      this.curApi = null
    } else if (this.curApi?.api_id === apiId) {
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

  set(params: { [key: string]: any }) {
    set(this, { ...params })
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
    this.schemaColumns = schema
    this.fieldSettingData = getFieldSettingParamsData(schema)
  }
}

export default WorkFlowStore
