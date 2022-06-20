// import { localstorage } from '@QCFE/qingcloud-portal-ui'
import { makeAutoObservable, set, observable } from 'mobx'
import type RootStore from './RootStore'

type TUdf = 'UDF' | 'UDTF' | 'UDTTF'

type ColumnSettingsType = { key: string; checked: boolean }

class DmStore {
  rootStore

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this, {
      rootStore: false,
      loadedKeys: observable.ref
    })
  }

  // 增、删、改操作状态
  op: OP = ''

  dataServiceOp: OP = ''

  loadedKeys: (string | number)[] = []

  setOp = (op: OP) => {
    this.op = op
  }

  setDataServiceOp = (op: OP) => {
    this.dataServiceOp = op
  }

  // 函数管理相关

  udfType: TUdf = 'UDF'

  udfStorageKey = 'DM_UDF_COLUMN_SETTINGS'

  modalData?: Record<string, any>

  set = (params: { [key: string]: any }) => {
    set(this, { ...params })
  }

  setUdfType = (type: TUdf) => {
    this.udfType = type
  }

  udfFilterRowKeys: string[] = []

  udfSelectedRowKeys: string[] = []

  udfColumnSettings: ColumnSettingsType[] = []

  setUdfFilterRowKeys = (keys: string[]) => {
    this.udfFilterRowKeys = keys
  }

  setUdfSelectedRowKeys = (keys: string[]) => {
    this.udfSelectedRowKeys = keys
  }

  setUdfColumnSettings = (settings: ColumnSettingsType[]) => {
    this.udfColumnSettings = settings
  }

  setModalData = (data: Record<string, any>) => {
    this.modalData = data
  }

  resetTreeData = () => {
    this.loadedKeys = []
  }
}

export default DmStore
