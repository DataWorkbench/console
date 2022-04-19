/* eslint-disable no-bitwise */
import { PageTab } from '@QCFE/qingcloud-portal-ui'
import { FlexBox } from 'components/Box'
import { useColumns } from 'hooks/useHooks/useColumns'
import { Table } from 'views/Space/styled'
import {
  IMoreActionItem,
  InstanceName,
  MoreAction,
  TextEllipsis,
  TextLink,
  Tooltip,
} from 'components'
import React, { useMemo } from 'react'
import {
  AlarmStatusCmp,
  Divider,
  JobInstanceStatusCmp,
  JobTypeCmp,
} from 'views/Space/Ops/DataIntegration/styledComponents'
import dayjs from 'dayjs'
import useIcon from 'hooks/useHooks/useIcon'
import { tuple } from 'utils/functions'
import { useHistory } from 'react-router-dom'
// import { useQueryClient } from 'react-query'
import { get, omitBy } from 'lodash-es'
import {
  // getJobInstanceKey,
  // useMutationInstance,
  useQueryJobInstances,
} from 'hooks'
import useFilter from 'hooks/useHooks/useFilter'
import tw, { css } from 'twin.macro'
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

const instanceNameStyle = css`
  &:hover {
    .instance-name-title {
      ${tw`text-green-11`}
    }
    .instance-name-icon {
      ${tw`bg-[#13966a80] border-[#9ddfc966]`}
      .icon svg.qicon {
        ${tw`text-green-11`}
      }
    }
  }
`

const settingKey = 'DATA_JOB_INSTANCE_TABLE_SETTING'

const actionsType = tuple('info', 'stop')
type ActionsType = typeof actionsType[number]

const DataJobInstance = () => {
  useIcon(icons)

  const history = useHistory()

  const { filter, setFilter, pagination, sort } = useFilter<
    {
      reverse?: 'asc' | 'desc'
      sort_by?: string
      job_type?: any
      alarm_status: string
      status: string
      offset: number
    },
    { pagination: true; sort: true }
  >({ alarm_status: '', offset: 0, status: '' })

  // const queryClient = useQueryClient()
  // const mutation = useMutationInstance()

  const { isFetching } = useQueryJobInstances(omitBy(filter, Boolean))

  const data = {}

  const infos =
    get(data, 'infos', [
      {
        instance_id: '11',
        instance_name: 'xxxxx',
        alarm_status: '1',
        job_name: 'adfa',
        job_id: '123123',
      },
    ]) || []

  // const refetchData = () => {
  //   queryClient.invalidateQueries(getJobInstanceKey())
  // }

  const jumpDetail = (tab?: string) => (record: Record<string, any>) => {
    window.open(
      `./data-instance/${record.id}${tab ? `?tab=${tab}` : ''}`,
      '_blank'
    )
  }

  const columnsRender = {
    instance_id: {
      render: (text: string, record: Record<string, any>) => (
        <InstanceName
          css={instanceNameStyle}
          theme="dark"
          name={record.instance_name}
          icon="q-dotLine2Fill"
          onClick={() => jumpDetail()(record)}
        />
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
      render: (text: keyof typeof alarmStatus, record: Record<string, any>) => (
        <AlarmStatusCmp
          type={text}
          onClick={() => jumpDetail('alarm')(record)}
        />
      ),
    },
    job_id: {
      render: (v: string, record: Record<string, any>) => {
        const child = (
          <div
            tw="truncate"
            css={css`
              &:hover {
                .pit-job-name-text {
                  ${tw`text-green-11`}
                }
              }
            `}
          >
            <TextEllipsis theme="light">
              <span tw="text-white" className="pit-job-name-text">
                {record.job_name}
              </span>
              <span tw="text-neut-8"> {record.job_id}</span>
            </TextEllipsis>
            <TextEllipsis theme="light">
              <span tw="text-neut-8">{`版本 ID： ${record.version}`}</span>
            </TextEllipsis>
          </div>
        )
        // TODO: desc 字段未定
        if (record.desc) {
          return (
            <Tooltip theme="light" hasPadding content={record.desc}>
              {child}
            </Tooltip>
          )
        }
        return child
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
          dataSource={infos}
          loading={!!isFetching}
          sort={sort}
          pagination={{
            total: get(data, 'total', 0),
            ...pagination,
          }}
        />
      </FlexBox>
    </FlexBox>
  )
}

export default DataJobInstance
