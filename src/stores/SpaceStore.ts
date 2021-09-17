import { makeAutoObservable } from 'mobx'
import type RootStore from './RootStore'

class SpaceStore {
  rootStore

  workspaces = []

  fetchPromise: Promise<unknown> | undefined

  page = {
    limit: 10,
    offset: 0,
    total: 0,
  }

  hasMore = true

  cancel: null | (() => void) = null

  constructor(rootStore: RootStore) {
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

  *fetchSpaces({ reload, ...params }: { reload: boolean }, options = {}) {
    if (reload) {
      this.reset()
    }
    if (!this.hasMore) {
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
    const cancelFn = (c: () => void) => {
      this.cancel = c
    }

    const newParams = {
      sort_by: 'created',
      reverse: true,
      offset,
      limit,
      ...params,
    }
    const ret = yield* api.workspace.load(newParams, {
      ...options,
      cancel: cancelFn,
    })
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
