import { makeAutoObservable, toJS, set } from 'mobx'
import { fromPromise } from 'mobx-utils'
import { omitBy } from 'lodash-es'

class WorkSpaceStore {
  regions = {}

  cancels = {}

  curRegionId = null

  fetchPromise

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
        { name: 'resource', title: '资源管理', icon: 'resource' },
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
    makeAutoObservable(this, {
      cancels: false,
      getRegion: false,
    })
    this.rootStore = rootStore
  }

  set(params) {
    set(this, { ...params })
  }

  getRegion(regionId, reload) {
    let region = this.regions[regionId]
    if (!region) {
      region = {
        workspaces: [],
        hasMore: true,
        total: 0,
        fetchPromise: null,
        params: {
          offset: 0,
          limit: 10,
          sort_by: 'created',
          reverse: true,
        },
      }
    } else if (reload) {
      set(region, {
        workspaces: [],
        hasMore: true,
        total: 0,
        fetchPromise: null,
      })
    }
    this.regions[regionId] = region
    return this.regions[regionId]
  }

  *fetchData(params, options = {}) {
    const { cardView, reload, ...otherParams } = params
    const { regionId } = params
    const { api } = this.rootStore
    const region = this.getRegion(regionId, reload)
    const cancel = this.cancels[regionId]
    const { fetchPromise, hasMore } = region
    if ((cardView && !hasMore) || fetchPromise?.state === 'pending') {
      return
    }
    const newParams = omitBy(
      {
        ...toJS(region.params),
        ...otherParams,
      },
      (v) => v === ''
    )
    // console.log(newParams)
    options.cancel = (c) => {
      this.cancels[regionId] = c
    }
    if (cancel) {
      cancel()
    }
    region.fetchPromise = fromPromise(api.workspace.load(newParams, options))
    const ret = yield region.fetchPromise
    if (ret?.ret_code === 0) {
      // if (regionId === 'staging') {
      //   region.hasMore = false
      //   return
      // }
      region.params = newParams
      const { infos, total } = ret
      if (infos && infos.length) {
        const { offset } = region.params
        region.workspaces =
          offset === 0 || !cardView ? infos : region.workspaces.concat(infos)
        region.total = total
        if (cardView) {
          region.params.offset = region.workspaces.length
        }
      }
      region.hasMore = ret.has_more || false
    }
  }

  *cud(op, params) {
    const { api } = this.rootStore
    const workspacesPromise = api.workspace[op](params)
    this.fetchPromise = fromPromise(workspacesPromise)
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
