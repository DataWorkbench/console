import { PageTab } from '@QCFE/qingcloud-portal-ui'
import { FlexBox } from 'components/Box'
import {
  alarmStatus,
  dataReleaseColumns,
  dataReleaseDevModeType,
  dataReleaseScheduleType,
  dataReleaseTabs,
  jobType,
  sourceTypes,
} from 'views/Space/Ops/DataIntegration/constants'
import { Table } from 'views/Space/styled'
import React, { useMemo } from 'react'
import { TextLink } from 'components/Link'
import {
  AlarmStatusCmp,
  Divider,
  JobTypeCmp,
} from 'views/Space/Ops/DataIntegration/styledComponents'
import { MoreAction } from 'components/MoreAction'
import { useColumns } from 'hooks/useHooks/useColumns'
import { get } from 'lodash-es'
import { styled } from 'twin.macro'
import { useImmer } from 'use-immer'
import dayjs from 'dayjs'
import TableHeader from './TableHeader'
// import { IColumn } from 'hooks/utils'

// interface IDataReleaseProps {}

const TabsWrapper = styled.div`
  & .panel-right .icon svg.qicon {
    fill: hsla(0, 0%, 100%, 0.9);
    color: hsla(0, 0%, 100%, 0.4);
  }
`

const dataReleaseSettingKey = 'DATA_RELEASE_SETTING'
// const columns: IColumn[] = []
const DataRelease = () => {
  const [filter, setFilter] = useImmer<{
    source?: string
    target?: string
    reverse?: 'asc' | 'desc'
    sort_by?: string
    job_type?: any
    alarm_status?: string
    schedule_status?: number
    offset: number
    limit: number
  }>({ offset: 0, limit: 10 })

  const columnsRender = {
    schedule_status: {
      filter: filter.schedule_status,
      onFilter: (v: number) => {
        setFilter((draft) => {
          draft.schedule_status = v
          draft.offset = 0
        })
      },
      filterAble: true,
      filtersNew: Object.values(dataReleaseScheduleType) as any,
    },
    alarm_status: {
      onFilter: (v: string) => {
        setFilter((draft) => {
          draft.alarm_status = v
          draft.offset = 0
        })
      },
      filter: filter.alarm_status,
      filterAble: true,
      filtersNew: Object.values(alarmStatus) as any,
      render: (text: keyof typeof alarmStatus) => (
        <AlarmStatusCmp type={text} />
      ),
    },
    dev_mode: {
      onFilter: (v: string) => {
        setFilter((draft) => {
          draft.job_type = v
          draft.offset = 0
        })
      },
      filter: filter.job_type,
      filterAble: true,
      filtersNew: Object.values(dataReleaseDevModeType) as any,
      render: (text: keyof typeof dataReleaseDevModeType) =>
        dataReleaseDevModeType[text]?.label,
    },
    version_id: {
      render: (text: string) => <span tw="text-neut-8">{text}</span>,
    },
    job_type: {
      onFilter: (v: string) => {
        setFilter((draft) => {
          draft.job_type = v
          draft.offset = 0
        })
      },
      filterAble: true,
      filtersNew: Object.values(jobType) as any,
      render: (text: keyof typeof jobType) => <JobTypeCmp type={text} />,
    },

    source: {
      filter: filter.source,
      onFilter: (v: string) => {
        setFilter((draft) => {
          draft.source = v
          draft.offset = 0
        })
      },
      filterAble: true,
      filtersNew: Object.entries(sourceTypes).map(([value, label]) => ({
        label,
        value,
      })),
      render: (text: keyof typeof sourceTypes) =>
        sourceTypes[text] ? (
          <span tw="h-3 bg-white text-neut-13 px-2 font-medium rounded-[2px] mr-2">
            {sourceTypes[text]}
          </span>
        ) : null,
    },
    target: {
      filter: filter.target,
      onFilter: (v: string) => {
        setFilter((draft) => {
          draft.target = v
          draft.offset = 0
        })
      },
      filterAble: true,
      filtersNew: Object.entries(sourceTypes).map(([value, label]) => ({
        label,
        value,
      })),
      render: (text: keyof typeof sourceTypes) =>
        sourceTypes[text] ? (
          <span tw="h-3 bg-white text-neut-13 px-2 font-medium rounded-[2px] mr-2">
            {sourceTypes[text]}
          </span>
        ) : null,
    },
    created_at: {
      sortable: true,
      sortOrder:
        // eslint-disable-next-line no-nested-ternary
        filter.sort_by === 'created_at'
          ? filter.reverse
            ? 'asc'
            : 'desc'
          : '',
      render: (v: number) => dayjs(v * 1000).format('YYYY-MM-DD HH:mm:ss'),
    },
  }

  const getActions = (record: Record<string, any>) => {
    return []
  }

  const handleMenuClick = () => {
    console.log('handleMenuClick')
  }

  const operations = {
    title: '操作',
    key: 'operation',
    render: (_: never, record: Record<string, any>) => {
      return (
        <FlexBox tw="gap-4">
          <TextLink>Flink UI</TextLink>
          <Divider />
          <MoreAction
            theme="darker"
            items={getActions(record)}
            onMenuClick={handleMenuClick as any}
          />
        </FlexBox>
      )
    },
  }

  const { columns, setColumnSettings } = useColumns(
    dataReleaseSettingKey,
    dataReleaseColumns,
    columnsRender,
    operations
  )

  const columnsSetting = useMemo(
    () => ({
      onSave: setColumnSettings as any,
      storageKey: dataReleaseSettingKey,
    }),
    [setColumnSettings]
  )

  const { data, isFetching } = {}

  const infos = get(data, 'infos', [])

  return (
    <FlexBox orient="column" tw="p-5 h-full">
      <TabsWrapper>
        <PageTab tabs={dataReleaseTabs} />
      </TabsWrapper>
      <FlexBox orient="column" tw="gap-3">
        <TableHeader columnsSetting={columnsSetting} columns={columns} />
        <Table columns={columns} dataSource={infos} loading={!!isFetching} />
      </FlexBox>
    </FlexBox>
  )
}

export default DataRelease
