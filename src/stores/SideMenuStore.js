import { makeObservable } from 'mobx'
import { flattenDeep } from 'lodash'

class SideMenuStore {
  constructor(rootStore) {
    this.rootStore = rootStore
    makeObservable(this, {})
    this.menuLinks = flattenDeep(this.getLinks(this.menus))
  }

  title = '大数据平台'

  menus = [
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
  ]

  relationMenus = [
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
  ]

  getLinks(item) {
    const menus = item || this.menus
    return menus.map((menu) => {
      return menu.items ? this.getLinks(menu.items) : `/${menu.name}`
    })
  }
}

export default SideMenuStore
