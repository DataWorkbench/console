import { useCallback, useEffect } from 'react'
import { sourceColumns$ } from 'views/Space/Dm/RealTime/Sync/common/subjects'

const schemas = [
  ['schema', 'STRING'],
  ['table', 'STRING'],
  ['ts', 'LONG'],
  ['opTime', 'STRING'],
  ['type', 'STRING'],
  ['before', 'STRING'],
  ['after', 'STRING'],
]

const schemasList = schemas.map((i) => ({
  type: i[1],
  name: i[0],
  is_primary_key: false,
  uuid: `source--${i[0]}`,
}))

const useSetRealtimeColumns = (id?: string) => {
  const refetch = useCallback(() => {
    if (id) {
      sourceColumns$.next([...schemasList])
    } else {
      sourceColumns$.next([])
    }
  }, [id])

  useEffect(() => {
    refetch()
  }, [id, refetch])
  return { refetch }
}

export default useSetRealtimeColumns
