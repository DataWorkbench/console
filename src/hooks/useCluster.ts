import { useQuery, useMutation } from 'react-query'
import { useParams } from 'react-router-dom'
import {
  listAvailableFlinkVersions,
  createFlinkCluster,
  listFlinkClusters,
  updateFlinkCluster,
  deleteFlinkClusters,
  startFlinkClusters,
  stopFlinkClusters,
} from 'stores/api'
import { get } from 'lodash-es'

interface IRouteParams {
  regionId: string
  spaceId: string
}

export const useQueryFlinkVersions = () => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const queryKey = 'flinkVersions'
  return useQuery(queryKey, async () => {
    const ret = await listAvailableFlinkVersions({ spaceId, regionId })
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
    ...filter,
  }
  queryKey = ['flinkCluster', params]
  return useQuery(queryKey, async () => listFlinkClusters(params), {
    keepPreviousData: true,
  })
}

export const useMutationCluster = () => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  return useMutation(
    async ({ op, ...rest }: { op: OP; clusterIds?: string[] }) => {
      let ret = null
      const params = {
        ...rest,
        regionId,
        spaceId,
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
      }
      return ret
    }
  )
}

export default {}
