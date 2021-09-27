import { makeAutoObservable } from 'mobx'
import type RootStore from './RootStore'

type OP = '' | 'create' | 'update' | 'enable' | 'disable' | 'delete'

class DataSourceStore {
  rootStore

  op: OP = ''

  opSourceList: any[] = []

  constructor(rootStore: RootStore) {
    makeAutoObservable(this, {
      rootStore: false,
    })
    this.rootStore = rootStore
  }

  mutateOperation = (op: OP = '', sourceList: any[] = []) => {
    this.op = op
    this.opSourceList = sourceList
  }
}

export default DataSourceStore
