// import { localstorage } from '@QCFE/qingcloud-portal-ui'
import { makeAutoObservable, set } from 'mobx'
import type RootStore from './RootStore'

type TUdf = 'UDF' | 'UDTF' | 'UDTTF'

type ColumnSettingsType = { key: string; checked: boolean }

class DmStore {
  rootStore

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this, {
      rootStore: false,
    })
  }

  // 增、删、改操作状态
  op: OP = ''

  setOp = (op: OP) => {
    this.op = op
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

  udfSelectedRowKeys: string[] = []

  udfColumnSettings: ColumnSettingsType[] = []

  setUdfSelectedRowKeys = (keys: string[]) => {
    this.udfSelectedRowKeys = keys
  }

  setUdfColumnSettings = (settings: ColumnSettingsType[]) => {
    this.udfColumnSettings = settings
  }

  setModalData = (data: Record<string, any>) => {
    this.modalData = data
  }
}

export default DmStore
