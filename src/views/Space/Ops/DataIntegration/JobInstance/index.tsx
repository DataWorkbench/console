/* eslint-disable no-bitwise */
import { Icon, PageTab } from '@QCFE/qingcloud-portal-ui'
import { FlexBox } from 'components/Box'
import { useColumns } from 'hooks/useHooks/useColumns'
import { Table } from 'views/Space/styled'
import { IMoreActionItem, MoreAction, TextEllipsis, TextLink } from 'components'
import React, { useMemo } from 'react'
import { Center } from 'components/Center'
import tw, { css, styled } from 'twin.macro'
import {
  AlarmStatusCmp, Circle,
  Divider,
  JobInstanceStatusCmp,
  JobTypeCmp,
} from 'views/Space/Ops/DataIntegration/styledComponents'
import { useImmer } from 'use-immer'
import dayjs from 'dayjs'
import useIcon from 'hooks/useHooks/useIcon'
import { tuple } from 'utils/functions'
import {
  alarmStatus,
  dataJobInstanceColumns,
  dataJobInstanceTab,
  jobInstanceStatus,
  JobInstanceStatusType,
  jobType,
} from '../constants'
import TableHeader from './TableHeader'
import icons from '../icons'
import {useHistory} from "react-router-dom";

const settingKey = 'DATA_JOB_INSTANCE_TABLE_SETTING'

const actionsType = tuple('info', 'stop')
type ActionsType = typeof actionsType[number]


const DataJobInstance = () => {
  useIcon(icons)

  const history = useHistory()

  const [filter, setFilter] = useImmer<{
    reverse?: 'asc' | 'desc'
    sort_by?: string
    job_type?: any
    alarm_status: string
    status: string
    offset: number
  }>({ alarm_status: '', offset: 0, status: '' })
  const columnsRender = {
    instance_id: {
      render: (text: string) => (
        <Center tw="truncate">
          {/* // TODO merge fill icon */}
          <Circle>
            <Icon
              name="q-mergeFillDuotone"
              type="light"
              css={css`
                & .qicon {
                  ${tw`text-white! fill-[#fff]!`}
                }
              `}
            />
          </Circle>
          <div tw="flex-1 truncate">
            <TextEllipsis theme="light">{text}</TextEllipsis>
          </div>
        </Center>
      ),
    },

    status: {
      filter: filter.status,
      onFilter: (v: string) => {
        setFilter((draft) => {
          draft.status = v
          draft.offset = 0
        })
      },
      filterAble: true,
      filtersNew: Object.values(jobInstanceStatus) as any,
      render: (text: keyof typeof jobInstanceStatus) => (
        <JobInstanceStatusCmp type={text} />
      ),
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
    job_id: {
      render: (v: string, record: Record<string, any>) => {
        return (
          <div>
            <FlexBox>
              <span tw="text-white">{record.job_name}</span>
              <span tw="text-neut-8"> {record.job_id}</span>
            </FlexBox>
            <div>
              <span tw="text-neut-8">{`版本 ID： ${record.version_id}`}</span>
            </div>
          </div>
        )
      },
    },
    job_type: {
      filter: filter.job_type,
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
    create_time: {
      sortable: true,
      sortOrder:
        // eslint-disable-next-line no-nested-ternary
        filter.sort_by === 'updated_at'
          ? filter.reverse
            ? 'asc'
            : 'desc'
          : '',
      render: (v: number) => dayjs(v * 1000).format('YYYY-MM-DD HH:mm:ss'),
    },
    update_time: {
      sortable: true,
      sortOrder:
        // eslint-disable-next-line no-nested-ternary
        filter.sort_by === 'updated_at'
          ? filter.reverse
            ? 'asc'
            : 'desc'
          : '',
      render: (v: number) => dayjs(v * 1000).format('YYYY-MM-DD HH:mm:ss'),
    },
  }

  const getActions = (
    status: JobInstanceStatusType,
    record: Record<string, any>
  ): IMoreActionItem[] => {
    const stopAble =
      JobInstanceStatusType.RUNNING |
      JobInstanceStatusType.FAILED_AND_RETRY |
      JobInstanceStatusType.PREPARING
    const result = []
    if (status & stopAble) {
      result.push({
        text: '中止',
        icon: 'q-closeCircleFill',
        key: 'stop',
        value: record,
      })
    }
    result.push({
      text: '查看详情',
      icon: 'eye',
      key: 'info',
      value: record,
    })
    return result
  }

  const handleMenuClick = (record: Record<string, any>, key: ActionsType) => {
    switch (key) {
      case 'stop':
        console.log('stop')
        break
      case 'info':
        history.push(`./data-job/${record.instance_id}`)
        break
      default:
        break
    }
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
            items={getActions(record.status, record)}
            onMenuClick={handleMenuClick as any}
          />
        </FlexBox>
      )
    },
  }

  const { columns, setColumnSettings } = useColumns(
    settingKey,
    dataJobInstanceColumns,
    columnsRender,
    operations
  )
  const columnsSetting = useMemo(() => {
    console.log(11111111111111)
    return {
      defaultColumns: dataJobInstanceColumns,
      storageKey: settingKey,
      onSave: setColumnSettings as any,
    }
  }, [setColumnSettings])

  console.log(columnsSetting)
  return (
    <FlexBox orient="column" tw="p-5 h-full">
      <PageTab tabs={dataJobInstanceTab} />
      <FlexBox orient="column" tw="gap-3">
        <TableHeader columnsSetting={columnsSetting} columns={columns} />
        <Table
          columns={columns}
          dataSource={[
            {
              instance_id: '122222222222222222222333333',
              status: '1',
              alarm_status: '1',
              job_id: '1',
              job_type: '1',
              create_time: '1',
              update_time: '1',
            },

            {
              instance_id: '888888888888888888888888888',
              status: '2',
              alarm_status: '1',
              job_id: '1',
              job_type: '2',
              create_time: '1',
              update_time: '1',
            },
            {
              instance_id: '999999999999999999999999999',
              status: '4',
              alarm_status: '1',
              job_id: '1',
              job_type: '0',
              create_time: '1',
              update_time: '1',
            },
          ]}
        />
      </FlexBox>
    </FlexBox>
  )
}

export default DataJobInstance
