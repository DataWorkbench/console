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
    const infos = ret?.infos || []
    const regions: IRegion[] = parseI18n(infos)
    return regions
  })
}
