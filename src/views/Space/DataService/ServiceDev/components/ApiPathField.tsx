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
  showGroupPath?: boolean
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
  `,
  focused && tw`border-green-11`
])

const Wrapper = styled('div')(({ 'data-focused': focused }: { 'data-focused': boolean }) => [
  css`
    ${tw`flex  border-neut-13 border-[1px] overflow-hidden h-[32px] border-solid rounded-sm!`}
    & > div {
    }
    input {
      ${tw`border-0`}
    }
  `,
  focused && tw`border-green-11`
])

export const InputField = forwardRef<IControlRef, IInputProps>((props, ref) => {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef()
  const { groupPath, onBlur, onFocus, className, showGroupPath = true, ...rest } = props

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
      {showGroupPath && <PathInput tw="w-[150px]! mr-2 rounded-sm!">{groupPath}</PathInput>}
      <Wrapper data-focused={focused}>
        <PathInput tw="w-[30px]! h-[30px]!">/</PathInput>
        <LInput {...rest} onBlur={handleBlur} onFocus={handleFocus} ref={ref} />
      </Wrapper>
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
