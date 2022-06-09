import { forwardRef, useImperativeHandle, useLayoutEffect, useRef } from 'react'
import { Control, Field, Form, Input, InputNumber, Label, Radio, RadioGroup } from '@QCFE/lego-ui'
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
          ${tw`w-[140px]!`}
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
  `
])

const styles = {
  form: css`
    &.form.is-horizon-layout {
      .label {
        ${tw`w-[124px]! mr-4`}
      }
      .help {
        ${tw`ml-[140px]! w-full`}
      }
    }
  `
}

interface ChannelControl {
  parallelism?: number | string
  record_num?: number | string
  percentage?: number | string
  bytes?: number | string
  rate?: 2 | 1
}
interface SyncChannelProps {
  channelControl?: ChannelControl
}

const SyncChannel = forwardRef((props: SyncChannelProps, ref) => {
  const { channelControl } = props
  const [channel, setChannel] = useImmer<ChannelControl>(() => {
    if (channelControl) {
      return channelControl
      // return pickBy(channelControl, (v) => v !== -1)
    }
    return { rate: 2 }
  })

  useLayoutEffect(() => {
    if (channelControl) {
      setChannel(channelControl)
      // setChannel(pickBy(channelControl, (v) => v !== -1))
    }
  }, [channelControl, setChannel])

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
    }
  }))

  return (
    <Root>
      <Form ref={formRef} css={styles.form}>
        <NumberField
          name="bytes"
          showButton={false}
          placeholder="请输入并行数"
          label={<AffixLabel>作业期望最大并行数</AffixLabel>}
          validateOnChange
          value={channel.parallelism || ''}
          min={1}
          max={100}
          onChange={(value: number) =>
            setChannel((draft) => {
              draft.parallelism = value
            })
          }
          schemas={[
            {
              help: '请输入并行数',
              status: 'error',
              rule: { required: true }
            }
          ]}
          help="范围：1~100"
        />
        <Field>
          <Label>
            <AffixLabel>同步速率</AffixLabel>
          </Label>
          <Control
            css={[
              tw`items-center space-x-1`,
              css`
                .field {
                  ${tw`mb-0`}
                }
              `
            ]}
          >
            <RadioGroup
              value={channel.rate || 2}
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
                  className={channel.rate === 1 && !channel.bytes ? 'is-danger' : ''}
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
            <AffixLabel required={false}>错误记录数超过</AffixLabel>
          </Label>
          <Control tw="max-w-full! items-center space-x-1">
            <InputNumber
              showButton={false}
              step={1}
              min={-1}
              value={(channel.record_num as number) || undefined}
              onChange={(v) => {
                const num = +v
                if (!isNAN(num)) {
                  setChannel((draft) => {
                    draft.record_num = num
                  })
                }
              }}
              placeholder="请输入条数"
            />
            <span>条，任务自动结束</span>
          </Control>
          <div className="help">
            <span>允许的脏数据条数，（写入一致性语义为 exactly-once 时无效）</span>
          </div>
        </Field>
      </Form>
    </Root>
  )
})

export default SyncChannel
