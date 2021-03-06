import {
  useMutation,
  useQuery,
  useInfiniteQuery,
  UseQueryOptions,
} from 'react-query'
import { useParams } from 'react-router-dom'
import { useStore } from 'stores'
import { omit } from 'lodash-es'
import {
  createStreamJob,
  updateStreamJob,
  deleteStreamJobs,
  IWorkFlowParams,
  loadWorkFlow,
  setStreamJobSchedule,
  getStreamJobSchedule,
  setStreamJobArgs,
  getStreamJobArgs,
  setStreamJobCode,
  getStreamJobCode,
  releaseStreamJob,
  inConnectors,
  streamJobCodeSyntax,
  streamJobCodeRun,
} from 'stores/api'

interface IRouteParams {
  regionId: string
  spaceId: string
  op?: string
}

export const useMutationStreamJob = () => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  return useMutation(async ({ op, ...rest }: IWorkFlowParams) => {
    const params = { ...rest, regionId, spaceId }
    if (op === 'create') {
      return createStreamJob(params)
    }
    if (op === 'update') {
      return updateStreamJob(params)
    }
    if (op === 'delete') {
      return deleteStreamJobs(params)
    }
    return null
  })
}

let infiniteQueryKey: any = ''
let streamJobCodeKey: any = ''
let streamJobScheduleKey: any = ''

export const getStreamJobCodeKey = () => streamJobCodeKey

type FlowKeyType = '' | 'streamJobCode' | 'StreamJobSchedule'

export const getFlowKey = (tp: FlowKeyType = '') => {
  switch (tp) {
    case 'streamJobCode':
      return streamJobCodeKey
    case 'StreamJobSchedule':
      return streamJobScheduleKey
    default:
      return infiniteQueryKey
  }
}

export const useInfiniteQueryFlow = (filter = {}) => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const params = {
    regionId,
    spaceId,
    limit: 100,
    offset: 0,
    ...filter,
  }
  infiniteQueryKey = ['job', omit(params, 'offset')]
  return useInfiniteQuery(
    infiniteQueryKey,
    async ({ pageParam = params }) => loadWorkFlow(pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.has_more) {
          const nextOffset = allPages.reduce(
            (acc, cur) => acc + cur.infos.length,
            0
          )

          if (nextOffset < lastPage.total) {
            const nextParams = {
              ...params,
              offset: nextOffset,
            }
            return nextParams
          }
        }

        return undefined
      },
    }
  )
}

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

export const useQueryStreamJobSchedule = (
  origin = '',
  options?: UseQueryOptions
) => {
  const {
    workFlowStore: { curJob },
  } = useStore()
  const { regionId, spaceId } = useParams<IRouteParams>()
  const params: any = {
    regionId,
    spaceId,
    jobId: curJob?.id,
  }
  if (origin === 'ops') params.version = curJob?.version
  streamJobScheduleKey = ['jobSchedule', params]
  return useQuery(
    streamJobScheduleKey,
    async () => getStreamJobSchedule(origin, params),
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
    workFlowStore: { curJob },
  } = useStore()
  const { regionId, spaceId } = useParams<IRouteParams>()
  const params = {
    regionId,
    spaceId,
    jobId: curJob?.id,
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
