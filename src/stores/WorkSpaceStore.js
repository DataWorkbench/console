import { makeObservable, observable, flow, action, set } from 'mobx'
import { fromPromise } from 'mobx-utils'

class WorkspaceStore {
  zones = {}

  loadStatus

  showModal = false

  curSpace

  curOpt = 'create'

  constructor(rootStore) {
    makeObservable(this, {
      zones: observable,
      loadStatus: observable,
      showModal: observable,
      load: flow,
      reload: action,
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

  reload(zoneName) {
    const zone = this.zones[zoneName]
    if (!zone) {
      return
    }
    this.zones[zoneName] = null
  }

  *load(zoneName) {
    const { api } = this.rootStore
    const curZone = this.getZone(zoneName)
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
        this.zones[zoneName] = curZone
      } else {
        curZone.hasMore = false
      }
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
