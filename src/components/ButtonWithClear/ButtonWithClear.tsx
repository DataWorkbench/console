import React, { FC, useEffect, useState } from 'react'
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
}

export const ButtonWithClear = React.forwardRef(
  (props: ButtonWithClearProps, ref: any) => {
    const {
      value: val = '',
      placeholder = '请选择',
      clearable = true,
      onClick = noop,
      onClear = noop,
      icon,
      children,
    } = props
    const [value, setValue] = useState(val)

    useEffect(() => {
      setValue(val)
    }, [val])

    return (
      <div>
        <Button tw="h-8" ref={ref} type="black" onClick={onClick}>
          {icon}
          {value === '' ? placeholder : children}
        </Button>
        {clearable && (
          <Button
            type="black"
            tw="ml-2 h-8 px-[7px]"
            onClick={() => {
              setValue('')
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
