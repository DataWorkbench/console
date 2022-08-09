import React, { useState, forwardRef, useEffect } from 'react'
import { TextArea, Input, RadioGroup, RadioButton, Button, Icon } from '@QCFE/lego-ui'
import { trim, filter } from 'lodash-es'
import tw, { css, styled } from 'twin.macro'
import { FlexBox } from 'components/Box'
import { Tooltip } from '../Tooltip'

// eslint-disable react/no-array-index-key
const Root = styled('div')(() => [
  tw`flex-1 min-w-full`,
  css`
    .input {
      ${tw`w-1/2!`}
    }
  `
])

const SignleRoot = styled('div')(() => [
  css`
    & > div {
      ${tw`border-b border-neut-1 dark:border-neut-13`}
    }
  `
])

const InputRow = styled(FlexBox)(({ hasDivision }: { hasDivision?: boolean }) => [
  hasDivision ? tw`space-x-2` : tw`space-x-1`,
  tw`px-3 py-1.5 items-center`,
  css`
    &:hover {
      ${tw`bg-neut-2 dark:bg-[#1E2F41]`}
    }
    .icon svg {
      ${tw`dark:text-white dark:fill-[#fff6]`}
    }
  `
])

interface IKVTextArea {
  title?: string
  className?: string
  kvs?: string[]
  lables: string[]
  value?: string
  placeholder?: string
  placeholders?: string[]
  division?: string
  disabled?: boolean
  type?: 'single' | 'batch'
  reverse?: boolean
  addText?: string
  theme?: 'light' | 'dark'
  min?: number
  onChange?: (v: string) => void
  onBlur?: (v: string) => void
}

type TKV = 'batch' | 'single'

const parseToKV = (v: string, division = ' ') => {
  const defArr = [['', '']]
  const str = v
  if (str === '') {
    return defArr
  }
  const rows = str.split(/[\r\n]/)
  const arr = rows
    .map((row) => {
      if (trim(row) === '') {
        return []
      }
      return row.split(division)
    })
    .filter((n) => n.length > 0)
  return arr.length > 0 ? arr : defArr
}

export const parseFromKv = (arr: string[][], division = ' ') => {
  if (!Array.isArray(arr)) {
    return undefined
  }
  if (arr.length > 0) {
    return arr
      .map((item) => {
        const k = trim(item[0]) || ''
        const v = item[1] || ''
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

export const formatKvStr = (str: string, division = ' ') => {
  const arr: string[] = []
  str.split(/[\r\n]/).forEach((r) => {
    if (trim(r) !== '') {
      const kv = r.split(division)
      if (kv.length > 1) {
        arr.push(`${kv[0]}${division}${kv[1]}`)
      } else {
        arr.push(kv[0])
      }
    }
  })
  return arr.join('\r\n')
}

const KVTextArea1 = forwardRef((props: IKVTextArea, ref) => {
  const {
    title = '参数信息',
    className = '',
    kvs = ['键', '值'],
    value = '',
    placeholder = '',
    lables = ['批量输入', '单条输入'],
    placeholders = ['键', '值'],
    division = ' ',
    theme = 'dark',
    type: typeProp = 'batch',
    addText = '添加参数',
    onBlur,
    onChange,
    min = 0,
    reverse = false,
    disabled = false
  } = props
  const [type, setType] = useState<TKV>(typeProp)
  const [kvArr, setKvArr] = useState(parseToKV(value, division))
  const [kvValue, setKvValue] = useState(formatKvStr(value, division))

  useEffect(() => {
    setKvArr(parseToKV(value, division))
    setKvValue(formatKvStr(value, division))
  }, [value, division])

  const handleTypeChange = (tp: TKV) => {
    setType(tp)
    if (tp === 'single') {
      setKvArr(parseToKV(kvValue, division))
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
        <RadioButton value={reverse ? 'single' : 'batch'}>{lables[0]}</RadioButton>
        <RadioButton value={reverse ? 'batch' : 'single'}>{lables[1]}</RadioButton>
      </RadioGroup>
      {type === 'batch' ? (
        <div>
          {title && (
            <div tw="flex pl-4 h-8  items-center border border-neut-2 bg-neut-1 dark:bg-neut-17 dark:border-none">
              <span>{title}</span>
            </div>
          )}
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
          {(kvArr || []).map((kv, i) => (
            <InputRow
              hasDivision={division !== ''}
              key={
                // eslint-disable-next-line react/no-array-index-key
                i
              }
              className="group"
            >
              <Input
                autoComplete="off"
                disabled={disabled}
                value={kv[0] || ''}
                onChange={(e, v) => handleInputChange('k', String(v), i)}
                onBlur={(e, v) => handleInputBlur(v)}
                placeholder={placeholders[0]}
              />
              <div>{division}</div>
              <Input
                autoComplete="off"
                disabled={disabled}
                value={kv[1] || ''}
                onChange={(e, v) => handleInputChange('v', String(v), i)}
                onBlur={(e, v) => handleInputBlur(v)}
                placeholder={placeholders[1]}
              />

              <div css={[tw`px-2 opacity-0`, i >= min && tw`group-hover:opacity-100`]}>
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
              {addText}
            </Button>
          </FlexBox>
        </SignleRoot>
      )}
    </Root>
  )
})

export default KVTextArea1
