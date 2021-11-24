import { FlexBox } from 'components/Box'
import { Button, Checkbox, Dropdown, Menu, Radio } from '@QCFE/lego-ui'
import {
  Modal,
  Table,
  Icon,
  ToolBar,
  localstorage,
} from '@QCFE/qingcloud-portal-ui'
import { observer } from 'mobx-react-lite'
import {
  getReleaseJobsKey,
  useMutationReleaseJobs,
  useQueryReleaseJobs,
  useStore,
} from 'hooks'
import { useImmer } from 'use-immer'
import { useQueryClient } from 'react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { omitBy, get } from 'lodash-es'
import { Tooltip, Center } from 'components'
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
  const {
    dmStore: { setOp, op, setModalData },
  } = useStore()
  const [visible, setVisible] = useState(false)
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
  const [modalChecked, setModalChecked] = useState(false)

  const toggle = () => setVisible(!visible)

  const queryClient = useQueryClient()
  const mutation = useMutationReleaseJobs()

  const { isFetching, isRefetching, data } = useQueryReleaseJobs(
    omitBy(filter, (v) => v === '')
  )

  const infos = get(data, 'infos', []) || []

  const refetchData = useCallback(() => {
    queryClient.invalidateQueries(getReleaseJobsKey())
  }, [queryClient])

  const handleOperation = useCallback(
    (row: any) => {
      if (row.status === 1) {
        Modal.warning({
          confirmLoading: mutation.isLoading,
          title: `暂停调度作业 ${row.name}`,
          okType: 'danger',
          okText: '暂停',
          content: (
            <>
              <div tw="text-neut-8">
                暂停后，相关实例需要手动恢复执行，确认暂停么?
              </div>
              <Checkbox>同时停止运行中的实例</Checkbox>
            </>
          ),
        })
      } else {
        Modal.info({
          confirmLoading: mutation.isLoading,
          title: `恢复调度作业 ${row.name}`,
          okText: '恢复',
          content: (
            <div tw="text-neut-8">确认恢复调度作业 ${row.name} 么？</div>
          ),
        })
      }
    },
    [mutation.isLoading]
  )

  const handleMutation = useCallback(
    (row: any, options?: any) => {
      mutation.mutate(
        {
          op,
          jobId: row.id,
          ...options,
        },
        {
          onSuccess: () => {
            setOp('')
            refetchData()
            setModalChecked(false)
          },
        }
      )
    },
    [mutation, op, refetchData, setOp]
  )

  const hanldeMenuClick = useCallback(
    (key: OP, row: any) => {
      if (key === 'stop') {
        Modal.warning({
          confirmLoading: mutation.isLoading,
          title: `下线作业 ${row.name}`,
          okType: 'danger',
          okText: '下线',
          content: (
            <>
              <div tw="text-neut-8">
                作业下线后，相关实例需要手动恢复执行，确认从调度系统移除作业么??
              </div>
              <Checkbox
                onChange={(e: any, value: boolean) => setModalChecked(value)}
              >
                同时停止运行中的实例
              </Checkbox>
            </>
          ),
          onOk: () => {
            setOp(key)
            handleMutation(row, { stop_running: modalChecked })
          },
        })
      } else if (key === 'detail') {
        setModalData(row)
      }
      // setOp(key)
      // handleMutation(row)
    },
    [handleMutation, modalChecked, mutation.isLoading, setModalData, setOp]
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
            <Radio checked={value === 1}>
              {value === 1 ? '调度中' : '已暂停'}
            </Radio>
          )
        },
      },
      {
        title: '发布描述',
        dataIndex: 'desc',
        render: (value: string) => (
          <Tooltip theme="light" animation="fade" content={<>{value}</>}>
            <>{value}</>
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
        sortOrder: filter.reverse ? 'asc' : 'desc',
        render: (value: any) =>
          dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '最后修改时间',
        dataIndex: 'updated',
        sortable: true,
        sortOrder: filter.reverse ? 'asc' : 'desc',
        render: (value: any) =>
          dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '操作',
        dataIndex: 'id',
        render: (value: any, row: any) => (
          <FlexBox tw="items-center">
            <Button type="text" onClick={() => handleOperation(row)}>
              {row.status === 1 ? '暂停' : '恢复'}
            </Button>
            <Center>
              <Dropdown
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
                <Button type="text">
                  <Icon name="more" />
                </Button>
              </Dropdown>
            </Center>
          </FlexBox>
        ),
      },
    ],
    [filter.reverse, handleOperation, hanldeMenuClick]
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
        <Button loading={isRefetching}>
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

      <AssoiateModal visible={visible} toggle={toggle} />
    </FlexBox>
  )
})

export default ReleaseTable
