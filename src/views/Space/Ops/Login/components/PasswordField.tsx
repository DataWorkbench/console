import { Icon, Form } from '@QCFE/lego-ui'
import { css } from 'twin.macro'
import sha256 from 'crypto-js/sha256'

const { PasswordField: Password } = Form
interface Props {
  onChange: (e: string) => void
}
export const PasswordField = ({ onChange }: Props) => {
  const handleChange = (value: string) => {
    const hashDigest = sha256(value).toString()
    onChange(hashDigest)
  }
  return (
    <Password
      name="password"
      placeholder="密码"
      help="忘记密码，请联系管理员"
      showPrefixIcon={<Icon name="key" size={24} />}
      onChange={handleChange}
      css={css`
        height: 44px !important;
        width: 100% !important;
        border-radius: 2px !important;
        margin-top: 24px;
        .control {
          width: 100% !important;
          max-width: 420px !important;
        }
        .label {
          width: 0 !important;
          padding-right: 0 !important;
        }
        .help {
          margin-left: 0 !important;
        }
        .input {
          height: 44px;
          font-size: 14px;
          width: 100% !important;
          padding-left: 52px !important;
          background: #fff !important;
          color: #000 !important;
          border: 1px solid #cbd5e1 !important;
        }
        .is-left {
          font-size: 18px !important;
          left: 20px !important;
          margin-top: 1px;
        }
        .icon svg.qicon {
          color: #324558 !important;
        }
      `}
      validateOnBlur
      schemas={[
        {
          rule: { required: true },
          help: '请输入密码',
          status: 'error',
        },
        {
          rule: { minLength: 5 },
          help: '最短为5个字符',
          status: 'error',
        },
        {
          rule: { maxLength: 50 },
          help: '最长为50个字符',
          status: 'error',
        },
      ]}
    />
  )
}

export default PasswordField
