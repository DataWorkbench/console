import tw, { css, styled } from 'twin.macro'
import { Select, Button, Form } from '@QCFE/lego-ui'

import { Icon } from '@QCFE/qingcloud-portal-ui'
import {
  ReactElement,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react'

const SelectWithRefreshBox = styled('div')(() => [
  css`
    .qicon {
      ${tw`text-neut-18 fill-current dark:text-white`}
    }
  `,
])
interface ISelectWithRefreshProps {
  onRefresh: () => void
  [propName: string]: any
}
const SelectWithRefreshCmp = forwardRef<
  { getControlRef: () => HTMLSelectElement },
  ISelectWithRefreshProps
>((props, ref) => {
  const { onRefresh, onChange, help, labelClassName, label, ...rest } = props
  const selectRef = useRef()
  const [domId] = useState(Math.random().toString(32))
  const { disabled = false } = props
  useImperativeHandle(ref, () => ({
    getControlRef: () => selectRef?.current!,
  }))
  return (
    <SelectWithRefreshBox>
      <>
        <Select {...rest} id={domId} onChange={onChange} ref={selectRef} />
        <Button
          tw="w-8 ml-3 p-0"
          disabled={disabled}
          onClick={() => onRefresh && onRefresh()}
        >
          <Icon name="refresh" tw="text-xl  text-white" size={20} />
        </Button>
      </>
    </SelectWithRefreshBox>
  )
})

export const SelectWithRefresh: (p: ISelectWithRefreshProps) => ReactElement = (
  Form as any
).getFormField(SelectWithRefreshCmp)

export default SelectWithRefresh
