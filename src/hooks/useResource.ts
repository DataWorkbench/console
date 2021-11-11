import { useQuery, useInfiniteQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { loadResourceList } from 'stores/api'

interface IRouteParams {
  regionId: string
  spaceId: string
  mod?: string
}

let queryKey: any = ''

export const getResourceKey = () => queryKey

export const useQueryResourceList = (
  filter: Record<string, any>,
  options = {},
  isInfinite = false
) => {
  const action: any = !isInfinite ? useQuery : useInfiniteQuery
  const { regionId, spaceId } = useParams<IRouteParams>()
  const params = {
    regionId,
    spaceId,
    ...filter,
  }
  queryKey = ['resource', params]
  return action(queryKey, async () => loadResourceList(params), options)
}
