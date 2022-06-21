import { useParams } from 'react-router-dom'
import { useMutation, useQueryClient } from 'react-query'
import { apiRequest } from 'utils/api'
import { merge } from 'lodash-es'
import { useCallback } from 'react'
import { apiHooks, queryKeyObj } from './apiHooks'
import { ListApiGroupsRequestType, ListDataServiceClustersRequestType } from '../types/request'
import {
  DataServiceManageListDataServiceClustersType,
  DataServiceManageListApiGroupsType,
  DataServiceManageDescribeApiConfigType
} from '../types/response'

import { PbmodelApiGroup } from '../types/types'

type Options = 'createApiGroup' | 'createApi'
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
