import { get } from 'lodash-es'
import {
  curJobDbConfSubject$,
  sourceColumns$,
  targetColumns$
} from 'views/Space/Dm/RealTime/Sync/common/subjects'
import { useQuerySourceTableSchema } from 'hooks'
import { useEffect, useMemo } from 'react'
import { SourceType } from 'views/Space/Upcloud/DataSourceList/constant'

/**
 * 实时同步里，来源为关系式数据库，目的为非关系型数据库且非 kafka, 来源字段添加额外 schema 、table、ts、op_time、type，类型 string
 */
const getRealColumns = (type: 'source' | 'target') => {
  if (type === 'target') {
    return []
  }

  const { jobType, sourceType, targetType } = curJobDbConfSubject$.getValue() ?? {}
  if (
    jobType === 3 &&
    [SourceType.Mysql, SourceType.PostgreSQL, SourceType.SqlServer].includes(sourceType) &&
    ![SourceType.Mysql, SourceType.PostgreSQL, SourceType.SqlServer, SourceType.Kafka].includes(
      targetType
    )
  ) {
    return [
      ['schema', 'string'],
      ['table', 'string'],
      ['ts', 'string'],
      ['op_time', 'string'],
      ['type', 'string']
    ].map((i) => ({
      type: i[1],
      name: i[0],
      is_primary_key: false,
      uuid: `source--${i[0]}`
    }))
  }
  return []
}
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
        const arr = getRealColumns()

        const columns = get(data, 'schema.columns') || []
        const subject = type === 'source' ? sourceColumns$ : targetColumns$
        subject.next(
          [...arr, ...columns].map((i) => ({
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
