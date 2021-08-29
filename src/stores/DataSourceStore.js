import { makeObservable, action, flow, observable, set } from 'mobx'

class DataSourceStore {
  sourceInfoList = []

  filter = {
    offset: 0,
    limit: 15,
  }

  constructor(rootStore) {
    this.rootStore = rootStore
    makeObservable(this, {
      sourceInfoList: observable,
      clean: action,
      loadEngineMap: flow,
      create: flow,
      load: flow,
    })
  }

  set(params) {
    set(this, { ...params })
  }

  clean() {
    set(this, {
      sourceInfoList: [],
      filter: {
        offset: 0,
        limit: 15,
      },
    })
  }

  *loadEngineMap() {
    const { api } = this.rootStore
    const res = yield api.datasource.loadEngineMap()
    const ret = res.data
    if (ret.ret_code === 0) {
      return ret.SourceList
    }
    return []
  }

  *create(params) {
    const { api } = this.rootStore
    const res = yield api.datasource.create(params)
    const ret = res.data
    if (ret.ret_code === 0) {
      return true
    }
    return false
  }

  *load(spaceId, force = false) {
    const { api } = this.rootStore
    if (force) {
      this.clean()
    }
    const params = { spaceId, ...this.filter }
    const res = yield api.datasource.load(params)
    const ret = res.data
    if (ret?.ret_code === 0) {
      this.sourceInfoList = this.sourceInfoList.concat(ret.infos)
      return ret.infos
    }
    return []
  }
}

export default DataSourceStore
