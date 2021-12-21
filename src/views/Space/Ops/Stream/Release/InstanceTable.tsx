import React, { useEffect, useState } from 'react'
import { Button } from '@QCFE/lego-ui'
import {
  Table,
  Icon,
  ToolBar,
  Divider,
  localstorage,
} from '@QCFE/qingcloud-portal-ui'
import { FlexBox, Center, TextLink } from 'components'
import dayjs from 'dayjs'
import { getJobInstanceKey, useQueryJobInstances } from 'hooks'
import { omitBy, get } from 'lodash-es'
import { observer } from 'mobx-react-lite'
import { useQueryClient } from 'react-query'
import { useImmer } from 'use-immer'
import { InstanceState } from '../constants'
import MessageModal from './MessageModal'

interface IFilter {
  state?: number
  job_id?: string
  version?: number
  limit: number
  offset: number
  sort_by: string
  reverse: boolean
}

const columnSettingsKey = 'ASSOIATE_INSTANCE_COLUMN_SETTINGS'

export const InstanceTable = observer(
  ({
    type = 'page',
    query = {},
    modalData = {},
  }: {
    type?: 'page' | 'modal'
    query?: any
    modalData?: any
  }) => {
    const [messageVisible, setMessageVisible] = useState(false)
    const [currentRow, setCurrentRow] = useState(undefined)
    const [columnSettings, setColumnSettings] = useState(
      localstorage.getItem(columnSettingsKey) || []
    )
    const [filter, setFilter] = useImmer<IFilter>({
      job_id: '',
      version: 0,
      state: 0,
      limit: 10,
      offset: 0,
      reverse: true,
      sort_by: 'update',
    })

    const queryClient = useQueryClient()

    const { isFetching, isRefetching, data } = useQueryJobInstances(
      omitBy(filter, (v) => v === ''),
      type
    )
    const infos = get(data, 'infos', []) || []

    const refetchData = () => {
      queryClient.invalidateQueries(getJobInstanceKey())
    }

    const handleCheckRowDetail = (row: any) => {
      setCurrentRow(row)
      setMessageVisible(true)
    }

    const columns = [
      {
        title: '实例ID',
        dataIndex: 'id',
      },
      {
        title: '状态',
        dataIndex: 'state',
        render: (value: number) => {
          return (
            <div tw="flex items-center">
              <Icon tw="mr-2" name="radio" color={InstanceState[value].color} />
              {InstanceState[value].name}
            </div>
          )
        },
      },
      {
        title: '所属作业',
        dataIndex: 'job_id',
      },
      {
        title: '创建时间',
        dataIndex: 'created',
        sortable: true,
        sortOrder:
          // filter.reverse ? 'asc' : 'desc',
          // eslint-disable-next-line no-nested-ternary
          filter.sort_by === 'created' ? (filter.reverse ? 'asc' : 'desc') : '',
        render: (value: any) => (
          <div tw="text-neut-8">
            {dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss')}
          </div>
        ),
      },
      {
        title: '更新时间',
        dataIndex: 'updated',
        sortable: true,
        sortOrder:
          // filter.reverse ? 'asc' : 'desc',
          // eslint-disable-next-line no-nested-ternary
          filter.sort_by === 'updated' ? (filter.reverse ? 'asc' : 'desc') : '',
        render: (value: any) => (
          <div tw="text-neut-8">
            {dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss')}
          </div>
        ),
      },
      {
        title: '操作',
        render: (_: any, row: Record<string, any>) => {
          return (
            <FlexBox tw="items-center">
              <Button type="text" disabled={row.state === 1}>
                <TextLink
                  href={`//${row.id}.flink.databench.io`}
                  target="_blank"
                >
                  Flink UI
                </TextLink>
              </Button>
              <Divider
                type="vertical"
                height={20}
                style={{ borderColor: '#475569', margin: '0 14px 0 5px' }}
              />
              <Center>
                <Button type="text" onClick={() => handleCheckRowDetail(row)}>
                  查看详情
                </Button>
              </Center>
            </FlexBox>
          )
        },
      },
    ]

    const filterColumn = columnSettings
      .map((o: { key: string; checked: boolean }) => {
        return o.checked && columns.find((col) => col.dataIndex === o.key)
      })
      .filter((o) => o)

    useEffect(() => {
      setFilter((draft) => {
        draft.job_id = query.jobId || modalData.id || ''
        draft.state = query.state || 0
        draft.version = Number(query.version) || 0
      })
    }, [modalData.id, query, setFilter])

    return (
      <FlexBox orient="column">
        <FlexBox tw="justify-end pt-6 pb-3">
          <Center tw="space-x-3">
            <Button
              type="black"
              loading={isRefetching}
              tw="px-[5px] border-line-dark!"
            >
              <Icon
                name="if-refresh"
                tw="text-xl text-white"
                type="light"
                onClick={() => {
                  refetchData()
                }}
              />
            </Button>
            <ToolBar.ColumnsSetting
              defaultColumns={columns}
              onSave={setColumnSettings}
              storageKey={columnSettingsKey}
            />
          </Center>
        </FlexBox>
        <Table
          rowKey="id"
          loading={isFetching}
          dataSource={infos || []}
          columns={filterColumn.length > 0 ? filterColumn : columns}
          onSort={(sortKey: any, order: string) => {
            setFilter((draft) => {
              draft.sort_by = sortKey
              draft.reverse = order === 'asc'
            })
          }}
          pagination={{
            total: data?.total || 0,
            current: filter.offset / filter.limit + 1,
            pageSize: filter.limit,
            onPageChange: (current: number) => {
              setFilter((draft) => {
                draft.offset = (current - 1) * filter.limit
              })
            },
            onShowSizeChange: (size: number) => {
              setFilter((draft) => {
                draft.offset = 0
                draft.limit = size
              })
            },
          }}
        />

        <MessageModal
          visible={messageVisible}
          row={currentRow}
          cancel={() => setMessageVisible(false)}
        />
      </FlexBox>
    )
  }
)

export default {}
