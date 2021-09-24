import { useQuery, useMutation } from 'react-query'
import {
  loadSourceKind,
  createDataSource,
  loadDataSource,
  IDataSourceParams,
} from 'stores/api'
import { get } from 'lodash-es'

export const useQuerySourceKind = (regionId: string, spaceId: string) => {
  const queryKey = 'sourcekind'
  return useQuery(queryKey, async () => {
    const ret = await loadSourceKind({ spaceId, regionId })
    return get(ret, 'kinds', [])
  })
}

let queryKey: any = ''

export const getSourceKey = () => queryKey

export const useQuerySource = (filter: IDataSourceParams) => {
  queryKey = ['sources', filter]
  // console.log(filter)
  return useQuery(queryKey, async () => loadDataSource(filter), {
    keepPreviousData: true,
  })
}

export const useMutationSource = () => {
  return useMutation(async (params: IDataSourceParams) => {
    const ret = await createDataSource(params)
    return ret
  })
}
