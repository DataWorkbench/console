import tw, { css, styled } from 'twin.macro'
import { Select, Button, Form } from '@QCFE/lego-ui'

import { Icon } from '@QCFE/qingcloud-portal-ui'
import { ReactElement, useState, forwardRef, useImperativeHandle, useRef } from 'react'

const SelectWithRefreshBox = styled('div')(() => [
  css`
    .qicon {
      ${tw`text-neut-18 dark:text-white`}
    }
    .is-disabled .select-control {
      ${tw`opacity-100 bg-neut-13! hover:border-neut-13`}
    }
  `
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
    getControlRef: () => selectRef?.current!
  }))
  return (
    <SelectWithRefreshBox className="select-with-refresh h-7!">
      <>
        <Select clearable {...rest} id={domId} onChange={onChange} ref={selectRef} type="small" />
        <Button
          tw="w-8 ml-3 p-0 dark:bg-neut-16!"
          className="refresh-button"
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
