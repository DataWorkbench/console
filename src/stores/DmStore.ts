import { makeAutoObservable } from 'mobx'
import type RootStore from './RootStore'

type OP = '' | 'create' | 'edit' | 'delete'
type TUdf = 'UDF' | 'UDTF' | 'UDTTF'

class DmStore {
  rootStore

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this, {})
  }

  // 函数管理相关

  udfOp: OP = ''

  udfType: TUdf = 'UDF'

  setUdfOp = (op: OP) => {
    this.udfOp = op
  }

  setUdfType = (type: TUdf) => {
    this.udfType = type
  }

  // 其他
}

export default DmStore
