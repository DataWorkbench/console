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

  *loadEngineMap(params) {
    const { api } = this.rootStore
    const ret = yield api.datasource.loadEngineMap(params)
    if (ret?.ret_code === 0) {
      return ret.kinds
    }
    return []
  }

  *create(params) {
    const { api } = this.rootStore
    const ret = yield api.datasource.create(params)
    if (ret?.ret_code === 0) {
      return true
    }
    return false
  }

  *load(params) {
    const { api } = this.rootStore
    const newParams = { ...this.params, ...params }
    const ret = yield api.datasource.load(newParams)
    if (ret?.ret_code === 0) {
      this.sourceList = ret.infos
      return ret.infos
    }
    return []
  }
}

export default DataSourceStore
