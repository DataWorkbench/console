import React, { useMemo, useState, useEffect } from 'react'
import { useImmer } from 'use-immer'
import { Button, Icon, InputSearch, Table, ToolBar } from '@QCFE/qingcloud-portal-ui'
import { useParams } from 'react-router-dom'
import { useQueryClient } from 'react-query'
import { observer } from 'mobx-react-lite'
import { get, omitBy, pick } from 'lodash-es'
import dayjs from 'dayjs'
import tw, { css } from 'twin.macro'

import { FlexBox, Center, Modal, TextLink, TextEllipsis } from 'components'
import { useStore, useQueryNetworks, getNetworkKey, useMutationNetwork } from 'hooks'

import NetworkModal from './NetworkModal'

interface IFilter {
  name?: string
  offset: number
  limit: number
  reverse: boolean
  search: string
  sort_by: string
}

const columnSettingsKey = 'DATAOMNIS_NETWORK_COLUMN_SETTINGS'
const NetworkTable = observer(() => {
  const {
    dmStore: { setNetWorkOp, networkOp }
  } = useStore()
  const [opNetworkList, setOpNetworkList] = useState<any[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [columnSettings, setColumnSettings] = useState([])
  const { regionId } = useParams<{ regionId: string }>()

  const [filter, setFilter] = useImmer<IFilter>({
    name: '',
    offset: 0,
    limit: 10,
    reverse: true,
    search: '',
    sort_by: 'created'
  })
  const queryClient = useQueryClient()
  const mutation = useMutationNetwork()

  useEffect(() => {
    if (networkOp === '') {
      setOpNetworkList([])
    }
  }, [networkOp])

  const columns = useMemo(
    () => [
      {
        title: '名称/ID',
        fixedInSetting: true,
        dataIndex: 'name',
        width: 200,
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
              <div tw="dark:text-neut-8">{row.id}</div>
            </div>
          </FlexBox>
        )
      },
      {
        title: 'VPC 网络',
        dataIndex: 'router_id',
        render: (v: string) =>
          v ? (
            <TextLink
              style={{ fontWeight: 'bold' }}
              href={`/${regionId}/routers/${v}`}
              target="_blank"
            >
              {v}
            </TextLink>
          ) : null
      },
      {
        title: '私有网络',
        dataIndex: 'vxnet_id',
        render: (v: string) =>
          v ? (
            <TextLink
              style={{ fontWeight: 'bold' }}
              href={`/${regionId}/vxnets/${v}`}
              target="_blank"
            >
              {v}
            </TextLink>
          ) : null
      },
      {
        title: '创建时间',
        dataIndex: 'created',
        sortable: true,
        sortOrder:
          // filter.reverse ? 'asc' : 'desc',
          // eslint-disable-next-line no-nested-ternary
          filter.sort_by === 'created' ? (filter.reverse ? 'asc' : 'desc') : '',
        render: (v: number) => (
          <span tw="dark:text-neut-8">{dayjs(v * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
        )
      },
      {
        title: '最近更新时间',
        dataIndex: 'updated',
        sortable: true,
        sortOrder:
          // filter.reverse ? 'asc' : 'desc',
          // eslint-disable-next-line no-nested-ternary
          filter.sort_by === 'updated' ? (filter.reverse ? 'asc' : 'desc') : '',

        render: (v: number) => (
          <span tw="dark:text-neut-8">{dayjs(v * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
        )
      },
      {
        title: '操作',
        dataIndex: 'id',
        render: (v: any, row: any) => (
          <FlexBox tw="items-center">
            <Button
              type="text"
              onClick={() => {
                setNetWorkOp('update')
                setOpNetworkList([row])
              }}
            >
              修改
            </Button>
            <Button
              type="text"
              onClick={() => {
                setNetWorkOp('delete')
                setOpNetworkList([row])
              }}
            >
              删除
            </Button>
          </FlexBox>
        )
      }
    ],
    [setNetWorkOp, setOpNetworkList, filter.sort_by, regionId, filter.reverse]
  )

  const refetchData = () => {
    queryClient.invalidateQueries(getNetworkKey())
  }

  const mutateData = () => {
    const networkIds = opNetworkList.map((o) => o.id)
    mutation.mutate(
      {
        op: networkOp,
        networkIds
      },
      {
        onSuccess: () => {
          setNetWorkOp('')
          refetchData()
          if (networkOp === 'delete') {
            setSelectedRowKeys(selectedRowKeys.filter((k) => !networkIds.includes(k)))
          }
        }
      }
    )
  }

  const { isFetching, isRefetching, data } = useQueryNetworks(omitBy(filter, (v) => v === ''))
  const infos = get(data, 'infos', []) || []
  const filterNetworkInfos = infos.filter((info: any) => selectedRowKeys.includes(info.id)) || []

  const filterColumn = columnSettings
    .map(
      (o: { key: string; checked: boolean }) =>
        o.checked && columns.find((col) => col.dataIndex === o.key)
    )
    .filter((o) => o)

  return (
    <FlexBox tw="w-full flex-1" orient="column">
      <div tw="mb-3">
        <FlexBox tw="justify-between">
          <Center tw="space-x-3">
            <Button type="primary" onClick={() => setNetWorkOp('create')}>
              <Icon name="add" />
              创建网络
            </Button>
            <Button
              disabled={selectedRowKeys.length === 0 || filterNetworkInfos.length === 0}
              onClick={() => {
                if (filterNetworkInfos.length) {
                  setOpNetworkList(filterNetworkInfos)
                  setNetWorkOp('delete')
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
          }
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
      />
      {(networkOp === 'create' || networkOp === 'update') && (
        <NetworkModal opNetwork={opNetworkList[0]} />
      )}
      {(networkOp === 'start' || networkOp === 'stop' || networkOp === 'delete') && (
        <Modal
          noBorder
          visible
          width={opNetworkList.length > 1 ? 800 : 400}
          onCancel={() => setNetWorkOp('')}
          okText="删除"
          onOk={mutateData}
          footer={
            <FlexBox tw="justify-end">
              <Button onClick={() => setNetWorkOp('')}>取消</Button>
              <Button
                type={networkOp === 'start' ? 'primary' : 'danger'}
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
            {opNetworkList.length > 1 && (
              <Table
                dataSource={opNetworkList}
                rowKey="id"
                columns={columns
                  .filter((col) =>
                    ['name', 'router_id', 'vxnet_id', 'created', 'updated'].includes(col.dataIndex)
                  )
                  .map((row) => pick(row, ['title', 'dataIndex', 'render']))}
              />
            )}
          </>
        </Modal>
      )}
    </FlexBox>
  )
})

export default NetworkTable
