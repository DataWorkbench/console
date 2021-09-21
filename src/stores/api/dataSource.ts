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

export const loadDataSource = ({
  regionId,
  spaceId,
  ...rest
}: IDataSourceParams) =>
  request({
    action: `${regionId}/v1/workspace/${spaceId}/source`,
    ...rest,
  })
