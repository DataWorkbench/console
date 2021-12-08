import React, { useState, useMemo, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import tw, { css, styled } from 'twin.macro'
import { useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { get, findKey, pick } from 'lodash-es'
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
  ToolBarLeft,
  ToolBarRight,
  InputSearch,
  utils,
} from '@QCFE/qingcloud-portal-ui'
import { useQuerySource, useMutationSource, sourceTypes, useStore } from 'hooks'
import {
  Card,
  Center,
  ContentBox,
  FlexBox,
  Icons,
  // Menu,
  // MenuItem,
  // TableContainer,
  Tooltip,
} from 'components'

import DataSourceModal from './DataSourceModal'
import DataEmpty from './DataEmpty'

const { MenuItem } = Menu

const tabs = [
  {
    title: '数据源',
    description:
      '数据源主要用于数据集成过程中 Reader 和 Writer 的对象，您可以在数据源管理页面查看、新增及批量新增数据源。指定的整个数据库全部或者部分表一次性的全部同步至MySQL，并且支持后续的实时增量同步模式，将新增数据持续同步至 MySQL。',
    icon: 'blockchain',
    helpLink: '/',
  },
]

const confirmMsgInfo: any = {
  disable: {
    name: '禁用',
    desc: '已发布调度未运行的任务将不会再使用该数据源内的所有表数据，是否确认进行禁用操作？',
  },
  enable: {
    name: '启动',
    desc: '启用该数据源，已发布调度未运行的任务将使用该数据源内的所有表数据，是否确认进行启用操作？',
  },
  delete: {
    name: '删除',
    desc: '该数据源后删除后业务流程将无法引用，该操作无法撤回，请谨慎操作。',
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

const TableActions = styled(FlexBox)(() => [
  css`
    ${tw`items-center relative`}
    button.is-text {
      ${tw`text-link px-2 hover:text-link border-0 focus:text-link`}
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

const columnSettingsKey = 'BIGDATA_SOURCELISTS_COLUMN_SETTINGS'

const DataSourceList = observer(() => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [columnSettings, setColumnSettings] = useState([])
  const [searchName, setSearchName] = useState('')
  const [isReFetching, setIsReFetching] = useState(false)
  const [delText, setDelText] = useState('')
  const {
    dataSourceStore: { op, opSourceList, mutateOperation },
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

  useEffect(() => {
    setFilter((draft) => {
      draft.regionId = regionId
      draft.spaceId = spaceId
    })
  }, [regionId, spaceId, setFilter])

  const defaultColumns = useMemo(
    () => [
      {
        title: '数据源名称/ID',
        dataIndex: 'source_id',
        render: (v: string, info: any) => (
          <FlexBox tw="space-x-1 items-center">
            <Center tw="w-6 h-6 bg-neut-3 rounded-full">
              <Icon name="blockchain" size="small" />
            </Center>
            <div tw="flex-1">
              <div>{info.name}</div>
              <div tw="text-neut-8">{v}</div>
            </div>
          </FlexBox>
        ),
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
          return findKey(sourceTypes, (o) => o === v)
        },
      },
      {
        title: '连接信息',
        dataIndex: 'url',
        width: 250,
        render: (v: any, row) => {
          const tp = findKey(sourceTypes, (o) => o === row.source_type)

          if (tp) {
            const key = tp.toLowerCase()
            const urlObj = get(v, key)
            const networkId = get(urlObj, 'network.vpc_network.network_id')
            return (
              <div tw="space-y-1">
                <div tw="truncate">
                  {['mysql', 'clickhouse', 'postgresql'].includes(key) && (
                    <>
                      <span tw="inline-block px-1.5 bg-[#E0EBFE] text-[#3B82F6] rounded-sm mr-0.5">
                        URL
                      </span>
                      <span>
                        {urlObj.host}: {urlObj.port}
                      </span>
                    </>
                  )}
                </div>
                {networkId && (
                  <div tw="truncate">
                    <span tw="inline-block px-1.5 bg-[#F1E4FE] text-[#A855F7] rounded-sm mr-0.5">
                      内网
                    </span>
                    {networkId}
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
        render: (v: number) => {
          if (v === 1) {
            return (
              <Center tw="space-x-1">
                <Icons name="circle_check" size={12} />
                <span>可用</span>
              </Center>
            )
          }
          return (
            <Center tw="space-x-1">
              <Icons name="circle_close" size={12} />
              <span>不可用</span>
            </Center>
          )
        },
      },
      {
        title: '数据源描述',
        dataIndex: 'comment',
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
        render: (v: string, info: any) => (
          <TableActions>
            <Button
              type="text"
              disabled={info.status === 1}
              onClick={() => {
                mutateOperation('enable', [info])
              }}
            >
              启动
            </Button>
            <Button
              type="text"
              disabled={info.status === 2}
              onClick={() => {
                mutateOperation('disable', [info])
              }}
            >
              停用
            </Button>
            <Button
              type="text"
              onClick={() => {
                mutateOperation('update', [info])
              }}
            >
              修改
            </Button>

            <Tooltip
              theme="light"
              trigger="click"
              arrow={false}
              content={
                <Menu
                  onClick={(e: React.SyntheticEvent, key: string) => {
                    if (key === 'delete') {
                      mutateOperation(key, [info])
                    }
                  }}
                >
                  <MenuItem disabled={info.status === 2} key="delete">
                    <Icon name="trash" tw="mr-2" />
                    删除
                  </MenuItem>
                </Menu>
              }
            >
              <Center>
                <Icon name="more" clickable />
              </Center>
            </Tooltip>
          </TableActions>
        ),
      },
    ],
    [mutateOperation, filter.reverse]
  )

  const columns = useMemo(
    () => utils.getTableColumnsBySetting(defaultColumns, columnSettings),
    [columnSettings, defaultColumns]
  )

  const { isLoading, refetch, data } = useQuerySource(filter)
  const mutation = useMutationSource()

  const handleOk = () => {
    if (op === '') {
      return
    }
    if (['disable', 'enable', 'delete'].includes(op)) {
      mutation.mutate(
        {
          op,
          regionId,
          spaceId,
          sourceIds: opSourceList.map((r) => r.source_id),
        },
        {
          onSuccess: () => {
            mutateOperation()
            refetch()
            if (op === 'delete') {
              setSelectedRowKeys([])
            }
          },
        }
      )
    }
  }

  const handleQuery = (v: string) => {
    setFilter((draft) => {
      draft.search = v
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
                  sourceList.filter(
                    ({
                      source_id,
                      status,
                    }: {
                      source_id: string
                      status: number
                    }) => selectedRowKeys.includes(source_id) && status !== 2
                  ).length === 0
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
                <Icon name="add" />
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
                  handleQuery('')
                }}
              />
              <Button loading={isReFetching}>
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
          <Card tw="flex-1">
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
        if (['create', 'update'].includes(op)) {
          return <DataSourceModal onHide={mutateOperation} />
        }
        if (['disable', 'enable', 'delete'].includes(op)) {
          const info = confirmMsgInfo[op]
          const filterSourceList =
            op === 'delete'
              ? opSourceList.filter((obj) => obj.status !== 2)
              : opSourceList
          return (
            <ModalWrapper
              visible
              width={680}
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
                          'created',
                        ].includes(col.dataIndex)
                      )
                      .map((col: any) =>
                        pick(col, ['title', 'dataIndex', 'render'])
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
    </>
  )
})

export default DataSourceList
