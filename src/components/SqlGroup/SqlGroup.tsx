import { Button, Form, Icon, TextArea } from '@QCFE/lego-ui'
import { FC } from 'react'
import { useImmer } from 'use-immer'
import { FlexBox } from 'components/Box'

export interface SqlGroupProps {
  name: string
  label?: string
  value?: string[]
  className?: string
  size?: number
  placeholder?: React.ReactNode
}

export const SqlGroup = (props: SqlGroupProps) => {
  const { value: valueProps, placeholder, size = 1 } = props
  const [value, setValue] = useImmer(valueProps || new Array(size).fill(''))
  const statements = value
  return (
    <div tw="space-y-3">
      {statements.map((s, index) => (
        <FlexBox tw="items-center" className="group">
          <TextArea
            placeholder={placeholder}
            value={s}
            rows={2}
            onChange={(e: any, v: string) =>
              setValue((draft) => {
                draft[index] = v
              })
            }
          />
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
        </FlexBox>
      ))}
      <Button
        type="black"
        onClick={() => {
          setValue((draft) => {
            draft.push('')
          })
        }}
      >
        <Icon name="add" type="light" />
        添加
      </Button>
    </div>
  )
}

export const SqlGroupField: FC<SqlGroupProps> = Form.getFormField(SqlGroup)
