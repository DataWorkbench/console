import { useParams } from 'react-router-dom'
import { QueryKey, useQuery, UseQueryOptions } from 'react-query'
import { merge } from 'lodash-es'
import { apiRequest } from 'utils/api'
import apiList from 'stores/api/apiList'
import { getStorage, setStorage } from 'utils/storage'

export type IResponse<T> = Omit<UseQueryOptions<T, unknown, T, QueryKey>, 'queryKey' | 'queryFn'>

export type RequestParams = {
  uri?: Record<string, any>
  params?: Record<string, any>
  data?: any
  regionId?: string
}

export const queryKeyObj: Record<string, any> = {}

export const getNextPageParam =
  (params: Record<string, any>) => (lastPage: Record<string, any>, allPages: any[]) => {
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

export const apiHooks =
  <T extends keyof typeof apiList, P extends RequestParams, U extends Record<string, any>>(
    manage: T,
    item: keyof typeof apiList[T]
  ) =>
  (filter: P, config?: IResponse<U>, storageTime?: number) => {
    const { regionId, spaceId } = useParams<{ regionId: string; spaceId: string }>()

    const params = merge({ regionId, uri: { space_id: spaceId } }, filter)

    queryKeyObj[item as string] = [item, params]

    return useQuery<U>(
      queryKeyObj[item as string],
      async () => {
        if (storageTime) {
          const data = getStorage(JSON.stringify(queryKeyObj[item as string]))
          if (data) {
            return data
          }
        }
        const re = await apiRequest(manage, item)(params)
        if (storageTime) {
          setStorage(JSON.stringify(queryKeyObj[item as string]), re, storageTime)
        }
        return re
      },
      config
    )
  }
