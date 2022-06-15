import { useMutation, useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { listReleaseSyncJobs } from 'stores/api'
import { JobMode } from 'views/Space/Dm/RealTime/Job/JobUtils'
import { api } from 'utils/api'

interface IRouteParams {
  regionId: string
  spaceId: string
}

let queryKey: any = ''

export const getJobReleaseKey = () => queryKey

export const useQuerySyncJobRelease = (
  filter: any,
  config: Record<string, any> = {}
) => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const params = {
    regionId,
    spaceId,
    limit: 10,
    offset: 0,
    ...filter,
  }
  const { enabled = true } = config
  queryKey = ['jobRelease', params]
  return useQuery(
    queryKey,
    async ({ pageParam = params }) => listReleaseSyncJobs(pageParam),
    {
      enabled,
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
      ...config,
    }
  )
}

export const useMutationJobRelease = (options?: {}, type = JobMode.DI) => {
  let jobMode = ''
  switch (type) {
    case JobMode.DI:
      jobMode = 'sync'
      break
    case JobMode.RT:
      jobMode = 'stream'
      break
    case JobMode.OLE:
      jobMode = '???'
      break
    default:
      break
  }
  const path =
    '/v1/workspace/{space_id}/{jobMode}/job/release/{job_id}/{action}'

  const { regionId, spaceId } = useParams<IRouteParams>()
  return useMutation(async ({ op, ...rest }: Record<string, any>) => {
    if (['offline', 'resume', 'suspend', 'release'].includes(op)) {
      let op1 = op
      // 作业这里重新发布接口特殊
      if (jobMode === 'sync' && op === 'resume') {
        op1 = 'reopen'
      }
      const ret = api.post(path)({
        ...rest,
        spaceId,
        regionId,
        action: op1,
        jobMode,
        job_id: rest.jobId ?? rest.job_id,
      })
      return ret
    }
    return undefined
  }, options)
}
