import React, {
  FocusEventHandler,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react'
import { Control, Field, Form } from '@QCFE/lego-ui'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import tw, { css, styled } from 'twin.macro'
import { Tooltip } from 'components/Tooltip'

const { TextField } = Form

interface IElement {
  focus: Function
  blur: Function
}

interface IControlRef {
  getControlRef: () => IElement
}

interface IArrayInputProps {
  value: (string | number)[]
  onChange: (value: (string | number)[]) => void
  name: string
  label?: string
  placeholder?: string
  disabled?: boolean

  [propsName: string]: any
}

const FieldWrapper = styled(Field)(() => [
  css`
    & i.if {
      ${tw`text-base leading-loose`}
    }
  `,
])

export const ArrayInputField = forwardRef<IControlRef, IArrayInputProps>(
  (props, ref) => {
    const {
      name,
      label,
      value = [''],
      onChange,
      onBlur,
      itemProps,
      placeholder,
      disabled,
      ...rest
    } = props

    const [curIptIdx, setCurIptIdx] = useState(-1)
    useImperativeHandle(ref, () => ({
      getControlRef(): IElement {
        return {
          focus: () => {},
          blur: () => {},
        }
      },
    }))

    const handleBlur: FocusEventHandler = useCallback(
      (e) => {
        onBlur?.(e)
      },
      [onBlur]
    )

    const handleChange = useCallback(
      (v: string | number, index: number) => {
        const tempArr = ([] as typeof value).concat(value)
        tempArr.splice(index, 1, v)
        onChange?.(tempArr)
      },
      [onChange, value]
    )

    const handleRemove = useCallback(
      (index: number) => {
        const tempArr = ([] as typeof value).concat(value)

        tempArr.splice(index, 1)
        onChange?.(tempArr)
      },
      [onChange, value]
    )

    const handleAdd = useCallback(
      (index: number) => {
        const tempArr = ([] as typeof value).concat(value)
        tempArr.splice(index + 1, 0, '')
        onChange?.(tempArr)
      },
      [onChange, value]
    )

    return (
      <FieldWrapper name={name} {...rest}>
        <label className="label" htmlFor="###">
          {label}
        </label>
        {value.map((item, index) => (
          <Control
            key={
              // eslint-disable-next-line react/no-array-index-key
              `${name}.${index}`
            }
            {...rest}
            onMouseEnter={() => setCurIptIdx(index)}
            onMouseLeave={() => setCurIptIdx(-1)}
          >
            <div tw="flex gap-3 items-start">
              <TextField
                disabled={disabled}
                name={`${name}.${index}`}
                placeholder={placeholder ?? '请输入'}
                props={itemProps}
                value={item}
                onChange={(e: string | number) => {
                  handleChange(e, index)
                }}
                onBlur={handleBlur}
              />

              <div css={[(curIptIdx !== index || disabled) && tw`invisible`]}>
                <Tooltip
                  hasPadding
                  // tw="leading-[32px]"
                  content="新增"
                  theme="darker"
                >
                  <Icon name="if-add" onClick={() => handleAdd(index)} />
                </Tooltip>
              </div>
              <div css={[(curIptIdx !== index || disabled) && tw`invisible`]}>
                <Tooltip
                  hasPadding
                  // tw="leading-[32px]"
                  content="删除"
                  theme="darker"
                >
                  <Icon name="if-trash" onClick={() => handleRemove(index)} />
                </Tooltip>
              </div>
            </div>
          </Control>
        ))}
      </FieldWrapper>
    )
  }
)

export default (Form as any).getFormField(ArrayInputField)
