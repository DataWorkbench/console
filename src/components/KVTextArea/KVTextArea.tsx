import { useState } from 'react'
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
import { nanoid } from 'nanoid'
import { FlexBox } from 'components/Box'

const Root = styled('div')(() => [
  tw`mb-6 flex-1`,
  css`
    .input {
      ${tw`w-1/2!`}
    }
  `,
])

const SignleRoot = styled('div')(() => [
  css`
    & > div {
      ${tw`border-b border-neut-13`}
    }
  `,
])

const InputRow = styled(FlexBox)(() => [
  tw`space-x-1 px-3 py-1.5 items-center`,
  css`
    &:hover {
      ${tw`bg-neut-17`}
    }
  `,
])

interface IKVTextArea {
  title?: string
  className?: string
  kvs?: string[]
  value?: string
  placeholder?: string
  onChange?: (v: string) => void
}

type TKV = 'batch' | 'single'

const parseToKV = (v: string) => {
  const str = trim(v)
  if (str === '') {
    return [
      {
        k: '',
        v: '',
        key: nanoid(),
      },
    ]
  }
  const rows = str.split(/[\r\n]/)
  return rows
    .map((row) => {
      const r = trim(row)
      if (r === '') {
        return null
      }
      const kv = r.split(/\s+/)
      return {
        k: kv[0] || '',
        v: kv[1] || '',
        key: nanoid(),
      }
    })
    .filter((n) => n !== null)
}

const parseFromKv = (arr: ({ k: string; v: string; key: string } | null)[]) => {
  if (!arr) {
    return ''
  }
  return arr
    .map((kv) => {
      const k = trim(kv?.k)
      const v = trim(kv?.v)
      if (k === '' && v === '') {
        return ''
      }
      return `${k} ${v}`
    })
    .filter((s) => s !== '')
    .join('\r\n')
}

const formatKvStr = (str: string) => {
  const arr: string[] = []
  trim(str)
    .split(/[\r\n]/)
    .forEach((row) => {
      const r = trim(row)
      if (r !== '') {
        const kv = r.split(/\s+/)
        if (kv.length > 1) {
          arr.push(`${kv[0]} ${kv[1]}`)
        } else {
          arr.push(kv[0])
        }
      }
    })
  return arr.join('\r\n')
}

const KVTextArea = ({
  title = '参数信息',
  className = '',
  kvs = ['键', '值'],
  value = '',
  placeholder = '',
  onChange,
}: IKVTextArea) => {
  const [type, setType] = useState<TKV>('batch')
  const [kvValue, setKvValue] = useState(formatKvStr(value))
  const [kvArr, setKvArr] = useState(parseToKV(value))
  const [curIptIndex, setCurIptIdx] = useState(-1)

  const handleTypeChange = (tp: TKV) => {
    setType(tp)
    if (tp === 'single') {
      setKvArr(parseToKV(kvValue))
    } else {
      setKvValue(parseFromKv(kvArr))
    }
  }

  const addRow = () => {
    setKvArr([...kvArr, { k: '', v: '', key: nanoid() }])
  }
  const handleTextAreaChange = (v: string) => {
    setKvValue(v)
  }

  const handleTextAreaBlur = (v: string) => {
    const str = formatKvStr(v)
    setKvValue(str)
    if (onChange) {
      onChange(str)
    }
  }

  const handleInputChange = (tp: 'k' | 'v', v: string, i: number) => {
    const arr = [...kvArr]
    const row = arr[i]
    if (row) {
      row[tp] = v
      setKvArr(arr)
      if (onChange) {
        onChange(parseFromKv(arr))
      }
    }
  }

  const handleInputsDel = (i) => {
    const arr = filter(kvArr, (v, index) => i !== index)
    setKvArr(arr)
    if (onChange) {
      onChange(parseFromKv(arr))
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
          <div tw="flex pl-4 h-8  items-center bg-neut-17">
            <span>{title}</span>
          </div>
          <TextArea
            tw="my-3 w-full!"
            resize
            placeholder={placeholder}
            // defaultValue={kvValue}
            value={kvValue}
            onBlur={(e) => handleTextAreaBlur(e.target.value)}
            onChange={(e, v: string) => {
              handleTextAreaChange(v)
            }}
          />
        </div>
      ) : (
        <SignleRoot>
          <FlexBox tw="bg-neut-17 h-8 items-center space-x-1 px-3 py-1.5">
            <span tw="w-1/2">{kvs[0]}</span>
            <span tw="w-1/2">{kvs[1]}</span>
          </FlexBox>
          {kvArr.map((kv, i) => (
            <InputRow
              key={kv?.key}
              onMouseEnter={() => setCurIptIdx(i)}
              onMouseLeave={() => setCurIptIdx(-1)}
            >
              <Input
                defaultValue={kv?.k}
                onChange={(e, v) => handleInputChange('k', String(v), i)}
              />
              <Input
                defaultValue={kv?.v}
                onChange={(e, v) => handleInputChange('v', String(v), i)}
              />
              <div tw="px-2" css={[curIptIndex !== i && tw`invisible`]}>
                <Icon
                  name="trash"
                  clickable
                  type="dark"
                  onClick={() => handleInputsDel(i)}
                />
              </div>
            </InputRow>
          ))}
          <FlexBox tw="h-8 items-center">
            <Button type="text" onClick={() => addRow()}>
              <Icon name="add" type="light" />
              添加参数
            </Button>
          </FlexBox>
        </SignleRoot>
      )}
    </Root>
  )
}

export default KVTextArea
