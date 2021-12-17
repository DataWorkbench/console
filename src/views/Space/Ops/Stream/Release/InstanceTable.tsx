import { Button, InputSearch, Menu } from '@QCFE/lego-ui'
import {
  Modal,
  Table,
  Icon,
  ToolBar,
  Divider,
  localstorage,
} from '@QCFE/qingcloud-portal-ui'
import { FlexBox, Center, Tooltip, TextLink } from 'components'
import dayjs from 'dayjs'
import {
  getJobInstanceKey,
  useMutationInstance,
  useQueryJobInstances,
} from 'hooks'
import { omitBy, get } from 'lodash-es'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { useQueryClient } from 'react-query'
import { useImmer } from 'use-immer'
import { InstanceState } from '../constants'

interface IFilter {
  job_id?: string
  limit: number
  offset: number
  version?: number
  reverse?: boolean
  name?: string
  state?: number
  sort_by?: string
}

const columnSettingsKey = 'ASSOIATE_INSTANCE_COLUMN_SETTINGS'

const { MenuItem } = Menu

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
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
    const [selectedRows, setSelectedRows] = useState<any>([])
    const [selectedMap, setSelectedMap] = useState<any>({})
    const [columnSettings, setColumnSettings] = useState(
      localstorage.getItem(columnSettingsKey) || []
    )
    const [filter, setFilter] = useImmer<IFilter>({
      job_id: '',
      limit: 10,
      offset: 0,
      reverse: true,
      sort_by: 'updated',
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

    const handleTerminate = (row?: any) => {
      let targets: object[] = []
      if (row) {
        targets = [{ ins_id: row.id, job_id: row.job_id }]
      } else {
        targets = selectedRowKeys.map((key) => ({
          inst_id: key,
          job_id: selectedRows.find((el: any) => el.id === key).job_id,
        }))
      }

      Modal.warning({
        title: '强制终止实例',
        content: (
          <div tw="text-neut-8">
            实例终止后将取消运行，您需要再次进行发布实例，此操作无法撤回，您确定终止该实例吗？
          </div>
        ),
        okType: 'danger',
        okText: '终止',
        confirmLoading: mutation.isLoading,
        onOk: () => {
          mutation.mutate(
            {
              op: 'stop',
              inst_ids: targets,
            },
            {
              onSuccess: () => {
                setSelectedRowKeys([])
                setSelectedRows([])
                setSelectedMap({})
                refetchData()
              },
            }
          )
        },
      })
    }

    const handleResume = () => {
      mutation.mutate(
        {
          op: 'stop',
          inst_ids: [],
        },
        {
          onSuccess: () => {
            setSelectedRowKeys([])
            setSelectedRows([])
            setSelectedMap({})
            refetchData()
          },
        }
      )
    }

    const handleMenuClick = (op: OP, row: any) => {
      if (op === 'stop') {
        handleTerminate(row)
      } else if (op === 'enable') {
        handleResume()
      }
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
        title: '结束时间',
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
                {row.state === 1 ? (
                  <TextLink tw="cursor-not-allowed text-blue-10!">
                    查看详情
                  </TextLink>
                ) : (
                  <TextLink
                    href={`//${row.id}.flink.databench.io`}
                    target="_blank"
                  >
                    查看详情
                  </TextLink>
                )}
              </Button>
              <Divider
                type="vertical"
                height={20}
                style={{ borderColor: '#475569', margin: '0 14px 0 5px' }}
              />
              <Center>
                {[1, 2, 3, 4].includes(row.state) ? (
                  <Tooltip
                    trigger="click"
                    placement="bottom-end"
                    arrow={false}
                    content={
                      <Menu
                        onClick={(e: any, key: OP) => handleMenuClick(key, row)}
                      >
                        {row.state === 4 && (
                          <MenuItem key="enable">恢复</MenuItem>
                        )}
                        <MenuItem key="stop">终止</MenuItem>
                      </Menu>
                    }
                  >
                    <div tw="flex items-center">
                      <Icon name="more" clickable changeable type="light" />
                    </div>
                  </Tooltip>
                ) : (
                  <Icon
                    name="more"
                    tw="cursor-not-allowed"
                    color={{ primary: '#4C5E70', secondary: '' }}
                    type="light"
                  />
                )}
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
        draft.job_id = query.id || modalData.id || ''
        draft.state = query.state || 0
      })
    }, [modalData.id, query, setFilter])

    useEffect(() => {
      setSelectedRows(selectedRowKeys.map((el: string) => selectedMap[el]))
    }, [selectedMap, selectedRowKeys])

    return (
      <FlexBox orient="column">
        <FlexBox tw="justify-between pt-6 pb-3">
          <div>
            <Button
              disabled={!selectedRowKeys.length}
              onClick={() => handleTerminate()}
            >
              <Icon name="stop" />
              终止
            </Button>
            <Button
              disabled={!selectedRowKeys.length}
              onClick={() => handleResume()}
              tw="ml-2"
            >
              <Icon
                name="restart"
                color={{ primary: '#939EA9', secondary: '#B6C2CD' }}
              />
              恢复
            </Button>
          </div>
          <Center tw="space-x-3">
            {type === 'modal' && (
              <InputSearch
                tw="w-64"
                placeholder="请输入作业流程名称/版本进行搜索"
                onPressEnter={(e: React.SyntheticEvent) => {
                  setFilter((draft) => {
                    draft.name = (e.target as HTMLInputElement).value
                  })
                }}
                onClear={() => {
                  setFilter((draft) => {
                    draft.name = ''
                  })
                }}
              />
            )}
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
          selectType="checkbox"
          loading={isFetching}
          selectedRowKeys={selectedRowKeys}
          dataSource={infos || []}
          columns={filterColumn.length > 0 ? filterColumn : columns}
          onSelect={(keys: string[], rows: any) => {
            setSelectedRowKeys(keys)
            const rowsMap = rows.reduce((acc: any, cur: any) => {
              acc[cur.id] = cur
              return acc
            }, {})
            setSelectedMap({ ...selectedMap, ...rowsMap })
          }}
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
      </FlexBox>
    )
  }
)

export default {}
