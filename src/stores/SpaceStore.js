import { makeAutoObservable } from 'mobx'

class SpaceStore {
  workspaces = []

  page = {
    limit: 10,
    offset: 0,
    total: 0,
  }

  cancel = null

  constructor(rootStore) {
    makeAutoObservable(this)
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
    if (!this.hasMore) {
      return
    }
    if (reload) {
      this.reset()
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

    const ret = yield api.workspace.load(newParams, options)
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
