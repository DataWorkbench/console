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
  { enabled = true }: Record<string, any> = { enable: true }
) => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const params = {
    regionId,
    spaceId,
    limit: 10,
    offset: 0,
    ...filter,
  }
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
      const ret = api.post(path)({
        ...rest,
        spaceId,
        regionId,
        action: op,
        jobMode,
      })
      return ret
    }
    return undefined
  }, options)
}
