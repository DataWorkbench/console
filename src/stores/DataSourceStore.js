import { makeObservable, flow } from 'mobx'

class DataSourceList {
  constructor(rootStore) {
    this.rootStore = rootStore
    makeObservable(this, {
      loadEngineMap: flow,
    })
  }

  *loadEngineMap() {
    const { api } = this.rootStore
    const res = yield api.datasource.loadEngineMap()
    const ret = res.data
    if (ret.ret_code === 0) {
      return ret.engines
    }
    return []
  }
}

export default DataSourceList
