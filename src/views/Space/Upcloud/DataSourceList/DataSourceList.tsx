import { useState, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import tw, { css, styled } from 'twin.macro'
import { useParams } from 'react-router-dom'
import Tippy from '@tippyjs/react'
import dayjs from 'dayjs'
import { get } from 'lodash-es'
import { useImmer } from 'use-immer'
import { Input } from '@QCFE/lego-ui'
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
import { useQuerySource, useMutationSource, useStore } from 'hooks'
import {
  Center,
  ContentBox,
  FlexBox,
  Icons,
  Menu,
  MenuItem,
  TableContainer,
} from 'components'

import DataSourceModal from './DataSourceModal'
import DataEmpty from './DataEmpty'

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
  tw`pb-4`,
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
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [columnSettings, setColumnSettings] = useState([])
  const [searchName, setSearchName] = useState('')
  const [isReFetching, setIsReFetching] = useState(false)
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
  }>({
    regionId,
    spaceId,
    search: '',
    reverse: true,
    offset: 0,
    limit: 10,
  })

  const defaultColumns = useMemo(
    () => [
      {
        title: '数据源名称/id',
        dataIndex: 'sourceid',
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
        dataIndex: 'state',
        render: (v: string) => {
          if (v === 'enable') {
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
        dataIndex: 'sourcetype',
      },
      {
        title: '连通性测试状态',
        dataIndex: 'connected',
        render: (v: string) => {
          if (v === 'failed') {
            return (
              <Center tw="space-x-1">
                <Icons name="circle_close" size={12} />
                <span>不通过</span>
              </Center>
            )
          }
          return (
            <Center tw="space-x-1">
              <Icons name="circle_check" size={12} />
              <span>通过</span>
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
        dataIndex: 'createtime',
        render: (v: number) => dayjs(v * 1000).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '操作',
        key: 'table_actions',
        render: (v: string, info: any) => (
          <TableActions>
            <Button
              type="text"
              disabled={info.state === 'enable'}
              onClick={() => {
                mutateOperation('enable', [info])
              }}
            >
              启动
            </Button>
            <Button
              type="text"
              disabled={info.state === 'disable'}
              onClick={() => {
                mutateOperation('disable', [info])
              }}
            >
              停用
            </Button>
            <Button
              type="text"
              disabled={info.state === 'disable'}
              onClick={() => {
                mutateOperation('update', [info])
              }}
            >
              修改
            </Button>
            <Tippy
              theme="light"
              animation="fade"
              trigger="click"
              arrow={false}
              interactive
              delay={100}
              zIndex={10}
              offset={[0, 10]}
              appendTo={() => document.body}
              content={
                <Menu>
                  <MenuItem
                    onClick={() => {
                      mutateOperation('update', [info])
                    }}
                  >
                    <Icon name="pen" tw="mr-2" />
                    修改
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      mutateOperation('delete', [info])
                    }}
                  >
                    <Icon name="trash" tw="mr-2" />
                    删除
                  </MenuItem>
                </Menu>
              }
            >
              <Center>
                <Icon name="more" clickable />
              </Center>
            </Tippy>
          </TableActions>
        ),
      },
    ],
    [mutateOperation]
  )

  const columns = useMemo(
    () => utils.getTableColumnsBySetting(defaultColumns, columnSettings),
    [columnSettings, defaultColumns]
  )

  const delColumns = useMemo(
    () => [
      {
        Header: '数据源名称/id',
        id: 'sourceid',
        accessor: (row) => [row.sourcetype, row.sourceid, row.name],
        Cell: ({ value }) => (
          <FlexBox tw="space-x-1 items-center">
            <Center tw="w-6 h-6 bg-neut-3 rounded-full">
              <Icon name="blockchain" size="small" />
            </Center>
            <div tw="flex-1">
              <div tw="space-x-1">
                <span>{value[0]}</span>
                <span>{value[2]}</span>
              </div>
              <div tw="text-neut-8">{value[1]}</div>
            </div>
          </FlexBox>
        ),
      },
      {
        Header: '数据源类型',
        accessor: 'comment',
      },
      {
        Header: '创建时间',
        accessor: 'createtime',
        Cell: ({ value }) => dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss'),
      },
    ],
    []
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
          sourceIds: opSourceList.map((r) => r.sourceid),
        },
        {
          onSuccess: () => {
            mutateOperation()
            refetch()
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

  const sourceList = (data?.infos || []).map(({ connected, info }) => ({
    ...info,
    connected,
  }))

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
                disabled={selectedRowKeys.length === 0}
                onClick={() =>
                  mutateOperation(
                    'delete',
                    sourceList.filter(({ sourceid }) =>
                      selectedRowKeys.includes(sourceid)
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
                onChange={(e, v: string) => setSearchName(v)}
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
          <Table
            selectType="checkbox"
            dataSource={sourceList}
            columns={columns}
            rowKey="sourceid"
            selectedRowKeys={selectedRowKeys}
            onSelect={(rowKeys: []) => setSelectedRowKeys(rowKeys)}
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
                  draft.limit = limit
                })
              },
            }}
          />
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
          const filterSourceList = opSourceList.filter(
            (obj) => obj.state !== 'disable'
          )
          const ifTableMode = op === 'delete' && filterSourceList.length > 1
          return (
            <ModalWrapper
              visible
              okText={`确认${info.name}`}
              okType={op === 'enable' ? 'primary' : 'danger'}
              width={ifTableMode ? 600 : 500}
              onOk={handleOk}
              confirmLoading={mutation.isLoading}
              onCancel={mutateOperation}
            >
              <div tw="flex items-start space-x-2">
                <Icon
                  name={op === 'enable' ? 'if-exclamation' : 'if-information'}
                  css={[
                    tw`text-xl leading-6`,
                    op === 'enable'
                      ? { color: '#FFD127' }
                      : { color: '#CF3B37' },
                  ]}
                />
                <div tw="space-y-2 text-neut-13 ">
                  <FlexBox tw="font-semibold text-base text-neut-15">
                    <span tw="mr-1">{info.name}数据源:</span>
                    {!ifTableMode && (
                      <div>
                        {filterSourceList
                          .map(({ sourceid }) => sourceid)
                          .join(',')}
                      </div>
                    )}
                  </FlexBox>
                  <div tw="mt-2">{info.desc}</div>
                  {ifTableMode && (
                    <TableContainer
                      columns={delColumns}
                      data={filterSourceList}
                    />
                  )}
                  {op === 'delete' && (
                    <div
                      css={[
                        tw`pt-3 space-y-1`,
                        ifTableMode && tw`border-t border-neut-2`,
                      ]}
                    >
                      <div>
                        *请在下方输入框中输入&quot;delete&quot;以确认操作
                      </div>
                      <div>
                        <Input type="text" placeholder="delete" tw="w-40" />
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
