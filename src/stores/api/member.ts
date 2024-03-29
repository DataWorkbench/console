import { request } from 'utils'

interface ISpace {
  regionId?: string
  spaceId?: string
}
export interface IMemberParams {
  [k: string]: unknown
}

export const loadMemberList = ({ regionId, spaceId, ...rest }: ISpace & IMemberParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/member`,
    query: rest
  })

export const loadAllMemberList = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        hasMore: false,
        infos: [
          {
            id: 'usr-fkc8HdBQ',
            name: 'test-1'
          },
          {
            id: 'usr-MMizzuys',
            name: 'test-02'
          }
        ]
      })
    }, 1000)
  })

export const deleteMember = ({ regionId, spaceId, userIds }: ISpace & { userIds: string[] }) =>
  request({
    region: regionId,
    method: 'POST',
    uri: `/v1/workspace/${spaceId}/member/deletes`,
    body: {
      user_ids: userIds
    }
  })

export const addMember = ({ regionId, spaceId, ...rest }: ISpace & Record<string, any>) =>
  request({
    region: regionId,
    method: 'POST',
    uri: `/v1/workspace/${spaceId}/member`,
    body: rest
  })

export const describeMember = ({ regionId, spaceId, userId }: ISpace & { userId: string }) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/member/${userId}`
  })

export const updateMember = ({
  regionId,
  spaceId,
  user_id,
  ...rest
}: ISpace & { userId: string } & Record<string, any>) =>
  request({
    region: regionId,
    method: 'POST',
    uri: `/v1/workspace/${spaceId}/member/${user_id}`,
    body: { ...rest, user_id }
  })

export const describeMemberQuota = ({ regionId, spaceId, userId }: ISpace & { userId: string }) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/member/${userId}/quota`
  })

export const upsertMemberQuota = ({
  regionId,
  spaceId,
  userId,
  ...rest
}: ISpace & { userId: string } & Record<string, any>) =>
  request({
    region: regionId,
    method: 'POST',
    uri: `/v1/workspace/${spaceId}/member/${userId}/quota`,
    body: rest
  })

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
