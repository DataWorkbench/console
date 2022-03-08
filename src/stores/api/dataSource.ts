import { request } from 'utils'

export interface IDataSourceParams {
  regionId: string
  spaceId: string
  [k: string]: unknown
}

export const loadSourceKind = ({ regionId, spaceId }: IDataSourceParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/datasource/kinds`,
  })

export const createDataSource = ({
  regionId,
  spaceId,
  ...rest
}: IDataSourceParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/datasource`,
    body: rest,
    method: 'POST',
  })

export const updateDataSource = ({
  regionId,
  spaceId,
  sourceId,
  ...rest
}: IDataSourceParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/datasource/${sourceId}`,
    body: rest,
    method: 'PUT',
  })

export const loadDataSource = ({
  regionId,
  spaceId,
  ...rest
}: IDataSourceParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/datasource`,
    query: rest,
  })

export const disableDataSource = ({
  regionId,
  spaceId,
  sourceIds,
}: IDataSourceParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/datasource/disables`,
    body: { source_ids: sourceIds },
    method: 'POST',
  })

export const enableDataSource = ({
  regionId,
  spaceId,
  sourceIds,
}: IDataSourceParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/datasource/enables`,
    body: { source_ids: sourceIds },
    method: 'POST',
  })

export const deleteDataSource = ({
  regionId,
  spaceId,
  sourceIds,
}: IDataSourceParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/datasource/deletes`,
    body: { source_ids: sourceIds },
    method: 'POST',
  })

export const pingDataSource = ({
  regionId,
  spaceId,
  ...rest
}: IDataSourceParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/datasource/ping`,
    body: rest,
    method: 'POST',
  })

export const pingDataSourceList = ({
  regionId,
  spaceId,
  sourceId,
  ...rest
}: IDataSourceParams) => {
  return request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/datasource/${sourceId}/conn`,
    body: rest,
    method: 'GET',
  })
}
