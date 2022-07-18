import { useParams } from 'react-router-dom'
import { useMutation, useQueryClient } from 'react-query'
import { apiRequest } from 'utils/api'
import { apiHooks, queryKeyObj } from './apiHooks'
import {
  ListAlertLogsRequestType,
  ListAlertPoliciesByJobRequestType,
  ListAlertPoliciesRequestType
} from '../types/request'
import {
  AlertManageListAlertLogsType,
  AlertManageListAlertPoliciesByJobType,
  AlertManageListAlertPoliciesType
} from '../types/response'

export const useMutationAlert = (options?: {}, getQueryKey?: () => string) => {
  const queryClient = useQueryClient()
  const { regionId, spaceId } = useParams<{ regionId: string; spaceId: string }>()
  return useMutation(
    async ({ op, ...rest }: Record<string, any>) => {
      if (['update', 'create', 'delete', 'bound', 'unbound'].includes(op)) {
        let ret
        if (op === 'create') {
          ret = await apiRequest(
            'alertManage',
            'createAlertPolicy'
          )({ ...rest, uri: { space_id: spaceId }, regionId })
        } else if (op === 'update') {
          ret = await apiRequest(
            'alertManage',
            'updateAlertPolicy'
          )({ ...rest, uri: { ...rest.uri, space_id: spaceId }, regionId })
        } else if (op === 'delete') {
          ret = await apiRequest(
            'alertManage',
            'deleteAlertPolicies'
          )({ ...rest, uri: { space_id: spaceId }, regionId })
        } else if (op === 'bound') {
          ret = await apiRequest('alertManage', 'jobBoundAlertPolicies')(rest)
        } else if (op === 'unbound') {
          ret = await apiRequest('alertManage', 'jobUnboundAlertPolicies')(rest)
        }
        return ret
      }
      return undefined
    },
    {
      ...options,
      onSuccess: () => {
        if (getQueryKey) {
          queryClient.invalidateQueries(getQueryKey())
        }
      }
    }
  )
}

export const useQueryListAlertLogs = apiHooks<
  'alertManage',
  ListAlertLogsRequestType,
  AlertManageListAlertLogsType
>('alertManage', 'listAlertLogs')

export const getQueryListAlertLogsKey = () => queryKeyObj.listAlertLogs

export const useQueryListAlertPolicies = apiHooks<
  'alertManage',
  ListAlertPoliciesRequestType,
  AlertManageListAlertPoliciesType
>('alertManage', 'listAlertPolicies')

export const getQueryKeyListAlertPolicies = () => queryKeyObj.listAlertPolicies

export const useQueryListAlertPoliciesByJob = apiHooks<
  'alertManage',
  ListAlertPoliciesByJobRequestType,
  AlertManageListAlertPoliciesByJobType
>('alertManage', 'listAlertPoliciesByJob')

export const getQueryKeyListAlertPoliciesByJob = () => queryKeyObj.listAlertPoliciesByJob
