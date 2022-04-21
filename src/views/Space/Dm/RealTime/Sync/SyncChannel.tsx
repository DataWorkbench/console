import { forwardRef, useImperativeHandle, useLayoutEffect, useRef } from 'react'
import {
  Control,
  Field,
  Form,
  Input,
  Label,
  Radio,
  RadioGroup,
} from '@QCFE/lego-ui'
import { AffixLabel } from 'components'
import tw, { css, styled } from 'twin.macro'
import { useImmer } from 'use-immer'
import { isNaN as isNAN, isNumber } from 'lodash-es'

const { NumberField } = Form
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
        input[type='text'],
        input[type='number'] {
          ${tw`w-[120px]!`}
        }
      }
    }
  `,
])

interface ChannelControl {
  parallelism?: number
  record_num?: number
  percentage?: number
  bytes?: number
  rate?: 2 | 1
}
interface SyncChannelProps {
  channelControl?: ChannelControl
}

const SyncChannel = forwardRef((props: SyncChannelProps, ref) => {
  const { channelControl } = props
  const [channel, setChannel] = useImmer<ChannelControl>(
    channelControl || { rate: 2 }
  )

  useLayoutEffect(() => {
    if (channelControl) {
      setChannel(channelControl)
    }
  })

  const formRef = useRef<Form>(null)
  useImperativeHandle(ref, () => ({
    getChannel: () => {
      if (formRef.current?.validateForm()) {
        const res = { ...channel }
        if (channel.rate === 1 && !isNumber(channel.bytes)) {
          return null
        }
        return res
      }
      return null
    },
  }))
  return (
    <Root>
      <Form ref={formRef}>
        <NumberField
          name="bytes"
          showButton={false}
          placeholder="请输入并行数"
          label={
            <AffixLabel help="xxx" theme="green">
              作业期望最大并行数
            </AffixLabel>
          }
          validateOnChange
          value={channel.parallelism || ''}
          min={1}
          max={300}
          onChange={(value: number) =>
            setChannel((draft) => {
              draft.parallelism = value
            })
          }
          schemas={[
            {
              help: '请输入并行数',
              status: 'error',
              rule: { required: true },
            },
          ]}
          help="范围：1~300"
        />
        <Field>
          <Label>
            <AffixLabel help="xxx" theme="green">
              同步速率
            </AffixLabel>
          </Label>
          <Control
            css={[
              tw`items-center space-x-1`,
              css`
                .field {
                  ${tw`mb-0`}
                }
              `,
            ]}
          >
            <RadioGroup
              value={channel.rate}
              onChange={(v) => {
                setChannel((draft) => {
                  draft.rate = v
                })
              }}
            >
              <Radio value={2}>不限流</Radio>
              <Radio value={1}>限流</Radio>
            </RadioGroup>
            {channel.rate === 1 && (
              <>
                <Input
                  type="text"
                  className={
                    channel.rate === 1 && !channel.bytes ? 'is-danger' : ''
                  }
                  placeholder="请输入速度"
                  value={channel.bytes || ''}
                  onChange={(e, v) => {
                    const num = +v
                    if (!isNAN(num)) {
                      setChannel((draft) => {
                        draft.bytes = num
                      })
                    }
                  }}
                />
                <span>Byte/s</span>
              </>
            )}
          </Control>
        </Field>
        <Field>
          <Label>
            <AffixLabel help="xxx" required={false}>
              错误记录数超过
            </AffixLabel>
          </Label>
          <Control tw="max-w-full! items-center space-x-1">
            <Input
              type="text"
              value={channel.record_num || ''}
              onChange={(e, v) => {
                const num = +v
                if (!isNAN(num)) {
                  setChannel((draft) => {
                    draft.record_num = num
                  })
                }
              }}
              placeholder="请输入条数"
            />
            <span>条，或者</span>
            <Input
              type="text"
              value={channel.percentage || ''}
              onChange={(e, v) => {
                const num = +v
                if (!isNAN(num)) {
                  setChannel((draft) => {
                    draft.percentage = num
                  })
                }
              }}
              placeholder="请输入比例"
            />
            <span>% 比例，达到任一条件时，任务自动结束</span>
          </Control>
          <div className="help">
            <span>脏数据条数，默认允许脏数据</span>
            <span tw="ml-5">脏数据比例，默认允许脏数据</span>
          </div>
        </Field>
      </Form>
    </Root>
  )
})

export default SyncChannel
