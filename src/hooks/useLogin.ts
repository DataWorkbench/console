import { useMutation } from 'react-query'
import { Login } from 'stores/api'

interface LoginParams {
  username: string
  password: string
}

export const useMutationLogin = () => {
  return useMutation(async ({ username, password }: LoginParams) =>
    Login({
      username,
      password,
    })
  )
}

export default useMutationLogin
