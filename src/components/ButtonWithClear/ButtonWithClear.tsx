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
    } = props

    useEffect(() => {
      if (value !== undefined) {
        onChange(value)
      }
    }, [value, onChange])

    return (
      <div>
        <Button tw="h-8" ref={ref} type="black" onClick={onClick}>
          {icon}
          {!value ? placeholder : children}
        </Button>
        {clearable && (
          <Button
            type="black"
            tw="ml-2 h-8 px-[7px]"
            onClick={() => {
              onClear()
            }}
          >
            <Icon name="close" type="light" size={16} />
          </Button>
        )}
      </div>
    )
  }
)

export const ButtonWithClearField: FC<
  ButtonWithClearProps & { label: React.ReactNode; name: string }
> = Form.getFormField(ButtonWithClear)
