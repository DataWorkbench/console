/* eslint-disable no-bitwise */
import { get } from 'lodash-es'
import { InstanceName } from 'components/InstanceName'
import {
  dataJobInstanceColumns,
  jobInstanceStatus,
  JobInstanceStatusType,
  jobType
} from 'views/Space/Ops/DataIntegration/constants'
import {
  Divider,
  JobInstanceStatusCmp,
  JobTypeCmp
} from 'views/Space/Ops/DataIntegration/styledComponents'
import tw, { css } from 'twin.macro'
import dayjs from 'dayjs'
import { useQueryClient } from 'react-query'
import React, { useEffect, useMemo, useState } from 'react'
import TableHeader from 'views/Space/Ops/DataIntegration/JobInstance/TableHeader'
import { Table } from 'views/Space/styled'
import { tuple } from 'utils/functions'
import { IColumn, useColumns } from 'hooks/useHooks/useColumns'
import { FlexBox, IMoreActionItem, MoreAction, TextEllipsis, TextLink, Tooltip } from 'components'
import {
  getSyncJobInstanceKey,
  useMutationJobInstance,
  useQuerySyncJobInstances
} from 'hooks/useSyncJobInstance'
import useFilter from 'hooks/useHooks/useFilter'
import { JobMode } from 'views/Space/Dm/RealTime/Job/JobUtils'
import { describeFlinkUI } from 'stores/api'
import { useParams } from 'react-router-dom'
import { Modal } from '@QCFE/qingcloud-portal-ui'
import MessageModal from 'views/Space/Ops/Stream/Release/MessageModal'

interface IJobInstanceTable {
  showHeader?: boolean
  filter?: Record<string, any>
  defaultColumns: IColumn[]
  settingKey: string
  jumpDetail: (tab?: string) => (record: Record<string, any>) => void
  type?: JobMode
  setFatherFilter?: (filter?: (record: Record<string, any>) => void) => void
}

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

const tableStyle = css`
  ${tw`w-full text-white mt-3`}
  .grid-table-header {
    ${tw`bg-[#1E2F41]! border-b border-neut-13 rounded-none`}
    .table-thead {
      ${tw`text-white`}
    }
  }
  .table-row {
    ${tw`bg-neut-17! border-b border-neut-13`}
    .column-action {
      ${tw`text-white`}
    }
    &:hover {
      ${tw`bg-[#1E2F41]!`}
      .column-name, .column-action {
        ${tw`text-green-11 font-medium`}
      }
    }
  }
  .grid-table-footer {
    ${tw`bg-neut-17! rounded-none`}
    > .portal-pagination {
      ${tw`text-white`}
      .pagination-number {
        ${tw`text-white`}
        a {
          ${tw` text-white`}
        }
        svg {
          ${tw`text-white`}
        }
      }
    }
  }
`

const actionsType = tuple('info', 'stop')
type ActionsType = typeof actionsType[number]

const JobInstanceTable = (props: IJobInstanceTable) => {
  const {
    settingKey,
    showHeader = true,
    defaultColumns,
    filter: filterProp,
    jumpDetail,
    setFatherFilter,
    type = JobMode.DI
  } = props
  const { filter, setFilter, pagination, sort } = useFilter<
    {
      sort_by?: string
      job_type?: any
      alarm_status?: string
      state?: number
      job_id?: string
      version?: string
      instance_id?: string
      verbose: number
      reverse: boolean
    },
    { pagination: true; sort: true }
  >({ verbose: 1, sort_by: 'created', reverse: true }, { pagination: true, sort: true }, settingKey)

  useEffect(() => {
    if (filterProp) {
      setFilter((draft: any) => ({
        ...draft,
        ...filterProp
      }))
    }
  }, [filterProp, setFilter])

  const { data, isFetching } = useQuerySyncJobInstances(
    filter,
    { refetchInterval: 1000 * 60 },
    type
  )

  const infos = get(data, 'infos', []) || []

  const columnsRender = {
    id: {
      render: (text: string, record: Record<string, any>) => (
        <InstanceName
          css={instanceNameStyle}
          theme="dark"
          name={record.id}
          icon="q-dotLine2Fill"
          onClick={() => {
            if (type === JobMode.DI) {
              jumpDetail()(record)
            }
          }}
        />
      )
    },

    state: {
      filter: filter.state,
      onFilter: (v: number) => {
        setFilter((draft) => {
          draft.state = v
          draft.offset = 0
        })
        if (setFatherFilter) {
          setFatherFilter((draft) => {
            draft.state = v
          })
        }
      },
      filterAble: true,
      filtersNew: Object.values(jobInstanceStatus) as any,
      render: (text: keyof typeof jobInstanceStatus) => <JobInstanceStatusCmp type={text} />
    },
    // alarm_status: {
    //   onFilter: (v: string) => {
    //     setFilter((draft) => {
    //       draft.alarm_status = v
    //       draft.offset = 0
    //     })
    //     if (setFatherFilter) {
    //       setFatherFilter((draft) => {
    //         draft.alarm_status = v
    //       })
    //     }
    //   },
    //   filter: filter.alarm_status,
    //   filterAble: true,
    //   filtersNew: Object.values(alarmStatus) as any,
    //   render: (text: keyof typeof alarmStatus, record: Record<string, any>) => (
    //     <AlarmStatusCmp
    //       type={text}
    //       onClick={() => jumpDetail('alarm')(record)}
    //     />
    //   ),
    // },
    job_id: {
      // width: 180,
      render: (v: string, record: Record<string, any>) => {
        const getContent = (children?: React.ReactElement) =>
          record?.sync_job?.desc ? (
            <div>
              <div>{`发布描述: ${record?.sync_job?.desc}`}</div>
              <div>{children}</div>
            </div>
          ) : (
            children
          )
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
              <TextEllipsis
                theme="light"
                content={getContent(<div>{`${record?.sync_job?.name}(${record.job_id})`}</div>)}
              >
                <span
                  tw="text-white cursor-pointer"
                  className="pit-job-name-text"
                  onClick={() => {
                    window.open(
                      `./data-release/${record.job_id}?version=${record.version}`,
                      '_blank'
                    )
                  }}
                >
                  {record?.sync_job?.name}
                </span>
                <span tw="text-neut-8"> {`(${record.job_id})`}</span>
              </TextEllipsis>
            </div>
            <div tw="truncate">
              <TextEllipsis
                theme="light"
                content={getContent(<div>{`版本 ID： ${record.version}`}</div>)}
              >
                <span tw="text-neut-8">{`版本 ID： ${record.version}`}</span>
              </TextEllipsis>
            </div>
          </div>
        )
        if (record?.sync_job?.desc) {
          return (
            <Tooltip
              theme="light"
              hasPadding
              content={`发布描述: ${record?.sync_job?.desc}`}
              twChild={tw`truncate text-neut-13!`}
            >
              {child}
            </Tooltip>
          )
        }
        return child
      }
    },
    type: {
      render: (text: keyof typeof jobType, record: Record<string, any>) => (
        <JobTypeCmp type={get(record, 'sync_job.type', '')} />
      )
    },
    created: {
      sortable: true,
      sortOrder:
        // eslint-disable-next-line no-nested-ternary
        filter.sort_by === 'created' ? (filter.reverse ? 'asc' : 'desc') : '',
      render: (v: number) => (
        <span tw="text-neut-8">{dayjs(v * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
      )
    },

    updated: {
      sortable: true,
      sortOrder:
        // eslint-disable-next-line no-nested-ternary
        filter.sort_by === 'updated' ? (filter.reverse ? 'asc' : 'desc') : '',
      render: (v: number) => (
        <span tw="text-neut-8">{dayjs(v * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
      )
    }
  }

  const queryClient = useQueryClient()
  const refetchData = () => {
    queryClient.invalidateQueries(getSyncJobInstanceKey('list'))
  }

  const mutation = useMutationJobInstance()
  const { spaceId, regionId } = useParams<{ spaceId: string; regionId: string }>()

  const handleStop = (record: Record<string, any>) => {
    Modal.warning({
      title: `终止作业实例: ${record.id}`,
      content: (
        <div tw="text-neut-8">实例终止后将取消运行，此操作无法撤回，您确定终止该实例吗？</div>
      ),
      okType: 'danger',
      okText: '终止',
      confirmLoading: mutation.isLoading,
      onOk: () => {
        mutation
          .mutateAsync({
            op: 'terminate',
            ids: [record.id]
          })
          .then(() => {
            refetchData()
          })
      }
    })
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
        text: '终止',
        icon: 'q-closeCircleFill',
        key: 'stop',
        value: record
      })
    }
    // if (type !== JobMode.RT) {
    result.push({
      text: '查看详情',
      icon: 'eye',
      key: 'info',
      value: record
    })
    // }
    return result
  }

  const [messageVisible, setMessageVisible] = useState(false)
  const [currentRow, setCurrentRow] = useState<Record<string, any>>()

  const handleFinkUI = (row: any) => {
    if (row.state === 1) return
    describeFlinkUI({
      inst_id: row.id,
      regionId,
      spaceId
    }).then((res) => {
      const ele = document.createElement('a')
      ele.style.display = 'none'
      ele.target = '_blank'
      ele.href = `//${res?.web_ui || ''}`
      document.body.appendChild(ele)
      ele.click()
      document.body.removeChild(ele)
    })
  }

  const handleMenuClick = (record: Record<string, any>, key: ActionsType) => {
    switch (key) {
      case 'stop':
        handleStop(record)
        break
      case 'info':
        if (type !== JobMode.RT) {
          jumpDetail()(record)
        } else {
          setCurrentRow(record)
          setMessageVisible(true)
        }
        break
      default:
        break
    }
  }
  const operations = {
    title: '操作',
    key: 'operation',
    render: (_: never, record: Record<string, any>) => (
      <FlexBox tw="gap-4">
        <TextLink
          disabled={jobInstanceStatus[record.state as 1]?.type === JobInstanceStatusType.PREPARING}
          onClick={() => {
            if (jobInstanceStatus[record.state as 1]?.type === JobInstanceStatusType.PREPARING) {
              return
            }
            if (type === JobMode.DI) {
              if (record?.flink_ui) {
                window.open(`//${record?.flink_ui}`, '_blank')
              }
            } else if (type === JobMode.RT) {
              handleFinkUI(record)
            }
          }}
        >
          Flink UI
        </TextLink>
        {!!getActions(jobInstanceStatus[record.state as 1]?.type, record).length && (
          <>
            <Divider />
            <MoreAction
              theme="darker"
              items={getActions(jobInstanceStatus[record.state as 1]?.type, record)}
              onMenuClick={handleMenuClick as any}
            />
          </>
        )}
      </FlexBox>
    )
  }

  const { columns, setColumnSettings } = useColumns(
    settingKey,
    defaultColumns,
    columnsRender as any,
    operations
  )

  const columnsSetting = useMemo(
    () => ({
      defaultColumns: dataJobInstanceColumns,
      storageKey: settingKey,
      onSave: setColumnSettings as any
    }),
    [setColumnSettings, settingKey]
  )

  return (
    <>
      {showHeader && <TableHeader columnsSetting={columnsSetting} columns={columns} />}
      <Table
        css={!showHeader ? tableStyle : null}
        columns={columns}
        dataSource={infos}
        loading={!!isFetching}
        rowKey="id"
        onSort={sort}
        pagination={{
          total: get(data, 'total', 0),
          ...pagination
        }}
      />
      <MessageModal
        visible={messageVisible}
        row={currentRow}
        cancel={() => setMessageVisible(false)}
        webUI={handleFinkUI}
      />
    </>
  )
}
export default JobInstanceTable
