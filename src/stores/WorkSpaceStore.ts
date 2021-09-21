import { makeAutoObservable, set } from 'mobx'
// import { fromPromise, IPromiseBasedObservable } from 'mobx-utils'
// import { omitBy } from 'lodash-es'
// import {
//   loadWorkSpace,
//   createWorkSpace,
//   updateWorkSpace,
//   deleteWorkSpaces,
//   disableWorkSpaces,
//   enableWorkSpaces,
//   IWorkSpaceParams,
// } from './api'
import type RootStore from './RootStore'

// interface SpaceModel {
//   created?: number
//   desc?: string
//   id: string
//   name: string
//   owner: string
//   status: number
//   updated: number
// }

class WorkSpaceStore {
  rootStore

  // regions: {
  //   [regionId: string]: { workspaces: SpaceModel[]; [key: string]: any }
  // } = {}

  // cancels: { [key: string]: () => void } = {}

  // curRegionId = null

  // curRegion = null

  // curSpace = null

  // fetchPromise: null | IPromiseBasedObservable<any> = null

  // scrollElem: HTMLElement | null = null

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

  constructor(rootStore: RootStore) {
    makeAutoObservable(this, {
      // cancels: false,
      // getRegion: false,
      rootStore: false,
    })
    this.rootStore = rootStore
  }

  set(params: { [key: string]: any }) {
    set(this, { ...params })
  }

  // getRegion(regionId: string, reload: boolean) {
  //   let region = this.regions[regionId]
  //   if (!region) {
  //     region = {
  //       workspaces: [],
  //       hasMore: true,
  //       total: 0,
  //       fetchPromise: null,
  //       params: {
  //         offset: 0,
  //         limit: 10,
  //         sort_by: 'created',
  //         reverse: true,
  //       },
  //     }
  //   } else if (reload) {
  //     set(region, {
  //       workspaces: [],
  //       hasMore: true,
  //       total: 0,
  //       fetchPromise: null,
  //     })
  //   }
  //   this.regions[regionId] = region
  //   return this.regions[regionId]
  // }

  // *fetchData(
  //   params: { cardView: boolean; reload: boolean; regionId: string },
  //   options = {}
  // ) {
  //   const { cardView, reload, ...otherParams } = params
  //   const { regionId } = params
  //   // const { api } = this.rootStore
  //   const region = this.getRegion(regionId, reload)
  //   const cancel = this.cancels[regionId]
  //   const { fetchPromise, hasMore } = region
  //   if ((cardView && !hasMore) || fetchPromise?.state === 'pending') {
  //     return
  //   }
  //   const newParams = omitBy(
  //     {
  //       ...toJS(region.params),
  //       ...otherParams,
  //     },
  //     (v) => v === ''
  //   )
  //   // console.log(newParams)
  //   const cancelFn = (c: () => void) => {
  //     this.cancels[regionId] = c
  //   }
  //   if (cancel) {
  //     cancel()
  //   }
  //   region.fetchPromise = fromPromise(
  //     loadWorkSpace(newParams, { ...options, cancelFn })
  //   )
  //   const ret: { ret_code: number; [p: string]: any } =
  //     yield region.fetchPromise
  //   if (ret?.ret_code === 0) {
  //     // if (regionId === 'staging') {
  //     //   region.hasMore = false
  //     //   return
  //     // }
  //     region.params = newParams
  //     const { infos, total } = ret
  //     if (infos && infos.length) {
  //       const { offset } = region.params
  //       region.workspaces =
  //         offset === 0 || !cardView ? infos : region.workspaces.concat(infos)
  //       region.total = total
  //       if (cardView) {
  //         region.params.offset = region.workspaces.length
  //       }
  //     }
  //     region.hasMore = ret.has_more || false
  //   }
  // }

  // *cud(
  //   op: 'create' | 'update' | 'enable' | 'disable' | 'delete',
  //   params: IWorkSpaceParams
  // ) {
  //   const funcMap = {
  //     create: createWorkSpace,
  //     update: updateWorkSpace,
  //     enable: enableWorkSpaces,
  //     disable: disableWorkSpaces,
  //     delete: deleteWorkSpaces,
  //   }
  //   // const { api } = this.rootStore
  //   const workspacesPromise = funcMap[op](params)
  //   this.fetchPromise = fromPromise(workspacesPromise)
  //   const ret: { ret_code: number; [p: string]: any } = yield workspacesPromise
  //   return ret
  // }

  // *create(params: IWorkSpaceParams) {
  //   yield this.cud('create', params)
  // }

  // *update(params: IWorkSpaceParams) {
  //   const ret: { ret_code: number; [p: string]: any } = yield this.cud(
  //     'update',
  //     params
  //   )
  //   if (ret?.ret_code === 0) {
  //     const { regionId, spaceId, name, desc } = params
  //     const curRegion = this.regions[regionId]
  //     curRegion.workspaces = curRegion.workspaces.map((space) => {
  //       if (spaceId.includes(space.id)) {
  //         return {
  //           ...space,
  //           name,
  //           desc,
  //         }
  //       }
  //       return space
  //     })
  //   }
  // }

  // *enable(params: IWorkSpaceParams) {
  //   const ret: { ret_code: number; [p: string]: any } = yield this.cud(
  //     'enable',
  //     params
  //   )
  //   if (ret?.ret_code === 0) {
  //     const { regionId, spaceIds } = params
  //     const curRegion = this.regions[regionId]
  //     curRegion.workspaces = curRegion.workspaces.map((space) => {
  //       if (spaceIds.includes(space.id)) {
  //         return {
  //           ...space,
  //           status: 1,
  //         }
  //       }
  //       return space
  //     })
  //   }
  // }

  // *disable(params: IWorkSpaceParams) {
  //   const ret: { ret_code: number; [p: string]: any } = yield this.cud(
  //     'disable',
  //     params
  //   )
  //   if (ret?.ret_code === 0) {
  //     const { regionId, spaceIds } = params
  //     const curRegion = this.regions[regionId]
  //     curRegion.workspaces = curRegion.workspaces.map((space) => {
  //       if (spaceIds.includes(space.id)) {
  //         return {
  //           ...space,
  //           status: 2,
  //         }
  //       }
  //       return space
  //     })
  //   }
  // }

  // *delete(params: IWorkSpaceParams) {
  //   const ret: { ret_code: number; [p: string]: any } = yield this.cud(
  //     'delete',
  //     params
  //   )
  //   if (ret?.ret_code === 0) {
  //     const { regionId, spaceIds } = params
  //     const curRegion = this.regions[regionId]
  //     const workspaces = curRegion.workspaces.filter((space) => {
  //       return !spaceIds.includes(space.id)
  //     })
  //     curRegion.workspaces = workspaces
  //   }
  // }
}

export default WorkSpaceStore
