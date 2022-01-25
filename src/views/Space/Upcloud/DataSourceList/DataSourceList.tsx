import React, { useState, useEffect, useRef, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import tw, { css, styled } from 'twin.macro'
import { useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { get, pick } from 'lodash-es'
import { useImmer } from 'use-immer'
import { Input, Menu } from '@QCFE/lego-ui'
import {
  PageTab,
  Icon,
  Button,
  Loading,
  Table,
  ToolBar,
  Modal,
  InputSearch,
  ToolBarLeft,
  ToolBarRight,
  utils,
} from '@QCFE/qingcloud-portal-ui'
import { useQuerySource, useMutationSource, useStore } from 'hooks'
import { Card, Center, ContentBox, FlexBox, Icons, Tooltip } from 'components'
import { getHelpCenterLink } from 'utils'

import DataSourceModal from './DataSourceModal'
import DataEmpty from './DataEmpty'
import { SourceKindImg } from './styled'
import {
  DataSourcePingHistoriesModal,
  DataSourcePingModal,
  getPingConnection,
} from './DataSourcePing'
import { NetworkContext } from './NetworkProvider'
import { usePingEvent } from './DataSourcePing/hooks'

const { MenuItem } = Menu

const getEllipsisText = (text: string, lenght: number) => {
  let index = 0
  let count = 0
  while (index < text.length) {
    const temp = count + (text[index].charCodeAt(0) <= 255 ? 1 : 2) // 中文算2个字
    if (temp >= lenght) {
      // 判断是否溢出
      return `${text.slice(0, index)}...`
    }
    count = temp
    index += 1
  }
  return text
}

const tabs = [
  {
    title: '数据源',
    description:
      '数据源定义结构化数据库、非结构化数据库、半结构化数据库以及消息队列等多种数据类型，主要用于数据集成和数据加工。您可以在数据源列表进行编辑和停用/启用管理。',
    icon: 'blockchain',
    helpLink: getHelpCenterLink('/manual/data_up_cloud/data_summary/'),
  },
]

const confirmMsgInfo: any = {
  disable: {
    name: '停用',
    desc: '已发布调度未运行的任务将不会再使用该数据源内的所有表数据，是否确认进行停用操作？',
  },
  enable: {
    name: '启动',
    desc: '启用该数据源，已发布调度未运行的任务将使用该数据源内的所有表数据，是否确认进行启用操作？',
  },
  delete: {
    name: '删除',
    desc: '数据源删除后新建作业将无法引用，该操作无法撤回，请谨慎操作。',
  },
}

const Root = styled('div')(() => [
  tw`h-full flex flex-col`,
  css`
    .page-tab-container {
      margin-bottom: 20px;
    }
  `,
])

const ModalWrapper = styled(Modal)(() => [
  css`
    .modal-card-head {
      border-bottom: 0;
    }
    .modal-card-body {
      padding-top: 0;
    }
    .modal-card-foot {
      border-top: 0;
    }
  `,
])

const columnSettingsKey = 'DATAOMNIS_SOURCELISTS_COLUMN_SETTINGS'

const getUrl = (
  urlObj: Record<string, any>,
  type:
    | 'hbase'
    | 'kafka'
    | 'ftp'
    | 'hdfs'
    | 'mysql'
    | 'clickhouse'
    | 'postgresql'
) => {
  switch (type) {
    case 'hbase':
      return `${urlObj.zookeeper}${urlObj.z_node}`
    case 'kafka':
      return urlObj.kafka_brokers
    case 'ftp':
      return `ftp://${urlObj?.host}:${urlObj?.port}`
    case 'hdfs':
      return `${urlObj?.nodes?.name_node}:${urlObj?.nodes?.port}`
    default:
      return `${type}://${urlObj.host}:${urlObj.port}/${urlObj.database}`
  }
}
const DataSourceList = observer(() => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [columnSettings, setColumnSettings] = useState([])
  const [searchName, setSearchName] = useState('')
  const [isReFetching, setIsReFetching] = useState(false)
  const [delText, setDelText] = useState('')
  const {
    dataSourceStore: {
      op,
      opSourceList,
      mutateOperation,
      sourceKinds,
      showPingHistories,
      addEmptyHistories,
      addItemHistories,
      removeItemHistories,
      itemLoadingHistories,
    },
  } = useStore()
  const { regionId, spaceId } =
    useParams<{ regionId: string; spaceId: string }>()

  const [filter, setFilter] = useImmer<{
    regionId: string
    spaceId: string
    offset: number
    limit: number
    reverse: boolean
    search?: string
    [k: string]: any
  }>({
    regionId,
    spaceId,
    search: '',
    reverse: true,
    offset: 0,
    limit: 10,
  })
  const { isLoading, refetch, data } = useQuerySource(filter)
  const mutation = useMutationSource()

  const { networkMap: networks } = useContext(NetworkContext)

  const shouldRefetch = useRef<string>()
  const removeItem = (sourceId: string, item: Record<'uuid' & string, any>) => {
    removeItemHistories(sourceId, item)
    const shouldUpdate =
      !itemLoadingHistories[sourceId] || !itemLoadingHistories[sourceId].size
    if (shouldUpdate && op === '') {
      refetch()
    } else if (shouldUpdate) {
      shouldRefetch.current = ''
    }
  }

  useEffect(() => {
    if (shouldRefetch.current === op) {
      shouldRefetch.current = undefined
      refetch()
    }
  }, [op, refetch])

  usePingEvent({
    addEmpty: addEmptyHistories,
    addItem: addItemHistories,
    updateEmpty: addEmptyHistories,
    removeItem,
  })

  useEffect(() => {
    setFilter((draft) => {
      draft.offset = 0
      draft.search = ''
      draft.regionId = regionId
      draft.spaceId = spaceId
    })
  }, [regionId, spaceId, setFilter])

  const handleMutate = (params: any) => {
    mutation.mutate(params, {
      onSuccess: () => {
        mutateOperation()
        refetch()
        if (op === 'delete') {
          setSelectedRowKeys([])
        }
      },
      onError: () => {
        mutateOperation()
      },
    })
  }

  const handleOk = () => {
    if (op === '') {
      return
    }
    if (['disable', 'enable', 'delete'].includes(op)) {
      handleMutate({
        op,
        sourceIds: opSourceList.map((r) => r.source_id),
      })
    }
  }

  const defaultColumns = [
    {
      title: '数据源名称/ID',
      dataIndex: 'source_id',
      width: 230,
      render: (v: string, info: any) => {
        const sourceKindName = sourceKinds.find(
          (kind) => kind.source_type === info.source_type
        )?.name
        return (
          <FlexBox tw="space-x-2 items-center">
            <Center>
              {sourceKindName && <SourceKindImg type={sourceKindName as any} />}
            </Center>
            <div tw="flex-1">
              <div>
                <Tooltip content={info.name} hasPadding theme="dark">
                  <span>{getEllipsisText(info.name, 20)}</span>
                </Tooltip>
              </div>
              <div tw="text-neut-8">{v}</div>
            </div>
          </FlexBox>
        )
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (v: number) => {
        if (v === 1) {
          return (
            <Center tw="space-x-1">
              <Icons name="circle_enable" size={12} />
              <span>活跃中</span>
            </Center>
          )
        }
        return (
          <Center tw="space-x-1">
            <Icons name="circle_disable" size={12} />
            <span>已停用</span>
          </Center>
        )
      },
    },
    {
      title: '数据源类型',
      dataIndex: 'source_type',
      render: (v: number) => {
        return sourceKinds.find((kind) => kind.source_type === v)?.name
      },
    },
    {
      title: '连接信息',
      dataIndex: 'url',
      width: 250,
      render: (v: any, row: any) => {
        const kindName = sourceKinds.find(
          (kind) => kind.source_type === row.source_type
        )?.name

        if (kindName) {
          const key = kindName.toLowerCase()
          const urlObj = get(v, key)
          // const networkId = get(urlObj, 'network.vpc_network.network_id')
          const networkName = get(row, 'network_name')
          return (
            <div tw="space-y-1">
              <div tw="truncate flex">
                <>
                  <span tw="inline-block px-1.5 bg-[#E0EBFE] text-center text-[#3B82F6] h-5 w-9 rounded-sm mr-0.5 font-medium">
                    URL
                  </span>
                  <Tooltip
                    theme="darker"
                    content={getUrl(urlObj, key as 'mysql')}
                    hasPadding
                  >
                    <span tw="truncate max-w-[180px] inline-block">
                      {!['mysql', 'clickhouse', 'postgresql'].includes(key)
                        ? getUrl(urlObj, key as 'mysql')
                        : `${getEllipsisText(`${key}://${urlObj.host}`, 16)}:${
                            urlObj.port
                          }/${urlObj.database}`}
                    </span>
                  </Tooltip>
                </>
              </div>
              {networkName && (
                <div tw="truncate">
                  <span tw="inline-block px-1.5 bg-[#F1E4FE] text-[#A855F7] rounded-sm mr-0.5 font-medium">
                    内网
                  </span>
                  {networks.has(
                    get(urlObj, 'network.vpc_network.network_id')
                  ) ? (
                    <Tooltip
                      theme="darker"
                      content={
                        <>
                          <div>
                            {`VPC:   ${
                              networks.get(
                                get(urlObj, 'network.vpc_network.network_id')
                              )?.router_id
                            }`}
                          </div>
                          <div>
                            {`vxnet: ${
                              networks.get(
                                get(urlObj, 'network.vpc_network.network_id')
                              )?.vxnet_id
                            }`}
                          </div>
                        </>
                      }
                      hasPadding
                    >
                      <span title={networkName}>
                        {getEllipsisText(networkName, 26)}
                      </span>
                    </Tooltip>
                  ) : (
                    <span title={networkName}>
                      {getEllipsisText(networkName, 26)}
                    </span>
                  )}
                </div>
              )}
            </div>
          )
        }
        return ''
      },
    },
    {
      title: '数据源可用性',
      dataIndex: 'connection',
      render: (v: 1 | 3, row: Record<string, any>) => {
        const isItemLoading = itemLoadingHistories?.[row.source_id]?.size
        return getPingConnection(isItemLoading ? -1 : v, row)
      },
    },
    {
      title: '数据源描述',
      dataIndex: 'comment',
      render: (v: string) => {
        return (
          <Tooltip content={v} theme="dark" hasPadding>
            <span>{getEllipsisText(v, 20)}</span>
          </Tooltip>
        )
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created',
      sortable: true,
      sortOrder: filter.reverse ? 'desc' : 'asc',
      render: (v: number) => dayjs(v * 1000).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'table_actions',
      width: 150,
      render: (v: string, info: any) => (
        <>
          <Button
            type="text"
            tw="text-green-11! font-semibold"
            onClick={() => {
              mutateOperation('view', [info])
            }}
          >
            查看详情
          </Button>
          <Tooltip
            theme="light"
            trigger="click"
            arrow={false}
            twChild={
              css`
                &[aria-expanded='true'],
                &:hover {
                  ${tw`bg-neut-2 rounded-sm`}
                }
                svg {
                  ${tw`text-black! bg-transparent! fill-[transparent]!`}
                }
              ` as any
            }
            content={
              <Menu
                onClick={(e: React.SyntheticEvent, key: any) => {
                  mutateOperation(key, [info])
                  console.log(2222)
                  // if (key === 'ping') {
                  //   pingIds.current.set(get(info, 'source_id'), 'loading')
                  //   pingMutate(
                  //     {
                  //       op: key,
                  //       source_type: info.source_type,
                  //       url: info.url,
                  //     },
                  //     info.source_id
                  //   )
                  // }
                }}
              >
                <MenuItem key="ping">
                  <Icon name="if-doublecheck" tw="mr-2" />
                  可用性测试
                </MenuItem>
                <MenuItem key="update" disabled={info.status === 2}>
                  <Icon name="pen" tw="mr-2" />
                  编辑
                </MenuItem>
                {info.status === 2 ? (
                  <MenuItem key="enable">
                    <Icon name="start" tw="mr-2" />
                    启用
                  </MenuItem>
                ) : (
                  <MenuItem key="disable">
                    <Icon name="stop" tw="mr-2" />
                    停用
                  </MenuItem>
                )}
                <MenuItem key="delete">
                  <Icon name="trash" tw="mr-2" />
                  删除
                </MenuItem>
              </Menu>
            }
          >
            <Center tw="w-6 h-6">
              <Icon name="more" size={20} clickable />
            </Center>
          </Tooltip>
        </>
      ),
    },
  ]

  const columns = utils.getTableColumnsBySetting(defaultColumns, columnSettings)

  const handleQuery = (v: string) => {
    setFilter((draft) => {
      draft.search = v
      draft.offset = 0
    })
  }

  const handleCancel = () => {
    mutateOperation()
    setDelText('')
  }

  if (isLoading) {
    return (
      <Root>
        <PageTab tabs={tabs} />
        <ContentBox tw="bg-white h-80">
          <Loading />
        </ContentBox>
      </Root>
    )
  }

  const sourceList = data?.infos || []

  return (
    <>
      {sourceList?.length || filter.search !== '' ? (
        <Root>
          <PageTab tabs={tabs} />
          <ToolBar tw="bg-white">
            <ToolBarLeft>
              <Button type="primary" onClick={() => mutateOperation('create')}>
                <Icon name="add" />
                新增数据源
              </Button>
              <Button
                type="default"
                disabled={
                  // .filter(
                  // ({
                  // source_id,
                  // status,
                  // }: {
                  // source_id: string
                  // status: number
                  // }) => selectedRowKeys.includes(source_id) && status !== 2
                  // ).
                  selectedRowKeys.length === 0
                }
                onClick={() =>
                  mutateOperation(
                    'delete',
                    sourceList.filter(({ source_id }) =>
                      selectedRowKeys.includes(source_id)
                    )
                  )
                }
              >
                <Icon name="trash" />
                删除
              </Button>
            </ToolBarLeft>
            <ToolBarRight>
              <InputSearch
                placeholder="请输入关键词进行搜索"
                value={searchName}
                onChange={(e, v) => setSearchName(String(v))}
                onPressEnter={() => handleQuery(searchName)}
                onClear={() => {
                  setSearchName('')
                  if (filter.search) {
                    handleQuery('')
                  }
                }}
              />
              <Button loading={isReFetching} tw="px-[5px]">
                <Icon
                  name="if-refresh"
                  tw="text-xl"
                  onClick={() => {
                    setIsReFetching(true)
                    refetch().then(() => {
                      setIsReFetching(false)
                    })
                  }}
                />
              </Button>
              <ToolBar.ColumnsSetting
                defaultColumns={defaultColumns.map(({ title, dataIndex }) => ({
                  title,
                  dataIndex,
                }))}
                onSave={setColumnSettings}
                storageKey={columnSettingsKey}
              />
            </ToolBarRight>
          </ToolBar>
          <Card tw="flex-1 pb-5 px-5">
            <Table
              selectType="checkbox"
              dataSource={sourceList}
              columns={columns}
              rowKey="source_id"
              tw="pb-4 "
              selectedRowKeys={selectedRowKeys}
              onSelect={(rowKeys: []) => setSelectedRowKeys(rowKeys)}
              onSort={(sortKey: string, sortOrder: string) => {
                setFilter((draft) => {
                  draft.order_by = sortKey
                  draft.reverse = sortOrder === 'desc'
                })
              }}
              pagination={{
                total: get(data, 'total', 0),
                current: Math.floor(filter.offset / filter.limit) + 1,
                pageSize: filter.limit,
                onPageChange: (page: number) => {
                  setFilter((draft) => {
                    draft.offset = (page - 1) * draft.limit
                  })
                },
                onShowSizeChange: (limit: number) => {
                  setFilter((draft) => {
                    draft.offset = 0
                    draft.limit = limit
                  })
                },
              }}
            />
          </Card>
        </Root>
      ) : (
        <DataEmpty onAddClick={() => mutateOperation('create')} />
      )}
      {(() => {
        if (['create', 'update', 'view'].includes(op)) {
          return <DataSourceModal onHide={mutateOperation} />
        }
        if (['disable', 'enable', 'delete'].includes(op)) {
          const info = confirmMsgInfo[op]
          const filterSourceList = opSourceList
          // op === 'delete'
          // ? opSourceList.filter((obj) => obj.status !== 2)
          // : opSourceList
          return (
            <ModalWrapper
              visible
              width={800}
              onCancel={handleCancel}
              footer={
                <FlexBox tw="justify-end">
                  <Button onClick={handleCancel}>取消</Button>
                  <Button
                    onClick={handleOk}
                    disabled={op === 'delete' && delText !== 'delete'}
                    loading={mutation.isLoading}
                    type={op === 'enable' ? 'primary' : 'danger'}
                  >
                    {info.name}
                  </Button>
                </FlexBox>
              }
            >
              <div tw="flex items-start">
                <Icon
                  name={op === 'enable' ? 'information' : 'if-error-info'}
                  size={op === 'enable' ? 24 : 'medium'}
                  css={[
                    tw`mr-3 text-2xl leading-6`,
                    op === 'enable'
                      ? css`
                          svg {
                            ${tw`text-white fill-[#2193D3]`}
                          }
                        `
                      : tw`text-red-10`,
                  ]}
                />
                <div tw="space-y-2 text-neut-13 ">
                  <FlexBox tw="font-semibold text-base text-neut-15">
                    确定要{info.name}以下
                    <span tw="mx-1 ">{filterSourceList.length}</span>
                    个数据源吗？
                  </FlexBox>
                  <div tw="mt-2">{info.desc}</div>

                  <Table
                    rowKey="source_id"
                    columns={columns
                      .filter((col: any) =>
                        [
                          'name',
                          'source_type',
                          'source_id',
                          'url',
                          'created',
                        ].includes(col.dataIndex)
                      )
                      .map((col: any) =>
                        pick(col, ['title', 'dataIndex', 'render', 'width'])
                      )}
                    dataSource={filterSourceList}
                  />

                  {op === 'delete' && (
                    <div tw="pt-3 space-y-1 border-t border-neut-2">
                      <div>
                        *请在下方输入框中输入&quot;delete&quot;以确认操作
                      </div>
                      <div>
                        <Input
                          autoComplete="off"
                          type="text"
                          placeholder="delete"
                          tw="w-40"
                          onChange={(e, v) => setDelText(String(v))}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ModalWrapper>
          )
        }
        return null
      })()}
      {op === 'ping' && <DataSourcePingModal />}
      {showPingHistories && <DataSourcePingHistoriesModal />}
    </>
  )
})

export default DataSourceList
