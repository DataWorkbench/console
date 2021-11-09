import { useMutation, useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { createUdf, deleteUdf, loadUdfList, updateUdf } from 'stores/api'

interface IRouteParams {
  regionId: string
  spaceId: string
  mod?: string
}

export const useQueryUdfList = (filter: Record<string, any>) => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const { atomKey, ...rest } = filter
  const params = {
    regionId,
    spaceId,
    ...rest,
  }
  const key = ['udf', params]
  return useQuery(key, async () => loadUdfList(params), {})
}

export const useMutationUdf = (options?: {}) => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  return useMutation(async ({ op, ...rest }: Record<string, any>) => {
    if (['delete', 'create', 'update'].includes(op)) {
      let ret
      if (op === 'create') {
        ret = await createUdf({ ...rest, regionId, spaceId })
      } else if (op === 'update') {
        ret = await updateUdf({ ...rest, regionId, spaceId })
      } else if (op === 'delete') {
        ret = await deleteUdf({ ...rest, regionId, spaceId })
      }
      return ret
    }
    return undefined
  }, options)
}
