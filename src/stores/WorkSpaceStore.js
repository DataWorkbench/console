import { makeObservable, observable, flow, action, set } from 'mobx'
import { fromPromise } from 'mobx-utils'
import { omitBy } from 'lodash'

class WorkSpaceStore {
  regions = {}

  curRegionId = null

  loadStatus

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

  constructor(rootStore) {
    makeObservable(this, {
      regions: observable,
      loadStatus: observable,
      // showSpaceModal: observable,
      // curOpt: observable,
      curRegionId: observable,
      fetchData: flow,
      cud: flow,
      create: flow,
      update: flow,
      disable: flow,
      enable: flow,
      delete: flow,
      set: action,
    })
    this.rootStore = rootStore
  }

  getRegion(regionId) {
    if (!this.regions[regionId]) {
      this.regions[regionId] = {
        workspaces: [],
        hasMore: true,
        total: 0,
        loadStatus: null,
        filter: {
          offset: 0,
          limit: 10,
          sort_by: 'created',
          reverse: true,
        },
      }
    }
    return this.regions[regionId]
  }

  set(params) {
    set(this, { ...params })
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

  *fetchData(params) {
    const { regionId, cardView, force, ...filter } = params
    const { api } = this.rootStore
    const region = this.getRegion(regionId)
    const newFilter = omitBy(
      {
        ...region.filter,
        ...filter,
      },
      (v) => v === ''
    )
    region.filter = newFilter

    if (cardView && force) {
      region.hasMore = true
    }
    if (
      cardView &&
      (region.loadStatus?.state === 'pending' || region.hasMore === false)
    ) {
      return
    }
    const isReFetch = !cardView || region.filter.offset === 0
    if (isReFetch) {
      region.workspaces = []
    }
    const workspacesPromise = api.workspace.load({
      ...region.filter,
      regionId,
    })
    region.loadStatus = fromPromise(workspacesPromise)
    const ret = yield workspacesPromise
    // const ret = res.data
    if (ret?.ret_code === 0) {
      // if (regionId === 'staging') {
      //   region.hasMore = false
      //   return
      // }
      const { infos, total } = ret
      if (infos && infos.length) {
        // if (isReFetch) {
        //   region.workspaces = []
        // }
        region.workspaces = region.workspaces.concat(infos)
        if (cardView) {
          region.filter.offset = region.workspaces.length
        }
      }
      region.total = total
      region.hasMore = ret.has_more || false
    }
  }

  *cud(op, params) {
    const { api } = this.rootStore
    const workspacesPromise = api.workspace[op](params)
    this.loadStatus = fromPromise(workspacesPromise)
    return yield workspacesPromise
  }

  *create(params) {
    yield this.cud('create', params)
  }

  *update(params) {
    const ret = yield this.cud('update', params)
    if (ret?.ret_code === 0) {
      const { regionId, spaceId, name, desc } = params
      const curRegion = this.regions[regionId]
      curRegion.workspaces = curRegion.workspaces.map((space) => {
        if (spaceId.includes(space.id)) {
          return {
            ...space,
            name,
            desc,
          }
        }
        return space
      })
    }
  }

  *enable(params) {
    const ret = yield this.cud('enable', params)
    if (ret?.ret_code === 0) {
      const { regionId, spaceIds } = params
      const curRegion = this.regions[regionId]
      curRegion.workspaces = curRegion.workspaces.map((space) => {
        if (spaceIds.includes(space.id)) {
          return {
            ...space,
            status: 1,
          }
        }
        return space
      })
    }
  }

  *disable(params) {
    const ret = yield this.cud('disable', params)
    if (ret?.ret_code === 0) {
      const { regionId, spaceIds } = params
      const curRegion = this.regions[regionId]
      curRegion.workspaces = curRegion.workspaces.map((space) => {
        if (spaceIds.includes(space.id)) {
          return {
            ...space,
            status: 2,
          }
        }
        return space
      })
    }
  }

  *delete(params) {
    const ret = yield this.cud('delete', params)
    if (ret?.ret_code === 0) {
      const { regionId, spaceIds } = params
      const curRegion = this.regions[regionId]
      const workspaces = curRegion.workspaces.filter((space) => {
        return !spaceIds.includes(space.id)
      })
      curRegion.workspaces = workspaces
    }
  }
}

export default WorkSpaceStore
