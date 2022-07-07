import { useMutation, useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import {
  createDataSource,
  deleteDataSource,
  disableDataSource,
  enableDataSource,
  IDataSourceParams,
  loadDataSource,
  loadSourceKind,
  pingDataSource,
  pingDataSourceList,
  updateDataSource,
  describeDataSourceTables,
  describeDataSourceTableSchema,
  dataSourceManage,
} from 'stores/api'
import { get } from 'lodash-es'
import { getIsFormalEnv } from 'utils/index'

let pingListKey: any
export const getPingHistoriesKey = () => pingListKey

export const useQuerySourceKind = (
  regionId: string,
  spaceId: string,
  op?: string
) => {
  const queryKey = 'sourcekind'
  return useQuery(
    queryKey,
    async () => {
      const ret = await loadSourceKind({ spaceId, regionId })
      return get(ret, 'kinds', [])
    },
    {
      enabled: op === 'create',
    }
  )
}

let queryKey: any = ''

export const getSourceKey = () => queryKey

export const useQuerySource = (filter: IDataSourceParams) => {
  queryKey = ['sources', filter]
  return useQuery(queryKey, async () => loadDataSource(filter), {
    keepPreviousData: true,
    enabled: !getIsFormalEnv(),
  })
}

// XXX: 业务需求：请求中数据和已有记录在同一个列表。使用本地数据和远程数据结合分页实现，业务不合理
export const useQuerySourceHistories = (
  filter: Record<string, any>,
  localList: Record<string, any>[]
) => {
  const { regionId, spaceId } =
    useParams<{ regionId: string; spaceId: string }>()
  pingListKey = ['sourceHistories', localList, filter]
  const { sourceId, offset = 0, limit = 10, ...rest } = filter
  return useQuery(
    pingListKey,
    async () => {
      const tempList = localList.slice(offset, limit + offset)

      if (!sourceId) {
        return { infos: tempList, total: localList.length }
      }
      /**
       *   |-- localList ---| -- remoteList --|
       *   /   limit   /   limit  /   limit  /.
       * offset1    offset2    offset3
       */

      let newOffset: number
      let newLimit: number
      if (tempList.length >= limit) {
        newOffset = 0
        newLimit = 0
      } else if (tempList.length) {
        newOffset = 0
        newLimit = limit - tempList.length
      } else {
        newOffset = offset - localList.length
        newLimit = 10
      }

      const res = await pingDataSourceList({
        offset: newOffset,
        limit: newLimit,
        spaceId,
        regionId,
        sourceId,
        ...rest,
      })
      if (res.ret_code === 0) {
        return {
          ...res,
          infos: [
            ...tempList,
            ...(res.infos || []).map((i: Record<string, any>) => ({
              ...i,
              uuid: Math.random().toString(32).slice(2),
            })),
          ],
          total: res.total + localList.length,
        }
      }
      return {
        infos: tempList,
        total: localList.length,
      }
    },
    {
      keepPreviousData: true,
      // enabled: !!sourceId,
      initialData: { infos: [] },
    }
  )
}

export const useQuerySourceTables = (
  { sourceId }: { sourceId: string },
  options = {}
) => {
  const { regionId, spaceId } = useParams<IUseParams>()
  const params = {
    regionId,
    spaceId,
    sourceId,
  }
  return useQuery(
    ['tables', params],
    async () => describeDataSourceTables(params),
    options
  )
}

export const useQuerySourceTableSchema = (
  { sourceId, tableName }: { sourceId: string; tableName: string },
  options = {},
  type: 'source' | 'target' = 'source'
) => {
  const { regionId, spaceId } = useParams<IUseParams>()
  const params = {
    regionId,
    spaceId,
    sourceId,
    tableName,
  }
  return useQuery(
    [`${type}_tableSchema`, params],
    async () => describeDataSourceTableSchema(params),
    options
  )
}

interface MutationSourceParams {
  op: 'disable' | 'enable' | 'delete' | 'create' | 'update' | 'ping' | 'view'
  source_type?: number
  sourceIds?: string[]
  sourceId?: string
  source_id?: string
  url?: any
  network_id?: string
  stage?: 1 | 2
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

export const useDescribeDataSource = (sourceId: string) => {
  const { regionId, spaceId } =
    useParams<{ regionId: string; spaceId: string }>()
  const params = {
    space_id: spaceId,
    regionId,
    source_id: sourceId,
  }

  const key: any = ['datasourceDetail', params]
  return useQuery(
    key,
    async () => dataSourceManage.describeDataSource(params),
    { enabled: !!sourceId }
  )
}
