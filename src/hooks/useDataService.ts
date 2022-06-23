import { useParams } from 'react-router-dom'
import { useMutation, useQueryClient } from 'react-query'
import { apiRequest } from 'utils/api'
import { merge } from 'lodash-es'
import { useCallback } from 'react'
import { apiHooks, queryKeyObj } from './apiHooks'
import {
  ListApiGroupsRequestType,
  ListDataServiceClustersRequestType,
  ListApiServicesRequestType,
  ListRoutesRequestType
} from '../types/request'
import {
  DataServiceManageListDataServiceClustersType,
  DataServiceManageListApiGroupsType,
  DataServiceManageDescribeApiConfigType,
  ServiceGatewayListApiServicesType,
  ServiceGatewayListRoutesType
} from '../types/response'

import { PbmodelApiGroup } from '../types/types'

type Options = 'createApiGroup' | 'createApi'
type AuthKeyOp = 'create' | 'update' | 'delete' | 'bind' | 'unbind'
interface IParams {
  regionId: string
  spaceId?: string
  [k: string]: unknown
}

interface IRouteParams {
  regionId: string
  spaceId: string
}

/**
 *  服务集群
 */
export type ClusterListInfo = DataServiceManageListDataServiceClustersType['infos'][0]

export const getQueryKeyListDataServiceClusters = () => queryKeyObj.listDataServiceClusters

export const useQueryListDataServiceClusters = apiHooks<
  'dataServiceManage',
  ListDataServiceClustersRequestType,
  DataServiceManageListDataServiceClustersType
>('dataServiceManage', 'listDataServiceClusters')

export const CreateDataServiceCluster = async ({ regionId, spaceId, ...rest }: IParams) => {
  const params = merge({ regionId, uri: { space_id: spaceId } }, { data: rest })
  return apiRequest('dataServiceManage', 'createDataServiceCluster')(params)
}
export const UpdateDataServiceCluster = async ({
  regionId,
  spaceId,
  clusterId,
  ...rest
}: IParams) => {
  const params = merge(
    { regionId, uri: { space_id: spaceId, cluster_id: clusterId } },
    { data: rest }
  )
  return apiRequest('dataServiceManage', 'updateDataServiceCluster')(params)
}
export const DeleteDataServiceCluster = async ({
  regionId,
  spaceId,
  clusterId,
  ...rest
}: IParams) => {
  const params = merge(
    { regionId, uri: { space_id: spaceId } },
    { data: rest, cluster_id: [clusterId] }
  )
  return apiRequest('dataServiceManage', 'deleteDataServiceClusters')(params)
}

export const StartDataServiceCluster = async ({ regionId, spaceId, clusterId }: IParams) => {
  const params = merge(
    { regionId, uri: { space_id: spaceId } },
    { data: { cluster_ids: [clusterId] } }
  )
  return apiRequest('dataServiceManage', 'startDataServiceClusters')(params)
}

export const StopDataServiceCluster = async ({ regionId, spaceId, clusterId }: IParams) => {
  const params = merge(
    { regionId, uri: { space_id: spaceId } },
    { data: { cluster_ids: [clusterId] } }
  )
  return apiRequest('dataServiceManage', 'stopDataServiceClusters')(params)
}

export const useMutationDataServiceCluster = () => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  return useMutation(async ({ op, ...rest }: { op: OP; clusterId?: string }) => {
    let ret = null
    const params = {
      ...rest,
      regionId,
      spaceId
    }
    if (op === 'create') {
      ret = await CreateDataServiceCluster(params)
    } else if (op === 'update') {
      ret = await UpdateDataServiceCluster(params)
    } else if (op === 'delete') {
      ret = await DeleteDataServiceCluster(params)
    } else if (op === 'start' || op === 'reload') {
      ret = await StartDataServiceCluster(params)
    } else if (op === 'stop') {
      ret = await StopDataServiceCluster(params)
    }
    return ret
  })
}

/**
 *  服务开发
 */

export const useQueryListApiGroups = apiHooks<
  'dataServiceManage',
  ListApiGroupsRequestType,
  DataServiceManageListApiGroupsType
>('dataServiceManage', 'listApiGroups')

export type ListApiGroupInfo = PbmodelApiGroup

export const getListApiConfigs = async ({ regionId, spaceId, clusterId, ...rest }: IParams) => {
  const params = merge({ regionId, uri: { space_id: spaceId } }, { data: rest })
  return apiRequest('dataServiceManage', 'listApiConfigs')(params)
}

export const useFetchApi = () => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const queryClient = useQueryClient()
  return useCallback(
    (filter = {}, options = {}) => {
      const params = {
        regionId,
        spaceId,
        search: '',
        ...filter
      }
      return queryClient.fetchQuery(['api', params], async () => getListApiConfigs(params), {
        ...options
      })
    },
    [queryClient, regionId, spaceId]
  )
}

export const CreateApiGroup = async ({ regionId, spaceId, ...rest }: IParams) => {
  const params = merge({ regionId, uri: { space_id: spaceId } }, { data: rest })
  return apiRequest('dataServiceManage', 'createApiGroup')(params)
}

export const CreateApiConfig = async ({ regionId, spaceId, ...rest }: IParams) => {
  const params = merge({ regionId, uri: { space_id: spaceId } }, { data: rest })
  return apiRequest('dataServiceManage', 'createApiConfig')(params)
}

export const useMutationApiService = () => {
  const { regionId, spaceId } = useParams<IRouteParams>()

  return useMutation(async ({ option, ...rest }: { option: Options; clusterId?: string }) => {
    let ret = null
    const params = {
      ...rest,
      regionId,
      spaceId
    }

    if (option === 'createApiGroup') {
      ret = await CreateApiGroup(params)
    } else if (option === 'createApi') {
      ret = await CreateApiConfig(params)
    }
    return ret
  })
}

export const useMutationListApiConfigs = () => {
  const { regionId, spaceId } = useParams<IRouteParams>()

  return useMutation(async ({ group_id }: { group_id: string }) => {
    let ret = null
    const params = {
      group_id,
      regionId,
      spaceId
    }
    ret = await getListApiConfigs(params)
    return ret
  })
}

export const DescribeApiConfig = async ({ regionId, spaceId, apiId, ...rest }: IParams) => {
  const params = merge({ regionId, uri: { space_id: spaceId, api_id: apiId } }, { data: rest })
  return apiRequest('dataServiceManage', 'describeApiConfig')(params)
}

export type DataServiceManageDescribeApiConfig = DataServiceManageDescribeApiConfigType
export const useFetchApiConfig = () => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const queryClient = useQueryClient()
  return useCallback(
    (filter = {}, options = {}) => {
      const params = {
        regionId,
        spaceId,
        ...filter
      }
      return queryClient.fetchQuery(['apiConfig', params], async () => DescribeApiConfig(params), {
        ...options
      })
    },
    [queryClient, regionId, spaceId]
  )
}

export const UpdateApiConfig = async ({ regionId, spaceId, apiId, ...rest }: IParams) => {
  const params = merge({ regionId, uri: { space_id: spaceId, api_id: apiId } }, { data: rest })
  return apiRequest('dataServiceManage', 'updateApiConfig')(params)
}

export const useMutationUpdateApiConfig = () => {
  const { regionId, spaceId } = useParams<IRouteParams>()

  return useMutation(async ({ apiId, ...rest }: Record<string, any>) => {
    let ret = null
    const params = {
      apiId,
      regionId,
      spaceId,
      ...rest
    }
    ret = await UpdateApiConfig(params)
    return ret
  })
}

/**
 *  API 管理
 */

// api服务列表
export const useQueryListApiServices = apiHooks<
  'serviceGateway',
  ListApiServicesRequestType,
  ServiceGatewayListApiServicesType
>('serviceGateway', 'listApiServices')

export const getQueryKeyListApiServices = () => queryKeyObj.listApiServices

// 已发布api列表
export const useQueryListRoutes = apiHooks<
  'serviceGateway',
  ListRoutesRequestType,
  ServiceGatewayListRoutesType
>('serviceGateway', 'listRoutes')

export const getQueryKeyListRoutes = () => queryKeyObj.listRoutes

// 下线api
export const AbolishDataServiceApis = async ({ regionId, spaceId, ...rest }: IParams) => {
  const params = merge({ regionId, uri: { space_id: spaceId } }, { data: rest })
  return apiRequest('dataServiceManage', 'abolishDataServiceApis')(params)
}
export const useMutationAbolishDataServiceApis = () => {
  const { regionId, spaceId } = useParams<IRouteParams>()

  return useMutation(async (apiIds: string[]) => {
    let ret = null
    const params = {
      regionId,
      spaceId,
      api_ids: apiIds
    }
    ret = await AbolishDataServiceApis(params)
    return ret
  })
}

// 密钥列表
export const useQueryListAuthKeys = apiHooks<
  'serviceGateway',
  ListRoutesRequestType,
  ServiceGatewayListRoutesType
>('serviceGateway', 'listAuthKeys')
export const getQueryKeyListAuthKeys = () => queryKeyObj.listAuthKeys

// 密钥 创建 更新 删除 绑定 解绑

export const CreateAuthKey = async ({ regionId, spaceId, ...rest }: IParams) => {
  const params = merge({ regionId, uri: { space_id: spaceId } }, { data: rest })
  return apiRequest('serviceGateway', 'createAuthKey')(params)
}
export const UpdateAuthKey = async ({ regionId, spaceId, auth_key_id, ...rest }: IParams) => {
  const params = merge({ regionId, uri: { space_id: spaceId, auth_key_id } }, { data: rest })
  return apiRequest('serviceGateway', 'updateAuthKey')(params)
}
export const DeleteAuthKey = async ({ regionId, spaceId, ...rest }: IParams) => {
  const params = merge({ regionId, uri: { space_id: spaceId } }, { data: rest })
  return apiRequest('serviceGateway', 'deleteAuthKey')(params)
}
export const BindAuthKey = async ({ regionId, spaceId, auth_key_id, ...rest }: IParams) => {
  const params = merge({ regionId, uri: { space_id: spaceId, auth_key_id } }, { data: rest })
  return apiRequest('serviceGateway', 'bindAuthKey')(params)
}
export const UnbindAuthKey = async ({ regionId, spaceId, auth_key_id, ...rest }: IParams) => {
  const params = merge({ regionId, uri: { space_id: spaceId, auth_key_id } }, { data: rest })
  return apiRequest('serviceGateway', 'unbindAuthKey')(params)
}

export const useMutationAuthKey = () => {
  const { regionId, spaceId } = useParams<IRouteParams>()

  return useMutation(async ({ option, ...rest }: { option: AuthKeyOp; [key: string]: any }) => {
    let ret = null
    const params = {
      ...rest,
      regionId,
      spaceId
    }
    if (option === 'create') {
      ret = await CreateAuthKey(params)
    } else if (option === 'update') {
      ret = await UpdateAuthKey(params)
    } else if (option === 'delete') {
      ret = await DeleteAuthKey(params)
    } else if (option === 'bind') {
      ret = await BindAuthKey(params)
    } else if (option === 'unbind') {
      ret = await UnbindAuthKey(params)
    }
    return ret
  })
}

// api服务列表
export const ListApiServices = async ({ regionId, spaceId, ...rest }: IParams) => {
  const params = merge({ regionId, uri: { space_id: spaceId } }, { data: rest })
  return apiRequest('serviceGateway', 'listApiServices')(params)
}

export const useMutationListApiServices = () => {
  const { regionId, spaceId } = useParams<IRouteParams>()

  return useMutation(async ({ ...rest }: { [key: string]: any }) => {
    let ret = null
    const params = {
      ...rest,
      regionId,
      spaceId
    }
    ret = await ListApiServices(params)
    return ret
  })
}
