import { Icon, Control, Input, Form } from '@QCFE/lego-ui'
import { css } from 'twin.macro'

const { TextGroupField } = Form
interface Props {
  onChange: (e: string | number) => void
}

export const InputField = ({ onChange }: Props) => {
  return (
    <Control
      className="has-icons-left"
      css={css`
        .text-group-field {
          flex-direction: column;
        }
      `}
    >
      <Icon
        className="is-left"
        name="human"
        size={20}
        tw="mt-[10px] left-[20px]!"
      />
      <TextGroupField
        css={css`
          .control {
            width: 100% !important;
          }
        `}
      >
        <Input
          type="text"
          name="username"
          placeholder="用户名"
          tw="h-[44px]! w-[100%]! rounded-[2px]! border border-[#CBD5E1]! bg-[#fff]! text-[#000]! text-[14px]! pl-[52px]!"
          onChange={(e, value) => onChange(value)}
          validateOnBlur
          schemas={[
            {
              rule: { required: true },
              help: '请输入用户名',
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
      </TextGroupField>
    </Control>
  )
}

export default InputField
