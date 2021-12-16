import { useMutation, useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import {
  listReleaseStreamJobs,
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

export const useQueryReleaseJobs = (filter: any) => {
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
  })
}

let instanceQueryKey: any = ''

export const getJobInstanceKey = () => instanceQueryKey

export const useQueryJobInstances = (filter: any, type?: string) => {
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
      keepPreviousData: true,
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
    async ({ op, ...rest }: { op: OP; inst_ids: object[] }) => {
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
      }

      return ret
    }
  )
}

export default {}
