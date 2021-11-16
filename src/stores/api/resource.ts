import { request } from 'utils'

export interface IResourceParams {
  regionId?: string
  spaceId?: string
  [k: string]: unknown
}

export const loadResourceList = ({
  regionId,
  spaceId,
  ...rest
}: IResourceParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/resource`,
    query: rest,
  })
