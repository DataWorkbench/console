import { FlexBox } from 'components/Box'
import { Form, Button } from '@QCFE/lego-ui'
import { useState } from 'react'
import { useMutationLogin } from 'hooks'
import LoginBg from 'assets/LoginBg.png'
import LoginGroup from 'assets/loginGroup.svg'

import { css } from 'twin.macro'
import { InputField, PasswordField } from './components'

const Index = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const mutation = useMutationLogin()
  const onFormSubmit = () => {
    const data = { username, password }
    mutation.mutate(data, {
      onSuccess: () => {
        console.log('in')
      },
    })
  }
  const handleInputChange = (value: string | number) => {
    setUsername(String(value))
  }
  const handlePasswordChange = (value: string) => {
    setPassword(value)
  }

  return (
    <FlexBox tw="h-[100%]">
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
          <Form
            onSubmit={onFormSubmit}
            tw="pl-[40px]! pr-[40px]! min-w-[230px]!"
          >
            <InputField
              onChange={(e: string | number) => handleInputChange(e)}
            />
            <PasswordField onChange={(e: string) => handlePasswordChange(e)} />
            <Button
              tw="h-[44px] w-[100%] mt-[32px] text-[14px]"
              type="primary"
              htmlType="submit"
            >
              登录
            </Button>
          </Form>
        </FlexBox>
      </FlexBox>
    </FlexBox>
  )
}

export default Index
