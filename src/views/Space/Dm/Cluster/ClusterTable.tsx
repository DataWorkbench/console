import React, { useMemo, useState, useEffect, useRef } from 'react'
import { useImmer } from 'use-immer'
import { Menu, Checkbox } from '@QCFE/lego-ui'
import { useParams } from 'react-router-dom'
import {
  Button,
  Icon,
  InputSearch,
  Table,
  ToolBar,
  localstorage,
  Loading,
  Modal as LegoModal,
} from '@QCFE/qingcloud-portal-ui'
import {
  FlexBox,
  Center,
  Modal,
  Tooltip,
  AffixLabel,
  TextLink,
  RouterLink,
} from 'components'
import { useQueryClient } from 'react-query'
import { observer } from 'mobx-react-lite'
import {
  useStore,
  useQueryFlinkClusters,
  getFlinkClusterKey,
  useMutationCluster,
  useMutationReleaseJobs,
  useQueryBindResouce,
} from 'hooks'
import { get, omitBy, pick, concat } from 'lodash-es'
import dayjs from 'dayjs'
import tw, { styled, css, theme } from 'twin.macro'
import { useWindowSize } from 'react-use'
import ClusterModal from './ClusterModal'

const { MenuItem } = Menu as any

const TableWrapper = styled(Table)(() => [
  css`
    .table-row:hover {
      .cluster-name {
        ${tw`text-green-11`}
      }
      .cluster-icon {
        ${tw`bg-green-12 bg-opacity-50 border-green-4 border-opacity-40`}
        svg {
          ${tw`text-green-11`}
          fill: ${theme`colors.green.4`};
        }
      }
    }
  `,
])

const statusFilters = [
  // {
  //   text: '已删除',
  //   value: 1,
  //   color: {
  //     primary: '#939EA9',
  //     secondary: '#DEE7F1',
  //   },
  // },
  {
    text: '运行中',
    value: 2,
    color: {
      primary: '#15A675',
      secondary: '#C6F4E4',
    },
  },
  {
    text: '停止',
    value: 3,
    color: {
      primary: '#939EA9',
      secondary: '#DEE7F1',
    },
  },
  {
    text: '启动中',
    value: 4,
    color: {
      primary: '#2193D3',
      secondary: '#C1E9FF',
    },
  },
  {
    text: '异常',
    value: 5,
    color: {
      primary: '#CF3B37',
      secondary: '#FEF2F2',
    },
  },
  {
    text: '欠费',
    value: 6,
    color: {
      primary: '#A855F7',
      secondary: '#F6EDFF',
    },
  },
]

interface IFilter {
  offset: number
  limit: number
  reverse: boolean
  search: string
  sort_by: string
  status: string | number
  verbose: number
}

const columnSettingsKey = 'DATAOMNIS_CLUSTER_COLUMN_SETTINGS'
const ClusterTable = observer(
  ({
    selectMode = false,
    onSelect,
    selectedIds = [],
  }: {
    selectMode?: boolean
    onSelect?: (clusterId?: any[]) => void
    selectedIds?: string[]
  }) => {
    const { width } = useWindowSize()
    const {
      dmStore: { setOp, op },
    } = useStore()
    const { regionId, spaceId } =
      useParams<{ regionId: string; spaceId: string }>()
    const [opclusterList, setOpClusterList] = useState<any[]>([])
    const [selectedRowKeys, setSelectedRowKeys] =
      useState<string[]>(selectedIds)
    const offLineRef = useRef({
      stopRunning: false,
      jobId: null,
    })
    const [columnSettings, setColumnSettings] = useState(
      localstorage.getItem(columnSettingsKey) || []
    )

    const { ret: bindResourceRet, key: bindResKey } = useQueryBindResouce(
      opclusterList.map((row) => row.id),
      {
        enabled: (op === 'delete' || op === 'stop') && opclusterList.length > 0,
      }
    )

    const [filter, setFilter] = useImmer<IFilter>({
      offset: 0,
      limit: 10,
      reverse: true,
      search: '',
      sort_by: '',
      status: selectMode ? 2 : '',
      verbose: 1,
    })
    const queryClient = useQueryClient()
    const mutation = useMutationCluster()
    const releaseMutation = useMutationReleaseJobs()

    useEffect(() => {
      if (selectMode) {
        // && selectedIds.length
        setSelectedRowKeys(selectedIds)
      }
    }, [selectMode, selectedIds])
    useEffect(() => {
      if (op === '') {
        setOpClusterList([])
      }
    }, [op])

    const isSmallScreen = useMemo(() => width < 1280, [width])

    const columns = useMemo(() => {
      return [
        {
          title: '名称/ID',
          dataIndex: 'name',
          width: 192,
          fixedInSetting: true,
          render: (v: any, row: any) => (
            <FlexBox
              tw="items-center cursor-pointer"
              onClick={() => {
                setOp('view')
                setOpClusterList([row])
              }}
            >
              <Center
                className="cluster-icon"
                tw="bg-neut-13 rounded-full box-content border-2 border-neut-16 w-6 h-6 mr-1.5"
              >
                <Icon name="pod" type="light" size={16} />
              </Center>
              <div tw="flex-1 break-all">
                <div tw="font-semibold" className="cluster-name">
                  {row.name}
                </div>
                <div tw="text-neut-8">{row.id}</div>
              </div>
            </FlexBox>
          ),
        },
        {
          title: (
            <FlexBox tw="items-center">
              <span>状态</span>
              {!selectMode && (
                <Tooltip
                  trigger="click"
                  placement="bottom-start"
                  content={
                    <Menu
                      selectedKey={String(filter.status || 'all')}
                      onClick={(
                        e: React.SyntheticEvent,
                        k: string,
                        v: number
                      ) => {
                        setFilter((draft) => {
                          draft.status = v
                          draft.offset = 0
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
              )}
            </FlexBox>
          ),
          width: 90,
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
          width: !isSmallScreen && 160,
          dataIndex: 'version',
        },
        {
          title: (
            <AffixLabel
              help="Flink 的 TaskManager 的数量"
              required={false}
              theme="green"
            >
              TM 数量
            </AffixLabel>
          ),
          dataIndex: 'task_num',
          render: (v: number) => v,
        },
        {
          title: (
            <AffixLabel
              help={
                <>
                  <div>Flink 的 TaskManager 的 CPU 和内存设置</div>
                  <div>每 CU 为 1 核 4 GB</div>
                </>
              }
              required={false}
              theme="green"
            >
              TM 规格
            </AffixLabel>
          ),
          dataIndex: 'task_cu',
          render: (v: number) => `${v} CU`,
        },
        {
          title: (
            <AffixLabel
              help={
                <>
                  <div>Flink 的 JobManager 的 CPU 和内存设置</div>
                  <div>每 CU 为 1 核 4 GB</div>
                </>
              }
              required={false}
              theme="green"
            >
              JM 规格
            </AffixLabel>
          ),
          dataIndex: 'job_cu',
          render: (v: number) => `${v} CU`,
        },
        {
          title: '最近更新时间',
          dataIndex: 'updated',
          sortable: true,
          width: !isSmallScreen && 150,
          // filter.reverse ? 'asc' : 'desc',
          sortOrder:
            // eslint-disable-next-line no-nested-ternary
            filter.sort_by === 'updated'
              ? filter.reverse
                ? 'asc'
                : 'desc'
              : '',
          render: (v: number) => dayjs(v * 1000).format('YYYY-MM-DD HH:mm:ss'),
        },
        !selectMode && {
          title: '操作',
          dataIndex: 'id',
          hiddenInSetting: true,
          width: 150,
          render: (v: any, row: any) => (
            <FlexBox tw="items-center">
              <Button type="text">
                <TextLink href={`//${row.web_ui}`} target="_blank">
                  Flink UI
                </TextLink>
              </Button>
              <div tw="text-neut-8 mr-2">|</div>
              {/* <Button
                type="text"
                disabled={[2, 4].includes(row.status)}
                onClick={() => {
                  setOp('update')
                  setOpClusterList([row])
                }}
              >
                修改
              </Button> */}
              <Center>
                <Tooltip
                  trigger="click"
                  placement="bottom"
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
                      onClick={(e: any, key: any) => {
                        setOp(key)
                        setOpClusterList([row])
                      }}
                    >
                      <MenuItem key="view">查看详情</MenuItem>
                      {(row.status === 2 || row.status === 4) && (
                        <MenuItem key="stop">停用</MenuItem>
                      )}
                      {row.status === 3 && (
                        <MenuItem key="start">启动</MenuItem>
                      )}
                      <MenuItem
                        key="update"
                        disabled={[2, 4].includes(row.status)}
                      >
                        <AffixLabel
                          required={false}
                          // help="如需修改，请先停用计算集群"
                          help={
                            [2, 4].includes(row.status) &&
                            '如需修改，请先停用计算集群'
                          }
                          theme="light"
                        >
                          修改
                        </AffixLabel>
                      </MenuItem>
                      <MenuItem
                        key="delete"
                        disabled={[2, 4].includes(row.status)}
                      >
                        <AffixLabel
                          required={false}
                          help={
                            [2, 4].includes(row.status) &&
                            '如需删除，请先停用计算集群'
                          }
                          theme="light"
                        >
                          删除
                        </AffixLabel>
                      </MenuItem>
                    </Menu>
                  }
                >
                  <div tw="flex items-center p-0.5 cursor-pointer hover:bg-line-dark rounded-sm">
                    <Icon
                      name="more"
                      clickable
                      changeable
                      type="light"
                      size={20}
                    />
                  </div>
                </Tooltip>
              </Center>
            </FlexBox>
          ),
        },
      ].filter(Boolean)
    }, [
      setOp,
      setOpClusterList,
      filter.reverse,
      filter.sort_by,
      filter.status,
      setFilter,
      selectMode,
      isSmallScreen,
    ])

    const refetchData = () => {
      queryClient.invalidateQueries(getFlinkClusterKey())
    }

    const mutateData = () => {
      const clusterIds = opclusterList.map((o) => o.id)
      mutation.mutate(
        {
          op,
          clusterIds,
        },
        {
          onSuccess: () => {
            setOp('')
            refetchData()
            if (op === 'delete') {
              setSelectedRowKeys(
                selectedRowKeys.filter((k) => !clusterIds.includes(k))
              )
            }
          },
        }
      )
    }
    const { isFetching, isRefetching, data } = useQueryFlinkClusters(
      omitBy(filter, (v) => v === '')
    )
    const infos = get(data, 'infos', []) || []
    // const filterClusterInfos =
    //   infos.filter(
    //     (info: any) =>
    //       selectedRowKeys.includes(info.id) &&
    //       info.status !== 2 &&
    //       info.status !== 4
    //   ) || []

    const handleJobOffLine = (job) => {
      offLineRef.current.jobId = job.id
      LegoModal.warning({
        confirmLoading: mutation.isLoading,
        title: `下线作业 ${job.name}`,
        okType: 'danger',
        okText: '下线',
        content: (
          <>
            <div tw="text-neut-8 mb-2">
              作业下线后，相关实例需要手动恢复执行，确认从调度系统移除作业么?
            </div>
            <Checkbox
              tw="text-white!"
              defaultChecked={get(offLineRef.current, 'stopRunning') || false}
              onChange={(_: any, checked: boolean) => {
                offLineRef.current.stopRunning = checked
              }}
            >
              同时停止运行中的实例
            </Checkbox>
          </>
        ),
        onOk: () => {
          releaseMutation.mutate(
            {
              op: 'stop',
              jobId: job.id,
              stopRunning: get(offLineRef.current, 'stopRunning') || false,
            },
            {
              onSuccess: () => {
                queryClient.invalidateQueries(bindResKey)
              },
            }
          )
        },
      })
    }

    // console.log('onRender offLineRef: ', offLineRef.current)
    const filterColumn = columnSettings
      .map((o: { key: string; checked: boolean }) => {
        return o.checked && columns.find((col) => col.dataIndex === o.key)
      })
      .filter((o) => o)
    const opWordInfo = { start: '启动', stop: '停用', delete: '删除' }
    const { data: bindResData } = bindResourceRet

    const bindResDataJobs = useMemo(() => {
      const streamJob = get(bindResData, 'infos[0].stream_job_release') || []
      const syncJob = get(bindResData, 'infos[0].sync_job_release') || []
      return concat(streamJob, syncJob)
    }, [bindResData])
    const hasBindRes = bindResDataJobs.length > 0
    return (
      <FlexBox tw="w-full flex-1" orient="column">
        <div tw="mb-3">
          <FlexBox tw="justify-between">
            {selectMode ? (
              <div tw="text-neut-8">
                如需选择新的计算集群，您可以到
                <RouterLink to={`/${regionId}/workspace/${spaceId}/dm/cluster`}>
                  计算集群列表
                </RouterLink>
                进行创建
              </div>
            ) : (
              <Center tw="space-x-3">
                <Tooltip
                  theme="light"
                  placement="top-start"
                  animation="fade"
                  disabled={infos.length < 5}
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
                {/* <Button
                  disabled={
                    selectedRowKeys.length === 0 ||
                    filterClusterInfos.length === 0
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
                </Button> */}
              </Center>
            )}
            <Center tw="space-x-3">
              <InputSearch
                tw="w-64"
                placeholder="请输入关键词进行搜索"
                onPressEnter={(e: React.SyntheticEvent) => {
                  setFilter((draft) => {
                    draft.search = (e.target as HTMLInputElement).value
                    draft.offset = 0
                  })
                }}
                onClear={() => {
                  setFilter((draft) => {
                    draft.search = ''
                    draft.offset = 0
                  })
                }}
              />
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
        </div>
        <TableWrapper
          // selectType={selectMode ? 'radio' : 'checkbox'}
          selectType={selectMode && 'radio'}
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
            if (onSelect) {
              onSelect(infos.filter((info: any) => keys.includes(info.id)))
            }
          }}
          onSort={(sortKey: any, order: string) => {
            setFilter((draft) => {
              draft.sort_by = sortKey
              draft.reverse = order === 'asc'
            })
          }}
        />
        {(op === 'create' || op === 'update' || op === 'view') && (
          <ClusterModal opCluster={opclusterList[0]} />
        )}

        {(op === 'start' || op === 'stop' || op === 'delete') && (
          <Modal
            noBorder
            visible
            draggable
            width={
              opclusterList.length > 1 || (op !== 'start' && hasBindRes)
                ? 800
                : 400
            }
            onCancel={() => setOp('')}
            footer={
              <>
                {(op === 'start' ||
                  (!bindResourceRet.isFetching && !hasBindRes)) && (
                  <div tw="flex justify-end">
                    <Button onClick={() => setOp('')}>取消</Button>
                    <Button
                      type={op === 'start' ? 'primary' : 'danger'}
                      onClick={mutateData}
                      loading={mutation.isLoading}
                    >
                      {opWordInfo[op]}
                    </Button>
                  </div>
                )}
              </>
            }
            // okText={opWordInfo[op]}
            // onOk={mutateData}
            // okType={op === 'start' ? 'primary' : 'danger'}
            // confirmLoading={mutation.isLoading}
          >
            <FlexBox tw="mb-3">
              <Icon
                name="if-exclamation"
                css={css`
                  color: #ffd127;
                  font-size: 22px;
                  line-height: 24px;
                `}
              />
              <section tw="flex-1 w-full pl-3">
                {(() => {
                  // const txtObj = { start: '启动', stop: '停用', delete: '删除' }
                  const opText = opWordInfo[op]
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
                        <div tw="font-medium mb-2 text-base break-all">
                          {clusterText}
                        </div>
                        <div className="modal-content-message" tw="break-all">
                          确定启动{clusterText}吗？
                        </div>
                      </>
                    )
                  }

                  return (
                    <>
                      <div tw="font-medium mb-2 text-base break-all">
                        {clusterText}
                        {hasBindRes && '注意事项'}
                      </div>
                      <div
                        className="modal-content-message"
                        tw="break-all text-neut-8"
                      >
                        {bindResourceRet.isFetching ? (
                          <div tw="h-20">
                            <Loading />
                          </div>
                        ) : (
                          <>
                            {hasBindRes ? (
                              <>
                                <div tw="mb-6">
                                  当前集群存在已发布作业，将已发布作业下线后，可
                                  {opText}计算集群
                                </div>
                                <div tw="text-white leading-[48px]">
                                  <Table
                                    dataSource={bindResDataJobs}
                                    rowKey="id"
                                    columns={[
                                      { title: '作业名称', dataIndex: 'name' },
                                      { title: '作业ID', dataIndex: 'id' },
                                      {
                                        title: '操作',
                                        dataIndex: '',
                                        render: (field, row) => (
                                          <Button
                                            loading={
                                              get(
                                                offLineRef,
                                                'current.jobId'
                                              ) === row.id &&
                                              releaseMutation.isLoading
                                            }
                                            onClick={() => {
                                              handleJobOffLine(row)
                                            }}
                                          >
                                            下线
                                          </Button>
                                        ),
                                      },
                                    ]}
                                  />
                                  {/* <div tw="border-b border-b-neut-13 pl-4">
                                    作业ID
                                  </div>
                                  <>
                                    {bindResDataJobs.map((item: any) => (
                                      <div
                                        key={item.id}
                                        tw="flex items-center border-b border-b-neut-13 pl-4 font-medium"
                                      >
                                        <Center
                                          tw="bg-neut-13 rounded-full w-7 h-7 mr-1.5 border-2 border-solid border-neut-16 "
                                          className="release-icon"
                                        >
                                          <Icons
                                            name="stream-release"
                                            size={16}
                                          />
                                        </Center>
                                        <div>
                                          {item.name} : {item.id}
                                        </div>
                                      </div>
                                    ))}
                                  </> */}
                                </div>
                              </>
                            ) : (
                              <>
                                {op === 'stop'
                                  ? `确认${opText}计算集群`
                                  : `${opText}后无法恢复，确认删除计算集群`}
                                {opclusterList
                                  .map(
                                    (cluster) =>
                                      `${cluster.name}(${cluster.id})`
                                  )
                                  .join(' ')}
                                {` ?`}
                              </>
                            )}
                          </>
                        )}
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
                  columns={columns
                    .filter((col) =>
                      ['name', 'version', 'updated'].includes(col.dataIndex)
                    )
                    .map((col) => pick(col, ['title', 'dataIndex', 'render']))}
                />
              )}
            </>
          </Modal>
        )}
      </FlexBox>
    )
  }
)

export default ClusterTable
