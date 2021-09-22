import { useQuery } from 'react-query'
import { loadRegion } from 'stores/api'
import { parseI18n } from 'utils'

export interface IRegion {
  id: string
  name: string
}

export const useQueryRegion = () => {
  return useQuery('regions', async () => {
    const ret = await loadRegion()
    if (!ret || ret.ret_code !== 0 || !ret.infos) {
      return []
    }
    const regions: IRegion[] = parseI18n(ret.infos)
    return regions
  })
}
