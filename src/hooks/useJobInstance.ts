import {
  useMutation,
  useQuery,
  UseQueryOptions,
  useQueryClient,
  useInfiniteQuery,
} from 'react-query'
import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useStore } from 'stores'
import { listFlinkClusters, listSyncInstances } from 'stores/api'
import { omit } from 'lodash-es'

interface IRouteParams {
  regionId: string
  spaceId: string
}

const queryKey: any = ''

export const getFlinkClusterKey = () => queryKey

export const useQuerySyncJobInstances = (
  filter: any,
  { enabled = true }: Record<string, any>
) => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const params = {
    regionId,
    spaceId,
    limit: 10,
    offset: 0,
    ...filter,
  }
  const qryKey = ['syncJobInstances', omit(params, 'offset')]
  return useInfiniteQuery(
    qryKey,
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
