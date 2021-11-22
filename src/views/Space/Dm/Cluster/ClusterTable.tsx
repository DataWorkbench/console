import React, { useMemo, useState, useEffect } from 'react'
import { useImmer } from 'use-immer'
import { Menu } from '@QCFE/lego-ui'
import {
  Button,
  Icon,
  InputSearch,
  Table,
  ToolBar,
  localstorage,
} from '@QCFE/qingcloud-portal-ui'
import { FlexBox, Center, Modal, Tooltip, AffixLabel } from 'components'
import { useQueryClient } from 'react-query'
import { observer } from 'mobx-react-lite'
import {
  useStore,
  useQueryFlinkClusters,
  getFlinkClusterKey,
  useMutationCluster,
} from 'hooks'
import { get, omitBy } from 'lodash-es'
import dayjs from 'dayjs'
import { css } from 'twin.macro'
import ClusterModal from './ClusterModal'

const { MenuItem } = Menu

const statusFilters = [
  {
    text: '运行中',
    value: 1,
    color: {
      primary: '#15A675',
      secondary: '#C6F4E4',
    },
  },
  {
    text: '停止',
    value: 2,
    color: {
      primary: '#939EA9',
      secondary: '#DEE7F1',
    },
  },
  {
    text: '启动中',
    value: 3,
    color: {
      primary: '#2193D3',
      secondary: '#C1E9FF',
    },
  },
  {
    text: '异常',
    value: 4,
    color: {
      primary: '#CF3B37',
      secondary: '#FEF2F2',
    },
  },
  {
    text: '欠费',
    value: 5,
    color: {
      primary: '#A855F7',
      secondary: '#F6EDFF',
    },
  },
]

interface IFilter {
  name: string
  offset: number
  limit: number
  reverse: boolean
  search: string
  sort_by: string
  status: string | number
}

const columnSettingsKey = 'BIGDATA_CLUSTER_COLUMN_SETTINGS'
const ClusterTable = observer(() => {
  const {
    dmStore: { setOp, op },
  } = useStore()
  const [opclusterList, setOpClusterList] = useState<any[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [columnSettings, setColumnSettings] = useState(
    localstorage.getItem(columnSettingsKey) || []
  )
  const [filter, setFilter] = useImmer<IFilter>({
    name: '',
    offset: 0,
    limit: 10,
    reverse: true,
    search: '',
    sort_by: '',
    status: '',
  })
  const queryClient = useQueryClient()
  const mutation = useMutationCluster()

  useEffect(() => {
    if (op === '') {
      setOpClusterList([])
    }
  }, [op])

  const columns = useMemo(() => {
    return [
      {
        title: '名称/ID',
        dataIndex: 'name',
        fixedInSetting: true,
        render: (v: any, row: any) => (
          <FlexBox tw="items-center space-x-1">
            <Center tw="bg-neut-13 rounded-full w-6 h-6">
              <Icon name="pod" type="light" />
            </Center>
            <div>
              <div>{row.name}</div>
              <div>{row.id}</div>
            </div>
          </FlexBox>
        ),
      },
      {
        title: (
          <FlexBox tw="items-center">
            <span>状态</span>
            <Tooltip
              trigger="click"
              placement="bottom-start"
              content={
                <Menu
                  selectedKey={String(filter.status || 'all')}
                  onClick={(e: React.SyntheticEvent, k: string, v: number) => {
                    setFilter((draft) => {
                      draft.status = v
                    })
                  }}
                >
                  <MenuItem value="" key="all">
                    全部
                  </MenuItem>
                  {statusFilters.map((st) => (
                    <MenuItem value={st.value} key={st.value}>
                      {st.text}
                    </MenuItem>
                  ))}
                </Menu>
              }
            >
              <Icon name="filter" type="light" clickable tw="ml-1 block" />
            </Tooltip>
          </FlexBox>
        ),
        dataIndex: 'status',
        render: (v: number) => {
          const statusObj = statusFilters.find((o) => o.value === v)
          return (
            <FlexBox tw="items-center space-x-1">
              <Icon name="radio" color={statusObj?.color} />
              <span>{statusObj?.text}</span>
            </FlexBox>
          )
        },
      },
      {
        title: '版本',
        dataIndex: 'version',
      },
      {
        title: (
          <AffixLabel
            help="Flink 的 TaskManager 的 CPU 和内存设置单个集群： 0.5≤TaskManager CU≦8"
            required={false}
            theme="green"
          >
            TaskManager
          </AffixLabel>
        ),
        dataIndex: 'task_cu',
        render: (v: number) => `${v} CU`,
      },
      {
        title: (
          <AffixLabel
            help="Flink 的 JobManager 的 CPU 和内存设置单个集群： 0.5≤JobManager CU≦8"
            required={false}
            theme="green"
          >
            JobManager
          </AffixLabel>
        ),
        dataIndex: 'job_cu',
        render: (v: number) => `${v} CU`,
      },
      {
        title: '最近更新时间',
        dataIndex: 'updated',
        sortable: true,
        sortOrder: filter.reverse ? 'asc' : 'desc',
        render: (v: number) => dayjs(v * 1000).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '操作',
        dataIndex: 'id',
        hiddenInSetting: true,
        render: (v: any, row: any) => (
          <FlexBox tw="items-center">
            <Button type="text">Flink UI</Button>
            <Button
              type="text"
              disabled={[1, 3].includes(row.status)}
              onClick={() => {
                setOp('update')
                setOpClusterList([row])
              }}
            >
              修改
            </Button>
            <Center>
              <Tooltip
                trigger="click"
                placement="bottom"
                arrow={false}
                content={
                  <Menu
                    onClick={(e: any, key: any) => {
                      setOp(key)
                      setOpClusterList([row])
                    }}
                  >
                    <MenuItem key="view">查看详情</MenuItem>
                    {(row.status === 1 || row.status === 3) && (
                      <MenuItem key="stop">停用</MenuItem>
                    )}
                    {row.status === 2 && <MenuItem key="start">启动</MenuItem>}
                    <MenuItem
                      key="delete"
                      disabled={[1, 3].includes(row.status)}
                    >
                      删除
                    </MenuItem>
                  </Menu>
                }
              >
                <div tw="flex items-center">
                  <Icon name="more" clickable changeable type="light" />
                </div>
              </Tooltip>
            </Center>
          </FlexBox>
        ),
      },
    ]
  }, [setOp, setOpClusterList, filter.reverse, filter.status, setFilter])

  const refetchData = () => {
    queryClient.invalidateQueries(getFlinkClusterKey())
  }

  const mutateData = () => {
    mutation.mutate(
      {
        op,
        clusterIds: opclusterList.map((o) => o.id),
      },
      {
        onSuccess: () => {
          setOp('')
          refetchData()
          setSelectedRowKeys([])
        },
      }
    )
  }

  const { isFetching, isRefetching, data } = useQueryFlinkClusters(
    omitBy(filter, (v) => v === '')
  )
  const infos = get(data, 'infos', []) || []
  const filterClusterInfos =
    infos.filter(
      (info: any) =>
        selectedRowKeys.includes(info.id) &&
        info.status !== 1 &&
        info.status !== 3
    ) || []

  const filterColumn = columnSettings
    .map((o: { key: string; checked: boolean }) => {
      return o.checked && columns.find((col) => col.dataIndex === o.key)
    })
    .filter((o) => o)

  return (
    <FlexBox tw="w-full flex-1" orient="column">
      <div tw="mb-3">
        <FlexBox tw="justify-between">
          <Center tw="space-x-3">
            <Tooltip
              theme="light"
              placement="top-start"
              animation="fade"
              content={
                <Center tw="h-9 px-3 text-neut-13">
                  单个用户最多可创建 5 个集群，如需更多集群，请提交工单
                </Center>
              }
            >
              <Button
                type="primary"
                disabled={infos.length > 4}
                onClick={() => setOp('create')}
              >
                <Icon name="add" />
                创建集群
              </Button>
            </Tooltip>
            <Button
              disabled={
                selectedRowKeys.length === 0 || filterClusterInfos.length === 0
              }
              onClick={() => {
                if (filterClusterInfos.length) {
                  setOpClusterList(filterClusterInfos)
                  setOp('delete')
                }
              }}
            >
              <Icon name="trash" type="light" />
              <span>删除</span>
            </Button>
          </Center>
          <Center tw="space-x-3">
            <InputSearch
              tw="w-64"
              placeholder="请输入关键词进行搜索"
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
            <Button loading={isRefetching}>
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
      </div>
      <Table
        selectType="checkbox"
        dataSource={infos || []}
        loading={isFetching}
        columns={filterColumn.length > 0 ? filterColumn : columns}
        rowKey="id"
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
        selectedRowKeys={selectedRowKeys}
        onSelect={(keys: string[]) => {
          setSelectedRowKeys(keys)
        }}
        onSort={(sortKey: any, order: string) => {
          setFilter((draft) => {
            draft.sort_by = sortKey
            draft.reverse = order === 'asc'
          })
        }}
        // onFilterChange={(filters: any) => {
        //   const status = get(filters, 'status', '')
        //   setFilter((draft) => {
        //     draft.status = ['', 'all'].includes(status) ? '' : +status
        //   })
        // }}
      />
      {(op === 'create' || op === 'update' || op === 'view') && (
        <ClusterModal opCluster={opclusterList[0]} />
      )}
      {(op === 'start' || op === 'stop' || op === 'delete') && (
        <Modal
          noBorder
          visible
          width={opclusterList.length > 1 ? 600 : 400}
          onCancel={() => setOp('')}
          onOk={mutateData}
          okType={op === 'start' ? 'primary' : 'danger'}
          confirmLoading={mutation.isLoading}
        >
          <FlexBox tw="space-x-3 mb-3">
            <Icon
              name="if-exclamation"
              css={css`
                color: #ffd127;
                font-size: 22px;
                line-height: 24px;
              `}
            />
            <section tw="flex-1">
              {(() => {
                const txtObj = { start: '启动', stop: '停用', delete: '删除' }
                const opText = txtObj[op]
                const opclusterLen = opclusterList.length

                const clusterText =
                  opclusterLen === 1 ? (
                    <>
                      {opText}计算集群{opclusterList[0].name}
                      <span tw="text-neut-8 break-all">
                        ({opclusterList[0].id})
                      </span>
                    </>
                  ) : (
                    <>
                      {opText}以下{opclusterList.length}个计算集群
                    </>
                  )
                if (op === 'start') {
                  return (
                    <>
                      <div tw="font-medium mb-2 text-base">{clusterText}</div>
                      <div className="modal-content-message">
                        确定启动{clusterText}吗？
                      </div>
                    </>
                  )
                }

                return (
                  <>
                    <div tw="font-medium mb-2 text-base">
                      {clusterText}注意事项
                    </div>
                    <div className="modal-content-message">
                      {clusterText}后，已发布的作业和正在运行中实例会受到影响
                      {op === 'stop'
                        ? `。确认${opText}吗？`
                        : ', 且该操作无法撤回。确认删除吗？'}
                    </div>
                  </>
                )
              })()}
            </section>
          </FlexBox>
          <>
            {opclusterList.length > 1 && (
              <Table
                dataSource={opclusterList}
                rowKey="id"
                columns={columns.filter((col) =>
                  ['name', 'status', 'version'].includes(col.dataIndex)
                )}
              />
            )}
          </>
        </Modal>
      )}
    </FlexBox>
  )
})

export default ClusterTable
