import { makeAutoObservable, set } from 'mobx'
import type RootStore from './RootStore'
import { loadWorkFlow, IWorkFlowParams } from './api'

class WorkFlowStore {
  rootStore

  flows = []

  curFlow = null

  showFlowModal = false

  constructor(rootStore: RootStore) {
    makeAutoObservable(this, {
      rootStore: false,
    })
    this.rootStore = rootStore
  }

  set(params: { [key: string]: any }) {
    set(this, { ...params })
  }

  setCurFlow(id: string) {
    const curFlow = this.flows.find((f: { id: string }) => f.id === id)
    if (curFlow) {
      this.curFlow = curFlow
    }
  }

  // eslint-disable-next-line class-methods-use-this
  // *create(params: IWorkFlowParams) {
  //   const res: { ret_code: number; [p: string]: any } = yield createWorkFlow(
  //     params
  //   )
  //   const ret = res.data
  //   if (ret.ret_code === 0) {
  //     return true
  //   }
  //   return false
  // }

  *load(params: IWorkFlowParams, force = false) {
    if (force) {
      this.curFlow = null
      this.flows = []
    }
    const ret: { ret_code: number; [p: string]: any } = yield loadWorkFlow(
      params
    )
    if (ret?.ret_code === 0 && ret.infos) {
      this.flows = this.flows.concat(ret.infos)
      return ret.infos
    }
    return []
  }
}

export default WorkFlowStore
