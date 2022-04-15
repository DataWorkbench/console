import { Button, Form, Icon, TextArea } from '@QCFE/lego-ui'
import { forwardRef, useEffect, useImperativeHandle } from 'react'
import { useImmer } from 'use-immer'
import { FlexBox } from 'components/Box'
import { nanoid } from 'nanoid'

export interface SqlGroupProps {
  name: string
  label?: string
  value?: string[] | Record<'value' | 'key', string>[]
  className?: string
  size?: number
  placeholder?: React.ReactNode
  onChange?: (value: { value: string; key: string }[]) => void
}

const addKey = (items: string[] | Record<'value' | 'key', string>[]) =>
  items.map((v) => {
    if (typeof v === 'string') {
      return { value: v, key: nanoid() }
    }
    if (v.key) {
      return v
    }
    return { ...v, key: nanoid() }
  })

export const SqlGroup = forwardRef((props: SqlGroupProps, ref) => {
  const { value: valueProps, placeholder, size = 1, onChange } = props
  const [value, setValue] = useImmer(
    addKey(valueProps || new Array(size).fill(''))
  )

  useImperativeHandle(ref, () => ({}))

  useEffect((): void => {
    if (onChange) {
      onChange(value)
    }
  }, [value, onChange])

  const statements = value
  return (
    <div tw="space-y-3">
      {statements.map((s, index) => (
        <FlexBox tw="items-center" key={s.key} className="group">
          <TextArea
            placeholder={placeholder}
            value={s.value}
            rows={2}
            onChange={(e: any, v: string) =>
              setValue((draft) => {
                draft[index].value = v
              })
            }
          />
          {index !== 0 && (
            <Icon
              name="trash-fill"
              type="light"
              size={16}
              clickable
              onClick={() => {
                setValue((draft) => {
                  draft.splice(index, 1)
                })
              }}
              tw="mx-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-200"
            />
          )}
        </FlexBox>
      ))}
      <Button
        type="black"
        onClick={() => {
          setValue((draft) => {
            draft.push({ value: '', key: nanoid() })
          })
        }}
      >
        <Icon name="add" type="light" />
        添加
      </Button>
    </div>
  )
})

export const SqlGroupField: any = Form.getFormField(SqlGroup)
