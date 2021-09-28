import { useQuery, useMutation } from 'react-query'
import {
  loadSourceKind,
  createDataSource,
  loadDataSource,
  enableDataSource,
  disableDataSource,
  deleteDataSource,
  updateDataSource,
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

interface MutationSourceParams extends IDataSourceParams {
  op: 'disable' | 'enable' | 'delete' | 'create' | 'update'
  sourceIds?: string[]
  sourceId?: string
}

export const useMutationSource = () => {
  return useMutation(async ({ op, ...rest }: MutationSourceParams) => {
    let ret = null
    if (op === 'create') {
      ret = await createDataSource(rest)
    } else if (op === 'enable') {
      ret = await enableDataSource(rest)
    } else if (op === 'disable') {
      ret = await disableDataSource(rest)
    } else if (op === 'delete') {
      ret = await deleteDataSource(rest)
    } else if (op === 'update') {
      ret = await updateDataSource(rest)
    }
    return ret
  })
}
