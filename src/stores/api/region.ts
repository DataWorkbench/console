import { request } from 'utils'

const loadRegion = () => request({ action: 'api/region' })
export default loadRegion
export { loadRegion }
