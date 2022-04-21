/* eslint-disable no-underscore-dangle */

import { MoreAction } from 'components'
import dayjs from 'dayjs'
import React from 'react'
import { pick } from 'lodash-es'
import { IColumn } from 'hooks/useHooks/useColumns'
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
} from '../styledComponents'

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
      render: (status: keyof typeof dataReleaseScheduleType) => {
        console.log(1111, status)
        return <DataReleaseStatusCmp type={status} />
      },
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
      render: (text: keyof typeof alarmStatus, record: Record<string, any>) => (
        <AlarmStatusCmp
          type={text}
          onClick={
            actions?.alarm_status
              ? () => actions.alarm_status(record)
              : undefined
          }
        />
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
    version: {
      render: (text: string) => <span tw="text-neut-8">{text}</span>,
    },
    type: {
      onFilter: (v: string) => {
        setFilter((draft) => {
          draft.type = v
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
        record.__level === 1 ? (
          <DbTypeCmp type={text} onClick={() => actions?.source(record)} />
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
          <DbTypeCmp type={text} onClick={() => actions?.target(record)} />
        ) : null,
    },
    updated: {
      sortable: true,
      sortOrder:
        // eslint-disable-next-line no-nested-ternary
        filter.sort_by === 'updated' ? (filter.reverse ? 'asc' : 'desc') : '',
      render: (v: number, record: Record<string, any>) =>
        record.__level === 1 ? (
          <span tw="text-neut-8">
            {dayjs(v * 1000).format('YYYY-MM-DD HH:mm:ss')}
          </span>
        ) : null,
    },
  }
  return (pickByKeys ? pick(columnsRender, pickByKeys) : columnsRender) as any
}

export const getOperations = (
  handleMenuClick: (selectedData: any, menuKey: DataReleaseActionType) => void
) => {
  const getActions = (record: Record<string, any>) => {
    let key = ''
    if (
      dataReleaseScheduleType[record.status as 2]?.type ===
      DataReleaseSchedule.DOWNED
    ) {
      key = 'offline'
    } else {
      key = 're-publish'
    }

    return dataReleaseActions
      .filter((i) => i.key !== key)
      .map((i) => ({ ...i, value: record }))
  }

  return {
    title: '操作',
    key: 'operation',
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
