import { useMutation, useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import {
  describeFlinkUiByInstanceId,
  listSyncInstances,
  syncJobInstanceManage,
  terminateSyncInstances,
} from 'stores/api'
import { isNull, omitBy } from 'lodash-es'

interface IRouteParams {
  regionId: string
  spaceId: string
}

const queryKey = {
  list: '' as any,
  detail: '' as any,
  flinkUi: '' as any,
}

export const getSyncJobInstanceKey = (key: keyof typeof queryKey = 'list') =>
  queryKey[key]

export const useQuerySyncJobInstances = (
  filter: any,
  { enabled = true }: Record<string, any> = { enabled: true }
) => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const params = omitBy(
    {
      regionId,
      spaceId,
      limit: 10,
      offset: 0,
      ...filter,
    },
    isNull
  )
  queryKey.list = ['syncJobInstances', params]
  return useQuery(
    queryKey.list,
    async ({ pageParam = params }) => listSyncInstances(pageParam),
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

export const useQueryDescribeFlinkUIByInstanceId = (
  id: string,
  { enabled = true }: Record<string, any>
) => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const qryKey = ['syncJobInstance', { regionId, spaceId, id }]
  return useQuery(
    qryKey,
    async () => describeFlinkUiByInstanceId({ regionId, spaceId, id }),
    {
      enabled,
    }
  )
}

export const useMutationJobInstance = (options?: {}) => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  return useMutation(async ({ op, ...rest }: Record<string, any>) => {
    if (['terminate'].includes(op)) {
      let ret
      if (op === 'terminate') {
        ret = await terminateSyncInstances({ ...rest, regionId, spaceId })
      } else {
        ret = undefined
      }
      return ret
    }
    return undefined
  }, options)
}

export const useDescribeFlinkUIByInstanceId = (id: string) => {
  const { regionId, spaceId } =
    useParams<{ regionId: string; spaceId: string }>()
  const params = {
    space_id: spaceId,
    regionId,
    instance_id: id,
  }

  const key: any = ['describeSyncInstance', params]
  return useQuery(key, async () =>
    syncJobInstanceManage.describeSyncInstance(params)
  )
}
