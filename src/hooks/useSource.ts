import { useQuery } from 'react-query'
import { loadSourceKind } from 'stores/api'

export const useQuerySourceKind = (regionId: string, spaceId: string) => {
  const queryKey = 'sourcekind'
  return useQuery(queryKey, async () => {
    const ret = await loadSourceKind({ spaceId, regionId })
    if (ret?.ret_code === 0) {
      return ret.kinds
    }
    return []
  })
}

export default useQuerySourceKind
