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

let pingListKey: any
export const getPingHistoriesKey = () => pingListKey

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
  return useQuery(queryKey, async () => loadDataSource(filter), {
    keepPreviousData: true,
  })
}

// XXX: 业务需求：请求中数据和已有记录在同一个列表。使用本地数据和远程数据结合分页实现，业务不合理
export const useQuerySourceHistories = (
  filter: Record<string, any>,
  localList: Record<string, any>[]
) => {
  pingListKey = ['sourceHistories', localList, filter]
  const { sourceId, offset = 0, limit = 10 } = filter
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

      let newOffset = 0
      let newLimit = 10
      if (tempList.length >= limit) {
        newOffset = 0
        newLimit = 0
      } else if (tempList.length) {
        newOffset = offset + tempList.length
        newLimit = limit - tempList.length
      } else {
        newOffset = offset + limit - tempList.length
        newLimit = 10
      }
      // todo: 接口调用
      console.log(22222, newOffset, newLimit)
      const res: any = {
        total: localList.length,
        infos: [
          {
            id: 1,
            name: 'hahaha',
          },
        ],
      }
      return {
        ...res,
        infos: [...tempList, ...res.infos],
        total: res.total + localList.length,
      }
    },
    {
      keepPreviousData: true,
      // enabled: !!sourceId,
      initialData: { infos: [] },
    }
  )
}

interface MutationSourceParams {
  op: 'disable' | 'enable' | 'delete' | 'create' | 'update' | 'ping' | 'view'
  source_type?: number
  sourceIds?: string[]
  sourceId?: string
  url?: any
  networkName?: string
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
