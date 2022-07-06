import { useParams } from 'react-router-dom'
import { useMutation, useQueryClient } from 'react-query'
import { apiRequest } from 'utils/api'
import { merge } from 'lodash-es'
import { useCallback } from 'react'
import { request } from 'utils'
import { PbmodelApiConfig, PbmodelApiGroup } from 'types/types'
import { apiHooks, queryKeyObj } from './apiHooks'
import {
  ListApiGroupsRequestType,
  ListDataServiceApiVersionsRequestType,
  ListDataSourcesRequestType,
  PingDataSourceConnectionRequestType,
  DescribeDataSourceRequestType,
  DescribeDataSourceTableSchemaRequestType,
  ListDataServiceClustersRequestType,
  ListApiServicesRequestType,
  ListRoutesRequestType
} from '../types/request'
import {
  DataServiceManageListDataServiceClustersType,
  DataServiceManageListApiGroupsType,
  DataServiceManageListDataServiceApiVersionsType,
  DataSourceManageCreateDataSourceType,
  DataServiceManageDescribeServiceDataSourceKindsType,
  DataSourceManageDescribeDataSourceTablesType,
  DataSourceManageDescribeDataSourceTableSchemaType,
  ServiceGatewayListApiServicesType,
  ServiceGatewayListRoutesType
} from '../types/response'

type Options = 'createApiGroup' | 'createApi' | 'updateApi'
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

interface IApiConfigParams {
  regionId: string
  spaceId: string
  groupId: string
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
    { data: { cluster_ids: [clusterId], ...rest } }
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
export const listPublishedApiVersionsByClusterId = async ({
  regionId,
  spaceId,
  clusterId,
  ...rest
}: IParams) => {
  const params = merge(
    { regionId, uri: { space_id: spaceId, cluster_id: clusterId } },
    { data: rest }
  )
  return apiRequest('dataServiceManage', 'listPublishedApiVersionsByClusterId')(params)
}

export const useMutationListPublishedApiVersionsByClusterId = () => {
  const { regionId, spaceId } = useParams<IRouteParams>()

  return useMutation(async ({ ...rest }: { [key: string]: any }) => {
    let ret = null
    const params = {
      ...rest,
      regionId,
      spaceId
    }
    ret = await listPublishedApiVersionsByClusterId(params)
    return ret
  })
}

/**
 *  服务开发
 */

export const getQueryKeyListApiGroups = () => queryKeyObj.listApiGroups

export const useQueryListApiGroups = apiHooks<
  'dataServiceManage',
  ListApiGroupsRequestType,
  DataServiceManageListApiGroupsType
>('dataServiceManage', 'listApiGroups')

export type ListApiGroupInfo = PbmodelApiGroup

export const getListApiConfigs = ({ regionId, spaceId, groupId }: IApiConfigParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/dataservice/config?group_id=${groupId}`
  })

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

  return useMutation(async ({ option, apiId, ...rest }: Record<string, any>) => {
    let ret = null
    const op: Options = option as Options
    const params = {
      ...rest,
      apiId,
      regionId,
      spaceId
    }

    if (op === 'createApiGroup') {
      ret = await CreateApiGroup(params)
    } else if (op === 'createApi') {
      ret = await CreateApiConfig(params)
    } else if (op === 'updateApi') {
      ret = await UpdateApiConfig(params)
    }
    return ret
  })
}

export const useMutationListApiConfigs = () => {
  const { regionId, spaceId } = useParams<IRouteParams>()

  return useMutation(async ({ group_id }: { group_id: string }) => {
    let ret = null
    const paramsData = {
      groupId: group_id,
      regionId,
      spaceId
    }
    ret = await getListApiConfigs(paramsData)
    return ret
  })
}

export const DescribeApiConfig = async ({ regionId, spaceId, apiId, ...rest }: IParams) => {
  const params = merge({ regionId, uri: { space_id: spaceId, api_id: apiId } }, { data: rest })
  return apiRequest('dataServiceManage', 'describeApiConfig')(params)
}

export type DataServiceManageDescribeApiConfig = PbmodelApiConfig
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

//
export const ListDataServiceApiVersions = apiHooks<
  'dataServiceManage',
  ListDataServiceApiVersionsRequestType,
  DataServiceManageListDataServiceApiVersionsType
>('dataServiceManage', 'listDataServiceApiVersions')

// 删除api
export const DeleteApiConfigs = async ({ regionId, spaceId, apiIds, ...rest }: IParams) => {
  const params = merge(
    { regionId, uri: { space_id: spaceId } },
    { data: { ...rest, api_ids: apiIds } }
  )
  return apiRequest('dataServiceManage', 'deleteApiConfigs')(params)
}
// 删除服务组
export const DeleteApiGroups = async ({ regionId, spaceId, groupIds, ...rest }: IParams) => {
  const params = merge(
    { regionId, uri: { space_id: spaceId } },
    { data: { ...rest, group_ids: groupIds } }
  )
  return apiRequest('dataServiceManage', 'deleteApiGroups')(params)
}

export const useMutationDeleteApiConfigs = () => {
  const { regionId, spaceId } = useParams<IRouteParams>()

  /**
   * @param {Record<string, any> & {op:"deleteApi" | "deleteApiGroups" }} params
   */
  return useMutation(async ({ apiIds, op, ...rest }: Record<string, any>) => {
    let ret = null
    const params = {
      apiIds,
      regionId,
      spaceId,
      ...rest
    }

    if (op === 'deleteApi') {
      ret = await DeleteApiConfigs(params)
    } else {
      ret = await DeleteApiGroups(params)
    }
    return ret
  })
}

export const useQueryListDataSources = apiHooks<
  'dataSourceManage',
  ListDataSourcesRequestType,
  DataSourceManageCreateDataSourceType
>('dataSourceManage', 'listDataSources')

export const useQueryDescribeDataSourceTables = apiHooks<
  'dataSourceManage',
  DescribeDataSourceRequestType,
  DataSourceManageDescribeDataSourceTablesType
>('dataSourceManage', 'describeDataSourceTables')

// 更具数据库和表查字段
export const useQueryDescribeDataSourceTableSchema = apiHooks<
  'dataSourceManage',
  DescribeDataSourceTableSchemaRequestType,
  DataSourceManageDescribeDataSourceTableSchemaType
>('dataSourceManage', 'describeDataSourceTableSchema')

// 数据源类型

export const useQueryDescribeServiceDataSourceKinds = apiHooks<
  'dataServiceManage',
  PingDataSourceConnectionRequestType,
  DataServiceManageDescribeServiceDataSourceKindsType
>('dataServiceManage', 'describeServiceDataSourceKinds')

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
