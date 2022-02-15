import React, {
  FocusEventHandler,
  forwardRef,
  ReactNode,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { Control, Input as LInput, InputProps } from '@QCFE/lego-ui'
import tw, { css, styled } from 'twin.macro'

export interface IInputProps extends InputProps {
  prefix?: ReactNode
  suffix?: ReactNode
}

interface IElement {
  focus: Function
  blur: Function
}

interface IControlRef {
  getControlRef: () => IElement
}

const InputWrapper = styled(Control)(
  ({ 'data-focused': focused }: { 'data-focused': boolean }) => [
    css`
      &.is-danger {
        ${tw`border-red-10`}
      }
      ${tw`flex px-3 space-x-1 hover:border-neut-5 border border-neut-3 bg-white focus:border-green-11 dark:bg-neut-16 `},
      & {
        & input.input {
          ${tw`border-none p-0 bg-transparent h-[30px]`}
        }
      }
    `,
    focused && tw`border-green-11`,
  ]
)

export const Input = forwardRef<IControlRef, IInputProps>((props, ref) => {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef()
  const { prefix, suffix, onBlur, onFocus, className, ...rest } = props

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
    },
  }))

  return (
    <InputWrapper className={className} data-focused={focused}>
      {prefix && <span tw="flex items-center flex-none ">{prefix}</span>}
      <LInput {...rest} onBlur={handleBlur} onFocus={handleFocus} ref={ref} />
      {suffix && <span tw="flex items-center flex-none ">{suffix}</span>}
    </InputWrapper>
  )
})

export default Input
