import { request } from 'utils'

interface IParams {
  regionId: string
  spaceId: string
  [k: string]: unknown
}

export const listAvailableFlinkVersions = ({ regionId, spaceId }: IParams) =>
  request({
    action: `${regionId}/v1/workspace/${spaceId}/cluster/flink/versions`,
  })

export const listFlinkClusters = ({ regionId, spaceId, ...rest }: IParams) =>
  request({
    action: `${regionId}/v1/workspace/${spaceId}/cluster/flink`,
    ...rest,
  })

export const createFlinkCluster = ({ regionId, spaceId, ...rest }: IParams) =>
  request({
    action: `${regionId}/v1/workspace/${spaceId}/cluster/flink`,
    ...rest,
    method: 'POST',
  })

export const updateFlinkCluster = ({
  regionId,
  spaceId,
  clusterId,
  ...rest
}: IParams) =>
  request({
    action: `${regionId}/v1/workspace/${spaceId}/cluster/flink/${clusterId}`,
    ...rest,
    method: 'PUT',
  })

export const stopFlinkClusters = ({ regionId, spaceId, clusterIds }: IParams) =>
  request({
    action: `${regionId}/v1/workspace/${spaceId}/cluster/flink/stops`,
    cluster_ids: clusterIds,
    method: 'POST',
  })

export const startFlinkClusters = ({
  regionId,
  spaceId,
  clusterIds,
}: IParams) =>
  request({
    action: `${regionId}/v1/workspace/${spaceId}/cluster/flink/starts`,
    cluster_ids: clusterIds,
    method: 'POST',
  })

export const deleteFlinkClusters = ({
  regionId,
  spaceId,
  clusterIds,
}: IParams) =>
  request({
    action: `${regionId}/v1/workspace/${spaceId}/cluster/flink/deletes`,
    cluster_ids: clusterIds,
    method: 'POST',
  })
