import { useQuery, useInfiniteQuery, useMutation } from 'react-query'
import { useParams } from 'react-router-dom'
import {
  listAvailableFlinkVersions,
  createFlinkCluster,
  listFlinkClusters,
  updateFlinkCluster,
  deleteFlinkClusters,
  startFlinkClusters,
  stopFlinkClusters,
  describeResourceBinding,
  getDescribeFlinkCluster,
  restartFlinkClusters
} from 'stores/api'
import { get, omit } from 'lodash-es'

interface IRouteParams {
  regionId: string
  spaceId: string
}

export const useQueryFlinkVersions = (type?: number) => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const queryKey = ['flinkVersions', {}]
  return useQuery(queryKey, async () => {
    const ret = await listAvailableFlinkVersions({ spaceId, regionId, type })
    return get(ret, 'items', [])
  })
}

let queryKey: any = ''

export const getFlinkClusterKey = () => queryKey

export const useQueryFlinkClusters = (filter: any) => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const params = {
    regionId,
    spaceId,
    limit: 10,
    offset: 0,
    ...filter
  }
  queryKey = ['flinkCluster', params]
  return useQuery(queryKey, async () => listFlinkClusters(params), {
    keepPreviousData: true
  })
}

export const useQueryBindResouce = (ids: string[], options = {}) => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const params = {
    regionId,
    spaceId,
    ids
  }
  const key = ['bindResource', params]
  return {
    ret: useQuery(key, async () => describeResourceBinding(params), options),
    key
  }
}

export const useQueryInfiniteFlinkClusters = ({ filter = {}, enabled = true }) => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const params = {
    regionId,
    spaceId,
    limit: 10,
    offset: 0,
    ...filter
  }
  const qryKey = ['flinkCluster', omit(params, 'offset')]
  return useInfiniteQuery(qryKey, async ({ pageParam = params }) => listFlinkClusters(pageParam), {
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
  })
}

export const useMutationCluster = () => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  return useMutation(async ({ op, ...rest }: { op: OP; clusterIds?: string[] }) => {
    let ret = null
    const params = {
      ...rest,
      regionId,
      spaceId
    }
    if (op === 'create') {
      ret = await createFlinkCluster(params)
    } else if (op === 'update') {
      ret = await updateFlinkCluster(params)
    } else if (op === 'delete') {
      ret = await deleteFlinkClusters(params)
    } else if (op === 'start') {
      ret = await startFlinkClusters(params)
    } else if (op === 'stop') {
      ret = await stopFlinkClusters(params)
    } else if (op === 'restart') {
      ret = await restartFlinkClusters(params)
    }
    return ret
  })
}

export const useQueryDescribeFlinkCluster = (
  filter: Record<string, any>,
  option: Record<string, any> = { enabled: true }
) => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const params = {
    regionId,
    spaceId,
    ...filter
  }

  const qky = ['describeFlinkCluster', params]
  return useQuery(qky, async () => getDescribeFlinkCluster(params), option)
}
