import { request } from 'utils'

interface IParams {
  regionId: string
  spaceId: string
  [k: string]: unknown
}

export const listNetworks = ({ regionId, spaceId, ...rest }: IParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/network`,
    query: rest,
  })

export const createNetwork = ({ regionId, spaceId, ...rest }: IParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/network`,
    body: rest,
    method: 'POST',
  })

export const updateNetwork = ({
  regionId,
  spaceId,
  networkId,
  ...rest
}: IParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/network/${networkId}`,
    body: rest,
    method: 'PUT',
  })

export const deleteNetworks = ({ regionId, spaceId, networkIds }: IParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/network/deletes`,
    body: { network_ids: networkIds },
    method: 'POST',
  })
