import { request } from 'utils'

interface LoginParams {
  username: string
  password: string
  regionId: string
}
export const Login = ({ username, password, regionId }: LoginParams) =>
  request({
    region: regionId,
    uri: `/v1/sessions`,
    body: {
      user_name: username,
      password,
    },
    method: 'POST',
  })

// export const pingSyncJobConnection = ({
//   regionId,
//   spaceId,
//   jobId,
//   ...rest
// }: LoginParams) =>
//   request({
//     region: regionId,
//     uri: `/v1/workspace/${spaceId}/sync/job/${jobId}/conn`,
//     body: rest,
//     method: 'POST',
//   })

export default Login
