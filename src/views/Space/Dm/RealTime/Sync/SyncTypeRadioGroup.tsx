import React, { forwardRef, useCallback, useEffect } from 'react'
import { Control, Form, Select } from '@QCFE/lego-ui'
import tw, { styled } from 'twin.macro'
import { isFunction } from 'lodash-es'
import { useImmer } from 'use-immer'
import { ArrowLine, HelpCenterLink } from 'components'
import { SourceType } from 'views/Space/Upcloud/DataSourceList/constant'
import { datasourceTypeObjs } from '../Job/JobUtils'

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

/**
 * 二、全量、增量同步
 * 1、 全量同步
 *
 * 支持 source： MySQL、Oracle、SqlServer、PostgreSQL、DB2、SAP HANA、ClickHouse、HBase、HDFS、FTP、MongoDB、ElasticSearch
 *
 * 支持 sink：MySQL、TiDB、Oracle、SqlServer、PostgreSQL、DB2、SAP HANA、ClickHouse、Hive、HBase、HDFS、FTP、MongoDB、Redis、ElasticSearch
 *
 * 2、增量同步
 *
 * 支持 source： MySQL、Oracle、SqlServer、PostgreSQL、DB2、SAP HANA、ClickHouse、MongoDB
 *
 * 支持 sink：MySQL、TiDB、Oracle、SqlServer、PostgreSQL、DB2、SAP HANA、ClickHouse、Hive、HBase、HDFS、FTP、MongoDB、Redis、ElasticSearch
 */
const sources = datasourceTypeObjs
const filterfullSources: SourceType[] = [
  SourceType.Mysql,
  SourceType.Oracle,
  SourceType.SqlServer,
  SourceType.PostgreSQL,
  SourceType.DB2,
  SourceType.SapHana,
  SourceType.ClickHouse,
  SourceType.HBase,
  SourceType.HDFS,
  SourceType.Ftp,
  SourceType.MongoDB,
  SourceType.ElasticSearch,
]
const filterFullTargets: SourceType[] = [
  SourceType.Mysql,
  SourceType.TiDB,
  SourceType.Oracle,
  SourceType.SqlServer,
  SourceType.PostgreSQL,
  SourceType.DB2,
  SourceType.SapHana,
  SourceType.ClickHouse,
  SourceType.Hive,
  SourceType.HBase,
  SourceType.HDFS,
  SourceType.Ftp,
  SourceType.MongoDB,
  SourceType.Redis,
  SourceType.ElasticSearch,
  SourceType.Kafka,
]

const filterIncrSources: SourceType[] = [
  SourceType.Mysql,
  SourceType.Oracle,
  SourceType.SqlServer,
  SourceType.PostgreSQL,
  SourceType.DB2,
  SourceType.SapHana,
  SourceType.ClickHouse,
  SourceType.MongoDB,
]

const filterIncrTargets: SourceType[] = [
  SourceType.Mysql,
  SourceType.TiDB,
  SourceType.Oracle,
  SourceType.SqlServer,
  SourceType.PostgreSQL,
  SourceType.DB2,
  SourceType.SapHana,
  SourceType.ClickHouse,
  SourceType.Hive,
  SourceType.HBase,
  SourceType.HDFS,
  SourceType.Ftp,
  SourceType.MongoDB,
  SourceType.Redis,
  SourceType.ElasticSearch,
]
const fullSources = sources.filter((s) => filterfullSources.includes(s.type))
const fullTargets = sources.filter((s) => filterFullTargets.includes(s.type))
const incrSources = sources.filter((s) => filterIncrSources.includes(s.type))
const incrTargets = sources.filter((s) => filterIncrTargets.includes(s.type))

const SyncTypeRadioGroup = forwardRef<
  React.ReactElement,
  SyncTypeRadioGroupProps
>(
  (
    {
      value,
      fullSourceData = fullSources,
      fullSinkData = fullTargets,
      incrSourceData = incrSources,
      incrSinkData = incrTargets,
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
      (data) =>
        data.map((v: Record<string, any>) => ({
          label: v.label,
          value: v.type,
        })),
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
            周期性或一次性将来源数据源中全量数据同步到目标数据源中。
            <HelpCenterLink
              href="/manual/integration_job/sync_type/#全量同步"
              isIframe={false}
            >
              了解更多
            </HelpCenterLink>
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
            增量的基础是全量，先将数据全量同步，再周期性将来源数据源中新增及变化的数据同步到目标数据源中。
            <HelpCenterLink
              href="/manual/integration_job/sync_type/#增量同步"
              isIframe={false}
            >
              了解更多
            </HelpCenterLink>
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

export const SyncTypeRadioGroupField: (props: any) => any = (
  Form as any
).getFormField(SyncTypeRadioGroup)
