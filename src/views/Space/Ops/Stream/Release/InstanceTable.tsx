import React, { useEffect, useState } from 'react'
import { Button } from '@QCFE/lego-ui'
import {
  Table,
  Icon,
  ToolBar,
  Divider,
  localstorage,
} from '@QCFE/qingcloud-portal-ui'
import { FlexBox, Center, TextLink, Icons } from 'components'
import dayjs from 'dayjs'
import {
  getJobInstanceKey,
  useMutationInstance,
  useQueryJobInstances,
  useStore,
} from 'hooks'
import { omitBy, get } from 'lodash-es'
import { observer } from 'mobx-react-lite'
import { useQueryClient } from 'react-query'
import { useImmer } from 'use-immer'
import { useHistory, useParams } from 'react-router-dom'
import { InstanceState } from '../constants'
import MessageModal from './MessageModal'

interface IFilter {
  state?: number
  job_id?: string
  version?: string
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
    const { workFlowStore } = useStore()
    const history = useHistory()
    const { regionId, spaceId } =
      useParams<{ regionId: string; spaceId: string }>()

    const [messageVisible, setMessageVisible] = useState(false)
    const [currentRow, setCurrentRow] = useState(undefined)
    const [columnSettings, setColumnSettings] = useState(
      localstorage.getItem(columnSettingsKey) || []
    )
    const [filter, setFilter] = useImmer<IFilter>({
      job_id: '',
      version: '',
      state: 0,
      limit: 10,
      offset: 0,
      reverse: true,
      sort_by: '',
    })

    const queryClient = useQueryClient()
    const mutation = useMutationInstance()

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

    const handleFinkUI = (id: String) => {
      mutation.mutate(
        { op: 'view', inst_id: id },
        {
          onSuccess: (response: any) => {
            const ele = document.createElement('a')
            ele.style.display = 'none'
            ele.target = '_blank'
            ele.href = `//${response?.web_ui || ''}`
            document.body.appendChild(ele)
            ele.click()
            document.body.removeChild(ele)
          },
        }
      )
    }

    const handleJobView = (curViewJobId: string) => {
      workFlowStore.set({ curViewJobId })
      history.push(`/${regionId}/workspace/${spaceId}/dm`)
    }

    const columns = [
      {
        title: '实例ID',
        dataIndex: 'id',
        render: (value: string) => {
          return (
            <FlexBox tw="items-center space-x-1">
              <Center
                tw="bg-neut-13 rounded-full w-6 h-6 mr-2 border-2 border-solid border-neut-16"
                className="release-icon"
              >
                <Icons name="stream-job" size={14} />
              </Center>
              <div tw="flex-1 break-all">{value}</div>
            </FlexBox>
          )
        },
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
        title: '所属作业/ID',
        dataIndex: 'job_id',
        render: (value: string, row: Record<string, any>) => {
          return (
            <div>
              {/* <div>{row.job_name}</div> */}
              <div
                tw="hover:text-green-11 cursor-pointer"
                onClick={() => handleJobView(row.job_id)}
              >
                {value}
              </div>
            </div>
          )
        },
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
              <Button type="text">
                <TextLink onClick={() => handleFinkUI(row.id)}>
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
        draft.version = query.version || ''
        draft.offset = 0
        draft.limit = 10
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
          loading={isFetching || mutation.isLoading}
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
          webUI={handleFinkUI}
        />
      </FlexBox>
    )
  }
)

export default {}
