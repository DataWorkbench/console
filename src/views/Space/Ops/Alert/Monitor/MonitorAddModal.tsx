import { Button, Icon, ToolBar } from '@QCFE/qingcloud-portal-ui'
import { Center, FlexBox, InstanceName, Modal } from 'components/index'
import { observer } from 'mobx-react-lite'
import { Table } from 'views/Space/styled'
import { InputSearch } from '@QCFE/lego-ui'
import React, { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { useAlarmsStore } from 'views/Space/Ops/Alert/AlarmsStore'
import { IColumn, useColumns } from 'hooks/useHooks/useColumns'
import tw, { css } from 'twin.macro'
import useFilter from 'hooks/useHooks/useFilter'

interface IMonitorAddProps {
  onCancel: () => void
}

const storageKey = 'monitor-add-modal-columns'

const { ColumnsSetting } = ToolBar as any

// 默认列
const defaultColumns: IColumn[] = [
  {
    title: '名称/ID',
    dataIndex: 'name',
    key: 'name',
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

const instanceNameStyle = css`
  &:hover {
    .instance-name-title {
      ${tw`text-green-11`}
    }
    .instance-name-icon {
      ${tw`bg-[#13966a80] border-[#9ddfc966]`}
      .icon svg.qicon {
        ${tw`text-green-11`}
      }
    }
  }
`

const MonitorAddModal = observer((props: IMonitorAddProps) => {
  const { set } = useAlarmsStore()
  const { onCancel } = props
  const { filter, setFilter, sort, pagination } = useFilter<
    { search: string },
    { pagination: true; sort: true }
  >({})

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const { data, isFetching, refetch } = {
    data: { total: 0, infos: [{ name: 'xxx', id: 1111 }] },
    isFetching: false,
    refetch: () => {},
  }

  // 带自定义的列
  const columnsRender: Record<string, Partial<IColumn>> = useMemo(
    () => ({
      name: {
        render: (text: string, record: Record<string, any>) => {
          return (
            <InstanceName
              theme="dark"
              name={text}
              desc={record.id}
              icon="q-bellGearFill"
              css={instanceNameStyle}
              onClick={() =>
                set({
                  showAddMonitorDetail: true,
                  selectedData: record,
                })
              }
            />
          )
        },
      },
      description: {
        render: (text: string) => <span tw="text-neut-8">{text}</span>,
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
          v ? (
            <span tw="text-neut-8">
              {dayjs(v * 1000).format('YYYY-MM-DD HH:mm:ss')}{' '}
            </span>
          ) : (
            ''
          ),
      },
    }),
    [filter.reverse, filter.sort_by, set]
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
              set({ showAddMonitorForm: true })
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
            ...pagination,
          }}
          rowKey="id"
          onSort={sort}
        />
      </div>
    </Modal>
  )
})

export default MonitorAddModal
