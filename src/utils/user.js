import { indexOf } from 'lodash'

function getUserZone(i) {
  if (USER) {
    const { zones } = USER
    const filterZones = zones.filter(
      (zone) => indexOf(GLOBAL_CONFIG.zones, zone) > -1
    )
    if (arguments.length === 0) {
      return filterZones
    }
    return i < filterZones.length && filterZones[i]
  }
  return null
}

export { getUserZone }

export default getUserZone
