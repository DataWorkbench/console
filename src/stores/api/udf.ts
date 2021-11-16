import { request } from 'utils'

export interface IUdfParams {
  regionId?: string
  spaceId?: string
  [k: string]: unknown
}

export const loadUdfList = ({ regionId, spaceId, ...rest }: IUdfParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/udf`,
    query: rest,
  })

export const createUdf = ({ regionId, spaceId, ...rest }: IUdfParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/udf`,
    body: rest,
    method: 'POST',
  })

export const updateUdf = ({
  regionId,
  spaceId,
  udf_id: udfId,
  ...rest
}: IUdfParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/udf/${udfId}`,
    body: rest,
    method: 'PUT',
  })

export const deleteUdf = ({ regionId, spaceId, ...rest }: IUdfParams) =>
  request({
    region: regionId,
    action: `/v1/workspace/${spaceId}/udf/deletes`,
    body: rest,
    method: 'POST',
  })
