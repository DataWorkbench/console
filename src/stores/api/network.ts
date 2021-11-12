import { request } from 'utils'

interface IParams {
  regionId: string
  spaceId: string
  [k: string]: unknown
}

export const listNetworks = ({ regionId, spaceId, ...rest }: IParams) =>
  request({
    action: `${regionId}/v1/workspace/${spaceId}/network`,
    ...rest,
  })

export const createNetwork = ({ regionId, spaceId, ...rest }: IParams) =>
  request({
    action: `${regionId}/v1/workspace/${spaceId}/network`,
    ...rest,
    method: 'POST',
  })

export const updateNetwork = ({
  regionId,
  spaceId,
  networkId,
  ...rest
}: IParams) =>
  request({
    action: `${regionId}/v1/workspace/${spaceId}/network/${networkId}`,
    ...rest,
    method: 'PUT',
  })

export const deleteNetworks = ({ regionId, spaceId, networkIds }: IParams) =>
  request({
    action: `${regionId}/v1/workspace/${spaceId}/network/deletes`,
    network_ids: networkIds,
    method: 'POST',
  })
