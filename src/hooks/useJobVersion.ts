import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import {
  getDescribeSyncJobVersion,
  getSyncJobVersionConf,
  getSyncJobVersionSchedule,
  streamJobVersionManage,
  syncJobVersionManage,
} from 'stores/api'
import { JobMode } from 'views/Space/Dm/RealTime/Job/JobUtils'

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
  { enabled = true }: Record<string, any> = { enable: true },
  type: JobMode = JobMode.DI
) => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const params = {
    regionId,
    spaceId,
    ...filter,
  }
  queryKey.list = [`jobVersion`, { ...params, type }]
  let action: any = async () => ({})
  switch (type) {
    case JobMode.DI:
      action = syncJobVersionManage.listSyncJobVersions
      break
    case JobMode.RT:
      action = streamJobVersionManage.listStreamJobVersions
      break
    case JobMode.OLE:
    default:
      break
  }
  return useQuery(
    queryKey.list,
    async ({ pageParam = params }) => action(pageParam),
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
