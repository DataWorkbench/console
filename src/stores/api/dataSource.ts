import { request } from 'utils'

export interface IDataSourceParams {
  regionId: string
  spaceId: string
  [k: string]: unknown
}

export const loadSourceKind = ({ regionId, spaceId }: IDataSourceParams) =>
  request({ region: regionId, uri: `/v1/workspace/${spaceId}/source/kind` })

export const createDataSource = ({
  regionId,
  spaceId,
  ...rest
}: IDataSourceParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/source`,
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
    uri: `/v1/workspace/${spaceId}/source/${sourceId}`,
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
    uri: `/v1/workspace/${spaceId}/source`,
    query: rest,
  })

export const disableDataSource = ({
  regionId,
  spaceId,
  sourceIds,
}: IDataSourceParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/source/disables`,
    body: { sourceids: sourceIds },
    method: 'POST',
  })

export const enableDataSource = ({
  regionId,
  spaceId,
  sourceIds,
}: IDataSourceParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/source/enables`,
    body: { sourceids: sourceIds },
    method: 'POST',
  })

export const deleteDataSource = ({
  regionId,
  spaceId,
  sourceIds,
}: IDataSourceParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/source/deletes`,
    body: { sourceids: sourceIds },
    method: 'POST',
  })

export const pingDataSource = ({
  regionId,
  spaceId,
  ...rest
}: IDataSourceParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/source/ping`,
    body: rest,
    method: 'POST',
  })
