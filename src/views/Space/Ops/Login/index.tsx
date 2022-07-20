import { FlexBox } from 'components/Box'
import { Form, Button, Notification as Notify } from '@QCFE/qingcloud-portal-ui'
import { useState } from 'react'
import LoginBg from 'assets/LoginBg.png'
import LoginGroup from 'assets/loginGroup.svg'
import { useHistory } from 'react-router-dom'
import { useCookie } from 'react-use'
import { css } from 'twin.macro'
import { omit } from 'lodash-es'
import { useMutationUser } from '../../../../hooks/useGlobalAPI'
import { InputField, PasswordField } from './components'

const Login = ({ onLogin }: { onLogin: (d: Record<string, any>, jump: boolean) => void }) => {
  const history = useHistory()
  const [, setSk] = useCookie('sk')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { mutateAsync } = useMutationUser()
  const onFormSubmit = () => {
    mutateAsync({
      op: 'login',
      password,
      username
    }).then((e) => {
      if (e.session_id) {
        setSk(e.session_id)
        onLogin(omit(e.user_set, 'password'), true)
        Notify.open({
          title: '登录成功',
          placement: 'bottomRight',
          type: 'success'
        })
        setTimeout(() => {
          history.push('/overview')
        }, 2000)
      }
    })
  }
  const handleInputChange = (value: string | number) => {
    setUsername(String(value))
  }
  const handlePasswordChange = (value: string) => {
    setPassword(value)
  }

  return (
    <FlexBox tw="h-screen">
      <FlexBox
        tw="w-[50%] h-[100%]"
        css={css`
          background-image: url(${LoginBg});
          background-size: cover;
          padding: 20px;
        `}
      >
        <img src={LoginGroup} alt="" tw="mx-auto w-8/12 max-w-[400px]" />
      </FlexBox>
      <FlexBox tw="bg-[#f1f5f9] w-[50%] h-[100%] items-center justify-center">
        <FlexBox
          orient="column"
          tw="h-[408px] w-[100%] max-w-[500px] bg-[white] shadow-[0px 4px 30px rgba(126, 137, 149, 0.05)]"
        >
          <div tw="text-[24px] text-[#324558] font-semibold mt-[64px] mb-[32px] ml-auto mr-auto">
            大数据工作台
          </div>
          <Form onSubmit={onFormSubmit} tw="pl-[40px]! pr-[40px]! min-w-[230px]!">
            <InputField onChange={(e: string | number) => handleInputChange(e)} />
            <PasswordField onChange={(e: string) => handlePasswordChange(e)} />
            <Button tw="h-[44px] w-[100%] mt-[32px] text-[14px]" type="primary" htmlType="submit">
              登录
            </Button>
          </Form>
        </FlexBox>
      </FlexBox>
    </FlexBox>
  )
}

export default Login
