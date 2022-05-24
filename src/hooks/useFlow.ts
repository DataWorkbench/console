import {
  useMutation,
  useQuery,
  UseQueryOptions,
  useQueryClient,
} from 'react-query'
import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useStore } from 'stores'
import {
  createJob,
  updateJob,
  moveJob,
  deleteJobs,
  IWorkFlowParams,
  listJobs,
  setStreamJobSchedule,
  setSyncJobSchedule,
  getStreamJobSchedule,
  getSyncJobSchedule,
  setStreamJobArgs,
  setSyncJobConf,
  getSyncJobConf,
  pingSyncJobConnection,
  getStreamJobArgs,
  setStreamJobCode,
  getStreamJobCode,
  releaseStreamJob,
  releaseSyncJob,
  inConnectors,
  streamJobCodeSyntax,
  streamJobCodeRun,
} from 'stores/api'
import { SyncJobDevManageGenerateJobJsonType } from '../types/response'
import { GenerateJobJsonRequestType } from '../types/request'

import { apiHooks, queryKeyObj } from './apiHooks'

interface IRouteParams {
  regionId: string
  spaceId: string
  op?: string
}

export const useFetchJob = () => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const queryClient = useQueryClient()
  return useCallback(
    (tp: 'sync' | 'stream' = 'stream', filter = {}, options = {}) => {
      const params = {
        regionId,
        spaceId,
        tp,
        search: '',
        limit: 100,
        offset: 0,
        reverse: true,
        sort_by: 'created',
        ...filter,
      }
      return queryClient.fetchQuery(
        ['job', params],
        async () => listJobs(params),
        {
          // retry: 3,
          ...options,
        }
      )
    },
    [queryClient, regionId, spaceId]
  )
}

export const useMutationStreamJob = () => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  return useMutation(
    async ({
      op,
      jobMode,
      ...rest
    }: IWorkFlowParams & { jobMode: 'RT' | 'DI' }) => {
      const params = { ...rest, regionId, spaceId }
      if (jobMode === 'RT') {
        params.tp = 'stream'
      }
      if (jobMode === 'DI') {
        params.tp = 'sync'
      }
      if (params.tp) {
        if (op === 'create') {
          return createJob(params)
        }
        if (op === 'update' || op === 'edit') {
          return updateJob(params)
        }
        if (op === 'move') {
          return moveJob(params)
        }
        if (op === 'delete') {
          return deleteJobs(params)
        }
      }
      return null
    }
  )
}

const infiniteQueryKey: any = ''
let streamJobCodeKey: any = ''
let streamJobScheduleKey: any = ''

export const getStreamJobCodeKey = () => streamJobCodeKey

type FlowKeyType = '' | 'streamJobCode' | 'JobSchedule'

export const getFlowKey = (tp: FlowKeyType = '') => {
  switch (tp) {
    case 'streamJobCode':
      return streamJobCodeKey
    case 'JobSchedule':
      return streamJobScheduleKey
    default:
      return infiniteQueryKey
  }
}

// export const useInfiniteQueryFlow = (filter = {}, options = {}) => {
//   const { regionId, spaceId } = useParams<IRouteParams>()
//   const params = {
//     regionId,
//     spaceId,
//     limit: 100,
//     offset: 0,
//     ...filter,
//   }
//   infiniteQueryKey = ['job', omit(params, 'offset')]
//   return useInfiniteQuery(
//     infiniteQueryKey,
//     async ({ pageParam = params }) => listJobs(pageParam),
//     {
//       getNextPageParam: (lastPage, allPages) => {
//         if (lastPage.has_more) {
//           const nextOffset = allPages.reduce(
//             (acc, cur) => acc + cur.infos.length,
//             0
//           )

//           if (nextOffset < lastPage.total) {
//             const nextParams = {
//               ...params,
//               offset: nextOffset,
//             }
//             return nextParams
//           }
//         }

//         return undefined
//       },
//       ...options,
//     }
//   )
// }

export const useMutationStreamJobSchedule = () => {
  const { regionId, spaceId } = useParams<IRouteParams>()

  return useMutation(async (params: IWorkFlowParams) => {
    const ret = await setStreamJobSchedule({
      ...params,
      regionId,
      spaceId,
    })
    return ret
  })
}

export const useMutationSyncJobSchedule = () => {
  const { regionId, spaceId } = useParams<IRouteParams>()

  return useMutation(async (params: IWorkFlowParams) => {
    const ret = await setSyncJobSchedule({
      ...params,
      regionId,
      spaceId,
    })
    return ret
  })
}

export const useQueryJobSchedule = (origin = '', options?: UseQueryOptions) => {
  const {
    workFlowStore: { curJob, curVersion },
  } = useStore()
  const { regionId, spaceId } = useParams<IRouteParams>()
  const params: any = {
    regionId,
    spaceId,
    jobId: curJob!.id,
    version: origin === 'ops' ? curJob?.version : curVersion?.version,
  }
  const getJobSchedule = /^syj-/.test(curJob!.id)
    ? getSyncJobSchedule
    : getStreamJobSchedule
  streamJobScheduleKey = ['jobSchedule', params]
  return useQuery(
    streamJobScheduleKey,
    async () => getJobSchedule(origin, params),
    options
  )
}

export const useQueryStreamJobSchedule = (
  origin = '',
  options?: UseQueryOptions
) => {
  const {
    workFlowStore: { curJob, curVersion },
  } = useStore()
  const { regionId, spaceId } = useParams<IRouteParams>()
  const params: any = {
    regionId,
    spaceId,
    jobId: curJob?.id,
    version: origin === 'ops' ? curJob?.version : curVersion?.version,
  }
  streamJobScheduleKey = ['jobSchedule', params]
  return useQuery(
    streamJobScheduleKey,
    async () => getStreamJobSchedule(origin, params),
    options
  )
}

export const useQuerySyncJobSchedule = (
  origin = '',
  options?: UseQueryOptions
) => {
  const {
    workFlowStore: { curJob, curVersion },
  } = useStore()
  const { regionId, spaceId } = useParams<IRouteParams>()
  const params: any = {
    regionId,
    spaceId,
    jobId: curJob?.id,
    version: origin === 'ops' ? curJob?.version : curVersion?.version,
  }
  streamJobScheduleKey = ['jobSchedule', params]
  return useQuery(
    streamJobScheduleKey,
    async () => getSyncJobSchedule(origin, params),
    options
  )
}

export const useMutationStreamJobArgs = () => {
  const {
    workFlowStore: { curJob },
  } = useStore()
  const { regionId, spaceId } = useParams<IRouteParams>()
  return useMutation(async (params: IWorkFlowParams) => {
    const ret = await setStreamJobArgs({
      ...params,
      regionId,
      spaceId,
      jobId: curJob?.id,
    })
    return ret
  })
}

export const useMutationSyncJobConf = () => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const {
    workFlowStore: { curJob },
  } = useStore()
  return useMutation(async (params: Record<string, any>) => {
    const ret = await setSyncJobConf({
      ...params,
      regionId,
      spaceId,
      jobId: curJob?.id,
    })
    return ret
  })
}

export const useQuerySyncJobConf = () => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const {
    workFlowStore: { curJob },
  } = useStore()
  const key = [
    'JobConf',
    {
      regionId,
      spaceId,
      jobId: curJob?.id,
    },
  ]
  return useQuery(key, async () =>
    getSyncJobConf({
      regionId,
      spaceId,
      jobId: curJob?.id,
    })
  )
}

export const useQueryStreamJobArgs = (options?: UseQueryOptions) => {
  const {
    workFlowStore: { curJob },
  } = useStore()
  const { regionId, spaceId } = useParams<IRouteParams>()
  const params = {
    regionId,
    spaceId,
    jobId: curJob?.id,
  }
  const key = ['streamJobArgs', params]
  return useQuery(
    key,
    async () =>
      getStreamJobArgs({ ...params, regionId, spaceId, jobId: curJob?.id }),
    options
  )
}

export const useMutationPingSyncJobConnection = () => {
  const {
    workFlowStore: { curJob },
  } = useStore()
  const { regionId, spaceId } = useParams<IRouteParams>()
  return useMutation(
    async (params: { clusterId: string; sourceId: string; targetId: string }) =>
      pingSyncJobConnection({
        cluster_id: params.clusterId,
        source_id: params.sourceId,
        target_id: params.targetId,
        regionId,
        spaceId,
        jobId: curJob?.id,
      })
  )
}

export const useMutationStreamJobCode = () => {
  const {
    workFlowStore: { curJob },
  } = useStore()
  const { regionId, spaceId } = useParams<IRouteParams>()
  return useMutation(async (params: IWorkFlowParams) =>
    setStreamJobCode({ ...params, regionId, spaceId, jobId: curJob?.id })
  )
}

export const useMutationStreamJobCodeSyntax = () => {
  const {
    workFlowStore: { curJob },
  } = useStore()
  const { regionId, spaceId } = useParams<IRouteParams>()
  return useMutation(async (params: IWorkFlowParams) =>
    streamJobCodeSyntax({ ...params, regionId, spaceId, jobId: curJob?.id })
  )
}

export const useMutationStreamJobCodeRun = () => {
  const {
    workFlowStore: { curJob },
  } = useStore()
  const { regionId, spaceId } = useParams<IRouteParams>()
  return useMutation(async (params: IWorkFlowParams) =>
    streamJobCodeRun({ ...params, regionId, spaceId, jobId: curJob?.id })
  )
}

export const useQueryStreamJobCode = (options?: UseQueryOptions) => {
  const {
    workFlowStore: { curJob, curVersion },
  } = useStore()
  const { regionId, spaceId } = useParams<IRouteParams>()
  const params = {
    regionId,
    spaceId,
    jobId: curJob?.id,
    version: curVersion?.version,
  }
  streamJobCodeKey = ['streamJobCode', params]
  return useQuery(
    streamJobCodeKey,
    async () =>
      getStreamJobCode({ ...params, regionId, spaceId, jobId: curJob?.id }),
    options
  )
}

export const useMutationReleaseStreamJob = () => {
  const {
    workFlowStore: { curJob },
  } = useStore()
  const { regionId, spaceId } = useParams<IRouteParams>()
  return useMutation(
    async (params: Record<string, string | boolean | number>) =>
      releaseStreamJob({ ...params, regionId, spaceId, jobId: curJob?.id })
  )
}

export const useMutationReleaseSyncJob = () => {
  const {
    workFlowStore: { curJob },
  } = useStore()
  const { regionId, spaceId } = useParams<IRouteParams>()
  return useMutation(
    async (params: Record<string, string | boolean | number>) =>
      releaseSyncJob({ ...params, regionId, spaceId, jobId: curJob?.id })
  )
}

export const useQueryInConnectorsQuery = () => {
  const {
    workFlowStore: { curJob },
  } = useStore()
  const { regionId, spaceId } = useParams<IRouteParams>()

  const params = {
    regionId,
    spaceId,
    jobId: curJob?.id,
  }
  return useQuery('In_Connectors', async () => inConnectors(params))
}

export const useQueryGenerateJobJson = apiHooks<
  'syncJobDevManage',
  GenerateJobJsonRequestType,
  SyncJobDevManageGenerateJobJsonType
>('syncJobDevManage', 'generateJobJson')

export const getQueryKeyGenerateJobJson = () => queryKeyObj.generateJobJson
