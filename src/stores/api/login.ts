import request from 'utils/customRequest'

interface LoginParams {
  username: string
  password: string
}
export const Login = ({ username, password }: LoginParams) =>
  request({
    url: `/global_api/v1/sessions`,
    body: {
      user_name: username,
      password,
    },
    method: 'POST',
  })

export default Login
