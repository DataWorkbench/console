import { forwardRef } from 'react'
import { Control, Form, Select, Icon } from '@QCFE/lego-ui'
import tw, { styled } from 'twin.macro'
import { isFunction } from 'lodash-es'

export interface SyncTypeRadioGroupProps {
  name: string
  value?: number
  onChange?: (value: any) => void
}

const SyncItem = styled('div')(({ selected = 1 }: { selected: boolean }) => [
  tw`px-3 py-1.5 border rounded-sm mb-2 cursor-pointer`,
  selected ? tw`border-green-11 bg-green-11 bg-opacity-10` : tw`border-neut-13`,
])

const SyncTypeRadioGroup = forwardRef<SyncTypeRadioGroupProps, any>(
  ({ value = 1, onChange }, ref) => {
    const handleChange = (v: number) => {
      if (isFunction(onChange)) {
        onChange(v)
      }
    }
    return (
      <Control tw="flex-col w-[556px]! max-w-[556px]!" ref={ref}>
        <SyncItem selected={value === 1} onClick={() => handleChange(1)}>
          <div tw="font-medium mb-1">全量同步</div>
          <div tw="text-neut-8 mb-1">
            全量同步的简短说明（文案暂时占位文案暂时占位文案暂时占位）
          </div>
          <div tw="flex py-4 items-center space-x-2">
            <Select placeholder="请选择来源端数据源类型" />
            <div tw="relative">
              <div tw="w-9 border-b border-dashed border-white" />
              <Icon
                name="caret-right"
                type="light"
                tw="absolute -top-2 -right-2"
              />
            </div>
            <Select placeholder="请选择目的端数据源类型" />
          </div>
        </SyncItem>
        <SyncItem selected={value === 2} onClick={() => handleChange(2)}>
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

export const SyncTypeRadioGroupField: (props: SelectTreeProps) => any = (
  Form as any
).getFormField(SyncTypeRadioGroup)
