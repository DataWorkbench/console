import { useCallback, useEffect } from 'react'
import { sourceColumns$ } from 'views/Space/Dm/RealTime/Sync/common/subjects'

const schemas: [string, string][] = [
  ['schema', 'STRING'],
  ['table', 'STRING'],
  ['ts', 'LONG'],
  ['opTime', 'STRING'],
  ['type', 'STRING'],
  ['before', 'STRING'],
  ['after', 'STRING'],
]

const useSetRealtimeColumns = (
  id?: string,
  list: [string, string][] = schemas
) => {
  const refetch = useCallback(() => {
    const schemasList = list.map((i) => ({
      type: i[1],
      name: i[0],
      is_primary_key: false,
      uuid: `source--${i[0]}`,
    }))
    if (id) {
      sourceColumns$.next([...schemasList])
    } else {
      sourceColumns$.next([])
    }
  }, [id, list])

  useEffect(() => {
    refetch()
  }, [id, refetch])
  return { refetch }
}

export default useSetRealtimeColumns
