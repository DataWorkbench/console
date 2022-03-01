import { useMutation, useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { omit } from 'lodash-es'
import {
  addMember,
  deleteMember,
  loadMemberList,
  loadRoleList,
  updateMember,
} from 'stores/api'

interface IRouteParams {
  regionId: string
  spaceId: string
  mod?: string
}

const keys: {
  page: any
} = {
  page: '',
}

export const getMemberKeys = (kind: keyof typeof keys = 'page') => keys[kind]

export const useQueryMemberList = (
  filter: Record<string, any>,
  options = {}
) => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const params = {
    regionId,
    spaceId,
    ...filter,
  }

  const queryKey = ['member', params]
  keys.page = queryKey
  return useQuery(queryKey, async () => loadMemberList(params), options)
}

export const useQueryRoleList = () => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const queryKey = ['role', { regionId, spaceId }]
  return useQuery(queryKey, async () => loadRoleList({ regionId, spaceId }))
}

export const useMutationMember = () => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  return useMutation(async ({ op, ...rest }: Record<string, any>) => {
    let ret = null
    const params = {
      ...rest,
      regionId,
      spaceId,
    }
    if (op === 'create') {
      ret = await addMember(params)
    } else if (op === 'update') {
      ret = await updateMember(omit(params, 'user_ids') as any)
    } else if (op === 'delete') {
      ret = await deleteMember(params as any)
    }
    return ret
  })
}
