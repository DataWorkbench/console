import React, { useState, forwardRef } from 'react'
import {
  TextArea,
  Input,
  RadioGroup,
  RadioButton,
  Button,
  Icon,
} from '@QCFE/lego-ui'
import { trim, filter } from 'lodash-es'
import tw, { css, styled } from 'twin.macro'
import { FlexBox } from 'components/Box'
import { Tooltip } from '../Tooltip'

const Root = styled('div')(() => [
  tw`flex-1`,
  css`
    .input {
      ${tw`w-1/2!`}
    }
  `,
])

const SignleRoot = styled('div')(() => [
  css`
    & > div {
      ${tw`border-b border-neut-1 dark:border-neut-13`}
    }
  `,
])

const InputRow = styled(FlexBox)(
  ({ hasDivision }: { hasDivision?: boolean }) => [
    hasDivision ? tw`space-x-2` : tw`space-x-1`,
    tw`px-3 py-1.5 items-center`,
    css`
      &:hover {
        ${tw`bg-neut-2 dark:bg-[#1E2F41]`}
      }
      .icon svg {
        ${tw`dark:text-white dark:fill-[#fff6]`}
      }
    `,
  ]
)

const splitReg = /\s*[=:]\s*|\s+/
interface IKVTextArea {
  title?: string
  className?: string
  kvs?: string[]
  value?: string
  placeholder?: string
  division?: string
  disabled?: boolean
  theme?: 'light' | 'dark'
  onChange?: (v: string) => void
  onBlur?: (v: string) => void
}

type TKV = 'batch' | 'single'

const parseToKV = (v: string) => {
  const defArr = [['', '']]
  const str = trim(v)
  if (str === '') {
    return defArr
  }
  const rows = str.split(/[\r\n]/)
  const arr = rows
    .map((row) => {
      const r = trim(row)
      if (r === '') {
        return []
      }
      return r.split(splitReg)
    })
    .filter((n) => n.length > 0)
  return arr.length > 0 ? arr : defArr
}

const parseFromKv = (arr: string[][], division = ' ') => {
  if (arr.length > 0) {
    return arr
      .map((item) => {
        const k = trim(item[0]) || ''
        const v = trim(item[1]) || ''
        if (k === '' && v === '') {
          return ''
        }
        return `${k}${division}${v}`
      })
      .filter((s) => s !== '')
      .join('\r\n')
  }
  return ''
}

const formatKvStr = (str: string, division = ' ') => {
  const arr: string[] = []
  trim(str)
    .split(/[\r\n]/)
    .forEach((row) => {
      const r = trim(row)
      if (r !== '') {
        const kv = r.split(splitReg)
        if (kv.length > 1) {
          arr.push(`${kv[0]}${division}${kv[1]}`)
        } else {
          arr.push(kv[0])
        }
      }
    })
  return arr.join('\r\n')
}

const KVTextArea = forwardRef(
  (
    {
      title = '参数信息',
      className = '',
      kvs = ['键', '值'],
      value = '',
      placeholder = '',
      division = ' ',
      theme = 'dark',
      onBlur,
      onChange,
      disabled = false,
    }: IKVTextArea,
    ref
  ) => {
    const [type, setType] = useState<TKV>('batch')
    const [kvArr, setKvArr] = useState(parseToKV(value))
    const [kvValue, setKvValue] = useState(formatKvStr(value, division))

    const [curIptIndex, setCurIptIdx] = useState(-1)

    const handleTypeChange = (tp: TKV) => {
      setType(tp)
      if (tp === 'single') {
        setKvArr(parseToKV(kvValue))
      } else {
        setKvValue(parseFromKv(kvArr, division))
      }
    }

    const addRow = () => {
      setKvArr([...kvArr, ['', '']])
    }
    const handleTextAreaChange = (v: string) => {
      setKvValue(v)
      if (onChange) {
        onChange(v)
      }
    }

    const handleTextAreaBlur = (v: string) => {
      const str = formatKvStr(v, division)
      setKvValue(str)
      if (onBlur) {
        onBlur(str)
      }
    }

    const handleInputBlur = () => {
      if (onBlur) {
        onBlur(kvArr)
      }
    }

    const handleInputChange = (tp: 'k' | 'v', v: string, i: number) => {
      const arr = [...kvArr]
      const row = arr[i]
      if (row) {
        row[tp === 'k' ? 0 : 1] = v
        setKvArr(arr)
        if (onChange) {
          onChange(parseFromKv(arr, division))
        }
      }
    }

    const handleInputsDel = (i: number) => {
      const arr = filter(kvArr, (v, index) => i !== index)
      setKvArr(arr)
      if (onChange) {
        onChange(parseFromKv(arr, division))
      }
    }

    return (
      <Root className={className}>
        <RadioGroup label="Host别名" value={type} onChange={handleTypeChange}>
          <RadioButton value="batch">批量输入</RadioButton>
          <RadioButton value="single">单条输入</RadioButton>
        </RadioGroup>
        {type === 'batch' ? (
          <div>
            <div tw="flex pl-4 h-8  items-center border border-neut-2 bg-neut-1 dark:bg-neut-17 dark:border-none">
              <span>{title}</span>
            </div>
            <TextArea
              disabled={disabled}
              tw="my-3 w-full!"
              resize
              placeholder={placeholder}
              ref={ref}
              // defaultValue={kvValue}
              value={kvValue}
              onBlur={(e: React.SyntheticEvent) =>
                handleTextAreaBlur((e.target as HTMLTextAreaElement).value)
              }
              onChange={(e: React.SyntheticEvent, v: string) => {
                handleTextAreaChange(v)
              }}
            />
          </div>
        ) : (
          <SignleRoot>
            <FlexBox tw="bg-neut-1 dark:bg-neut-17 h-8 items-center space-x-1 px-3 py-1.5">
              <span tw="w-1/2">{kvs[0]}</span>
              <span tw="w-1/2">{kvs[1]}</span>
            </FlexBox>
            {kvArr.map((kv, i) => (
              <InputRow
                hasDivision={division !== ''}
                key={String(i)}
                onMouseEnter={() => setCurIptIdx(i)}
                onMouseLeave={() => setCurIptIdx(-1)}
              >
                <Input
                  autoComplete="off"
                  disabled={disabled}
                  defaultValue={kv[0] || ''}
                  onChange={(e, v) => handleInputChange('k', String(v), i)}
                  onBlur={(e, v) => handleInputBlur(v)}
                />
                <div>{division}</div>
                <Input
                  autoComplete="off"
                  disabled={disabled}
                  defaultValue={kv[1] || ''}
                  onChange={(e, v) => handleInputChange('v', String(v), i)}
                  onBlur={(e, v) => handleInputBlur(v)}
                />
                <div tw="px-2" css={[curIptIndex !== i && tw`invisible`]}>
                  <Tooltip content="删除" theme="light" hasPadding>
                    <Icon
                      disabled={disabled}
                      name="trash"
                      clickable
                      type="dark"
                      onClick={() => handleInputsDel(i)}
                    />
                  </Tooltip>
                </div>
              </InputRow>
            ))}
            <FlexBox tw="h-8 items-center">
              <Button type="text" onClick={() => addRow()} disabled={disabled}>
                <Icon name="add" type={theme === 'dark' ? 'light' : 'dark'} />
                添加参数
              </Button>
            </FlexBox>
          </SignleRoot>
        )}
      </Root>
    )
  }
)

export default KVTextArea
