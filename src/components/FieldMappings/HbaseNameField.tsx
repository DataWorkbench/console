import { useImmer } from 'use-immer'
import { useEffect } from 'react'
import { FlexBox } from 'components/Box'
import tw, { css } from 'twin.macro'
import { Form, Input } from '@QCFE/qingcloud-portal-ui'

export const HbaseNameInput = (props: {
  value: string
  onChange: (d: string) => void
  validateStatus?: 'success' | 'warning' | 'error' | 'validating' | undefined
}) => {
  const { value: valueProp = ':', onChange, validateStatus } = props
  const [family = '', name = ''] = valueProp.split(':')
  const [value, setValue] = useImmer<{ family: string; name: string }>({
    family,
    name
  })
  useEffect(() => {
    if (valueProp !== `${value.family}:${value.name}`) {
      const [family1 = '', name1 = ''] = valueProp.split(':')
      setValue({ family: family1, name: name1 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue, valueProp])

  useEffect(() => {
    const v = valueProp || ':'
    if (v !== `${value.family}:${value.name}`) {
      onChange(`${value.family}:${value.name}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChange, value])
  return (
    <FlexBox
      tw="items-center"
      css={css`
        input.input {
          ${tw`h-7!`}
        }
      `}
    >
      <Input
        className={validateStatus === 'error' ? 'is-danger' : ''}
        size="small"
        tw="w-[40%]"
        placeholder="列族"
        value={value.family}
        onChange={(e, v) => {
          setValue((draft) => {
            draft.family = v as string
          })
        }}
      />
      <span>:</span>
      <Input
        className={validateStatus === 'error' ? 'is-danger' : ''}
        tw="w-[40%]"
        placeholder="列名"
        size="small"
        value={value?.name}
        onChange={(e, v) => {
          setValue((draft) => {
            draft.name = v as string
          })
        }}
      />
    </FlexBox>
  )
}

export const HbaseNameField = Form.getFormField(HbaseNameInput)
