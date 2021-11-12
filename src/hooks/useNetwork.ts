import { useQuery, useMutation } from 'react-query'
import { useParams } from 'react-router-dom'
import {
  createNetwork,
  listNetworks,
  updateNetwork,
  deleteNetworks,
} from 'stores/api'

interface IRouteParams {
  regionId: string
  spaceId: string
}

let queryKey: any = ''

export const getNetworkKey = () => queryKey

export const useQueryNetworks = (filter: any) => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const params = {
    regionId,
    spaceId,
    limit: 10,
    offset: 0,
    ...filter,
  }
  queryKey = ['network', params]
  return useQuery(queryKey, async () => listNetworks(params), {
    keepPreviousData: true,
  })
}

export const useMutationNetwork = () => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  return useMutation(
    async ({ op, ...rest }: { op: OP; networkIds?: string[] }) => {
      let ret = null
      const params = {
        ...rest,
        regionId,
        spaceId,
      }
      if (op === 'create') {
        ret = await createNetwork(params)
      } else if (op === 'update') {
        ret = await updateNetwork(params)
      } else if (op === 'delete') {
        ret = await deleteNetworks(params)
      }
      return ret
    }
  )
}

export default {}
