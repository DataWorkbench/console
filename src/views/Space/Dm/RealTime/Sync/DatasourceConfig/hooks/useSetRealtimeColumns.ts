import { useCallback, useEffect, useRef } from 'react'
import { sourceColumns$ } from 'views/Space/Dm/RealTime/Sync/common/subjects'
import { isEqual } from 'lodash-es'

const schemas: [string, string][] = [
  ['schema', 'STRING'],
  ['table', 'STRING'],
  ['ts', 'LONG'],
  ['opTime', 'STRING'],
  ['type', 'STRING'],
  ['before', 'STRING'],
  ['after', 'STRING']
]

const useSetRealtimeColumns = (id?: string, list: [string, string][] = schemas) => {
  const idRef = useRef(id)
  const listRef = useRef(list)
  const refetch = useCallback(() => {
    const schemasList = list.map((i) => ({
      type: i[1],
      name: i[0],
      is_primary_key: false,
      uuid: `source--${i[0]}`
    }))
    if (id) {
      sourceColumns$.next([...schemasList])
    } else {
      sourceColumns$.next([])
    }
  }, [id, list])

  useEffect(() => {
    if (!isEqual(id, idRef.current) || !isEqual(list, listRef.current)) {
      idRef.current = id
      listRef.current = list
      refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, list])
  return { refetch }
}

export default useSetRealtimeColumns
