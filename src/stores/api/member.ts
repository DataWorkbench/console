import { request } from 'utils'

interface ISpace {
  regionId?: string
  spaceId?: string
}
export interface IMemberParams {
  [k: string]: unknown
}

export const loadMemberList = ({
  regionId,
  spaceId,
  ...rest
}: ISpace & IMemberParams) => {
  return request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/member`,
    query: rest,
  })
}

export const deleteMember = ({
  regionId,
  spaceId,
  userIds,
}: ISpace & { userIds: string[] }) => {
  return request({
    region: regionId,
    method: 'POST',
    uri: `/v1/workspace/${spaceId}/member/deletes`,
    body: {
      user_ids: userIds,
    },
  })
}

export const addMember = ({
  regionId,
  spaceId,
  ...rest
}: ISpace & Record<string, any>) => {
  return request({
    region: regionId,
    method: 'POST',
    uri: `/v1/workspace/${spaceId}/member`,
    body: rest,
  })
}

export const describeMember = ({
  regionId,
  spaceId,
  userId,
}: ISpace & { userId: string }) => {
  return request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/member/${userId}`,
  })
}

export const updateMember = ({
  regionId,
  spaceId,
  user_id,
  ...rest
}: ISpace & { userId: string } & Record<string, any>) => {
  return request({
    region: regionId,
    method: 'POST',
    uri: `/v1/workspace/${spaceId}/member/${user_id}`,
    body: { ...rest, user_id },
  })
}

export const describeMemberQuota = ({
  regionId,
  spaceId,
  userId,
}: ISpace & { userId: string }) => {
  return request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/member/${userId}/quota`,
  })
}

export const upsertMemberQuota = ({
  regionId,
  spaceId,
  userId,
  ...rest
}: ISpace & { userId: string } & Record<string, any>) => {
  return request({
    region: regionId,
    method: 'POST',
    uri: `/v1/workspace/${spaceId}/member/${userId}/quota`,
    body: rest,
  })
}
