import { makeAutoObservable, set } from 'mobx'
import { parseI18n } from 'utils/convert'
import type RootStore from './RootStore'

class GlobalStore {
  rootStore

  darkMode = false

  regionInfos = []

  menuInfo = {
    title: '大数据平台',
    menus: [
      {
        name: 'overview',
        title: '概览',
        icon: 'dashboard',
      },
      {
        name: 'workspace',
        title: '工作空间',
        icon: 'project',
      },
      {
        name: 'access_control_policy',
        title: '引擎管理',
        icon: 'computing',
        items: [
          {
            name: 'qingmr',
            title: 'QingMR',
            icon: 'image-object',
          },
          {
            name: 'flink',
            title: '实时计算 Flink',
            icon: 'cron-job',
          },
        ],
      },
      {
        name: 'logs',
        title: '操作日志',
        icon: 'paper',
      },
    ],
    relationMenus: [
      {
        name: 'relations',
        title: '关联服务',
        isSubTitle: true,
      },
      {
        name: 'relati',
        title: '运维工具',
        link: 'https://console.qingcloud.com/',
        icon: 'desktop-group',
      },
      {
        name: 'homepage',
        title: '子账户管理',
        icon: 'sub-account',
        link: 'https://console.qingcloud.com/',
      },
    ],
  }

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this, {
      menuInfo: false,
    })
  }

  set(params: { [key: string]: any }) {
    set(this, { ...params })
  }

  *loadRegions() {
    const { api } = this.rootStore
    const regionPromise = api.region.load()
    const ret = yield* regionPromise
    if (ret?.ret_code === 0) {
      this.regionInfos = parseI18n(ret.infos)
    }
    return this.regionInfos
  }
}

export default GlobalStore
