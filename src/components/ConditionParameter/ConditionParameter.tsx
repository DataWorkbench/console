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
import { isEqual, isNil, pick, values } from 'lodash-es'

import { PopConfirm } from 'components/PopConfirm'
import { FlexBox } from '../Box'
import { Tooltip } from '../Tooltip'
import { HelpCenterLink } from '../Link'

const tuple = <T extends string[]>(...args: T) => args

const symbols = tuple('<=', '>=', '=', '!=', '>', '<')
type SymbolType = typeof symbols[number]

enum ConditionType {
  // Unset = 0,
  Visualization = 1,
  Express = 2,
}

export type TConditionParameterVal = {
  type: ConditionType
  column?: string
  startValue?: string
  endValue?: string
  startCondition?: SymbolType
  endCondition?: SymbolType
  expression?: string
}

interface IConditionParameterProps {
  value?: TConditionParameterVal
  onChange?: (value: TConditionParameterVal) => void
  helpStr?: string
  helpLink?: string
  className?: string
  width?: number
  columns: string[]
  loading?: boolean
  onRefresh?: () => void
}

const SimpleWrapper = styled.div`
  ${tw`bg-neut-16 p-2 w-[376px]`}
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
    value: ConditionType.Visualization,
  },
  {
    label: '表达式',
    value: ConditionType.Express,
  },
]
export const ConditionParameter = React.forwardRef(
  (props: IConditionParameterProps, ref: React.ForwardedRef<any>) => {
    const {
      value: defaultValue,
      onChange,
      helpStr,
      helpLink,
      className,
      width,
      columns,
      loading = false,
      onRefresh,
    } = props

    const [value, setValue] = useImmer(
      defaultValue || { type: ConditionType.Visualization }
    )
    const prevValue = useRef(value)

    useEffect(() => {
      const v = defaultValue || { type: ConditionType.Visualization }
      if (!isEqual(v, prevValue.current)) {
        setValue(() => v)
        prevValue.current = v
      }
    }, [defaultValue, setValue])

    useImperativeHandle(ref, () => ({}))

    useEffect(() => {
      if (value && onChange) {
        // const tempValue =
        //   value?.type === ConditionType.Visualization
        //     ? pick(value, [
        //         'type',
        //         'column',
        //         'startValue',
        //         'endValue',
        //         'startCondition',
        //         'endCondition',
        //       ])
        //     : (pick(value, ['type', 'column', 'expression']) as any)
        prevValue.current = value
        onChange(value)
      }
    }, [onChange, value])

    const handleTypeChange = (v: ConditionType) => {
      setValue({ type: v })
      // setValue((draft) => {
      //   draft.type = v
      //   if (v !== ConditionType.Visualization && draft.column) {
      //     const hasStart = draft.startValue && draft.startCondition
      //     const hasEnd = draft.endValue && draft.endCondition
      //     const start = hasStart
      //       ? `${draft?.startValue ?? ''} ${draft?.startCondition ?? ''} {${
      //           draft?.column
      //         }}`
      //       : ''
      //     const end = hasEnd
      //       ? `${draft?.endValue ?? ''} ${draft?.endCondition ?? ''} {${
      //           draft?.column
      //         }}`
      //       : ''
      //     if (hasEnd || hasStart) {
      //       draft.expression = `${start} ${
      //         hasStart && hasEnd ? ' and ' : ''
      //       } ${end}`
      //     }
      //   }
      // })
    }

    const keys =
      value.type === ConditionType.Visualization
        ? ['endValue', 'startValue', 'startCondition', 'endCondition', 'column']
        : ['expression']
    const hasChange = !!values(pick(value, keys)).find((i) => !isNil(i))
    return (
      <div className={className} tw="flex-auto" style={{ width }}>
        <FlexBox tw="mb-1">
          <RadioGroup
            value={value?.type}
            onChange={hasChange ? undefined : handleTypeChange}
            style={{ marginBottom: 0 }}
          >
            {types.map((item) => {
              if (!hasChange) {
                return (
                  <RadioButton key={item.value} value={item.value}>
                    {item.label}
                  </RadioButton>
                )
              }
              return (
                <PopConfirm
                  content={<div>切换输入模式会清空已输入内容，确认切换？</div>}
                  type="warning"
                  onOk={() => handleTypeChange(item.value)}
                >
                  <RadioButton key={item.value} value={item.value}>
                    {item.label}
                  </RadioButton>
                </PopConfirm>
              )
            })}
          </RadioGroup>
          <div tw="flex flex-auto items-center ml-1">
            {helpStr ? (
              <Tooltip
                twChild={tw`inline-flex`}
                hasPadding
                theme="light"
                content={helpStr}
              >
                <Icon name="information" />
              </Tooltip>
            ) : (
              <div />
            )}
            {helpLink && <HelpCenterLink href={helpLink} />}
          </div>
        </FlexBox>
        {value?.type !== ConditionType.Express && (
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
                tw="w-8 ml-3 p-0 dark:bg-neut-16! flex-none"
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
                  value={value?.startCondition}
                  onChange={(v: SymbolType) => {
                    setValue((draft) => {
                      draft.startCondition = v
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
                  value={value?.endCondition}
                  onChange={(v: SymbolType) => {
                    setValue((draft) => {
                      draft.endCondition = v
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
                {value?.startCondition ?? '关系符号'}] [
                {value?.column ?? '列名'}] [{value?.endCondition ?? '关系符号'}]
                [{value?.endValue || '结束条件'}]
              </div>
            </FlexBox>
          </SimpleWrapper>
        )}
        {value?.type === ConditionType.Express && (
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
