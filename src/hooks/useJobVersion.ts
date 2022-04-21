import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import {
  getDescribeSyncJobVersion,
  getSyncJobVersionConf,
  getSyncJobVersionSchedule,
  listSyncJobVersions,
} from 'stores/api/syncJobVersion'

interface IRouteParams {
  regionId: string
  spaceId: string
}

const queryKey = {
  list: '' as any,
  detail: '' as any,
  schedule: '' as any,
  conf: '' as any,
}

export const getJobVersionKey = (key: keyof typeof queryKey = 'list') =>
  queryKey[key]

export const useQuerySyncJobVersions = (
  filter: Record<string, any>,
  { enabled = true }: Record<string, any> = { enable: true }
) => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const params = {
    regionId,
    spaceId,
    ...filter,
  }
  queryKey.list = ['jobVersion', params]
  return useQuery(
    queryKey.list,
    async ({ pageParam = params }) => listSyncJobVersions(pageParam),
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

export const useQuerySyncJobVersionDetail = <T extends Object>(
  filter: Record<string, any>
) => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const params = {
    regionId,
    spaceId,
    ...filter,
  }

  queryKey.detail = ['jobVersionDetail', params]
  return useQuery<T>(queryKey.detail, async () =>
    getDescribeSyncJobVersion(params)
  )
}

export const useQuerySyncJobVersionSchedule = (filter: Record<string, any>) => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const params = {
    regionId,
    spaceId,
    ...filter,
  }

  queryKey.schedule = ['jobVersionSchedule', params]
  return useQuery(queryKey.schedule, async () =>
    getSyncJobVersionSchedule(params)
  )
}

export const useQuerySyncJobVersionConf = (filter: Record<string, any>) => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const params = {
    regionId,
    spaceId,
    ...filter,
  }

  queryKey.conf = ['jobVersionConf', params]
  return useQuery(queryKey.conf, async () => getSyncJobVersionConf(params))
}
