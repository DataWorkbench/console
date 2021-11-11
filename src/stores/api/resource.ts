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
    action: `${regionId}/v1/workspace/${spaceId}/resource`,
    ...rest,
  })
