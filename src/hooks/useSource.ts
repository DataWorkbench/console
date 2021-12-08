import { useQuery, useMutation } from 'react-query'
import { useParams } from 'react-router-dom'
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
      source_type: sourceTypes[kind.name],
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

interface MutationSourceParams {
  op: 'disable' | 'enable' | 'delete' | 'create' | 'update' | 'ping'
  source_type?: number
  sourceIds?: string[]
  sourceId?: string
  url?: any
}

export const useMutationSource = () => {
  const { regionId, spaceId } =
    useParams<{ regionId: string; spaceId: string }>()
  return useMutation(async ({ op, ...rest }: MutationSourceParams) => {
    let ret = null
    const params = {
      ...rest,
      regionId,
      spaceId,
    }
    if (op === 'create') {
      ret = await createDataSource(params)
    } else if (op === 'enable') {
      ret = await enableDataSource(params)
    } else if (op === 'disable') {
      ret = await disableDataSource(params)
    } else if (op === 'delete') {
      ret = await deleteDataSource(params)
    } else if (op === 'update') {
      ret = await updateDataSource(params)
    } else if (op === 'ping') {
      ret = await pingDataSource(params)
    }
    return ret
  })
}
