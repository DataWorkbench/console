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
  pingDataSource,
} from 'stores/api'
import { get } from 'lodash-es'

export const sourceTypes = {
  MySQL: 1,
  PostgreSQL: 2,
  Kafka: 3,
  S3: 4,
  ClickHouse: 5,
  Hbase: 6,
  Ftp: 7,
  HDFS: 8,
}

type SourceType =
  | 'MySQL'
  | 'PostgreSQL'
  | 'Kafka'
  | 'S3'
  | 'ClickHouse'
  | 'Hbase'
  | 'Ftp'
  | 'HDFS'

export const useQuerySourceKind = (regionId: string, spaceId: string) => {
  const queryKey = 'sourcekind'
  return useQuery(queryKey, async () => {
    const ret = await loadSourceKind({ spaceId, regionId })
    return get(ret, 'kinds', []).map((kind: { name: SourceType }) => ({
      ...kind,
      sourcetype: sourceTypes[kind.name],
    }))
  })
}

let queryKey: any = ''

export const getSourceKey = () => queryKey

export const useQuerySource = (filter: IDataSourceParams) => {
  queryKey = ['sources', filter]
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
    } else if (op === 'ping') {
      ret = await pingDataSource(rest)
    }
    return ret
  })
}
