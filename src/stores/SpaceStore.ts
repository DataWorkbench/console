import { makeAutoObservable } from 'mobx'
import { loadWorkSpace, IWorkSpaceParams } from './api'
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
      rootStore: false,
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

  *fetchSpaces(
    {
      reload,
      ...params
    }: { reload: boolean; regionId: string; [k: string]: any },
    options = {}
  ) {
    if (reload) {
      this.reset()
    }
    if (!this.hasMore) {
      return
    }
    const {
      cancel,
      page: { offset, limit },
    } = this

    if (cancel !== null) {
      cancel()
    }
    const cancelFn = (c: () => void) => {
      this.cancel = c
    }

    const newParams: IWorkSpaceParams = {
      sort_by: 'created',
      reverse: true,
      offset,
      limit,
      ...params,
    }
    const ret: { ret_code: number; [p: string]: any } = yield loadWorkSpace(
      newParams,
      {
        ...options,
        cancel: cancelFn,
      }
    )
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
