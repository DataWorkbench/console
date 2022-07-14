import { Icon, Control, InputPassword } from '@QCFE/lego-ui'
import { css } from 'twin.macro'
import sha256 from 'crypto-js/sha256'

interface Props {
  onChange: (e: string) => void
}
export const PasswordField = ({ onChange }: Props) => {
  const handleChange = (e, value: string) => {
    const hashDigest = sha256(value).toString()
    onChange(hashDigest)
  }
  return (
    <Control className="has-icons-left" tw="mt-[24px]">
      <InputPassword
        name="password"
        showPrefixIcon={<Icon name="key" size={24} />}
        placeholder="密码"
        css={css`
          height: 44px !important;
          width: 100% !important;
          border-radius: 2px !important;
          border: 1px solid #cbd5e1 !important;
          background: #fff !important;
          color: #000 !important;
          caret-color: #000;
          font-size: 14px;
          &.input {
            padding-left: 52px !important;
          }
          ~ .icon.is-left {
            font-size: 18px !important;
            left: 20px !important;
            margin-top: 1px;
          }
        `}
        onChange={handleChange}
      />
      <div tw="text-[#939EA9] text-[12px] mt-[8px]">忘记密码，请联系管理员</div>
    </Control>
  )
}

export default PasswordField
