import { makeAutoObservable, set } from 'mobx'
import type RootStore from './RootStore'

class WorkSpaceStore {
  rootStore

  funcList = [
    {
      name: 'upcloud',
      title: '数据上云',
      subFuncList: [
        { name: 'dsl', title: '数据源列表', icon: 'blockchain' },
        { name: 'tools', title: '网络连通工具', icon: 'earth' },
        { name: 'migration', title: '整库迁移', icon: 'loadbalancer-policies' },
      ],
    },
    {
      name: 'dm',
      title: '云上加工',
      subFuncList: [
        { name: 'realtime', title: '实时计算', icon: 'cogwheel' },
        { name: 'cluster', title: '计算集群', icon: 'pod' },
        { name: 'table', title: '表管理', icon: 'listview' },
        { name: 'resource', title: '资源管理', icon: 'resource' },
        { name: 'func', title: '函数管理', icon: 'textarea' },
        { name: 'history', title: '任务运维', icon: 'paper' },
      ],
    },
    {
      name: 'ops',
      title: '运维中心',
      subFuncList: [
        { name: 'overview', title: '运维大屏', icon: 'blockchain' },
        { name: 'realtime', title: '实时任务运维', icon: 'blockchain' },
        { name: 'offline', title: '离线任务运维', icon: 'blockchain' },
        { name: 'monitor', title: '智能监控', icon: 'blockchain' },
        { name: 'logs', title: '操作日志', icon: 'blockchain' },
      ],
    },
    {
      name: 'manage',
      title: '空间管理',
      subFuncList: [
        { name: 'setting', title: '空间配置', icon: 'blockchain' },
        { name: 'engine', title: '引擎管理', icon: 'blockchain' },
        { name: 'users', title: '成员管理', icon: 'blockchain' },
        { name: 'permissions', title: '列表权限', icon: 'blockchain' },
      ],
    },
  ]

  constructor(rootStore: RootStore) {
    makeAutoObservable(this, {
      rootStore: false,
    })
    this.rootStore = rootStore
  }

  set(params: { [key: string]: any }) {
    set(this, { ...params })
  }
}

export default WorkSpaceStore
