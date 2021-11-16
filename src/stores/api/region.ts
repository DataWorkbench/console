import { request } from 'utils'

const loadRegion = () => request({ action: 'ListLocations' })
export default loadRegion
export { loadRegion }
