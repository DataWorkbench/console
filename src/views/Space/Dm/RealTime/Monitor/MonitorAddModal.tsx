import { Button, Icon, ToolBar } from '@QCFE/qingcloud-portal-ui'
import { Center, FlexBox, Modal, Tooltip } from 'components'
import { observer } from 'mobx-react-lite'
import { Table } from 'views/Space/styled'
import { useStore } from 'stores/index'
import { InputSearch, Menu } from '@QCFE/lego-ui'
import { useImmer } from 'use-immer'
import React, { useMemo, useState } from 'react'
import { statusFilters } from 'views/Space/Dm/RealTime/Monitor/constants'
import dayjs from 'dayjs'
import { IColumn, useColumns } from './hooks'

interface IMonitorAddProps {
  onCancel: () => void
}

const { MenuItem } = Menu as any

const storageKey = 'monitor-add-modal-columns'

const { ColumnsSetting } = ToolBar as any

// anyconst MenuItem = styled(LMenuItem)(({ active }: { active: boolean }) => [
//   active && tw`justify-between`,
// ])

// 默认列
const defaultColumns: IColumn[] = [
  {
    title: '名称/ID',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '监控对象',
    dataIndex: 'monitorObject',
    key: 'monitorObject',
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: '最近更新时间',
    dataIndex: 'updated_at',
    key: 'updated_at',
  },
]

const MonitorAddModal = observer((props: IMonitorAddProps) => {
  const { workFlowStore } = useStore()
  const { onCancel } = props
  const [filter, setFilter] = useImmer({
    sort_by: 'updated_at',
    reverse: true,
    search: '',
    offset: 0,
    limit: 10,
    status: 0,
  })

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const { data, isFetching, refetch } = {
    data: { total: 0, infos: [] },
    isFetching: false,
    refetch: () => {},
  }

  // 带自定义的列
  const columnsRender: Record<string, Partial<IColumn>> = useMemo(
    () => ({
      status: {
        title: (
          <FlexBox tw="items-center">
            <span>状态</span>
            <Tooltip
              trigger="click"
              placement="bottom-start"
              content={
                <Menu
                  selectedKey={String(filter.status)}
                  onClick={(e: React.SyntheticEvent, k: string, v: number) => {
                    setFilter((draft) => {
                      draft.status = v
                      draft.offset = 0
                    })
                  }}
                >
                  {Array.from(statusFilters).map(([value, text]) => (
                    <MenuItem value={value} key={value}>
                      <FlexBox tw="justify-between flex-auto">
                        <span>{text}</span>
                        {filter.status === value && (
                          <Icon name="check" tw="ml-4" size={16} type="light" />
                        )}
                      </FlexBox>
                    </MenuItem>
                  ))}
                </Menu>
              }
            >
              <Icon name="filter" type="light" clickable tw="ml-1 block" />
            </Tooltip>
          </FlexBox>
        ),
        render: (text: string) => {
          return <span>{text}</span>
        },
      },
      updated_at: {
        width: 150,
        sortable: true,
        // filter.reverse ? 'asc' : 'desc',
        sortOrder:
          // eslint-disable-next-line no-nested-ternary
          filter.sort_by === 'updated_at'
            ? filter.reverse
              ? 'asc'
              : 'desc'
            : '',
        render: (v: number) =>
          v ? dayjs(v * 1000).format('YYYY-MM-DD HH:mm:ss') : '',
      },
    }),
    [filter.reverse, filter.sort_by, filter.status, setFilter]
  )

  // 操作列
  const operation: Partial<IColumn> | undefined = undefined

  const { columns, setColumnSettings } = useColumns(
    storageKey,
    defaultColumns,
    columnsRender,
    operation
  )

  return (
    <Modal
      visible
      width={1200}
      onOk={onCancel}
      onCancel={onCancel}
      title="选择告警策略"
      appendToBody
    >
      <div tw="my-2">
        <FlexBox tw="mb-3 justify-between">
          <Button
            type="primary"
            onClick={() => {
              workFlowStore.set({ showAddMonitorForm: true })
            }}
          >
            <Icon name="add" />
            创建策略
          </Button>
          <Center tw="space-x-3">
            <InputSearch
              tw="w-64"
              placeholder="请输入关键词进行搜索"
              onPressEnter={(evt) => {
                setFilter((_) => {
                  _.search = String((evt.target as HTMLInputElement).value)
                  _.offset = 0
                })
              }}
              onClear={() => {
                setFilter((_) => {
                  if (_.search) {
                    _.search = ''
                    _.offset = 0
                  }
                })
              }}
            />
            <Button
              type="black"
              loading={!!isFetching}
              tw="px-[5px] border-line-dark!"
            >
              <Icon
                name="if-refresh"
                tw="text-xl text-white"
                type="light"
                onClick={() => {
                  refetch()
                }}
              />
            </Button>
            <ColumnsSetting
              defaultColumns={defaultColumns}
              storageKey={storageKey}
              onSave={setColumnSettings}
            />
          </Center>
        </FlexBox>
        <Table
          selectType="checkbox"
          onSelect={(keys: string[]) => {
            setSelectedRowKeys(keys)
          }}
          selectedKeys={selectedRowKeys}
          columns={columns}
          dataSource={data?.infos || []}
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
          rowKey="id"
          onSort={(sortKey: any, order: string) => {
            setFilter((draft) => {
              draft.sort_by = sortKey
              draft.reverse = order === 'asc'
            })
          }}
        />
      </div>
    </Modal>
  )
})

export default MonitorAddModal
