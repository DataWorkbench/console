import React, { forwardRef, useCallback, useEffect } from 'react'
import { Control, Form, Select } from '@QCFE/lego-ui'
import { isFunction } from 'lodash-es'
import { useImmer } from 'use-immer'
import { ArrowLine } from 'components'
import { SourceType } from 'views/Space/Upcloud/DataSourceList/constant'
import { datasourceRealtimeTypeObjs, datasourceTypeObjs } from '../Job/JobUtils'

export interface RealTimeSyncTypeVal {
  sourceType: string
  targetType: string
}

export interface RealTimeRadioGroupProps {
  // name: string
  value?: RealTimeSyncTypeVal
  // label?: React.ReactElement
  onChange?: (value: RealTimeSyncTypeVal) => void
}

const sources = [
  ...datasourceRealtimeTypeObjs,
  { type: SourceType.Kafka, name: 'kafka', label: 'Kafka' }
]
const targets = datasourceTypeObjs.filter((i) => i.type !== SourceType.Oracle)

const RealTimeRadioGroup = forwardRef<React.ReactElement, RealTimeRadioGroupProps>(
  ({ value, onChange }, ref) => {
    const [params, setParams] = useImmer(
      value || {
        sourceType: '',
        targetType: ''
      }
    )
    const handleChange = (v: RealTimeSyncTypeVal) => {
      setParams(v)

      if (isFunction(onChange)) {
        onChange(v)
      }
    }

    useEffect(() => {
      if (value) {
        setParams(value)
      }
    }, [value, setParams])

    const geneOpts = useCallback(
      (data) =>
        data.map((v: Record<string, any>) => ({
          label: v.label,
          value: v.type
        })),
      []
    )

    return (
      <Control tw="flex-col w-[556px]! max-w-[556px]!" ref={ref}>
        <div tw="flex items-center space-x-2">
          <Select
            placeholder="请选择来源端数据源类型"
            options={geneOpts(sources)}
            value={params.sourceType}
            tw="flex-1"
            onChange={(v: string) => handleChange({ ...params, sourceType: v })}
          />
          <ArrowLine tw="w-9 flex-none" />
          <Select
            tw="flex-1"
            placeholder="请选择目的端数据源类型"
            options={geneOpts(targets)}
            value={params.targetType}
            onChange={(v: string) => handleChange({ ...params, targetType: v })}
          />
        </div>
      </Control>
    )
  }
)

export default RealTimeRadioGroup

export const RealTimeRadioGroupField: (props: any) => any = (Form as any).getFormField(
  RealTimeRadioGroup
)
