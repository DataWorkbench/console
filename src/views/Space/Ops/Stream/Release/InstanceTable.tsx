import { useEffect, useState } from 'react'
import { Button, Menu } from '@QCFE/lego-ui'
import {
  Modal,
  Table,
  Icon,
  ToolBar,
  Divider,
  localstorage,
} from '@QCFE/qingcloud-portal-ui'
import { FlexBox, Center, TextLink, Icons, Tooltip } from 'components'
import dayjs from 'dayjs'
import tw, { css } from 'twin.macro'
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
  instance_id?: string
  job_id?: string
  version?: string
  limit: number
  offset: number
  sort_by: string
  reverse: boolean
}

const { MenuItem } = Menu

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
      state: 0,
      instance_id: '',
      job_id: '',
      version: '',
      sort_by: '',
      reverse: true,
      offset: 0,
      limit: 10,
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

    const handleJobView = (curViewJobId: string) => {
      workFlowStore.set({ curViewJobId })
      history.push(`/${regionId}/workspace/${spaceId}/dm`)
    }

    const handleFinkUI = (row: any) => {
      if (row.state === 1) return
      mutation.mutate(
        { op: 'view', inst_id: row.id },
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

    const handleCheckRowDetail = (row: any) => {
      setCurrentRow(row)
      setMessageVisible(true)
    }

    const handleTerminate = (row: any) => {
      Modal.warning({
        title: `终止作业实例: ${row.id}`,
        content: (
          <div tw="text-neut-8">
            实例终止后将取消运行，此操作无法撤回，您确定终止该实例吗？
          </div>
        ),
        okType: 'danger',
        okText: '终止',
        confirmLoading: mutation.isLoading,
        onOk: () => {
          mutation.mutate(
            {
              op: 'stop',
              instance_ids: [row.id],
            },
            {
              onSuccess: () => {
                refetchData()
              },
            }
          )
        },
      })
    }

    const handleMenuClick = (key: String, row: any) => {
      if (key === 'stop') {
        handleTerminate(row)
      } else if (key === 'view') {
        handleCheckRowDetail(row)
      }
    }

    const columns = [
      {
        title: '实例ID',
        dataIndex: 'id',
        width: 185,
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
        width: 185,
        render: (value: string, row: Record<string, any>) => {
          return (
            <div>
              {/* <div>{row.job_name}</div> */}
              <div
                tw="text-neut-8 hover:text-green-11 cursor-pointer"
                onClick={() => handleJobView(row.job_id)}
              >
                {value}
              </div>
            </div>
          )
        },
      },
      {
        title: '作业版本',
        width: 185,
        dataIndex: 'version',
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
        dataIndex: 'table_actions',
        render: (_: any, row: Record<string, any>) => {
          return (
            <FlexBox tw="items-center">
              <Button type="text">
                <TextLink
                  onClick={() => handleFinkUI(row)}
                  disabled={row.state === 1}
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
                <Tooltip
                  trigger="click"
                  placement="bottom-end"
                  arrow={false}
                  twChild={
                    css`
                      &[aria-expanded='true'] {
                        ${tw`bg-line-dark`}
                      }
                      svg {
                        ${tw`text-white! bg-transparent! fill-[transparent]!`}
                      }
                    ` as any
                  }
                  content={
                    <Menu
                      onClick={(e: any, key: OP) => handleMenuClick(key, row)}
                    >
                      {[1, 2, 3].includes(row.state) && (
                        <MenuItem key="stop">终止</MenuItem>
                      )}
                      <MenuItem key="view">查看详情</MenuItem>
                    </Menu>
                  }
                >
                  <div tw="flex items-center p-0.5 cursor-pointer hover:bg-line-dark rounded-sm">
                    <Icon name="more" clickable changeable type="light" />
                  </div>
                </Tooltip>
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
        draft.state = query.state || 0
        draft.instance_id = query.instanceId || ''
        draft.job_id = query.jobId || modalData.id || ''
        draft.version = query.version || modalData.version || ''
        draft.offset = 0
      })
    }, [
      query.state,
      query.instanceId,
      query.jobId,
      modalData.id,
      query.version,
      modalData.version,
      setFilter,
    ])

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
