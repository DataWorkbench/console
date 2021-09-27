import { request } from 'utils'

export interface IDataSourceParams {
  regionId: string
  spaceId: string
  [k: string]: unknown
}

export const loadSourceKind = ({ regionId, spaceId }: IDataSourceParams) =>
  request({ action: `${regionId}/v1/workspace/${spaceId}/source/kind` })

export const createDataSource = ({
  regionId,
  spaceId,
  ...rest
}: IDataSourceParams) =>
  request({
    action: `${regionId}/v1/workspace/${spaceId}/source`,
    ...rest,
    method: 'POST',
  })

export const updateDataSource = ({
  regionId,
  spaceId,
  sourceId,
  ...rest
}: IDataSourceParams) =>
  request({
    action: `${regionId}/v1/workspace/${spaceId}/source/${sourceId}`,
    ...rest,
    method: 'PUT',
  })

export const loadDataSource = ({
  regionId,
  spaceId,
  ...rest
}: IDataSourceParams) =>
  request({
    action: `${regionId}/v1/workspace/${spaceId}/source`,
    ...rest,
  })

export const disableDataSource = ({
  regionId,
  spaceId,
  sourceIds,
}: IDataSourceParams) =>
  request({
    action: `${regionId}/v1/workspace/${spaceId}/source/disables`,
    sourceids: sourceIds,
    method: 'PUT',
  })

export const enableDataSource = ({
  regionId,
  spaceId,
  ...sourceIds
}: IDataSourceParams) =>
  request({
    action: `${regionId}/v1/workspace/${spaceId}/source/enables`,
    sourceids: sourceIds,
    method: 'PUT',
  })

export const deleteDataSource = ({
  regionId,
  spaceId,
  sourceIds,
}: IDataSourceParams) =>
  request({
    action: `${regionId}/v1/workspace/${spaceId}/source/deletes`,
    sourceids: sourceIds,
    method: 'DELETE',
  })
