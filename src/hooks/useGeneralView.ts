import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { getGeneraView } from 'stores/api'

interface IRouteParams {
  regionId: string
  spaceId: string
}
// export const useQuerySyncJobConf = () => {
//   const { regionId, spaceId } = useParams<IRouteParams>()
//   const {
//     workFlowStore: { curJob },
//   } = useStore()
//   const key = [
//     'JobConf',
//     {
//       regionId,
//       spaceId,
//       jobId: curJob?.id,
//     },
//   ]
//   return useQuery(key, async () =>
//     getSyncJobConf({
//       regionId,
//       spaceId,
//       jobId: curJob?.id,
//     })
//   )
// }

export const useQueryGeneraView = () => {
  const { regionId, spaceId } = useParams<IRouteParams>()
  const key = [
    'GENERA_VIEW',
    {
      regionId,
      spaceId
    }
  ]
  return useQuery(key, async () =>
    getGeneraView({
      regionId,
      spaceId
    })
  )
}

export default useQueryGeneraView
