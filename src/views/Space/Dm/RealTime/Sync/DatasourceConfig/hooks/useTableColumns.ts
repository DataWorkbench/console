import { get } from 'lodash-es'
import { sourceColumns$, targetColumns$ } from 'views/Space/Dm/RealTime/Sync/common/subjects'
import { useQuerySourceTableSchema } from 'hooks'
import { useEffect, useMemo } from 'react'

const useTableColumns = (sourceId: string, tableName: string, type: 'source' | 'target') => {
  const params = useMemo(() => {
    return { sourceId, tableName }
  }, [sourceId, tableName])
  const {
    data: re,
    isFetching,
    refetch: refetch1
  } = useQuerySourceTableSchema(
    params,
    {
      enabled: !!(sourceId && tableName),
      onSuccess: (data: any) => {
        const columns = get(data, 'schema.columns') || []
        const subject = type === 'source' ? sourceColumns$ : targetColumns$
        subject.next(
          columns.map((i) => ({
            ...i,
            uuid: `${type}--${i.name}`
          }))
        )
      }
    },
    type
  )

  useEffect(() => {
    if (!(sourceId && tableName)) {
      const subject = type === 'source' ? sourceColumns$ : targetColumns$
      subject.next([])
    }
  }, [sourceId, tableName, type])

  return {
    data: re,
    loading: isFetching,
    refetch: () => {
      if (sourceId && tableName) {
        refetch1()
      }
    }
  }
}

export default useTableColumns
