/* eslint-disable no-underscore-dangle */

import { MoreAction } from 'components'
import dayjs from 'dayjs'
import React from 'react'
import { pick } from 'lodash-es'
import { IColumn } from 'hooks/useHooks/useColumns'
import {
  alarmStatus,
  dataReleaseDevModeType,
  dataReleaseScheduleType,
  jobType,
  sourceTypes,
} from '../constants'
import { AlarmStatusCmp, JobTypeCmp } from '../styledComponents'

export const getColumnsRender = (
  filter: Record<string, any>,
  setFilter: (f: (t: Record<string, any>) => void) => void,
  pickByKeys?: string[]
): Record<string, Partial<IColumn>> => {
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
      render: (text: keyof typeof jobType, record: Record<string, any>) => {
        if (record.__level > 1) {
          return null
        }
        return <JobTypeCmp type={text} />
      },
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
      render: (text: keyof typeof sourceTypes, record: Record<string, any>) =>
        record.__level === 1 && sourceTypes[text] ? (
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
      render: (text: keyof typeof sourceTypes, record: Record<string, any>) =>
        record.__level === 1 && sourceTypes[text] ? (
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
      render: (v: number, record: Record<string, any>) =>
        record.__level === 1
          ? dayjs(v * 1000).format('YYYY-MM-DD HH:mm:ss')
          : null,
    },
  }
  return (pickByKeys ? pick(columnsRender, pickByKeys) : columnsRender) as any
}

export const getOperations = (
  handleMenuClick: (selectedData: any, menuKey: string) => void
) => {
  const getActions = (record: Record<string, any>) => {
    console.log(record)
    return [
      {
        icon: '',
        text: '关联实例',
        key: 'link',
      },
      {
        icon: '',
        text: '开发内容',
        key: 'dev',
      },
      {
        icon: '',
        text: '计算集群',
        key: 'cluster',
      },
      {
        icon: '',
        text: '监控告警',
        key: 'alarm',
      },
      {
        icon: '',
        text: '调度信息',
        key: 'schedule',
      },
      {
        icon: '',
        text: '下线',
        key: 'offline',
      },
    ]
  }

  return {
    title: '操作',
    key: 'operation',
    render: (_: never, record: Record<string, any>) => {
      return (
        <MoreAction
          theme="darker"
          items={getActions(record)}
          onMenuClick={handleMenuClick}
        />
      )
    },
  }
}
