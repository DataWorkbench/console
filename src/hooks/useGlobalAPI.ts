import { useMutation, useQuery, useQueryClient } from 'react-query'
import request from 'utils/customRequest'
import { get } from 'lodash-es'

export const useDescribeUser = (userId: string) => {
  const key = ['describeUser', userId]
  return useQuery(
    key,
    async () => {
      const res = await request({
        method: 'GET',
        url: `/global_api/v1/users/${userId}`
      })
      return res
    },
    {}
  )
}

export const useCheckSession = (sessionId: string) => {
  const key = ['checkSession', sessionId]
  return useQuery(
    key,
    async () => {
      const res = await request({
        method: 'GET',
        url: `/global_api/v1/sessions/${sessionId}`
      })
      return res
    },
    {}
  )
}

export const useValidateSession = (sessionId: string, options = {}) => {
  const key = ['validateSession', sessionId]
  return useQuery(
    key,
    async () => {
      const res = await request({
        method: 'GET',
        url: `/global_api/v1/sessions/${sessionId}`
      })
      return res
    },
    options
  )
}

export const useMutationUser = () =>
  useMutation(async ({ op, ...rest }: Record<string, any>) => {
    let ret
    if (op === 'update') {
      ret = await request({
        method: 'PUT',
        url: `/global_api/v1/users/${rest.userId}`,
        params: {
          email: rest.email
        }
      })
    } else if (op === 'login') {
      ret = await request({
        method: 'POST',
        url: `/global_api/v1/sessions`,
        params: {
          ignore_password: false,
          password: rest.password,
          user_name: rest.username
        }
      })
    } else {
      ret = undefined
    }
    return ret
  })

let notifyListKey: any
const getNotifyListKey = () => notifyListKey

export const useListNotifications = (filter: Record<string, any>) => {
  const params = {
    user_id: get(window, 'USER.user_id', ''),
    limit: 10,
    offset: 0,
    ...filter
  }
  const key = ['listNotifications', params]
  notifyListKey = key
  return useQuery(
    key,
    async () => {
      const res = await request({
        method: 'GET',
        url: '/global_api/v1/notification',
        params
      })
      return res
    },
    {}
  )
}

export const useMutationNotification = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async ({ op, ...rest }: Record<string, any>) => {
      let ret
      if (op === 'create') {
        ret = await request({
          method: 'POST',
          url: '/global_api/v1/notification',
          params: {
            ...rest,
            user_id: get(window, 'USER.user_id', '')
          }
        })
      } else if (op === 'update') {
        ret = await request({
          method: 'PUT',
          url: `/global_api/v1/notification/${rest.id}`,
          data: {
            ...rest
          }
        })
      } else if (op === 'POST') {
        ret = await request({
          method: 'DELETE',
          url: `/global_api/v1/notification/deletes`,
          data: {
            nf_ids: rest.nf_ids
          }
        })
      } else {
        ret = undefined
      }
      return ret
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(getNotifyListKey())
      }
    }
  )
}
