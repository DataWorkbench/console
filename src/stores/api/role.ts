import { request } from 'utils'

export interface IRoleParams {
  regionId?: string
  spaceId?: string
  [k: string]: unknown
}

export const loadRoleList = ({ regionId, spaceId }: IRoleParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/role/system`,
  })

export const loadRolePermissionList = ({ regionId, spaceId }: IRoleParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/role/system/permission`,
  })
