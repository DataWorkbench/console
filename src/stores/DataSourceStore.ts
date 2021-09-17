import { makeAutoObservable, set } from 'mobx'
import type RootStore from './RootStore'

class DataSourceStore {
  rootStore

  sourceList = []

  params = {
    offset: 0,
    limit: 10,
  }

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this, {})
  }

  set(params: { [key: string]: any }): void {
    set(this, { ...params })
  }

  clean(): void {
    set(this, {
      sourceList: [],
      params: {
        offset: 0,
        limit: 10,
      },
    })
  }

  async loadEngineMap(params: { [key: string]: any }) {
    const { api } = this.rootStore
    const ret = await api.datasource.loadEngineMap(params)
    if (ret?.ret_code === 0) {
      return ret.kinds
    }
    return []
  }

  async create(params: { [key: string]: any }): Promise<boolean> {
    const { api } = this.rootStore
    const ret = await api.datasource.create(params)
    if (ret?.ret_code === 0) {
      return true
    }
    return false
  }

  *load(params: { [key: string]: any }) {
    const { api } = this.rootStore
    const newParams = { ...this.params, ...params }
    const ret = yield* api.datasource.load(newParams)
    if (ret?.ret_code === 0) {
      this.sourceList = ret.infos
      return ret.infos
    }
    return []
  }
}

export default DataSourceStore
