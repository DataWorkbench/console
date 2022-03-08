import { useInfiniteQuery, useMutation, useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { omit } from 'lodash-es'

import { createUdf, deleteUdf, loadUdfList, updateUdf } from 'stores/api'

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

export const getUdfKey = (kind: 'infinite' | 'page' = 'page') => keys[kind]

export const useQueryUdfList = (filter: Record<string, any>, options = {}) => {
  const { regionId, spaceId } = useParams<IRouteParams>()

  const params = {
    regionId,
    spaceId,
    ...filter,
  }

  const queryKey = ['udf', params]
  keys.page = queryKey
  return useQuery(queryKey, async () => loadUdfList(params), options)
}

export const useQueryUdf = (filter: Record<string, any>, options = {}) => {
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
      return loadUdfList({ ...pageParam, regionId, spaceId })
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

export const useMutationUdf = (options?: {}) => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  return useMutation(async ({ op, ...rest }: Record<string, any>) => {
    if (['edit', 'create', 'delete'].includes(op)) {
      let ret
      if (op === 'create') {
        ret = await createUdf({ ...rest, regionId, spaceId })
      } else if (op === 'edit') {
        ret = await updateUdf({ ...rest, udf_id: rest.id, regionId, spaceId })
      } else if (op === 'delete') {
        ret = await deleteUdf({ ...rest, regionId, spaceId })
      }
      return ret
    }
    return undefined
  }, options)
}
