import { makeAutoObservable } from 'mobx'

class SpaceStore {
  workspaces = []

  page = {
    limit: 10,
    offset: 0,
    total: 0,
  }

  hasMore = true

  cancel = null

  constructor(rootStore) {
    makeAutoObservable(this, {
      cancel: false,
    })
    this.rootStore = rootStore
  }

  reset() {
    this.hasMore = true
    this.cancel = null
    this.page = {
      limit: 10,
      offset: 0,
      total: 0,
    }
  }

  *fetchSpaces({ reload, ...params }, options = {}) {
    if (reload) {
      this.reset()
    }
    if (!this.hasMore || this.fetchPromise?.state === 'pending') {
      return
    }
    const {
      rootStore: { api },
      cancel,
      page: { offset, limit },
    } = this

    if (cancel !== null) {
      cancel()
    }
    options.cancel = (c) => {
      this.cancel = c
    }

    const newParams = {
      sort_by: 'created',
      reverse: true,
      offset,
      limit,
      ...params,
    }
    this.fetchPromise = api.workspace.load(newParams, options)
    const ret = yield this.fetchPromise
    if (ret?.ret_code === 0) {
      const { workspaces } = this
      const { infos } = ret
      if (infos && infos.length) {
        this.workspaces = offset === 0 ? infos : workspaces.concat(infos)
        this.page.total = ret.total
        this.page.offset = this.workspaces.length
      }
      this.hasMore = ret.has_more || false
    }
  }
}

export default SpaceStore
