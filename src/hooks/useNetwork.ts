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
let queryRoutersKey: any = ''
let queryVxnetsKey: any = ''
let queryAllVxnetsKey: any = ''

export const getNetworkKey = () => queryKey
export const getRoutersKey = () => queryRoutersKey
export const getVxnetsKey = () => queryVxnetsKey
export const getAllVxnetsKey = () => queryAllVxnetsKey

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
  queryKey = ['network', omit(params, 'offset')]
  return useInfiniteQuery(
    queryKey,
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
  regionId?: string
  search_word?: string
  spaceId?: string
}) => {
  const { regionId } = useParams<IRouteParams>()
  const params = {
    regionId,
    limit: 10,
    offset: 0,
    ...filter,
  }
  queryRoutersKey = ['DescribeRouters', omit(params, 'offset')]
  return useInfiniteQuery(
    queryRoutersKey,
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
  regionId?: string
  search_word?: string
}) => {
  const { regionId } = useParams<IRouteParams>()
  const params = {
    regionId,
    limit: 10,
    offset: 0,
    ...filter,
  }
  queryVxnetsKey = ['DescribeRouterVxnets', omit(params, 'offset')]
  return useInfiniteQuery(
    queryVxnetsKey,
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

export const useQueryDescribeRoutersAllVxnets = (filter: {
  router: string
  offset?: number
  limit?: number
  regionId?: string
}) => {
  const { regionId } = useParams<IRouteParams>()
  const params = {
    regionId,
    offset: 0,
    ...filter,
    limit: 200,
  }
  queryAllVxnetsKey = ['DescribeRouterVxnets', omit(params, 'offset')]
  return useQuery(
    queryAllVxnetsKey,
    async () => {
      const params1 = {
        ...params,
      }
      const params2 = {
        ...params,
        offset: 200,
      }
      const [res1, res2] = await Promise.all([
        describeRouterVxnets(params1),
        describeRouterVxnets(params2),
      ])

      const allVxnets = [...res1.router_vxnet_set, ...res2.router_vxnet_set]
      return {
        router_vxnet_set: allVxnets,
        total: allVxnets.length,
      }
    },
    {
      enabled: !!params.router,
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
