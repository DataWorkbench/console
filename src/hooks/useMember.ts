import { omit } from 'lodash-es'
import { useInfiniteQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { getListAvailableUsers, getListNotifications } from 'stores/api/member'

let allUsersKey: any = null

export const useQueryListAvailableUsers = (filter: Record<string, any>) => {
  const rest = omit(filter, 'offset')
  const { regionId, spaceId } = useParams<{ regionId: string; spaceId: string }>()
  const params = {
    regionId,
    spaceId,
    limit: 20,
    offset: 0,
    ...rest
  }
  allUsersKey = ['ListAvailableUsers', params]

  return useInfiniteQuery(
    allUsersKey,
    async ({ pageParam = params }) => getListAvailableUsers(pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.has_more) {
          const nextOffset = allPages.reduce((acc, cur) => acc + cur.infos.length, 0)
          if (nextOffset < lastPage.total) {
            const nextFilter = {
              ...params,
              offset: nextOffset
            }

            return nextFilter
          }
        }
        return undefined
      }
    }
  )
}

export const useQueryListNotifications = (filter: Record<string, any>) => {
  const rest = omit(filter, 'offset')
  const { regionId, spaceId } = useParams<{ regionId: string; spaceId: string }>()
  const params = {
    regionId,
    spaceId,
    limit: 20,
    offset: 0,
    ...rest
  }
  allUsersKey = ['ListAvailableUsers', params]

  return useInfiniteQuery(
    allUsersKey,
    async ({ pageParam = params }) => getListNotifications(pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.has_more) {
          const nextOffset = allPages.reduce((acc, cur) => acc + cur.infos.length, 0)
          if (nextOffset < lastPage.total) {
            const nextFilter = {
              ...params,
              offset: nextOffset
            }

            return nextFilter
          }
        }
        return undefined
      }
    }
  )
}
