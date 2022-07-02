import { get } from 'lodash-es'
import {
  sourceColumns$,
  targetColumns$,
} from 'views/Space/Dm/RealTime/Sync/common/subjects'
import { useQuerySourceTableSchema } from 'hooks'

const useTableColumns = (
  sourceId: string,
  tableName: string,
  type: 'source' | 'target'
) => {
  const { data: re, refetch: refetch1 } = useQuerySourceTableSchema(
    {
      sourceId,
      tableName,
    },
    {
      enabled: !!(sourceId && tableName),
      onSuccess: (data: any) => {
        const columns = get(data, 'schema.columns') || []
        const subject = type === 'source' ? sourceColumns$ : targetColumns$
        subject.next(
          columns.map((i) => ({
            ...i,
            uuid: `${type}--${i.name}`,
          }))
        )
      },
    },
    type
  )

  return {
    data: re,
    refetch: () => {
      if (sourceId && tableName) {
        refetch1()
      }
    },
  }
}

export default useTableColumns
