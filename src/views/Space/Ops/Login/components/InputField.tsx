import { Icon, Control, Input } from '@QCFE/lego-ui'

interface Props {
  onChange: (e: string | number) => void
}
export const InputField = ({ onChange }: Props) => {
  return (
    <Control className="has-icons-left">
      <Icon
        className="is-left"
        name="human"
        size={20}
        tw="mt-[3px] left-[20px]!"
      />
      <Input
        name="username"
        placeholder="用户名"
        tw="h-[44px]! w-[100%]! rounded-[2px]! border border-[#CBD5E1]! bg-[#fff]! text-[#000]! text-[14px]! pl-[52px]!"
        onChange={(e, value) => onChange(value)}
      />
    </Control>
  )
}

export default InputField
