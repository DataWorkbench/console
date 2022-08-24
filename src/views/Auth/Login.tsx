import { omit } from 'lodash-es'
import { useCookie } from 'react-use'
import { useHistory } from 'react-router-dom'
import { Button } from '@QCFE/lego-ui'
import { useMutationUser } from '../../hooks/useGlobalAPI'

const Login = ({ onLogin }: { onLogin: (d: Record<string, any>, jump: boolean) => void }) => {
  const { mutateAsync } = useMutationUser()
  const history = useHistory()
  const [, setSk] = useCookie('sk')
  return (
    <div>
      <div>login</div>
      <Button
        onClick={() => {
          mutateAsync({
            op: 'login',
            password: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
            username: 'admin'
          }).then((e) => {
            setSk(e.session_id)
            onLogin(omit(e.user_set, 'password'), true)
            history.push('/overview')
          })
        }}
      >
        login
      </Button>
    </div>
  )
}

export default Login
