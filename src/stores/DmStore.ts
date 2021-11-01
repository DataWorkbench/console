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

  // 增、删、改操作状态
  op: OP = ''

  setOp = (op: OP) => {
    this.op = op
  }

  // 函数管理相关

  udfType: TUdf = 'UDF'

  setUdfType = (type: TUdf) => {
    this.udfType = type
  }
}

export default DmStore
