import React, { FC, useEffect } from 'react'
import { noop } from 'lodash-es'
import { Form, RadioGroup } from '@QCFE/lego-ui'

interface ButtonWithClearProps {
  value?: any
  placeholder?: React.ReactNode
  children?: React.ReactNode
  onChange?: (value: string | number) => void
  popConfirm?: React.ReactNode
  showPopConfirm?: boolean
  disabled?: boolean
  [propsName: string]: any
}

export const RadioGroupField = React.forwardRef((props: ButtonWithClearProps) => {
  const {
    value,
    placeholder = '请选择',
    children,
    onChange = noop,
    popConfirm,
    disabled = false,
    showPopConfirm = false
  } = props

  useEffect(() => {
    if (value !== undefined) {
      onChange(value)
    }
  }, [value, onChange])

  let clearButton: React.ReactNode | null

  if (React.isValidElement(popConfirm) && showPopConfirm) {
    if (Array.isArray(children)) {
      // eslint-disable-next-line prefer-const
      clearButton = children.map((item) =>
        React.cloneElement(popConfirm, {
          ...popConfirm.props,
          children: item,
          onOk: () => {
            onChange(item.props.value)
          },
          key: item.props.value,
          disabled,
          placeholder
        })
      )
    }
  } else {
    return (
      <RadioGroup {...props} value={value} onChange={onChange}>
        {children}
      </RadioGroup>
    )
  }
  return <RadioGroup value={value}>{clearButton}</RadioGroup>
})

export const RadioGroupWithProp: FC<
  ButtonWithClearProps & { label: React.ReactNode; name: string }
> = Form.getFormField(RadioGroupField)
