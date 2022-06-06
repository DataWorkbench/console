import React, { FC, useEffect } from 'react'
import { Form, Icon, Button } from '@QCFE/lego-ui'
import { noop } from 'lodash-es'

interface ButtonWithClearProps {
  value?: string
  placeholder?: React.ReactNode
  icon?: React.ReactNode
  clearable?: boolean
  children?: React.ReactNode
  onClick?: () => void
  onClear?: () => void
  onChange?: (value: string) => void
  popConfirm?: React.ReactNode
}

export const ButtonWithClear = React.forwardRef(
  (props: ButtonWithClearProps, ref: any) => {
    const {
      value,
      placeholder = '请选择',
      clearable = true,
      onClick = noop,
      onClear = noop,
      icon,
      children,
      onChange = noop,
      popConfirm,
    } = props

    useEffect(() => {
      if (value !== undefined) {
        onChange(value)
      }
    }, [value, onChange])

    let clearButton: React.ReactNode | null = (
      <Button type="black" tw="ml-2 h-8 px-[7px]">
        <Icon name="close" type="light" size={16} />
      </Button>
    )
    if (clearable) {
      if (React.isValidElement(popConfirm)) {
        clearButton = React.cloneElement(popConfirm, {
          ...popConfirm.props,
          children: clearButton,
          onOk: onClear,
        })
      } else {
        clearButton = React.cloneElement(clearButton as React.ReactElement, {
          onClick: onClear,
        })
      }
    } else {
      clearButton = null
    }
    return (
      <div>
        <Button tw="h-7" ref={ref} type="black" onClick={onClick}>
          {icon}
          {!value ? placeholder : children}
        </Button>
        {clearable && clearButton}
      </div>
    )
  }
)

export const ButtonWithClearField: FC<
  ButtonWithClearProps & { label: React.ReactNode; name: string }
> = Form.getFormField(ButtonWithClear)
