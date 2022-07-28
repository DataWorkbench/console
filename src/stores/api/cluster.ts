import { request } from 'utils'

interface IParams {
  regionId: string
  spaceId: string
  [k: string]: unknown
}

export const listAvailableFlinkVersions = ({ regionId, spaceId, type }: IParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/cluster/flink/versions`,
    query: {
      source_kind: type
    }
  })

export const describeResourceBinding = ({ regionId, spaceId, ids = [] }: IParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/binding/resources?${(ids as string[])
      .map((id) => `ids=${id}`)
      .join('&')}`,
    method: 'GET'
  })

export const listFlinkClusters = ({ regionId, spaceId, ...rest }: IParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/cluster/flink`,
    query: rest
  })

export const createFlinkCluster = ({ regionId, spaceId, ...rest }: IParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/cluster/flink`,
    body: rest,
    method: 'POST'
  })

export const updateFlinkCluster = ({ regionId, spaceId, clusterId, ...rest }: IParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/cluster/flink/${clusterId}`,
    body: rest,
    method: 'PUT'
  })

export const stopFlinkClusters = ({ regionId, spaceId, clusterIds }: IParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/cluster/flink/stops`,
    body: { cluster_ids: clusterIds },
    method: 'POST'
  })

export const startFlinkClusters = ({ regionId, spaceId, clusterIds }: IParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/cluster/flink/starts`,
    body: { cluster_ids: clusterIds },
    method: 'POST'
  })

export const deleteFlinkClusters = ({ regionId, spaceId, clusterIds }: IParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/cluster/flink/deletes`,
    body: { cluster_ids: clusterIds },
    method: 'POST'
  })

export const getDescribeFlinkCluster = ({ regionId, spaceId, clusterId }: IParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/cluster/flink/${clusterId}`,
    method: 'GET'
  })
