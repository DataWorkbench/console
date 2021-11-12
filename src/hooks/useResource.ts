import { omit } from 'lodash-es'
import { useQuery, useInfiniteQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { loadResourceList } from 'stores/api'

interface IRouteParams {
  regionId: string
  spaceId: string
  mod?: string
}

const keys: {
  infinite: any
  page: any
} = {
  infinite: '',
  page: '',
}

export const getResourceKey = (kind: 'infinite' | 'page' = 'page') => keys[kind]

export const useQueryResourceList = (
  filter: Record<string, any>,
  options = {}
) => {
  const { regionId, spaceId } = useParams<IRouteParams>()

  const params = {
    regionId,
    spaceId,
    ...filter,
  }

  const queryKey = ['udf', params]
  keys.page = queryKey
  return useQuery(queryKey, async () => loadResourceList(params), options)
}

export const useQueryResource = (filter: Record<string, any>, options = {}) => {
  const { regionId, spaceId } = useParams<IRouteParams>()

  const rest = omit(filter, 'offset')

  const params = {
    regionId,
    spaceId,
    ...rest,
  }

  const queryKey = ['workspaces', params]
  keys.infinite = queryKey

  return useInfiniteQuery(
    queryKey,
    async ({ pageParam = filter }) => {
      return loadResourceList({ ...pageParam, regionId, spaceId })
    },
    {
      getNextPageParam: (lastPage: any, allPages: any) => {
        if (lastPage.infos?.length === filter.limit) {
          const nextOffset = allPages.reduce(
            (acc: number, cur: Record<string, any>) => acc + cur.infos.length,
            0
          )
          if (nextOffset < lastPage.total) {
            const nextFilter = {
              ...filter,
              offset: nextOffset,
            }
            return nextFilter
          }
        }
        return undefined
      },
      ...options,
    }
  )
}
