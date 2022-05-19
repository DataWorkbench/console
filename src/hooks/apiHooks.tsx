import { useParams } from 'react-router-dom'
import { QueryKey, useQuery, UseQueryOptions } from 'react-query'
import { merge, omit } from 'lodash-es'
import { apiRequest } from 'utils/api'
import apiList from 'stores/api/apiList'

export type IResponse<T> = Omit<
  UseQueryOptions<T, unknown, T, QueryKey>,
  'queryKey' | 'queryFn'
>

export type RequestParams = {
  uri: Record<string, any>
  params?: Record<string, any>
  data?: any
  regionId?: string
}

export const queryKeyObj: Record<string, any> = {}

export const apiHooks =
  <
    T extends keyof typeof apiList,
    P extends RequestParams,
    U extends Record<string, any>
  >(
    manage: T,
    item: keyof typeof apiList[T]
  ) =>
  (filter: P, config?: IResponse<U>) => {
    const { regionId, spaceId } =
      useParams<{ regionId: string; spaceId: string }>()

    const params = merge({ regionId, uri: { space_id: spaceId } }, filter)

    queryKeyObj[item as string] = [item, omit(params, 'params.offset')]

    return useQuery<U>(
      queryKeyObj[item as string],
      () => apiRequest(manage, item)(params),
      config
    )
  }
