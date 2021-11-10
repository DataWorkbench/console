import { useMutation, useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { createUdf, deleteUdf, loadUdfList, updateUdf } from 'stores/api'

interface IRouteParams {
  regionId: string
  spaceId: string
  mod?: string
}

let queryKey: any = ''

export const getUdfKey = () => queryKey

export const useQueryUdfList = (filter: Record<string, any>) => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const { atomKey, ...rest } = filter
  const params = {
    regionId,
    spaceId,
    ...rest,
  }
  queryKey = ['udf', params]
  return useQuery(queryKey, async () => loadUdfList(params), {})
}

export const useMutationUdf = (options?: {}) => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  return useMutation(async ({ op, ...rest }: Record<string, any>) => {
    if (['edit', 'create', 'delete'].includes(op)) {
      let ret
      if (op === 'create') {
        ret = await createUdf({ ...rest, regionId, spaceId })
      } else if (op === 'edit') {
        ret = await updateUdf({ ...rest, regionId, spaceId })
      } else if (op === 'delete') {
        ret = await deleteUdf({ ...rest, regionId, spaceId })
      }
      return ret
    }
    return undefined
  }, options)
}
