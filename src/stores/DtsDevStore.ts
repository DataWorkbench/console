import { makeAutoObservable, observable, set } from 'mobx'
import { findIndex } from 'lodash-es'
import emitter from 'utils/emitter'
import type RootStore from './RootStore'

interface IJob {
  id: string
  name: string
  /**
   * 1 => "OfflineFull" 2 => "OfflineIncrement" 3 => "RealTime"
   *  */
  type: 1 | 2 | 3
  desc: string
  version: string
  source_type?: number
  target_type?: number
  jobMode?: 'DI' | 'RT' | 'OLE'
}

const initTreeData = [
  {
    key: 'di-root',
    pid: 'di-root',
    title: 'API组',
    isLeaf: false,
    children: [
      {
        key: 'di-root2',
        pid: 'di-root',
        title: 'API',
        isLeaf: true
      }
    ]
  }
]

class WorkFlowStore {
  rootStore

  curViewJobId: null | string = null

  curJob: null | IJob = null

  curVersion: null | IJob = null

  showJobModal = false

  panels: IJob[] = []

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

  opTabName = ''

  nextJob: null | IJob = null

  showSaveJobConfirm = false

  treeData = initTreeData

  loadedKeys: (string | number)[] = []

  constructor(rootStore: RootStore) {
    makeAutoObservable(this, {
      rootStore: false,
      treeData: observable.ref,
      loadedKeys: observable.ref
    })
    this.rootStore = rootStore
  }

  addPanel = (panel: IJob) => {
    const idx = findIndex(this.panels, (p) => p.id === panel.id)
    if (idx === -1) {
      this.panels.push(panel)
    }
  }

  removePanel = (panelId: string) => {
    const filterPanels = this.panels.filter((p) => p.id !== panelId)
    this.panels = filterPanels
    const len = filterPanels.length
    if (len === 0) {
      this.curJob = null
    } else if (this.curJob?.id === panelId) {
      this.curJob = filterPanels[len - 1]
    }
  }

  switchPanel = () => {
    this.isDirty = false
    this.showSaveJobConfirm = false
    if (this.tabOp === 'close') {
      this.removePanel(this.opTabName)
    } else if (this.tabOp === 'switch') {
      const job = this.panels.find((p) => p.id === this.opTabName) || this.nextJob
      if (job) {
        this.curJob = job
      }
    }
    this.resetNeedSave()
  }

  resetNeedSave = () => {
    this.isDirty = false
    this.tabOp = ''
    this.opTabName = ''
    this.showSaveJobConfirm = false
    this.nextJob = null
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
    this.treeData = initTreeData
    this.loadedKeys = []
  }

  toggleJobModal = (v?: boolean) => {
    if (typeof v === 'boolean') {
      this.showJobModal = v
    } else {
      this.showJobModal = !this.showJobModal
    }
  }
}

export default WorkFlowStore
