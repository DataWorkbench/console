import { makeAutoObservable, set } from 'mobx'

class DataSourceStore {
  sourceList = []

  params = {
    offset: 0,
    limit: 10,
  }

  constructor(rootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this, {})
  }

  set(params) {
    set(this, { ...params })
  }

  clean() {
    set(this, {
      sourceList: [],
      params: {
        offset: 0,
        limit: 10,
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

  *load(params) {
    const { api } = this.rootStore
    const newParams = { ...this.params, ...params }
    const res = yield api.datasource.load(newParams)
    const ret = res.data
    if (ret?.ret_code === 0) {
      this.sourceList = ret.infos
      return ret.infos
    }
    return []
  }
}

export default DataSourceStore
