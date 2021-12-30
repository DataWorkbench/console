import { makeAutoObservable, set } from 'mobx'
import { findIndex } from 'lodash-es'
import type RootStore from './RootStore'

interface IJob {
  id: string
  name: string
  type: number
  desc: string
}
class WorkFlowStore {
  rootStore

  curViewJobId: null | string = null

  curJob: null | IJob = null

  panels: IJob[] = []

  showNotify = false

  needSaveJob = false

  tabOp: '' | 'switch' | 'close' = ''

  opTabName = ''

  showSaveJobConfirm = false

  constructor(rootStore: RootStore) {
    makeAutoObservable(this, {
      rootStore: false,
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
    this.needSaveJob = false
    this.showSaveJobConfirm = false
    if (this.tabOp === 'close') {
      this.removePanel(this.opTabName)
    } else if (this.tabOp === 'switch') {
      const job = this.panels.find((p) => p.id === this.opTabName)
      if (job) {
        this.curJob = job
      }
    }
    this.tabOp = ''
  }

  resetNeedSave = () => {
    this.needSaveJob = false
    this.tabOp = ''
    this.opTabName = ''
    this.showSaveJobConfirm = false
  }

  needSave = (opTabName: string, op: 'switch' | 'close' = 'switch') => {
    this.showSaveJobConfirm = true
    this.opTabName = opTabName
    this.tabOp = op
  }

  set(params: { [key: string]: any }) {
    set(this, { ...params })
  }
}

export default WorkFlowStore
