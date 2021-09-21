import { makeAutoObservable, set } from 'mobx'
import type RootStore from './RootStore'
import {
  // loadSourceKind,
  // createDataSource,
  loadDataSource,
  IDataSourceParams,
} from './api'

class DataSourceStore {
  rootStore

  sourceList = []

  params = {
    offset: 0,
    limit: 10,
  }

  constructor(rootStore: RootStore) {
    makeAutoObservable(this, {
      rootStore: false,
    })
    this.rootStore = rootStore
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

  // async loadEngineMap(params: IDataSourceParams) {
  //   const ret = await loadSourceKind(params)
  //   if (ret?.ret_code === 0) {
  //     return ret.kinds
  //   }
  //   return []
  // }

  // async create(params: IDataSourceParams) {
  //   const ret = await createDataSource(params)
  //   if (ret?.ret_code === 0) {
  //     return true
  //   }
  //   return false
  // }

  *load(params: IDataSourceParams) {
    const newParams = { ...this.params, ...params }
    const ret: { ret_code: number; [p: string]: any } = yield loadDataSource(
      newParams
    )
    if (ret?.ret_code === 0) {
      this.sourceList = ret.infos
      return ret.infos
    }
    return []
  }
}

export default DataSourceStore
