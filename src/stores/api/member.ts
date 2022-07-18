import { request } from 'utils/index'

// eslint-disable-next-line import/prefer-default-export
export const getListAvailableUsers = (params: Record<string, any>) => {
  const { regionId, spaceId, ...rest } = params
  return request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/member/users`,
    query: rest
  })
}

export const getListNotifications = (params: Record<string, any>) => {
  const { regionId, spaceId, ...rest } = params
  return request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/op/notice`,
    query: rest
  })
}
