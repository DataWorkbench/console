import { Radio, Button, InputSearch } from '@QCFE/lego-ui'
import { Table, Icon, ToolBar, localstorage } from '@QCFE/qingcloud-portal-ui'
import { Modal, FlexBox, Center, Tooltip } from 'components'
import dayjs from 'dayjs'
import {
  getJobInstanceKey,
  useMutationInstance,
  useQueryJobInstances,
  useStore,
} from 'hooks'
import { omitBy, get } from 'lodash-es'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { useQueryClient } from 'react-query'
import { useImmer } from 'use-immer'

interface IFilter {
  job_id?: string
  limit: number
  offset: number
  version?: number
  reverse?: boolean
  name?: string
  id?: string
  status?: number
  sort_by?: string
}

const columnSettingsKey = 'ASSOIATE_INSTANCE_COLUMN_SETTINGS'

export const InstanceTable = observer(
  ({ type = 'page', query }: { type?: 'page' | 'modal'; query?: any }) => {
    const {
      dmStore: { modalData },
    } = useStore()
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
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
      type === 'page' || modalData?.id
    )
    const infos = get(data, 'infos', []) || []

    const refetchData = () => {
      queryClient.invalidateQueries(getJobInstanceKey())
    }

    const handleMutation = () => {
      Modal.warning({
        title: '强制终止实例',
        content: (
          <div tw="text-neut-8">
            实例终止后将取消运行，您需要再次进行发布实例，此操作无法撤回，您确定终止该实例吗？
          </div>
        ),
        okText: '终止',
        confirmLoading: mutation.isLoading,
        onOk: () => {
          mutation.mutate(
            {
              op: 'stop',
              inst_ids: selectedRowKeys,
            },
            {
              onSuccess: () => {
                refetchData()
                setSelectedRowKeys([])
              },
            }
          )
        },
      })
    }

    const columns = [
      {
        title: '实例ID',
        dataIndex: 'id',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (value: number) => {
          return (
            <Radio checked={value === 1}>
              {value === 1 ? '调度中' : '已暂停'}
            </Radio>
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
        render: (value: any) =>
          dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '结束时间',
        dataIndex: 'updated',
        sortable: true,
        sortOrder:
          // filter.reverse ? 'asc' : 'desc',
          // eslint-disable-next-line no-nested-ternary
          filter.sort_by === 'updated' ? (filter.reverse ? 'asc' : 'desc') : '',
        render: (value: any) =>
          dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '操作',
        render: () => {
          return (
            <FlexBox tw="items-center">
              <Button>查看详情</Button>
              <Center>
                <Tooltip trigger="click" placement="bottom" arrow={false}>
                  <div tw="flex items-center">
                    <Icon name="more" clickable changeable type="light" />
                  </div>
                </Tooltip>
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
        draft.job_id = modalData?.id
      })
    }, [modalData, setFilter])

    useEffect(() => {
      setFilter((draft) => {
        draft.id = query.id
        draft.status = query.status
      })
    }, [query.id, query.status, setFilter])

    return (
      <FlexBox orient="column">
        <FlexBox tw="justify-between pt-6 pb-3">
          <Button disabled={!selectedRowKeys.length} onClick={handleMutation}>
            <Icon name="stop" />
            终止
          </Button>
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
              tw="px-[5px] border-[#4C5E70]!"
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
          onSelect={(keys: string[]) => {
            setSelectedRowKeys(keys)
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
