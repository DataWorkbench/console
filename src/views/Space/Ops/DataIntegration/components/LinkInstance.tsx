/* eslint-disable no-bitwise */
import { Table } from 'views/Space/styled'
import { IColumn, useColumns } from 'hooks/useHooks/useColumns'
import tw, { css } from 'twin.macro'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import { Button, InputSearch, Select } from '@QCFE/lego-ui'
import {
  Center,
  FlexBox,
  IMoreActionItem,
  InstanceName,
  MoreAction,
  TextLink,
} from 'components'
import { get } from 'lodash-es'
import useFilter from 'hooks/useHooks/useFilter'
import {
  alarmStatus,
  dataJobActions,
  DataJobActionType,
  jobInstanceStatus,
  JobInstanceStatusType,
} from 'views/Space/Ops/DataIntegration/constants'
import {
  AlarmStatusCmp,
  Divider,
  JobInstanceStatusCmp,
} from 'views/Space/Ops/DataIntegration/styledComponents'
import dayjs from 'dayjs'
import React from 'react'

const defaultColumns: IColumn[] = [
  {
    title: '实例 ID',
    dataIndex: 'instance_id',
    key: 'instance_id',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '告警状态',
    dataIndex: 'alarm_status',
    key: 'alarm_status',
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    key: 'create_time',
  },
  {
    title: '更新时间',
    dataIndex: 'update_time',
    key: 'update_time',
  },
]

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

const linkInstanceSettingKey = 'LINK_INSTANCE_SETTING'

const LinkInstance = () => {
  const { filter, setFilter, pagination, sort } = useFilter<
    {
      instance_id?: string
      status?: number
      alarm_status?: number
    },
    {
      pagination: true
      sort: true
    }
  >({})

  const { data, refetch, isFetching } = {
    refetch: () => {},
    isFetching: false,
    data: [],
  }

  const jumpDetail = (tab?: string) => (record: Record<string, any>) => {
    window.open(`../data-job/${record.id}${tab ? `?tab=${tab}` : ''}`, '_blank')
  }

  const columnsRender = {
    instance_id: {
      render: (text: string, record: Record<string, any>) => (
        <InstanceName
          theme="dark"
          name={record.instance_name}
          icon="q-dotLine2Fill"
          css={instanceNameStyle}
          onClick={() => {
            jumpDetail()(record)
          }}
        />
      ),
    },

    status: {
      filter: filter.status,
      onFilter: (v: number) => {
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
      onFilter: (v: number) => {
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
    create_time: {
      sortable: true,
      sortOrder:
        // eslint-disable-next-line no-nested-ternary
        filter.sort_by === 'updated_at'
          ? filter.reverse
            ? 'asc'
            : 'desc'
          : '',
      render: (v: number) => (
        <span tw="text-neut-8">
          {dayjs(v * 1000).format('YYYY-MM-DD HH:mm:ss')}
        </span>
      ),
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
      render: (v: number) => (
        <span tw="text-neut-8">
          {dayjs(v * 1000).format('YYYY-MM-DD HH:mm:ss')}
        </span>
      ),
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
    const filterKeys = new Set<string>()
    if (status & stopAble) {
      filterKeys.add('stop')
    }

    return dataJobActions.reduce(
      (acc: IMoreActionItem[], cur: IMoreActionItem) => {
        if (filterKeys.has(cur.key)) {
          return acc
        }
        return [...acc, { ...cur, value: record }]
      },
      []
    )
  }

  const handleMenuClick = (
    record: Record<string, any>,
    key: DataJobActionType
  ) => {
    switch (key) {
      case 'stop':
        console.log('stop', record)
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
    width: 150,
    key: 'operation',
    render: (text: any, record: any) => (
      <FlexBox tw="gap-4">
        <TextLink>Flink UI</TextLink>
        <Divider />
        <MoreAction<DataJobActionType>
          theme="darker"
          items={getActions(record.status, record)}
          onMenuClick={handleMenuClick as any}
        />
      </FlexBox>
    ),
  }
  const { columns } = useColumns(
    linkInstanceSettingKey,
    defaultColumns,
    columnsRender as any,
    operations
  )

  console.log(pagination)
  return (
    <div tw="w-full">
      <FlexBox tw="gap-9 whitespace-nowrap">
        <Center tw="gap-1 ">
          <div tw="text-white w-auto">调度状态</div>
          <Select
            tw="w-[200px]"
            placeholder="请选择"
            options={[
              { value: 0, label: '全部' },
              { value: 1, label: '调度中' },
              { value: 2, label: '已暂停' },
              { value: 4, label: '已完成' },
            ]}
            onChange={(value: number) => {
              setFilter((draft) => {
                draft.status = value
              })
            }}
            value={filter.status}
          />
        </Center>
        <Center tw="gap-1">
          <div tw="text-white w-auto ">告警状态</div>
          <Select
            tw="w-[200px]"
            placeholder="请选择"
            options={[
              { value: 0, label: '全部' },
              { value: 1, label: '正常' },
              { value: 2, label: '告警' },
            ]}
            onChange={(value: number) => {
              setFilter((draft) => {
                draft.alarm_status = value
              })
            }}
            value={filter.alarm_status}
          />
        </Center>
        <Center tw="gap-1">
          <div tw="text-white w-auto ">作业 ID</div>
          <InputSearch
            tw="w-[200px]"
            placeholder="搜索作业 ID"
            onPressEnter={(e: React.SyntheticEvent) => {
              setFilter((draft) => {
                draft.instance_id = (e.currentTarget as HTMLInputElement).value
              })
            }}
            onClear={() => {
              setFilter((draft) => {
                draft.instance_id = ''
              })
            }}
          />
        </Center>
        <div tw="text-right flex-auto">
          <Button
            type="black"
            loading={!!isFetching}
            tw="w-auto px-[5px] border-line-dark!"
          >
            <Icon
              name="if-refresh"
              tw="text-xl text-white"
              type="light"
              onClick={() => {
                refetch()
              }}
            />
          </Button>
        </div>
      </FlexBox>
      <Table
        tw="mt-2"
        css={css`
          .grid-table-header {
            ${tw`bg-[#1e2f41]!`}
          }
        `}
        columns={columns}
        dataSource={[
          {
            instance_id: '111',
            instance_name: 'xxxx',
            status: '1',
            alarm_status: '1',
          },
        ]}
        sort={sort}
        pagination={{
          total: get(data, 'total', 0),
          ...pagination,
        }}
      />
    </div>
  )
}

export default LinkInstance
