import { ReactElement } from 'react'
import { Form } from '@QCFE/lego-ui'
import { compose, connect } from 'utils/functions'
import { IInputProps, Input } from './Input'

export * from './Input'
export * from './ArrayInputField'

const mapChange = (props: Record<string, any>) => ({
  ...props,
  onChange: (e: Event, v: string | number) => {
    props.onChange?.(v)
  },
})

export const InputField: (
  p: IInputProps & { onChange: (v: string | number) => void }
) => ReactElement = compose(
  (Form as any).getFormField,
  connect(mapChange)
)(Input)
