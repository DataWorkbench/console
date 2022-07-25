import { makeAutoObservable, set } from 'mobx'
import type RootStore from './RootStore'

const defaultFuncList = [
  {
    name: 'upcloud',
    title: '数据源管理',
    subFuncList: [
      { name: 'dsl', title: '数据源列表', icon: 'blockchain' }
      // { name: 'tools', title: '网络连通工具', icon: 'earth' },
      // { name: 'migration', title: '整库迁移', icon: 'loadbalancer-policies' },
    ]
  },
  {
    name: 'dm',
    title: '数据开发',
    subFuncList: [
      { name: 'realtime', title: '作业开发', icon: 'cogwheel' },
      // { name: 'network', title: '网络配置', icon: 'earth' },
      { name: 'cluster', title: '计算集群', icon: 'pod' },
      // { name: 'table', title: '表管理', icon: 'listview' },
      { name: 'resource', title: '资源管理', icon: 'resource' }
      // { name: 'udf', title: '函数管理', icon: 'textarea' },
      // { name: 'history', title: '任务运维', icon: 'paper' },
    ]
  },
  {
    name: 'dts',
    title: '数据服务',
    subFuncList: [
      { name: 'cluster', title: '服务集群', icon: 'q-dockerHubDuotone2' },
      { name: 'serviceDev', title: '服务开发', icon: 'q-inferenceEnginDuotone' },
      {
        name: 'serviceGateWay',
        title: 'API 管理',
        icon: 'q-dataWarehouseDuotone',
        items: [
          { name: 'apiService', title: 'API 服务组' },
          { name: 'routers', title: '已发布 API' },
          { name: 'authKey', title: '密钥管理' }
        ]
      }
    ]
  },
  {
    name: 'ops',
    title: '运维中心',
    subFuncList: [
      // { name: 'overview', title: '运维大屏', icon: 'blockchain' },
      // { name: 'login', title: '登录', icon: 'blockchain' },
      { name: 'general-view', title: '运维概览', icon: 'blockchain' },
      {
        name: 'stream',
        title: '流式计算运维',
        icon: 'q-event2Duotone',
        items: [
          { name: 'release', title: '已发布作业' },
          { name: 'job', title: '作业实例' }
        ]
      },
      {
        name: 'sync',
        title: '数据集成运维',
        icon: 'q-iot2Duotone',
        items: [
          {
            name: 'data-release',
            title: '已发布作业'
          },
          {
            name: 'data-job',
            title: '作业实例'
          }
        ]
      },
      {
        title: '监控告警',
        name: 'alert',
        icon: 'q-bell2Duotone',
        items: [
          {
            name: 'alert-policy',
            title: '告警策略'
          },
          {
            name: 'alert-history',
            title: '告警记录'
          }
        ]
      }
      // { name: 'offline', title: '离线任务运维', icon: 'blockchain' },
      // { name: 'monitor', title: '智能监控', icon: 'blockchain' },
      // { name: 'logs', title: '操作日志', icon: 'blockchain' },
    ]
  },
  {
    hideInHeader: true,
    name: 'manage',
    title: '空间管理',
    subFuncList: [
      { name: 'network', title: '网络管理', icon: 'earth' },
      // { name: 'setting', title: '空间配置', icon: 'blockchain' },
      // { name: 'engine', title: '引擎管理', icon: 'blockchain' },
      { name: 'members', title: '成员管理', icon: 'group' },
      { name: 'permissions', title: '权限列表', icon: 'passport' }
    ]
  }
]
class WorkSpaceStore {
  rootStore

  defaultFuncList = defaultFuncList

  funcList = defaultFuncList

  space?: { name?: string; id?: string; owner?: string; regionId?: string } = {}

  spaceIndex = 0

  showHeaderNav = true

  constructor(rootStore: RootStore) {
    makeAutoObservable(this, {
      rootStore: false
    })
    this.rootStore = rootStore
  }

  set = (params: { [key: string]: any }) => {
    set(this, { ...params })
  }
}

export default WorkSpaceStore
