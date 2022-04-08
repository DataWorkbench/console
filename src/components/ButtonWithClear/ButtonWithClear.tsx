import React, { useEffect, useState } from 'react'
import { Form, Icon, Button } from '@QCFE/lego-ui'
import { noop } from 'lodash-es'

interface ButtonWithClearProps {
  name: string
  value?: string
  placeholder?: React.ReactNode
  showClear?: boolean
  children?: React.ReactNode
  onClick?: () => void
  onClear?: () => void
}

export const ButtonWithClear = React.forwardRef(
  (props: ButtonWithClearProps, ref: any) => {
    const {
      name,
      value: val = '',
      placeholder = '请选择',
      showClear = true,
      onClick = noop,
      onClear = noop,
      children,
    } = props
    const [value, setValue] = useState(val)

    useEffect(() => {
      setValue(val)
    }, [val])

    return (
      <div>
        <Button tw="h-7" name={name} ref={ref} type="black" onClick={onClick}>
          {value === '' ? placeholder : children}
        </Button>
        {showClear && (
          <Button
            type="black"
            tw="ml-2 h-7"
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

export const ButtonWithClearField = Form.getFormField(ButtonWithClear)
