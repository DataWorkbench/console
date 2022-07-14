import { useMutation } from 'react-query'
import { Login } from 'stores/api'
import { useParams } from 'react-router-dom'

interface IRouteParams {
  regionId: string
}

interface LoginParams {
  username: string
  password: string
}

export const useMutationLogin = () => {
  // const { username, password } = useParams<LoginParams>()
  const { regionId } = useParams<IRouteParams>()
  return useMutation(async ({ username, password }: LoginParams) =>
    Login({
      regionId,
      username,
      password,
    })
  )
}

export default useMutationLogin

// export const useMutationPingSyncJobConnection = () => {
//   const {
//     workFlowStore: { curJob },
//   } = useStore()
//   const { regionId, spaceId } = useParams<IRouteParams>()
//   return useMutation(
//     async (params: { clusterId: string; sourceId: string; targetId: string }) =>
//       pingSyncJobConnection({
//         cluster_id: params.clusterId,
//         source_id: params.sourceId,
//         target_id: params.targetId,
//         regionId,
//         spaceId,
//         jobId: curJob?.id,
//       })
//   )
// }
