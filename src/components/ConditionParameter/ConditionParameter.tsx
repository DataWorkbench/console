import React, {
  ChangeEvent,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'
import {
  Button,
  Form,
  Input,
  RadioButton,
  RadioGroup,
  Select,
  TextArea,
} from '@QCFE/lego-ui'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import { useImmer } from 'use-immer'
import tw, { css, styled } from 'twin.macro'
import { isEqual, pick } from 'lodash-es'

import { FlexBox } from '../Box'
import { Tooltip } from '../Tooltip'
import { HelpCenterLink } from '../Link'

const tuple = <T extends string[]>(...args: T) => args

const symbols = tuple('<=', '>=', '=', '!=', '>', '<')
type SymbolType = typeof symbols[number]

interface IConditionParameterProps {
  value?: {
    type: 'visual' | 'expression'
    startValue?: string
    endValue?: string
    startSymbol?: SymbolType
    endSymbol?: SymbolType
    column?: string
    expression?: string
  }
  onChange?: (value: { type: 'visual' | 'expression'; config: any }) => void
  help?: React.ReactElement
  helpLink?: string
  className?: string
  width?: number
  columns: string[]
  loading?: boolean
  onRefresh?: () => void
}

const SimpleWrapper = styled.div`
  ${tw`bg-neut-16 p-2 max-w-[376px]`}
  ${css`
    & > div {
      ${tw`flex-auto!`}
      & > span {
        ${tw`text-white w-20 flex-none`}
      }

      &:not(:last-child) {
        ${tw`mb-3`}
      }
    }

    & > div > div {
      ${tw`flex-auto!`}
      & > .select {
        ${tw`w-[100px]`}
      }

      & > .input {
        ${tw`flex-auto! w-auto!`}
      }
    }
  `}
`

const types = [
  {
    label: '可视化',
    value: 'visual',
  },
  {
    label: '表达式',
    value: 'expression',
  },
]
export const ConditionParameter = React.forwardRef(
  (props: IConditionParameterProps, ref: React.ForwardedRef<any>) => {
    const {
      value: defaultValue = { type: 'visual' },
      onChange,
      help,
      helpLink,
      className,
      width,
      columns,
      loading = false,
      onRefresh,
    } = props

    const [value, setValue] = useImmer(defaultValue || { type: 'visual' })
    const prevValue = useRef(value)

    useEffect(() => {
      const v = defaultValue || { type: 'visual' }
      if (!isEqual(v, prevValue.current)) {
        setValue(() => v)
        prevValue.current = v
      }
    }, [defaultValue, setValue])

    useImperativeHandle(ref, () => {})

    useEffect(() => {
      if (value && onChange) {
        const tempValue =
          value?.type === 'visual'
            ? pick(value, [
                'type',
                'column',
                'startValue',
                'endValue',
                'startSymbol',
                'endSymbol',
              ])
            : (pick(value, ['type', 'column', 'expression']) as any)
        onChange(tempValue)
        prevValue.current = tempValue
      }
    }, [onChange, value])

    const handleTypeChange = (v: 'visual' | 'expression') => {
      setValue((draft) => {
        draft.type = v
        if (v !== 'visual' && draft.column) {
          const hasStart = draft.startValue && draft.startSymbol
          const hasEnd = draft.endValue && draft.endSymbol
          const start = hasStart
            ? `${draft?.startValue ?? ''} ${draft?.startSymbol ?? ''} {${
                draft?.column
              }}`
            : ''
          const end = hasEnd
            ? `${draft?.endValue ?? ''} ${draft?.endSymbol ?? ''} {${
                draft?.column
              }}`
            : ''
          if (hasEnd || hasStart) {
            draft.expression = `${start} ${
              hasStart && hasEnd ? ' and ' : ''
            } ${end}`
          }
        }
      })
    }

    return (
      <div className={className} tw="flex-auto" style={{ width }}>
        <FlexBox>
          <RadioGroup
            value={value?.type}
            onChange={handleTypeChange}
            style={{ marginBottom: 4 }}
          >
            {types.map((item) => (
              <RadioButton key={item.value} value={item.value}>
                {item.label}
              </RadioButton>
            ))}
          </RadioGroup>
          <div>
            {help ? (
              <Tooltip hasPadding theme="light" content={help}>
                <Icon name="information" />
              </Tooltip>
            ) : (
              <div />
            )}
            {helpLink && <HelpCenterLink href={helpLink} />}
          </div>
        </FlexBox>
        {value?.type !== 'expression' && (
          <SimpleWrapper>
            <FlexBox>
              <span tw="label-required">列名</span>
              <Select
                tw="flex-auto"
                value={value?.column}
                onChange={(v) => {
                  setValue((draft) => {
                    draft.column = v
                  })
                }}
                isLoading={loading}
                options={(columns || []).map((item) => ({
                  label: item,
                  value: item,
                }))}
              />
              <Button
                tw="w-8 ml-3 p-0 dark:bg-neut-16!"
                disabled={loading}
                onClick={() => onRefresh && onRefresh()}
              >
                <Icon
                  name="refresh"
                  tw="text-white"
                  css={css`
                    svg {
                      ${tw`fill-current`}
                    }
                  `}
                  type="light"
                  size={20}
                />
              </Button>
            </FlexBox>
            <FlexBox>
              <span tw="label-required">开始条件</span>
              <FlexBox tw="gap-2">
                <Select
                  placeholder="关系符号"
                  value={value?.startSymbol}
                  onChange={(v: SymbolType) => {
                    setValue((draft) => {
                      draft.startSymbol = v
                    })
                  }}
                  options={symbols.map((item) => ({
                    label: item,
                    value: item,
                  }))}
                />
                <Input
                  placeholder="开始值"
                  value={value?.startValue ?? ''}
                  onChange={(_, v) => {
                    setValue((draft) => {
                      draft.startValue = v as string
                    })
                  }}
                />
              </FlexBox>
            </FlexBox>
            <FlexBox>
              <span tw="label-required">结束条件</span>
              <FlexBox tw="gap-2">
                <Select
                  placeholder="关系符号"
                  value={value?.endSymbol}
                  onChange={(v: SymbolType) => {
                    setValue((draft) => {
                      draft.endSymbol = v
                    })
                  }}
                  options={symbols.map((item) => ({
                    label: item,
                    value: item,
                  }))}
                />
                <Input
                  placeholder="结束值"
                  value={value?.endValue ?? ''}
                  onChange={(_, v) =>
                    setValue((draft) => {
                      draft.endValue = v as string
                    })
                  }
                />
              </FlexBox>
            </FlexBox>
            <FlexBox>
              <span>生成条件参数</span>
              <div tw="text-neut-8">
                [{value?.startValue || '开始条件'}] [
                {value?.startSymbol ?? '关系符号'}] [{value?.column ?? '列名'}]
                [{value?.endSymbol ?? '关系符号'}] [
                {value?.endValue || '结束条件'}]
              </div>
            </FlexBox>
          </SimpleWrapper>
        )}
        {value?.type === 'expression' && (
          <TextArea
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setValue((draft) => {
                draft.expression = e.target.value
              })
            }}
            value={value?.expression ?? ''}
            placeholder="where 过滤语句（不要填写 where 关键字）。注：需填写 SQL 合法 where 子句。例：col1>10 and col1<30"
            tw="w-full! min-h-[96px]!"
          />
        )}
      </div>
    )
  }
)

export const ConditionParameterField = styled(
  (Form as any).getFormField(ConditionParameter)
)`
  & > .label {
    ${tw`items-start! flex-none`}
  }
`
