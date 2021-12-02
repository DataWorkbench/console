import { useQuery, useMutation, useInfiniteQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { omit } from 'lodash-es'
import {
  createNetwork,
  listNetworks,
  updateNetwork,
  deleteNetworks,
  describeRouters,
  describeRouterVxnets,
} from 'stores/api'

interface IRouteParams {
  regionId: string
  spaceId: string
}

let queryKey: any = ''

export const getNetworkKey = () => queryKey

export const useQueryNetworks = (filter: any) => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const params = {
    regionId,
    spaceId,
    limit: 10,
    offset: 0,
    ...filter,
  }
  queryKey = ['network', params]
  return useQuery(queryKey, async () => listNetworks(params), {
    keepPreviousData: true,
  })
}

export const useInfiniteQueryNetworks = (filter: any) => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const params = {
    regionId,
    spaceId,
    limit: 10,
    offset: 0,
    ...filter,
  }
  const qryKey = ['network', omit(params, 'offset')]
  return useInfiniteQuery(
    qryKey,
    async ({ pageParam = params }) => listNetworks(pageParam),
    {
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

export const useQueryDescribeRouters = (filter: {
  offset?: number
  limit?: number
}) => {
  const { regionId } = useParams<IRouteParams>()
  const params = {
    regionId,
    limit: 10,
    offset: 0,
    ...filter,
  }
  const qryKey = ['DescribeRouters', omit(params, 'offset')]
  return useInfiniteQuery(
    qryKey,
    async ({ pageParam = params }) => {
      return describeRouters(pageParam)
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextOffset = allPages.reduce(
          (acc, cur) => acc + cur.router_set.length,
          0
        )
        if (nextOffset < lastPage.total) {
          const nextFilter = {
            ...filter,
            offset: nextOffset,
          }

          return nextFilter
        }

        return undefined
      },
    }
  )
}

export const useQueryDescribeRoutersVxnets = (filter: {
  router: string
  offset?: number
  limit?: number
}) => {
  const { regionId } = useParams<IRouteParams>()
  const params = {
    regionId,
    limit: 10,
    offset: 0,
    ...filter,
  }
  const qryKey = ['DescribeRouterVxnets', omit(params, 'offset')]
  return useInfiniteQuery(
    qryKey,
    async ({ pageParam = params }) => {
      return describeRouterVxnets(pageParam)
    },
    {
      enabled: !!params.router,
      getNextPageParam: (lastPage, allPages) => {
        const nextOffset = allPages.reduce(
          (acc, cur) => acc + cur.router_vxnet_set.length,
          0
        )
        if (nextOffset < lastPage.total) {
          const nextFilter = {
            ...filter,
            offset: nextOffset,
          }

          return nextFilter
        }

        return undefined
      },
    }
  )
}

export const useMutationNetwork = () => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  return useMutation(
    async ({ op, ...rest }: { op: OP; networkIds?: string[] }) => {
      let ret = null
      const params = {
        ...rest,
        regionId,
        spaceId,
      }
      if (op === 'create') {
        ret = await createNetwork(params)
      } else if (op === 'update') {
        ret = await updateNetwork(params)
      } else if (op === 'delete') {
        ret = await deleteNetworks(params)
      }
      return ret
    }
  )
}

export default {}
