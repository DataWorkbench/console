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

let queryKey: any = ''

export const getFlowKey = () => queryKey

export const useInfiniteQueryFlow = (filter = {}) => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const params = {
    regionId,
    spaceId,
    limit: 100,
    offset: 0,
    ...filter,
  }
  queryKey = ['job', omit(params, 'offset')]
  return useInfiniteQuery(
    queryKey,
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
  const {
    workFlowStore: { curJob },
  } = useStore()
  const { regionId, spaceId } = useParams<IRouteParams>()

  return useMutation(async (params: IWorkFlowParams) => {
    const ret = await setStreamJobSchedule({
      ...params,
      regionId,
      spaceId,
      flowId: curJob?.id,
    })
    return ret
  })
}

export const useQueryStreamJobSchedule = (options?: UseQueryOptions) => {
  const {
    workFlowStore: { curJob },
  } = useStore()
  const { regionId, spaceId } = useParams<IRouteParams>()
  const params = {
    regionId,
    spaceId,
    jobId: curJob?.id,
  }
  const key = ['flowSche', params]
  return useQuery(key, async () => getStreamJobSchedule(params), options)
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
  const key = ['streamJobCode', params]
  return useQuery(
    key,
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
  return useMutation(async () =>
    releaseStreamJob({ regionId, spaceId, jobId: curJob?.id })
  )
}
