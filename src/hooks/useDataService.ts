import { useParams } from 'react-router-dom'
import { useMutation, useQueryClient } from 'react-query'
import { apiRequest } from 'utils/api'
import { merge } from 'lodash-es'
import { useCallback } from 'react'
import { apiHooks, queryKeyObj } from './apiHooks'
import { ListApiGroupsRequestType, ListDataServiceClustersRequestType } from '../types/request'
import {
  DataServiceManageListDataServiceClustersType,
  DataServiceManageListApiGroupsType
} from '../types/response'

import { PbmodelApiGroup } from '../types/types'

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
