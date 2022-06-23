/* eslint-disable no-bitwise */
import { useColumns } from 'hooks/useHooks/useColumns'
import {
  dataReleaseScheduleType,
  streamDevModeType,
  streamInstanceColumns,
  streamInstanceSuggestions,
  streamInstanceTabs,
  streamReleaseColumns,
} from 'views/Space/Ops/Stream1/common/constants'
import { FlexBox } from 'components/Box'
import { Icon, PageTab, ToolBar } from '@QCFE/qingcloud-portal-ui'
import { Button } from '@QCFE/lego-ui'
import {
  alarmStatus,
  jobInstanceStatus,
  JobInstanceStatusType,
} from 'views/Space/Ops/DataIntegration/constants'
import { Table } from 'views/Space/styled'
import { get, isNil } from 'lodash-es'
import React, { useCallback } from 'react'
import { useIsFetching, useQueryClient } from 'react-query'
import { MappingKey } from 'utils/types'
import { streamInstanceFieldMapping } from 'views/Space/Ops/Stream1/common/mappings'
import dayjs from 'dayjs'
import useFilter from 'hooks/useHooks/useFilter'
import {
  FilterInput,
  IMoreActionItem,
  MoreAction,
  TextEllipsis,
  TextLink,
  Tooltip,
} from 'components'
import {
  AlarmStatusCmp,
  Divider,
  JobInstanceStatusCmp,
} from 'views/Space/Ops/styledComponents'
import tw, { css } from 'twin.macro'
import { useParams } from 'react-router-dom'
import { describeFlinkUiByInstanceId } from 'stores/api'
import { getReleaseJobsKey, useQueryJobInstances } from 'hooks'

const { ColumnsSetting } = ToolBar as any

interface IRouteParams {
  regionId: string
  spaceId: string
}

const getName = (name: MappingKey<typeof streamInstanceFieldMapping>) =>
  streamInstanceFieldMapping.get(name)!.apiField

const streamInstanceSettingKey = 'STREAM_INSTANCE_SETTING'

const StreamInstance = () => {
  const {
    filter,
    // setFilter,
    pagination,
    sort,
    getColumnFilter: getFilter,
  } = useFilter<
    Record<ReturnType<typeof getName>, number | string>,
    { pagination: true; sort: true }
  >({}, { pagination: true, sort: true }, streamInstanceSettingKey)

  const columnsRender = {
    [getName('instanceId')]: {
      render: (text: string) => {
        return <span tw="text-neut-8">{text}</span>
      },
    },
    [getName('status')]: {
      ...getFilter(getName('status'), dataReleaseScheduleType),
      render: (text: number) => {
        return <JobInstanceStatusCmp type={text as any} />
      },
    },
    [getName('alarmStatus')]: {
      ...getFilter(getName('alarmStatus'), alarmStatus),
      render: (type: number) => {
        return <AlarmStatusCmp type={type as any} />
      },
    },
    [getName('job')]: {
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
    [getName('devMode')]: {
      ...getFilter(getName('devMode'), streamDevModeType),
      render: (type?: keyof typeof streamDevModeType) =>
        !isNil(type) && (
          <span
            tw="border px-1.5 text-white border-white rounded-sm"
            css={css`
              transform: scale(0.8);
            `}
          >
            {streamDevModeType[type]?.label}
          </span>
        ),
    },
    [getName('createTime')]: {
      render: (d: number) => {
        return (
          d && (
            <span tw="text-neut-8">
              {dayjs(d * 1000).format('YYYY-MM-DD HH:mm:ss')}
            </span>
          )
        )
      },
    },
    [getName('updateTime')]: {
      render: (d: number) => {
        return (
          d && (
            <span tw="text-neut-8">
              {dayjs(d * 1000).format('YYYY-MM-DD HH:mm:ss')}
            </span>
          )
        )
      },
    },
  }

  const queryClient = useQueryClient()
  const refetchData = useCallback(() => {
    queryClient.invalidateQueries(getReleaseJobsKey())
  }, [queryClient])

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
  const { regionId, spaceId } = useParams<IRouteParams>()

  const jumpDetail = (tab?: string) => (record: Record<string, any>) => {
    window.open(`./job/${record.id}${tab ? `?tab=${tab}` : ''}`, '_blank')
  }

  const handleMenuClick = (
    record: Record<string, any>,
    key: 'stop' | 'info'
  ) => {
    switch (key) {
      case 'stop':
        // mutation
        //   .mutateAsync({
        //     op: 'terminate',
        //     ids: [record.id],
        //   })
        //   .then(() => {
        //     refetchData()
        //   })
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
              describeFlinkUiByInstanceId({
                instanceId: record.id,
                regionId,
                spaceId,
              }).then((web_ui: string) => {
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
    streamInstanceSettingKey,
    streamInstanceColumns,
    columnsRender as any,
    operations
  )

  const isFetching = useIsFetching()

  const { data } = useQueryJobInstances(filter)
  const infos = get(data, 'infos', [])

  return (
    <FlexBox orient="column" tw="p-5 h-full">
      <PageTab tabs={streamInstanceTabs} />
      <FlexBox orient="column" tw="gap-3 p-5 bg-neut-16">
        <FlexBox tw=" gap-2">
          <FilterInput
            filterLinkKey={streamInstanceSettingKey}
            suggestions={streamInstanceSuggestions}
            tw="border-line-dark!"
            searchKey="job_name"
            placeholder="搜索关键字或输入过滤条件"
            // isMultiKeyword
            defaultKeywordLabel="实例名称"
          />

          <Button
            type="black"
            onClick={() => {
              refetchData()
            }}
            loading={!!isFetching}
            tw="px-[5px] border-line-dark!"
          >
            <Icon name="if-refresh" tw="text-xl text-white" type="light" />
          </Button>
          <ColumnsSetting
            defaultColumns={streamReleaseColumns}
            storageKey={streamInstanceSettingKey}
            onSave={setColumnSettings}
          />
        </FlexBox>
        <Table
          columns={columns}
          dataSource={infos}
          loading={!!isFetching}
          onSort={sort}
          pagination={{
            total: get(data, 'total', 0),
            ...pagination,
          }}
        />
      </FlexBox>
    </FlexBox>
  )
}

export default StreamInstance
