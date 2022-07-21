import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { streamJobVersionManage } from 'stores/api'

interface IRouteParams {
  regionId: string
  spaceId: string
}

const queryKey = {
  list: '' as any,
  detail: '' as any,
  schedule: '' as any,
  conf: '' as any
}

export const getSteamJobVersionKey = (key: keyof typeof queryKey = 'list') => queryKey[key]

export const useQueryStreamJobVersions = (
  filter: Record<string, any>,
  { enabled = true }: Record<string, any> = { enable: true }
) => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const params = {
    regionId,
    spaceId,
    ...filter
  }
  queryKey.list = ['streamVersion', params]
  return useQuery(
    queryKey.list,
    async ({ pageParam = params }) => streamJobVersionManage.listStreamJobVersions(pageParam),
    {
      enabled,
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.has_more) {
          const nextOffset = allPages.reduce((acc, cur) => acc + cur.infos.length, 0)

          if (nextOffset < lastPage.total) {
            const nextParams = {
              ...params,
              offset: nextOffset
            }
            return nextParams
          }
        }

        return undefined
      }
    }
  )
}

export const useQueryStreamJobVersionDetail = <T extends Object>(filter: Record<string, any>) => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const params = {
    regionId,
    spaceId,
    job_id: filter.jobId,
    ver_id: filter.versionId,
    ...filter
  }

  queryKey.detail = ['streamVersionDetail', params]
  return useQuery<T>(queryKey.detail, async () =>
    streamJobVersionManage.describeStreamJobVersion(params)
  )
}

export const useQueryStreamJobVersionSchedule = (filter: Record<string, any>) => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const params = {
    regionId,
    spaceId,
    job_id: filter.jobId,
    ver_id: filter.versionId,
    ...filter
  }

  queryKey.schedule = ['jobVersionSchedule', params]
  return useQuery(queryKey.schedule, async () =>
    streamJobVersionManage.getStreamJobVersionSchedule(params)
  )
}

export const useQuerySteamJobVersionArgs = (filter: Record<string, any>) => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const params = {
    regionId,
    spaceId,
    job_id: filter.jobId,
    ver_id: filter.versionId,
    ...filter
  }

  queryKey.conf = ['jobVersionConf', params]
  return useQuery(queryKey.conf, async () => streamJobVersionManage.getStreamJobVersionArgs(params))
}

export const useQuerySteamJobVersionCode = (filter: Record<string, any>) => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const params = {
    regionId,
    spaceId,
    job_id: filter.jobId,
    ver_id: filter.versionId,
    ...filter
  }

  queryKey.conf = ['jobVersionCode', params]
  return useQuery(queryKey.conf, async () => streamJobVersionManage.getStreamJobVersionCode(params))
}
