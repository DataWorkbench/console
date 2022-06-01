// import { localstorage } from '@QCFE/qingcloud-portal-ui'
import { makeAutoObservable, set, observable } from 'mobx'
import type RootStore from './RootStore'

type TUdf = 'UDF' | 'UDTF' | 'UDTTF'

type ColumnSettingsType = { key: string; checked: boolean }

const initTreeData = [
  {
    key: 'di-root',
    pid: 'di-root',
    jobMode: 'DI',
    title: 'API组',
    isLeaf: false,
    children: [
      {
        key: 'di-root1',
        pid: 'di-root1',
        jobMode: 'DI2',
        title: 'API',
        isLeaf: true
      },
      {
        key: 'di-root2',
        pid: 'di-root3',
        jobMode: 'DI2',
        title: 'API',
        isLeaf: true
      }
    ]
  }
]

class DmStore {
  rootStore

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this, {
      rootStore: false,
      APItreeData: observable.ref,
      loadedKeys: observable.ref
    })
  }

  // 增、删、改操作状态
  op: OP = ''

  dataServiceOp: OP = ''

  APItreeData = initTreeData

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
    this.APItreeData = initTreeData
    this.loadedKeys = []
  }
}

export default DmStore
