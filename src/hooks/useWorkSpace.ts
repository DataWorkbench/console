import { useInfiniteQuery, useQuery, useMutation } from 'react-query'
import { omit } from 'lodash-es'
import {
  loadWorkSpace,
  IListWorkSpaceParams,
  disableWorkSpaces,
  enableWorkSpaces,
  deleteWorkSpaces,
  createWorkSpace,
  updateWorkSpace,
  attachWorkSpacesNetwork
} from 'stores/api'
import { apiHooks, queryKeyObj } from './apiHooks'
import {
  DescribePlatformConfigRequestType,
  DescribeNetworkConfigRequestType,
  DescribeWorkspaceConfigRequestType
} from '../types/request'
import {
  PlatformManageDescribePlatformConfigType,
  SpaceManageDescribeNetworkConfigType,
  SpaceManageDescribeWorkspaceConfigType
} from '../types/response'

const keys: {
  infinite: any
  page: any
} = {
  infinite: '',
  page: ''
}

export const getWorkSpaceKey = (kind: 'infinite' | 'page') => keys[kind]

export const useQueryWorkSpace = (filter: IListWorkSpaceParams) => {
  const queryKey = ['workspaces', omit(filter, 'offset')]
  keys.infinite = queryKey
  return useInfiniteQuery(queryKey, async ({ pageParam = filter }) => loadWorkSpace(pageParam), {
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.has_more) {
        const nextOffset = allPages.reduce((acc, cur) => acc + cur.infos.length, 0)
        if (nextOffset < lastPage.total) {
          const nextFilter = {
            ...filter,
            offset: nextOffset
          }

          return nextFilter
        }
      }
      return undefined
    }
  })
}

export const useQueryPageWorkSpace = (filter: any) => {
  const queryKey = ['workspaces', filter]
  keys.page = queryKey
  return useQuery(queryKey, async () => loadWorkSpace(filter), {
    keepPreviousData: true
  })
}
// {IWorkSpaceParams, 'disable' | 'enable' | 'delete' | 'create'}
export interface MutationWorkSpaceParams {
  regionId: string
  op: 'disable' | 'enable' | 'delete' | 'create' | 'update' | 'network'
  spaceIds?: string[]
  space?: {
    id: string
    [k: string]: string
  }
}

export const useMutationWorkSpace = (options?: {}) =>
  useMutation(async ({ op, ...rest }: MutationWorkSpaceParams) => {
    if (['disable', 'enable', 'delete', 'create', 'update', 'network'].includes(op)) {
      let ret
      if (op === 'create') {
        ret = await createWorkSpace(rest)
      } else if (op === 'update') {
        ret = await updateWorkSpace(rest)
      } else if (op === 'disable') {
        ret = await disableWorkSpaces(rest)
      } else if (op === 'enable') {
        ret = await enableWorkSpaces(rest)
      } else if (op === 'delete') {
        ret = await deleteWorkSpaces(rest)
      } else if (op === 'network') {
        ret = await attachWorkSpacesNetwork(rest)
      }
      return ret
    }
    return undefined
  }, options)

export const useQueryDescribePlatformConfig = apiHooks<
  'platformManage',
  DescribePlatformConfigRequestType,
  PlatformManageDescribePlatformConfigType
>('platformManage', 'describePlatformConfig')

export const getQueryKeyDescribePlatformConfig = () => queryKeyObj.describePlatformConfig

export const useQueryDescribeNetworkConfig = apiHooks<
  'spaceManage',
  DescribeNetworkConfigRequestType,
  SpaceManageDescribeNetworkConfigType
>('spaceManage', 'describeNetworkConfig')

export const getQueryKeyDescribeNetworkConfig = () => queryKeyObj.describeNetworkConfig

export default useQueryWorkSpace

export const useQueryDescribeWorkspaceConfig = apiHooks<
  'spaceManage',
  DescribeWorkspaceConfigRequestType,
  SpaceManageDescribeWorkspaceConfigType
>('spaceManage', 'describeWorkspaceConfig')
