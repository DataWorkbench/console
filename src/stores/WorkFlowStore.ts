import { makeObservable, flow, action, observable, set } from 'mobx'
import type RootStore from './RootStore'

class WorkFlowStore {
  rootStore

  flows = []

  curFlow = null

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    makeObservable(this, {
      flows: observable,
      curFlow: observable,
      set: action,
      setCurFlow: action,
      create: flow,
      load: flow,
    })
  }

  set(params: { [key: string]: any }) {
    set(this, { ...params })
  }

  setCurFlow(id: string) {
    const curFlow = this.flows.find((f) => f.id === id)
    if (curFlow) {
      this.curFlow = curFlow
    }
  }

  *create(params: { [key: string]: any }) {
    const { api } = this.rootStore
    const res = yield* api.workflow.create(params)
    const ret = res.data
    if (ret.ret_code === 0) {
      return true
    }
    return false
  }

  *load(params: { [key: string]: any }, force = false) {
    if (force) {
      this.curFlow = null
      this.flows = []
    }
    const { api } = this.rootStore
    const ret = yield* api.workflow.load(params)
    if (ret?.ret_code === 0 && ret.infos) {
      this.flows = this.flows.concat(ret.infos)
      return ret.infos
    }
    return []
  }
}

export default WorkFlowStore
