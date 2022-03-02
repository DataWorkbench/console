import dayjs from 'dayjs'
import { Modal, Table } from '@QCFE/qingcloud-portal-ui'
import { get } from 'lodash-es'
import React, { useEffect, useMemo } from 'react'
import { useImmer } from 'use-immer'

import { useQuerySourceHistories } from 'hooks'
import emitter from 'utils/emitter'
import { useStore } from 'stores'
import { Tooltip } from 'components'
import { timeFormat } from 'utils/convert'
import { SOURCE_PING_RESULT } from '../constant'
import { getPingConnection } from './getPingConnection'

const columns = [
  {
    title: '网络配置',
    dataIndex: 'name',
    render: (val: string, record: Record<string, any>) => {
      const { network_info: networkInfo } = record
      const children = networkInfo?.name || val
      if (networkInfo) {
        return (
          <Tooltip
            theme="darker"
            content={
              <div>
                <div>VPC: {networkInfo?.space_id}</div>
                <div>vxnet: {networkInfo?.vxnet_id}</div>
              </div>
            }
            hasPadding
          >
            {children}
          </Tooltip>
        )
      }
      return children
    },
  },
  {
    title: '可用性测试',
    dataIndex: 'result',
    render: getPingConnection,
  },
  {
    title: '测试开始时间',
    dataIndex: 'created',
    render: (val: number) => {
      return dayjs(val * 1000).format('YYYY-MM-DD HH:mm:ss')
    },
  },
  {
    title: '耗时',
    dataIndex: 'elapse',
    width: 100,
    render: (v?: number) => (v !== undefined ? timeFormat(v) : ''),
    // render: (val?: number, record?: Record<string, any>) => (
    //   <TimeInterval consuming={val} startTime={record?.startAt} />
    // ),
  },
]

export const DataSourcePingHistoriesModal = () => {
  const {
    dataSourceStore: {
      itemLoadingHistories,
      opSourceList,
      emptyHistories,
      setShowPingHistories,
    },
  } = useStore()

  const onClose = () => {
    setShowPingHistories(false)
  }
  const sourceId = get(opSourceList, `[0].id`)
  const histories = useMemo(() => {
    if (sourceId) {
      return itemLoadingHistories[sourceId] || new Map()
    }
    return emptyHistories
  }, [sourceId, itemLoadingHistories, emptyHistories])

  const [filter, setFilter] = useImmer({
    offset: 0,
    limit: 10,
    sourceId,
    verbose: 1,
    sort_by: 'created',
    reverse: true,
  })
  const { data, refetch, isFetching } = useQuerySourceHistories(
    filter,
    Array.from(histories.values()).reverse()
  )

  useEffect(() => {
    emitter.on(SOURCE_PING_RESULT, refetch)
    return () => emitter.off(SOURCE_PING_RESULT, refetch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <Modal
      visible
      width={800}
      title={`${get(opSourceList, `[0].name`, '新增数据源')}可用性测试记录`}
      // @ts-ignore next-line
      closable
      footer={null}
      onCancel={onClose}
    >
      <Table
        dataSource={data?.infos || []}
        columns={columns}
        rowKey="uuid"
        loading={isFetching}
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
    </Modal>
  )
}

export default DataSourcePingHistoriesModal
