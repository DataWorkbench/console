import { request } from 'utils'

const loadRegion = () => request({ action: 'ListLocations' })

export { loadRegion }
export default loadRegion
