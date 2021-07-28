import { makeObservable, observable, flow, action, set } from 'mobx'
import { fromPromise } from 'mobx-utils'

class WorkspaceStore {
  zones = {}

  loadStatus

  showModal = false

  curSpace

  curOpt = 'create'

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
        { name: 'resources', title: '资源管理', icon: 'resource' },
        { name: 'funcs', title: '函数管理', icon: 'textarea' },
        { name: 'history', title: '任务运行历史', icon: 'paper' },
      ],
    },
    {
      name: 'ops',
      title: '运维中心',
      subFuncList: [
        { name: 'overview', title: '运维大屏' },
        { name: 'realtime', title: '实时任务运维' },
        { name: 'offline', title: '离线任务运维' },
        { name: 'monitor', title: '智能监控' },
        { name: 'logs', title: '操作日志' },
      ],
    },
    {
      name: 'manage',
      title: '空间管理',
      subFuncList: [
        { name: 'setting', title: '空间配置' },
        { name: 'engine', title: '引擎管理' },
        { name: 'users', title: '成员管理' },
        { name: 'permissions', title: '列表权限' },
      ],
    },
  ]

  constructor(rootStore) {
    makeObservable(this, {
      zones: observable,
      loadStatus: observable,
      showModal: observable,
      load: flow,
      clean: action,
      create: flow,
      delete: flow,
      update: flow,
      set: action,
    })
    this.rootStore = rootStore
  }

  getZone(zoneName) {
    const { zones } = this
    const curZone = zones[zoneName]
    if (!curZone) {
      return {
        workspaces: [],
        hasMore: true,
        loadStatus: null,
        filter: {
          offset: 0,
          limit: 5,
        },
      }
    }
    return zones[zoneName]
  }

  set(params) {
    set(this, { ...params })
  }

  clean(zoneName) {
    const zone = this.zones[zoneName]
    if (!zone) {
      return
    }
    this.zones[zoneName] = null
  }

  async loadAll(zoneName) {
    const { api } = this.rootStore
    const workspacesPromise = api.workspace.load({ zone: zoneName })
    const res = await workspacesPromise
    const ret = res.data
    if (ret.ret_code === 0) {
      const { infos } = ret
      if (infos && infos.length) {
        return infos
      }
    }
    return null
  }

  *load(zoneName, force = false) {
    const { api } = this.rootStore
    const curZone = this.getZone(zoneName)
    if (force) {
      this.clean(zoneName)
    }
    const { workspaces, filter } = curZone

    const workspacesPromise = api.workspace.load({ ...filter, zone: zoneName })
    curZone.loadStatus = fromPromise(workspacesPromise)

    const res = yield workspacesPromise
    const ret = res.data
    if (ret.ret_code === 0) {
      const { infos, has_more: hasMore } = ret
      if (infos && infos.length) {
        curZone.workspaces = workspaces.concat(infos)
        curZone.hasMore = hasMore
        filter.offset = curZone.workspaces.length
      } else {
        curZone.hasMore = hasMore
      }
      this.zones[zoneName] = curZone
    }
  }

  *create(params) {
    const {
      rootStore: { api },
    } = this
    const workspacesPromise = api.workspace.create(params)
    this.loadStatus = fromPromise(workspacesPromise)
    const res = yield workspacesPromise
    const ret = res.data
    if (ret.ret_code !== 0) {
      throw new Error(ret.message)
    }
    return true
  }

  *delete(id) {
    const { api } = this.rootStore
    const promise = api.workspace.delete(id)
    this.loadStatus = fromPromise(promise)
    const res = yield promise
    const ret = res.data
    if (ret.ret_code !== 0) {
      throw new Error(ret.message)
    }
    return true
  }

  *update(params) {
    const { api } = this.rootStore
    const promise = api.workspace.update(params)
    this.loadStatus = fromPromise(promise)
    const res = yield promise
    const ret = res.data
    if (ret.ret_code !== 0) {
      throw new Error(ret.message)
    }
    return ret
  }
}

export default WorkspaceStore
