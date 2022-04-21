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
import { get } from 'lodash-es'
import useFilter from 'hooks/useHooks/useFilter'
import tw, { css } from 'twin.macro'
import {
  getSyncJobInstanceKey,
  useMutationJobInstance,
  useQuerySyncJobInstances,
} from 'hooks/useJobInstance'
import { describeFlinkUiByInstanceId } from 'stores/api'
import { useQueryClient } from 'react-query'
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

  const { filter, setFilter, pagination, sort } = useFilter<
    {
      reverse?: 'asc' | 'desc'
      sort_by?: string
      job_type?: any
      alarm_status?: string
      state?: number
    },
    { pagination: true; sort: true }
  >({}, { pagination: true, sort: true }, settingKey)

  // const queryClient = useQueryClient()
  // const mutation = useMutationInstance()

  const { data, isFetching } = useQuerySyncJobInstances(filter)

  const infos =
    get(data, 'infos', [
      {
        id: '111',
        job_id: 'aaf',
        name: 'asdfasdf',
        message: 'sdfaf',
        state: 1,
        status: 1,
        alarm_status: 1,
        created: new Date().getTime(),
        updated: new Date().getTime(),
        version: 'asdfasdfasf',
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
    id: {
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

    state: {
      filter: filter.state,
      onFilter: (v: number) => {
        setFilter((draft) => {
          draft.state = v
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
            <div tw="truncate">
              <TextEllipsis theme="light">
                <span tw="text-white" className="pit-job-name-text">
                  {record.job_name}
                </span>
                <span tw="text-neut-8"> {`(${record.job_id})`}</span>
              </TextEllipsis>
            </div>
            <div tw="truncate">
              <TextEllipsis theme="light">
                <span tw="text-neut-8">{`版本 ID： ${record.version}`}</span>
              </TextEllipsis>
            </div>
          </div>
        )
        // TODO: desc 字段未定
        if (record.desc) {
          return (
            <Tooltip
              theme="light"
              hasPadding
              content={`发布描述: ${record.desc}`}
            >
              {child}
            </Tooltip>
          )
        }
        return child
      },
    },
    type: {
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
    created: {
      sortable: true,
      sortOrder:
        // eslint-disable-next-line no-nested-ternary
        filter.sort_by === 'created' ? (filter.reverse ? 'asc' : 'desc') : '',
      render: (v: number) => dayjs(v * 1000).format('YYYY-MM-DD HH:mm:ss'),
    },

    updated: {
      sortable: true,
      sortOrder:
        // eslint-disable-next-line no-nested-ternary
        filter.sort_by === 'updated' ? (filter.reverse ? 'asc' : 'desc') : '',
      render: (v: number) => dayjs(v * 1000).format('YYYY-MM-DD HH:mm:ss'),
    },
  }

  const queryClient = useQueryClient()
  const refetchData = () => {
    queryClient.invalidateQueries(getSyncJobInstanceKey('list'))
  }

  const mutation = useMutationJobInstance()

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
        mutation
          .mutateAsync({
            op: 'terminate',
            ids: [record.id],
          })
          .then(() => {
            refetchData()
          })
        break
      case 'info':
        jumpDetail()(record)
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
          <TextLink
            disabled={
              // todo: 字段和值未定
              jobInstanceStatus[record.state as 1]?.type ===
              JobInstanceStatusType.RUNNING
            }
            onClick={() => {
              describeFlinkUiByInstanceId(record.id).then((web_ui: string) => {
                if (web_ui) {
                  window.open(web_ui, '_blank')
                }
              })
            }}
          >
            Flink UI
          </TextLink>
          <Divider />
          <MoreAction
            theme="darker"
            items={getActions(
              jobInstanceStatus[record.state as 1]?.type,
              record
            )}
            onMenuClick={handleMenuClick as any}
          />
        </FlexBox>
      )
    },
  }

  const { columns, setColumnSettings } = useColumns(
    settingKey,
    dataJobInstanceColumns,
    columnsRender as any,
    operations
  )
  const columnsSetting = useMemo(() => {
    return {
      defaultColumns: dataJobInstanceColumns,
      storageKey: settingKey,
      onSave: setColumnSettings as any,
    }
  }, [setColumnSettings])

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
