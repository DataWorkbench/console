import { useMutation, useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import {
  jobReleaseSyncJob,
  listReleaseSyncJobs,
  offlineReleaseSyncJob,
  resumeReleaseSyncJobs,
  suspendReleaseSyncJob,
} from 'stores/api'

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

export const useMutationJobRelease = (options?: {}) => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  return useMutation(async ({ op, ...rest }: Record<string, any>) => {
    if (['offline', 'resume', 'suspend', 'release'].includes(op)) {
      let ret
      if (op === 'offline') {
        ret = await offlineReleaseSyncJob({ ...rest, regionId, spaceId })
      } else if (op === 'resume') {
        ret = await resumeReleaseSyncJobs({
          ...rest,
          regionId,
          spaceId,
        })
      } else if (op === 'suspend') {
        ret = await suspendReleaseSyncJob({ ...rest, regionId, spaceId })
      } else if (op === 'release') {
        ret = await jobReleaseSyncJob({ ...rest, regionId, spaceId })
      }
      return ret
    }
    return undefined
  }, options)
}
