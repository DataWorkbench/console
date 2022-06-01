import React, { useState, useEffect } from 'react'
import { Button, Icon, InputSearch, Table, ToolBar } from '@QCFE/qingcloud-portal-ui'
import { MoreAction, FlexBox, Center, Modal, TextEllipsis, StatusBar } from 'components'

import { useParams } from 'react-router-dom'
import { useQueryClient } from 'react-query'
import { observer } from 'mobx-react-lite'
import { omitBy } from 'lodash-es'
import dayjs from 'dayjs'
import tw, { css } from 'twin.macro'
import { useColumns } from 'hooks/useHooks/useColumns'
import { MappingKey } from 'utils/types'

import { useStore, useQueryNetworks, getNetworkKey, useMutationNetwork } from 'hooks'
import useFilter from 'hooks/useHooks/useFilter'

import NewClusterModal from './ClusterModal'
import { ClusterColumns, StatusMap, streamDevModeType } from './common/constants'
import { ClusterFieldMapping } from './common/mappings'

// interface IFilter {
//   name?: string
//   offset: number
//   limit: number
//   reverse: boolean
//   search: string
//   sort_by: string
// }

const { ColumnsSetting } = ToolBar as any

const columnSettingsKey = 'DATAOMNIS_NETWORK_COLUMN_SETTINGS'

const ClusterTable = observer(() => {
  const {
    dtsStore: { setDataServiceOp, dataServiceOp }
  } = useStore()

  const [opNetworkList, setOpNetworkList] = useState<any[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const { regionId } = useParams<{ regionId: string }>()
  const {
    filter,
    setFilter,
    pagination,
    sort,
    getColumnFilter: getFilter
  } = useFilter<
    Record<ReturnType<typeof getName>, number | string>,
    { pagination: true; sort: true }
  >({}, { pagination: true, sort: true }, columnSettingsKey)

  const { isFetching, isRefetching, data } = useQueryNetworks(omitBy(filter, (v) => v === ''))

  console.log(regionId, isFetching, data)

  const queryClient = useQueryClient()
  const mutation = useMutationNetwork()

  useEffect(() => {
    if (dataServiceOp === '') {
      setOpNetworkList([])
    }
  }, [dataServiceOp])

  const refetchData = () => {
    queryClient.invalidateQueries(getNetworkKey())
  }

  const mutateData = () => {
    const networkIds = opNetworkList.map((o) => o.id)
    mutation.mutate(
      {
        op: dataServiceOp,
        networkIds
      },
      {
        onSuccess: () => {
          setDataServiceOp('')
          refetchData()
          if (dataServiceOp === 'delete') {
            setSelectedRowKeys(selectedRowKeys.filter((k) => !networkIds.includes(k)))
          }
        }
      }
    )
  }

  const getName = (name: MappingKey<typeof ClusterFieldMapping>) =>
    ClusterFieldMapping.get(name)!.apiField

  const dataSource = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => ({
    id: i,
    name: 'item01',
    name2: 'pod-g0ljvp7ed1r1dmxg',
    status: 'error',
    cu: '基础版本',
    mode: '按需',
    term_validity: '永久',
    last_updated: 1579490172 + i * 10
  }))

  const columnsRender = {
    [getName('name')]: {
      render: (v: any, row: any) => (
        <FlexBox tw="items-center space-x-1 truncate">
          <Center
            className="clusterIcon"
            tw="bg-neut-13 border-2 box-content border-neut-16 rounded-full w-6 h-6 mr-1.5"
          >
            <Icon name="earth" type="light" />
          </Center>
          <div tw="truncate">
            <TextEllipsis twStyle={tw`font-semibold`}>{row.name}</TextEllipsis>
            <div tw="dark:text-neut-8">{row.name2}</div>
          </div>
        </FlexBox>
      )
    },
    [getName('status')]: {
      ...getFilter(getName('name'), streamDevModeType),
      render: () => (
        <StatusBar
          type={StatusMap.get('suspended')?.style}
          label={StatusMap.get('suspended')?.label}
        />
      )
    },
    [getName('cu')]: {
      render: (v: any, row: any) => <span tw="dark:text-neut-0">{row.cu}</span>
    },
    [getName('mode')]: {
      ...getFilter(getName('name'), streamDevModeType),
      render: (v: any, row: any) => <span tw="dark:text-neut-0">{row.mode}</span>
    },
    [getName('term_validity')]: {
      render: (v: any, row: any) => <span tw="dark:text-neut-0">{row.term_validity}</span>
    },
    [getName('last_updated')]: {
      sortable: true,
      // eslint-disable-next-line no-nested-ternary
      sortOrder: filter.sort_by === 'last_updated' ? (filter.reverse ? 'asc' : 'desc') : '',
      render: (v: number, row: any) => (
        <span tw="dark:text-neut-0">{dayjs(row.last_updated).format('YYYY-MM-DD HH:mm:ss')}</span>
      )
    }
  }

  const handleMenuClick = (record: Record<string, any>, key: string) => {
    console.log(record, key)
  }
  const getActions = (row: any) => {
    const result = [
      {
        text: '恢复',
        icon: 'q-rmbCircleFill',
        key: 'recovery',
        value: row
      },
      {
        text: '启动',
        icon: 'q-closeCircleFill',
        key: 'start',
        value: row
      },
      {
        text: '停用',
        icon: 'q-closeCircleFill',
        key: 'stop',
        value: row
      },
      {
        text: '修改',
        icon: 'q-closeCircleFill',
        key: 'edit',
        value: row,
        help: '如需修改，请先停用服务集群'
      },
      {
        text: '删除',
        icon: 'q-closeCircleFill',
        key: 'delete',
        value: row,
        help: '如需删除，请先停用服务集群'
      }
    ]
    return result
  }

  const operation = {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    render: (_: never, record: Record<string, any>) => (
      <MoreAction theme="darker" items={getActions(record)} onMenuClick={handleMenuClick} />
    )
    // render: (v: any, row: any) => (
    //   <FlexBox tw="items-center">
    //     <Center>
    //       <Tooltip
    //         trigger="click"
    //         placement="bottom"
    //         arrow={false}
    //         twChild={
    //           css`
    //             &[aria-expanded='true'] {
    //               ${tw`bg-line-dark`}
    //             }
    //             svg {
    //               ${tw`text-white! bg-transparent! fill-[transparent]!`}
    //             }
    //           ` as any
    //         }
    //         content={
    //           <Menu>
    //             {(row.status === 2 || row.status === 4) && <MenuItem key="stop">停用</MenuItem>}
    //             {row.status === 3 && <MenuItem key="start">启动</MenuItem>}
    //             <MenuItem key="update" disabled={[2, 4].includes(row.status)}>
    //               <AffixLabel
    //                 required={false}
    //                 // help="如需修改，请先停用计算集群"
    //                 help={[2, 4].includes(row.status) && '如需修改，请先停用服务集群'}
    //                 theme="light"
    //               >
    //                 修改
    //               </AffixLabel>
    //             </MenuItem>
    //             <MenuItem key="delete" disabled={[2, 4].includes(row.status)}>
    //               <AffixLabel
    //                 required={false}
    //                 help={[2, 4].includes(row.status) && '如需删除，请先停用服务集群'}
    //                 theme="light"
    //               >
    //                 删除
    //               </AffixLabel>
    //             </MenuItem>
    //           </Menu>
    //         }
    //       >
    //         <div tw="flex items-center p-0.5 cursor-pointer hover:bg-line-dark rounded-sm">
    //           <Icon name="more" clickable changeable type="light" size={20} />
    //         </div>
    //       </Tooltip>
    //     </Center>
    //   </FlexBox>
    // )
  }

  const { columns, setColumnSettings } = useColumns(
    columnSettingsKey,
    ClusterColumns,
    columnsRender,
    operation
  )

  return (
    <FlexBox tw="w-full flex-1" orient="column">
      <div tw="mb-3">
        <FlexBox tw="justify-between">
          <Center tw="space-x-3">
            <Button type="primary" onClick={() => setDataServiceOp('create')}>
              <Icon name="add" />
              创建
            </Button>
          </Center>
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
                  if (draft.search) {
                    draft.offset = 0
                    draft.search = ''
                  }
                })
              }}
            />
            <Button type="black" loading={isRefetching} tw="px-[5px] border-line-dark!">
              <Icon
                name="if-refresh"
                tw="text-xl text-white"
                type="light"
                onClick={() => {
                  refetchData()
                }}
              />
            </Button>
            <ColumnsSetting
              defaultColumns={ClusterColumns}
              onSave={setColumnSettings}
              storageKey={columnSettingsKey}
            />
          </Center>
        </FlexBox>
      </div>

      <Table
        dataSource={dataSource}
        loading={false}
        columns={columns}
        rowKey="id"
        pagination={{
          // total: get(data, 'total', 0),
          total: dataSource.length,
          ...pagination
        }}
        onSort={sort}

        // pagination={{
        //   total: data?.total || 0,
        //   current: filter.offset / filter.limit + 1,
        //   pageSize: filter.limit,
        //   onPageChange: (current: number) => {
        //     setFilter((draft) => {
        //       draft.offset = (current - 1) * filter.limit
        //     })
        //   },
        //   onShowSizeChange: (size: number) => {
        //     setFilter((draft) => {
        //       draft.offset = 0
        //       draft.limit = size
        //     })
        //   }
        // }}
        // selectedRowKeys={selectedRowKeys}
        // onSelect={(keys: string[]) => {
        //   setSelectedRowKeys(keys)
        // }}
        // onSort={(sortKey: any, order: string) => {
        //   setFilter((draft) => {
        //     draft.sort_by = sortKey
        //     draft.reverse = order === 'asc'
        //   })
        // }}
      />
      {(dataServiceOp === 'create' || dataServiceOp === 'update') && (
        <NewClusterModal opNetwork={opNetworkList[0]} />
      )}
      {(dataServiceOp === 'start' || dataServiceOp === 'stop' || dataServiceOp === 'delete') && (
        <Modal
          noBorder
          visible
          width={opNetworkList.length > 1 ? 800 : 400}
          onCancel={() => setDataServiceOp('')}
          okText="删除"
          onOk={mutateData}
          footer={
            <FlexBox tw="justify-end">
              <Button onClick={() => setDataServiceOp('')}>取消</Button>
              <Button
                type={dataServiceOp === 'start' ? 'primary' : 'danger'}
                loading={mutation.isLoading}
                onClick={mutateData}
              >
                删除
              </Button>
            </FlexBox>
          }
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
                const opText = '删除'
                const opNetworkLen = opNetworkList.length

                const networkText =
                  opNetworkLen === 1 ? (
                    <>
                      确认{opText}网络配置{opNetworkList[0].name}
                      <span tw="text-neut-8 break-all">({opNetworkList[0].id})</span>
                    </>
                  ) : (
                    <>
                      {opText}以下{opNetworkList.length}个网络配置
                    </>
                  )
                return (
                  <>
                    <div tw="font-medium mb-2 text-base">{networkText}注意事项</div>
                    <div className="modal-content-message">
                      删除网络配置后，关联该资源的内网数据源将无法正常访问，且该操作无法撤回，确认删除吗？
                    </div>
                  </>
                )
              })()}
            </section>
          </FlexBox>
          <>
            {/* {opNetworkList.length > 1 && (
                <Table
                  dataSource={[{ name: 1 }, { name: 1 }]}
                  rowKey="id"
                  columns={columns}
                />
              )} */}
          </>
        </Modal>
      )}
    </FlexBox>
  )
})

export default ClusterTable
