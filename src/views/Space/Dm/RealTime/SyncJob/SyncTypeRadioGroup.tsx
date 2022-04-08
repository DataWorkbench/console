import React, { forwardRef, useCallback, useEffect } from 'react'
import { Control, Form, Select } from '@QCFE/lego-ui'
import tw, { styled } from 'twin.macro'
import { isFunction, keys } from 'lodash-es'
import { useImmer } from 'use-immer'
import { ArrowLine } from 'components'
import { dataSourceTypes } from '../JobUtils'

type SyncType = 'full' | 'incr'
type SyncSourceType = 'fullSource' | 'fullSink' | 'incrSource' | 'incrSink'
export interface SyncTypeVal {
  type: SyncType
  fullSource: string
  fullSink: string
  incrSource: string
  incrSink: string
}

export interface SyncTypeRadioGroupProps {
  name: string
  value?: SyncTypeVal
  label?: React.ReactElement
  fullSourceData?: string[]
  fullSinkData?: string[]
  incrSourceData?: string[]
  incrSinkData?: string[]
  onChange?: (value: SyncTypeVal) => void
}

const SyncItem = styled('div')(({ selected = true }: { selected: boolean }) => [
  tw`px-3 py-1.5 border rounded-sm mb-2 cursor-pointer`,
  selected ? tw`border-green-11 bg-green-11 bg-opacity-10` : tw`border-neut-13`,
])

const sources = keys(dataSourceTypes)
const filterfullSources = ['TiDB', 'Hive', 'Redis', 'Kafka']
const filterIncrSources = [
  'TiDB',
  'Hive',
  'HBase',
  'HDFS',
  'FTP',
  'Redis',
  'ElasticSearch',
  'Kafka',
]
const fullSources = sources.filter((s) => !filterfullSources.includes(s))
const incrSources = sources.filter((s) => !filterIncrSources.includes(s))

const SyncTypeRadioGroup = forwardRef<
  React.ReactElement,
  SyncTypeRadioGroupProps
>(
  (
    {
      value,
      fullSourceData = fullSources,
      fullSinkData = sources,
      incrSourceData = incrSources,
      incrSinkData = sources,
      onChange,
    },
    ref
  ) => {
    const [params, setParams] = useImmer(
      value || {
        type: 'full' as SyncType,
        fullSource: '',
        fullSink: '',
        incrSource: '',
        incrSink: '',
      }
    )
    const handleChange = (
      v: SyncType | SyncSourceType,
      valueType: 'type' | SyncSourceType
    ) => {
      if (valueType === 'type' && v === params.type) {
        return
      }
      const val = { ...params }

      if (valueType === 'type') {
        setParams((draft) => {
          draft.type = v as SyncType
        })
        val.type = v as SyncType
      } else {
        setParams((draft) => {
          draft[valueType] = v
        })
        val[valueType] = v
      }

      if (isFunction(onChange)) {
        onChange(val)
      }
    }

    useEffect(() => {
      if (value) {
        setParams(value)
      }
    }, [value, setParams])

    const geneOpts = useCallback(
      (data: string[]) =>
        data.map((v) => ({ label: v, value: dataSourceTypes[v] })),
      []
    )

    return (
      <Control tw="flex-col w-[556px]! max-w-[556px]!" ref={ref}>
        <SyncItem
          selected={params.type === 'full'}
          onClick={() => handleChange('full', 'type')}
        >
          <div tw="font-medium mb-1">全量同步</div>
          <div tw="text-neut-8 mb-1">
            全量同步的简短说明（文案暂时占位文案暂时占位文案暂时占位）
          </div>
          <div
            tw="flex py-4 items-center space-x-2"
            css={params.type !== 'full' && tw`hidden`}
          >
            <Select
              placeholder="请选择来源端数据源类型"
              options={geneOpts(fullSourceData)}
              value={params.fullSource}
              tw="flex-1"
              onChange={(v: SyncSourceType) => handleChange(v, 'fullSource')}
            />
            {/* <div tw="relative">
              <div tw="w-9 border-b border-dashed border-white" />
              <Icon
                name="caret-right"
                type="light"
                tw="absolute -top-2 -right-2"
              />
            </div> */}
            <ArrowLine tw="w-9 flex-none" />
            <Select
              tw="flex-1"
              placeholder="请选择目的端数据源类型"
              options={geneOpts(fullSinkData)}
              value={params.fullSink}
              onChange={(v: SyncSourceType) => handleChange(v, 'fullSink')}
            />
          </div>
        </SyncItem>
        <SyncItem
          selected={params.type === 'incr'}
          onClick={() => handleChange('incr', 'type')}
        >
          <div tw="font-medium mb-1">增量同步</div>
          <div tw="text-neut-8 mb-1">
            增量同步的简短说明（文案暂时占位文案暂时占位文案暂时占位）
          </div>
          <div
            tw="flex py-4 items-center space-x-2"
            css={params.type !== 'incr' && tw`hidden`}
          >
            <Select
              placeholder="请选择来源端数据源类型"
              options={geneOpts(incrSourceData)}
              value={params.incrSource}
              onChange={(v: SyncSourceType) => handleChange(v, 'incrSource')}
            />
            <ArrowLine tw="w-9 flex-none" />
            <Select
              placeholder="请选择目的端数据源类型"
              options={geneOpts(incrSinkData)}
              value={params.incrSink}
              onChange={(v: SyncSourceType) => handleChange(v, 'incrSink')}
            />
          </div>
        </SyncItem>
      </Control>
    )
  }
)

export default SyncTypeRadioGroup

export const SyncTypeRadioGroupField: (props: SyncTypeRadioGroupProps) => any =
  (Form as any).getFormField(SyncTypeRadioGroup)
