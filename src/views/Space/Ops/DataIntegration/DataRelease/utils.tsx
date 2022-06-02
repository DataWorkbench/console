/* eslint-disable no-underscore-dangle */

import { MoreAction } from 'components'
import dayjs from 'dayjs'
import React from 'react'
import { get, pick } from 'lodash-es'
import { IColumn } from 'hooks/useHooks/useColumns'
import { JobMode } from 'views/Space/Dm/RealTime/Job/JobUtils'
import {
  StreamReleaseScheduleType,
  streamReleaseScheduleTypes,
} from 'views/Space/Ops/Stream1/common/constants'
import {
  alarmStatus,
  dataReleaseActions,
  DataReleaseActionType,
  dataReleaseDevModeType,
  DataReleaseSchedule,
  dataReleaseScheduleType,
  jobType,
  sourceTypes,
} from '../constants'
import {
  AlarmStatusCmp,
  DataReleaseStatusCmp,
  DbTypeCmp,
  JobTypeCmp,
} from '../../styledComponents'

export const getColumnsRender = (
  filter: Record<string, any>,
  setFilter: (f: (t: Record<string, any>) => void) => void,
  pickByKeys?: string[],
  actions?: Record<string, any>
): Record<string, Partial<IColumn>> => {
  const columnsRender = {
    status: {
      filter: filter.status,
      onFilter: (v: number) => {
        setFilter((draft) => {
          draft.status = v
          draft.offset = 0
        })
      },
      filterAble: true,
      filtersNew: Object.values(dataReleaseScheduleType) as any,
      render: (
        status: keyof typeof dataReleaseScheduleType,
        record: Record<string, any>
      ) => {
        if (record.__level !== 1) {
          return null
        }
        return <DataReleaseStatusCmp type={status} />
      },
    },
    alert_status: {
      onFilter: (v: string) => {
        setFilter((draft) => {
          draft.alarm_status = v
          draft.offset = 0
        })
      },
      filter: filter.alert_status,
      filterAble: true,
      filtersNew: Object.values(alarmStatus) as any,
      render: (text: keyof typeof alarmStatus, record: Record<string, any>) => {
        return (
          <AlarmStatusCmp
            type={text}
            onClick={
              actions?.alert_status
                ? () => actions.alarm_status(record)
                : undefined
            }
          />
        )
      },
    },
    job_mode: {
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
    version: {
      render: (text: string) => <span tw="text-neut-8">{text}</span>,
    },
    type: {
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
        record.__level === 1 ? (
          <DbTypeCmp
            type={get(record, 'sync_job.source_type', '')}
            onClick={() => actions?.source(record)}
          />
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
        record.__level === 1 ? (
          <DbTypeCmp
            type={get(record, 'sync_job.target_type', '')}
            onClick={() => actions?.target(record)}
          />
        ) : null,
    },
    updated: {
      sortable: true,
      sortKey: filter.sort_by,
      sortOrder:
        // eslint-disable-next-line no-nested-ternary
        filter.sort_by === 'updated' ? (filter.reverse ? 'asc' : 'desc') : '',
      render: (v: number, record: Record<string, any>) =>
        record.__level === undefined || record.__level === 1 ? (
          <span tw="text-neut-8">
            {dayjs(v * 1000).format('YYYY-MM-DD HH:mm:ss')}
          </span>
        ) : null,
    },
  }
  return (pickByKeys ? pick(columnsRender, pickByKeys) : columnsRender) as any
}

export const getOperations = (
  handleMenuClick: (selectedData: any, menuKey: DataReleaseActionType) => void,
  type: JobMode,
  isVersion?: boolean
) => {
  const getActions = (record: Record<string, any>) => {
    const emitKey = new Set()
    if (isVersion || record.__level > 1) {
      emitKey.add('suspend')
      emitKey.add('resume')
      emitKey.add('offline')
    }
    if (type === JobMode.DI) {
      emitKey.add('suspend')
      if (
        dataReleaseScheduleType[record.status as 2]?.type ===
        DataReleaseSchedule.DOWNED
      ) {
        emitKey.add('offline')
      } else {
        emitKey.add('online')
      }
    } else if (JobMode.RT === type) {
      if (
        streamReleaseScheduleTypes[record.status as 2]?.type ===
        StreamReleaseScheduleType.SUSPENDED
      ) {
        emitKey.add('suspend')
      } else {
        emitKey.add('resume')
      }
    }

    return dataReleaseActions
      .filter((i) => !emitKey.has(i.key))
      .map((i) => ({ ...i, value: record }))
  }

  return {
    title: '操作',
    key: 'operation',
    width: 64,
    render: (_: never, record: Record<string, any>) => {
      return (
        <MoreAction<DataReleaseActionType>
          theme="darker"
          items={getActions(record)}
          onMenuClick={handleMenuClick}
        />
      )
    },
  }
}
