import { request } from 'utils'

export interface IParams {
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
