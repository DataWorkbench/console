import { useImmer } from 'use-immer'
import { WithConfig, WithPagination, WithSort } from 'utils/types'
import { useCallback, useEffect, useMemo } from 'react'
import { emitter } from 'utils/index'

interface ITableConfig {
  pagination?: boolean
  sort?: boolean
}

const useFilter = <T extends Object, P extends ITableConfig>(
  defaultFilter: Partial<WithConfig<T, P>>,
  config: ITableConfig = { pagination: true },
  tableLinkKey?: string
) => {
  const [filter, setFilter] = useImmer<WithConfig<T, P>>(() => {
    let v = { ...(defaultFilter ?? {}) }
    if (config.pagination) {
      v = { limit: 10, offset: 0, ...v }
    }
    return v as WithConfig<T, P>
  })

  const handlePageChange = useCallback(
    (page: number) => {
      // @ts-ignore
      setFilter((draft: WithPagination<T>) => {
        draft.offset = (page - 1) * draft.limit
      })
    },
    [setFilter]
  )

  const handleShowSizeChange = useCallback(
    (limit: number) => {
      // @ts-ignore
      setFilter((draft: WithPagination<T>) => {
        draft.limit = limit
        draft.offset = 0
      })
    },
    [setFilter]
  )

  const handleSort = useCallback(
    (sortKey: any, order: string) => {
      // @ts-ignore
      setFilter((draft: WithSort<T>) => {
        draft.sort_by = sortKey
        draft.reverse = order === 'asc'
      })
    },
    [setFilter]
  )
  const pagination = useMemo(() => {
    if (config.pagination) {
      return {
        current:
          Math.floor((filter as any).offset / (filter as any)!.limit) + 1,
        pageSize: (filter as any).limit,
        onPageChange: handlePageChange,
        onShowSizeChange: handleShowSizeChange,
      }
    }
    return {}
  }, [config.pagination, filter, handlePageChange, handleShowSizeChange])

  const sort = useMemo(() => {
    if (config.sort) {
      return handleSort
    }
    return undefined
  }, [config.sort, handleSort])

  useEffect(() => {
    if (tableLinkKey) {
      emitter.emit(`${tableLinkKey}-set`, filter)
    }
  }, [filter, tableLinkKey])

  useEffect(() => {
    emitter.on(`${tableLinkKey}-get`, (d) => {
      setFilter((draft: any) => {
        return { ...draft, ...d }
      })
    })
  }, [tableLinkKey, setFilter])

  return {
    filter,
    setFilter,
    pagination,
    sort,
  }
}

export default useFilter
