import { makeObservable, flow, action, observable, set } from 'mobx'

class WorkFlowStore {
  flows = []

  curFlow = null

  constructor(rootStore) {
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

  set(params) {
    set(this, { ...params })
  }

  setCurFlow(id) {
    const curFlow = this.flows.find((f) => f.id === id)
    if (curFlow) {
      this.curFlow = curFlow
    }
  }

  *create(params) {
    const { api } = this.rootStore
    const res = yield api.workflow.create(params)
    const ret = res.data
    if (ret.ret_code === 0) {
      return true
    }
    return false
  }

  *load(params, force = false) {
    if (force) {
      this.curFlow = null
      this.flows = []
    }
    const { api } = this.rootStore
    const res = yield api.workflow.load(params)
    const ret = res.data
    if (ret.ret_code === 0 && ret.infos) {
      this.flows = this.flows.concat(ret.infos)
      return ret.infos
    }
    return []
  }
}

export default WorkFlowStore
