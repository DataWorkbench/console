/* eslint-disable no-bitwise */
import { get } from 'lodash-es'
import { InstanceName } from 'components/InstanceName'
import {
  dataJobInstanceColumns,
  jobInstanceStatus,
  JobInstanceStatusType,
  jobType,
} from 'views/Space/Ops/DataIntegration/constants'
import {
  Divider,
  JobInstanceStatusCmp,
  JobTypeCmp,
} from 'views/Space/Ops/DataIntegration/styledComponents'
import tw, { css } from 'twin.macro'
import dayjs from 'dayjs'
import { useQueryClient } from 'react-query'
import React, { useEffect, useMemo } from 'react'
import TableHeader from 'views/Space/Ops/DataIntegration/JobInstance/TableHeader'
import { Table } from 'views/Space/styled'
import { tuple } from 'utils/functions'
import { IColumn, useColumns } from 'hooks/useHooks/useColumns'
import {
  FlexBox,
  IMoreActionItem,
  MoreAction,
  TextEllipsis,
  TextLink,
  Tooltip,
} from 'components'
import {
  getSyncJobInstanceKey,
  useMutationJobInstance,
  useQuerySyncJobInstances,
} from 'hooks/useSyncJobInstance'
import useFilter from 'hooks/useHooks/useFilter'
import { JobMode } from 'views/Space/Dm/RealTime/Job/JobUtils'
import { describeFlinkUI } from 'stores/api'
import { useParams } from 'react-router-dom'

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
    type = JobMode.DI,
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
  >(
    { verbose: 1, sort_by: 'created', reverse: true },
    { pagination: true, sort: true },
    settingKey
  )

  useEffect(() => {
    if (filterProp) {
      setFilter((draft: any) => {
        Object.entries(filterProp).forEach(([key, value]) => {
          draft[key] = value
        })
      })
    }
  }, [filterProp, setFilter])

  const { data, isFetching } = useQuerySyncJobInstances(filter, undefined, type)

  const infos = get(data, 'infos', []) || []

  const columnsRender = {
    id: {
      render: (text: string, record: Record<string, any>) => (
        <InstanceName
          css={instanceNameStyle}
          theme="dark"
          name={record.id}
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
        if (setFatherFilter) {
          setFatherFilter((draft) => {
            draft.state = v
          })
        }
      },
      filterAble: true,
      filtersNew: Object.values(jobInstanceStatus) as any,
      render: (text: keyof typeof jobInstanceStatus) => (
        <JobInstanceStatusCmp type={text} />
      ),
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
        const getContent = (children?: React.ReactElement) => {
          return record?.sync_job?.desc ? (
            <div>
              <div>{`发布描述: ${record?.sync_job?.desc}`}</div>
              <div>{children}</div>
            </div>
          ) : (
            children
          )
        }
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
                content={getContent(
                  <div>{`${record?.sync_job?.name}(${record.job_id})`}</div>
                )}
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
      render: (v: number) => (
        <span tw="text-neut-8">
          {dayjs(v * 1000).format('YYYY-MM-DD HH:mm:ss')}
        </span>
      ),
    },

    updated: {
      sortable: true,
      sortOrder:
        // eslint-disable-next-line no-nested-ternary
        filter.sort_by === 'updated' ? (filter.reverse ? 'asc' : 'desc') : '',
      render: (v: number) => (
        <span tw="text-neut-8">
          {dayjs(v * 1000).format('YYYY-MM-DD HH:mm:ss')}
        </span>
      ),
    },
  }

  const queryClient = useQueryClient()
  const refetchData = () => {
    queryClient.invalidateQueries(getSyncJobInstanceKey('list'))
  }

  const mutation = useMutationJobInstance()
  const { spaceId, regionId } =
    useParams<{ spaceId: string; regionId: string }>()

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
              jobInstanceStatus[record.state as 1]?.type ===
              JobInstanceStatusType.PREPARING
            }
            onClick={() => {
              if (
                jobInstanceStatus[record.state as 1]?.type ===
                JobInstanceStatusType.PREPARING
              ) {
                return
              }
              if (type === JobMode.DI) {
                if (record?.flink_ui) {
                  window.open(`//${record?.flink_ui}`, '_blank')
                }
              } else if (type === JobMode.RT) {
                describeFlinkUI({
                  inst_id: record.id,
                  regionId,
                  spaceId,
                }).then((res) => {
                  window.open(`//${res?.web_ui || ''}`, '_blank')
                })
              }

              // describeFlinkUiByInstanceId({
              //   instanceId: record.id,
              //   regionId,
              //   spaceId,
              // }).then((web_ui: string) => {

              // })
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
    defaultColumns,
    columnsRender as any,
    operations
  )

  const columnsSetting = useMemo(() => {
    return {
      defaultColumns: dataJobInstanceColumns,
      storageKey: settingKey,
      onSave: setColumnSettings as any,
    }
  }, [setColumnSettings, settingKey])

  return (
    <>
      {showHeader && (
        <TableHeader columnsSetting={columnsSetting} columns={columns} />
      )}
      <Table
        columns={columns}
        dataSource={infos}
        loading={!!isFetching}
        rowKey="id"
        onSort={sort}
        pagination={{
          total: get(data, 'total', 0),
          ...pagination,
        }}
      />
    </>
  )
}
export default JobInstanceTable
