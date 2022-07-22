import React, {
  FocusEventHandler,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
  ReactElement
} from 'react'
import { Control, Input as LInput, InputProps, Form } from '@QCFE/lego-ui'
import tw, { css, styled } from 'twin.macro'
import { compose, connect } from 'utils/functions'
import { PathInput } from '../styled'

export interface IInputProps extends InputProps {
  groupPath?: string
}

interface IElement {
  focus: Function
  blur: Function
}

interface IControlRef {
  getControlRef: () => IElement
}

const InputWrapper = styled(Control)(({ 'data-focused': focused }: { 'data-focused': boolean }) => [
  css`
    &.is-danger {
      ${tw`border-red-10`}
    }
    & {
      ${tw`dark:bg-neut-16! border-0`}
    }
  `,
  focused && tw`border-green-11`,
  tw`dark:bg-neut-13 dark:border-neut-13`
])

export const InputField = forwardRef<IControlRef, IInputProps>((props, ref) => {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef()
  const { groupPath, onBlur, onFocus, className, ...rest } = props

  const handleBlur: FocusEventHandler = useCallback(
    (e) => {
      setFocused(false)
      onBlur?.(e)
    },
    [onBlur]
  )

  const handleFocus: FocusEventHandler = useCallback(
    (e) => {
      setFocused(true)
      onFocus?.(e)
    },
    [onFocus]
  )
  useImperativeHandle(ref, () => ({
    getControlRef(): IElement {
      return inputRef.current!
    }
  }))

  return (
    <InputWrapper className={className} data-focused={focused}>
      <PathInput tw="w-[150px]! mr-2">{groupPath}</PathInput>
      <PathInput>/</PathInput>
      <LInput {...rest} onBlur={handleBlur} onFocus={handleFocus} ref={ref} />
    </InputWrapper>
  )
})

const mapChange = (props: Record<string, any>) => ({
  ...props,
  onChange: (e: Event, v: string | number) => {
    props.onChange?.(v)
  }
})

const ApiPathField: (p: IInputProps & { onChange: (v: string | number) => void }) => ReactElement =
  compose((Form as any).getFormField, connect(mapChange))(InputField)

export default ApiPathField
