import { FlexBox } from 'components/Box'
import { Button, Checkbox, Menu } from '@QCFE/lego-ui'
import {
  Modal,
  Table,
  Icon,
  ToolBar,
  Divider,
  localstorage,
} from '@QCFE/qingcloud-portal-ui'
import { observer } from 'mobx-react-lite'
import {
  getReleaseJobsKey,
  useMutationReleaseJobs,
  useQueryReleaseJobs,
} from 'hooks'
import { useImmer } from 'use-immer'
import { useQueryClient } from 'react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { omitBy, get } from 'lodash-es'
import { Tooltip, Center } from 'components'
import { useHistory, useParams } from 'react-router-dom'
import { AssoiateModal } from './AssoiateModal'

const { MenuItem } = Menu

const columnSettingsKey = 'OPS_RELEASE_COLUMN_SETTINGS'

interface ITypes {
  [key: number]: string
}

const JobTypes: ITypes = {
  1: 'StreamOperator',
  2: 'StreamSQL',
  3: 'StreamJAR',
  4: 'StreamPython',
  5: 'SreamScala',
}

export const ReleaseTable = observer(({ query }: any) => {
  const history = useHistory()
  const { regionId, spaceId } =
    useParams<{ regionId: string; spaceId: string }>()

  const [visible, setVisible] = useState(false)
  const [currentRelease, setCurrentRelease] = useState<any>({})
  const [columnSettings, setColumnSettings] = useState(
    localstorage.getItem(columnSettingsKey) || []
  )

  const [filter, setFilter] = useImmer({
    limit: 10,
    offset: 0,
    reverse: true,
    search: '',
    status: undefined,
    sort_by: '',
  })

  const toggle = useCallback(() => setVisible(!visible), [visible])

  const queryClient = useQueryClient()
  const mutation = useMutationReleaseJobs()

  const { isFetching, isRefetching, data } = useQueryReleaseJobs(
    omitBy(filter, (v) => v === '')
  )

  const infos = get(data, 'infos', []) || []

  const refetchData = useCallback(() => {
    queryClient.invalidateQueries(getReleaseJobsKey())
  }, [queryClient])

  const handleMutation = useCallback(
    (row: any, op: OP, options?: any) => {
      mutation.mutate(
        {
          op,
          jobId: row.id,
          ...options,
        },
        {
          onSuccess: () => {
            refetchData()
          },
        }
      )
    },
    [mutation, refetchData]
  )

  const handleOperation = useCallback(
    (row: any) => {
      if (row.status === 1) {
        let stopRunning: boolean = false
        Modal.warning({
          title: `暂停调度作业 ${row.name}`,
          okType: 'danger',
          okText: '暂停',
          content: (
            <>
              <div tw="text-neut-8 mb-2">
                暂停后，相关实例需要手动恢复执行，确认暂停么?
              </div>
              <Checkbox
                tw="text-white!"
                onChange={(_: any, checked: boolean) => {
                  stopRunning = checked
                }}
              >
                同时停止运行中的实例
              </Checkbox>
            </>
          ),
          confirmLoading: mutation.isLoading,
          onOk: () => handleMutation(row, 'disable', { stopRunning }),
        })
      } else {
        Modal.info({
          title: `恢复调度作业 ${row.name}`,
          okText: '恢复',
          content: <div tw="text-neut-8">确认恢复调度作业 {row.name} 么？</div>,
          confirmLoading: mutation.isLoading,
          onOk: () => handleMutation(row, 'enable'),
        })
      }
    },
    [handleMutation, mutation.isLoading]
  )

  const hanldeMenuClick = useCallback(
    (key: OP, row: any) => {
      if (key === 'detail') {
        setCurrentRelease(row)
        toggle()
      } else if (key === 'view') {
        history.push(`/${regionId}/workspace/${spaceId}/dm`)
      } else if (key === 'stop') {
        let stopRunning = false
        Modal.warning({
          confirmLoading: mutation.isLoading,
          title: `下线作业 ${row.name}`,
          okType: 'danger',
          okText: '下线',
          content: (
            <>
              <div tw="text-neut-8 mb-2">
                作业下线后，相关实例需要手动恢复执行，确认从调度系统移除作业么?
              </div>
              <Checkbox
                tw="text-white!"
                onChange={(_: any, checked: boolean) => {
                  stopRunning = checked
                }}
              >
                同时停止运行中的实例
              </Checkbox>
            </>
          ),
          onOk: () => {
            handleMutation(row, 'stop', { stopRunning })
          },
        })
      }
    },
    [handleMutation, history, mutation.isLoading, regionId, spaceId, toggle]
  )

  const columns = useMemo(
    () => [
      {
        title: '作业名称',
        dataIndex: 'name',
      },
      {
        title: '调度状态',
        dataIndex: 'status',
        render: (value: number) => {
          return (
            <div tw="flex items-center">
              <Icon
                tw="mr-2"
                name="radio"
                color={
                  value === 1
                    ? {
                        primary: '#15A675',
                        secondary: '#C6F4E4',
                      }
                    : ''
                }
              />
              {value === 1 ? '调度中' : '已暂停'}
            </div>
          )
        },
      },
      {
        title: '发布描述',
        dataIndex: 'desc',
        render: (value: string) => (
          <Tooltip content={<Center tw="p-3">{value}</Center>}>
            <div tw="max-w-[130px] truncate">{value}</div>
          </Tooltip>
        ),
      },
      {
        title: '作业版本',
        dataIndex: 'version',
      },
      {
        title: '作业类型',
        dataIndex: 'type',
        render: (value: number) => <>{JobTypes[value]}</>,
      },
      {
        title: '发布时间',
        dataIndex: 'created',
        sortable: true,
        sortOrder:
          // filter.reverse ? 'asc' : 'desc',
          // eslint-disable-next-line no-nested-ternary
          filter.sort_by === 'created' ? (filter.reverse ? 'asc' : 'desc') : '',
        render: (value: number) => (
          <div tw="text-neut-8">
            {dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss')}
          </div>
        ),
      },
      {
        title: '最后修改时间',
        dataIndex: 'updated',
        sortable: true,
        // filter.reverse ? 'asc' : 'desc',
        sortOrder:
          // eslint-disable-next-line no-nested-ternary
          filter.sort_by === 'updated' ? (filter.reverse ? 'asc' : 'desc') : '',
        render: (value: number) => (
          <div tw="text-neut-8">
            {dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss')}
          </div>
        ),
      },
      {
        title: '操作',
        dataIndex: 'id',
        render: (value: any, row: any) => (
          <FlexBox tw="items-center">
            <Button type="text" onClick={() => handleOperation(row)}>
              {row.status === 1 ? '暂停' : '恢复'}
            </Button>
            <Divider
              type="vertical"
              height={20}
              style={{ borderColor: '#475569', margin: '0 14px 0 5px' }}
            />
            <Center>
              <Tooltip
                arrow={false}
                trigger="click"
                placement="bottom-end"
                content={
                  <Menu
                    onClick={(e: any, key: OP) => hanldeMenuClick(key, row)}
                  >
                    <MenuItem key="detail">关联实例</MenuItem>
                    <MenuItem key="view">作业详情</MenuItem>
                    <MenuItem key="schedule">调度配置</MenuItem>
                    <MenuItem key="stop">下线</MenuItem>
                  </Menu>
                }
              >
                <Icon name="more" tw="w-5! h-5! cursor-pointer" />
              </Tooltip>
            </Center>
          </FlexBox>
        ),
      },
    ],
    [filter.reverse, filter.sort_by, handleOperation, hanldeMenuClick]
  )

  const filterColumn = columnSettings
    .map((o: { key: string; checked: boolean }) => {
      return o.checked && columns.find((col) => col.dataIndex === o.key)
    })
    .filter((o) => o)

  useEffect(() => {
    setFilter((draft) => {
      draft.search = query.search
      draft.status = query.status
    })
  }, [query, setFilter])

  return (
    <FlexBox orient="column">
      <FlexBox tw="justify-end pt-5 pb-3">
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
        <ToolBar tw="p-0 ml-2">
          <ToolBar.ColumnsSetting
            defaultColumns={columns}
            onSave={setColumnSettings}
            storageKey={columnSettingsKey}
          />
        </ToolBar>
      </FlexBox>
      <Table
        rowKey="id"
        loading={isFetching}
        columns={filterColumn.length > 0 ? filterColumn : columns}
        dataSource={infos || []}
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
        onSort={(sortKey: any, order: string) => {
          setFilter((draft) => {
            draft.sort_by = sortKey
            draft.reverse = order === 'asc'
          })
        }}
      />

      <AssoiateModal
        visible={visible}
        toggle={() => {
          toggle()
        }}
        modalData={currentRelease}
      />
    </FlexBox>
  )
})

export default ReleaseTable
