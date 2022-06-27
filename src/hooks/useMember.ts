import { useInfiniteQuery, useMutation, useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { omit } from 'lodash-es'
import {
  addMember,
  deleteMember,
  loadAllMemberList,
  loadMemberList,
  loadRoleList,
  loadRolePermissionList,
  updateMember,
} from 'stores/api'
import { getNextPageParam } from './apiHooks'

interface IRouteParams {
  regionId: string
  spaceId: string
  // mod?: string
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

export const useQueryRoleList = (
  params: Record<string, any> = {},
  option: Record<string, any> = {}
) => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const queryKey = ['role', { regionId, spaceId, ...params }]
  return useQuery(
    queryKey,
    async () => loadRoleList({ regionId, spaceId, ...params }),
    {
      ...option,
    }
  )
}

export const useQueryRolePermissionList = (
  params: Record<string, any> = {},
  option: Record<string, any> = {}
) => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const queryKey = ['rolePermissions', { regionId, spaceId, ...params }]
  return useQuery(
    queryKey,
    async () => loadRolePermissionList({ regionId, spaceId, ...params }),
    {
      ...option,
    }
  )
}
export const useMutationMember = () => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  return useMutation(async ({ op, ...rest }: Record<string, any>) => {
    let ret = null
    const params = {
      regionId,
      spaceId,
      ...rest,
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

export const useQueryInfiniteMember = (
  params: Record<string, any>,
  config: Record<string, any> = {}
) => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const queryKey = ['member', { regionId, spaceId, ...params }]
  return useInfiniteQuery(
    queryKey,
    async ({ pageParam = params }) => {
      return loadAllMemberList({ regionId, spaceId, ...pageParam })
    },
    {
      ...config,
      getNextPageParam,
    }
  )
}
