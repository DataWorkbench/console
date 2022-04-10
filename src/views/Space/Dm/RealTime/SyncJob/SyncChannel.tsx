import { Control, Field, Form, Input, Label, Radio } from '@QCFE/lego-ui'
import { AffixLabel } from 'components'
import tw, { css, styled } from 'twin.macro'

const { TextField, RadioGroupField } = Form
const Root = styled('div')(() => [
  css`
    form {
      ${tw`pl-0! w-full`}
      .field {
        .label {
          ${tw`w-[162px]!`}
        }

        .help {
          ${tw`w-full ml-[162px]!`}
        }
        input[type='text'] {
          ${tw`w-[120px]!`}
        }
      }
    }
  `,
])

const SyncChannel = () => {
  return (
    <Root>
      <Form>
        <TextField
          name="parallel"
          label={
            <AffixLabel help="xxx" theme="green">
              作业期望最大并行数
            </AffixLabel>
          }
          help="范围：1~300"
        />
        <RadioGroupField
          name="speed"
          value={1}
          label={
            <AffixLabel help="xxx" theme="green">
              同步速率
            </AffixLabel>
          }
        >
          <Radio value={1}>不限流</Radio>
          <Radio value={2}>限流</Radio>
        </RadioGroupField>
        <Field>
          <Label>
            <AffixLabel help="xxx" required={false}>
              错误记录数超过
            </AffixLabel>
          </Label>
          <Control tw="max-w-full! items-center space-x-1">
            <Input type="text" />
            <span>条，或者</span>
            <Input type="text" />
            <span>% 比例，达到任一条件时，任务自动结束</span>
          </Control>
        </Field>
      </Form>
    </Root>
  )
}

export default SyncChannel
