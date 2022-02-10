import { ReactElement } from 'react'
import { Form } from '@QCFE/lego-ui'
import { Input, IInputProps } from './Input'

export * from './Input'

export const InputField: (p: IInputProps) => ReactElement = (
  Form as any
).getFormField(Input)
