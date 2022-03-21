import { forwardRef, useEffect } from 'react'
import { Control, Form, Select, Icon } from '@QCFE/lego-ui'
import tw, { styled } from 'twin.macro'
import { isFunction } from 'lodash-es'
import { useImmer } from 'use-immer'

export interface SyncTypeVal {
  type: 1 | 2
  source: string
  target: string
}

export interface SyncTypeRadioGroupProps {
  name: string
  value?: SyncTypeVal
  label?: React.ReactElement
  sourceData: { label: string; value: string }[]
  targetData: { label: string; value: string }[]
  onChange?: (value: SyncTypeVal) => void
}

const SyncItem = styled('div')(({ selected = true }: { selected: boolean }) => [
  tw`px-3 py-1.5 border rounded-sm mb-2 cursor-pointer`,
  selected ? tw`border-green-11 bg-green-11 bg-opacity-10` : tw`border-neut-13`,
])

const SyncTypeRadioGroup = forwardRef<SyncTypeRadioGroupProps, any>(
  ({ value, sourceData = [], targetData = [], onChange }, ref) => {
    const [params, setParams] = useImmer(
      value || {
        type: 1,
        source: '',
        target: '',
      }
    )
    const handleChange = (
      v: number | string,
      valueType: 'type' | 'source' | 'target'
    ) => {
      if (valueType === 'type' && v === params.type) {
        return
      }
      setParams((draft) => {
        draft[valueType] = v
      })
      if (isFunction(onChange)) {
        onChange({ ...params, [valueType]: v })
      }
    }

    useEffect(() => {
      setParams(value)
    }, [value, setParams])

    console.log('params', params)

    return (
      <Control tw="flex-col w-[556px]! max-w-[556px]!" ref={ref}>
        <SyncItem
          selected={params.type === 1}
          onClick={() => handleChange(1, 'type')}
        >
          <div tw="font-medium mb-1">全量同步</div>
          <div tw="text-neut-8 mb-1">
            全量同步的简短说明（文案暂时占位文案暂时占位文案暂时占位）
          </div>
          <div tw="flex py-4 items-center space-x-2">
            <Select
              placeholder="请选择来源端数据源类型"
              options={sourceData}
              value={params.source}
              onChange={(v) => handleChange(v, 'source')}
            />
            <div tw="relative">
              <div tw="w-9 border-b border-dashed border-white" />
              <Icon
                name="caret-right"
                type="light"
                tw="absolute -top-2 -right-2"
              />
            </div>
            <Select
              placeholder="请选择目的端数据源类型"
              options={targetData}
              value={params.target}
              onChange={(v) => handleChange(v, 'target')}
            />
          </div>
        </SyncItem>
        <SyncItem
          selected={params.type === 2}
          onClick={() => handleChange(2, 'type')}
        >
          <div tw="font-medium mb-1">增量同步</div>
          <div tw="text-neut-8 mb-1">
            增量同步的简短说明（文案暂时占位文案暂时占位文案暂时占位）
          </div>
        </SyncItem>
      </Control>
    )
  }
)

export default SyncTypeRadioGroup

export const SyncTypeRadioGroupField: (props: SyncTypeRadioGroupProps) => any =
  (Form as any).getFormField(SyncTypeRadioGroup)
