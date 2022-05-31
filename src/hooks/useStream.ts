import { useInfiniteQuery, useMutation, useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { useStore } from 'stores'
import {
  describeFlinkUI,
  listReleaseStreamJobs,
  listReleaseJobVersions,
  listStreamJobInstances,
  offlineReleaseJob,
  resumeReleaseJob,
  suspendReleaseJob,
  terminateInstances,
} from 'stores/api'

interface IRouteParams {
  regionId: string
  spaceId: string
}

let releaseQueryKey: any = ''

export const getReleaseJobsKey = () => releaseQueryKey

export const useQueryReleaseJobs = (
  filter: any,
  options?: { refetchInterval: number }
) => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const params = {
    regionId,
    spaceId,
    limit: 10,
    offset: 0,
    ...filter,
  }
  releaseQueryKey = ['RELEASE_STREAM_JOBS', params]
  return useQuery(releaseQueryKey, async () => listReleaseStreamJobs(params), {
    keepPreviousData: true,
    refetchInterval: options?.refetchInterval,
  })
}

export const useQueryReleaseJobVersions = (filter: any) => {
  const {
    workFlowStore: { curJob },
  } = useStore()
  const { regionId: region, spaceId } = useParams<IRouteParams>()
  const params = {
    region,
    spaceId,
    jobId: curJob?.id,
    limit: 10,
    offset: 0,
    ...filter,
  }
  const jobVersionsKey = ['RELEASE_JOB_VERSIONS', params]
  return useQuery(jobVersionsKey, async () => listReleaseJobVersions(params), {
    keepPreviousData: true,
  })
}

let infiniteVersionQueryKey: any = ''
export const useInfiniteQueryJobVersions = (filter?: any) => {
  const {
    workFlowStore: { curJob },
  } = useStore()
  const { regionId: region, spaceId } = useParams<IRouteParams>()
  const params = {
    region,
    spaceId,
    jobId: curJob?.id,
    limit: 100,
    offset: 0,
    ...filter,
  }
  infiniteVersionQueryKey = ['RELEASE_JOB_VERSIONS', params]
  return useInfiniteQuery(
    infiniteVersionQueryKey,
    async ({ pageParam = params }) => listReleaseJobVersions(pageParam),
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

let instanceQueryKey: any = ''

export const getJobInstanceKey = () => instanceQueryKey

export const useQueryJobInstances = (
  filter: any,
  type?: string,
  options?: { refetchInterval: number }
) => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const params = {
    regionId,
    spaceId,
    limit: 10,
    offset: 0,
    ...filter,
  }
  instanceQueryKey = [
    type === 'modal' ? 'JOB_INSTANCES' : 'STREAM_JOB_INSTANCES',
    params,
  ]
  return useQuery(
    instanceQueryKey,
    async () => listStreamJobInstances(params),
    {
      refetchInterval: options?.refetchInterval,
      keepPreviousData: true,
      enabled: type === 'modal' ? !!filter.job_id : true,
    }
  )
}

export const useMutationReleaseJobs = () => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  return useMutation(
    async ({
      op,
      ...rest
    }: {
      op: OP
      jobId: String
      stopRunning: Boolean
    }) => {
      const params = {
        spaceId,
        regionId,
        ...rest,
      }
      let ret = null
      if (op === 'enable') {
        ret = await resumeReleaseJob(params)
      } else if (op === 'disable') {
        ret = await suspendReleaseJob(params)
      } else if (op === 'stop') {
        ret = await offlineReleaseJob(params)
      }
      return ret
    }
  )
}

export const useMutationInstance = () => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  return useMutation(
    async ({
      op,
      ...rest
    }: {
      op: OP
      inst_id?: String
      instance_ids?: object[]
    }) => {
      const params = {
        spaceId,
        regionId,
        ...rest,
      }
      let ret = null
      if (op === 'enable') {
        ret = await resumeReleaseJob(params)
      } else if (op === 'stop') {
        ret = await terminateInstances(params)
      } else if (op === 'view') {
        ret = await describeFlinkUI(params)
      }

      return ret
    }
  )
}

let queryStreamInstanceDetailKey: any = ''
export const getQueryStreamInstanceDetailKey = () =>
  queryStreamInstanceDetailKey
export const useQueryStreamInstanceDetail = (id: string) => {
  const { regionId, spaceId } = useParams<IRouteParams>()

  const params = {
    regionId,
    spaceId,
    instanceId: id,
  }

  queryStreamInstanceDetailKey = ['STREAM_INSTANCE_DETAIL', params]
  return useQuery(
    ['STREAM_INSTANCE_DETAIL', params],
    async () => ({} as Record<string, any>)
  )
}
