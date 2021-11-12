import { request } from 'utils'

export interface IUdfParams {
  regionId?: string
  spaceId?: string
  [k: string]: unknown
}

export const loadUdfList = ({ regionId, spaceId, ...rest }: IUdfParams) =>
  request({
    action: `${regionId}/v1/workspace/${spaceId}/udf`,
    ...rest,
  })

export const createUdf = ({ regionId, spaceId, ...rest }: IUdfParams) =>
  request({
    action: `${regionId}/v1/workspace/${spaceId}/udf`,
    ...rest,
    method: 'POST',
  })

export const updateUdf = ({
  regionId,
  spaceId,
  udf_id: udfId,
  ...rest
}: IUdfParams) =>
  request({
    action: `${regionId}/v1/workspace/${spaceId}/udf/${udfId}`,
    ...rest,
    method: 'PUT',
  })

export const deleteUdf = ({ regionId, spaceId, ...rest }: IUdfParams) =>
  request({
    action: `${regionId}/v1/workspace/${spaceId}/udf/deletes`,
    ...rest,
    method: 'POST',
  })
