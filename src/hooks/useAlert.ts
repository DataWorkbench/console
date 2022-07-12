import { useParams } from 'react-router-dom'
import { useMutation, useQueryClient } from 'react-query'
import { apiRequest } from 'utils/api'

// eslint-disable-next-line import/prefer-default-export
export const useMutationAlert = (options?: {}, getQueryKey?: () => string) => {
  const queryClient = useQueryClient()
  const { regionId, spaceId } =
    useParams<{ regionId: string; spaceId: string }>()
  return useMutation(
    async ({ op, ...rest }: Record<string, any>) => {
      if (['update', 'create', 'delete'].includes(op)) {
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
      },
    }
  )
}
