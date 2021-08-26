import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useWindowSize, useMount } from 'react-use'
import { observer } from 'mobx-react-lite'
import { get } from 'lodash'
import clsx from 'clsx'
import { useImmer } from 'use-immer'
import { formatDate } from 'utils/convert'
import { Icon, Table, utils } from '@QCFE/qingcloud-portal-ui'
import { useStore } from 'stores'
import { useWorkSpaceContext } from 'contexts'
import TableRowOpt from './TableRowOpt'

const getDefaultColumns = ({ defaultColumns, regionId, winW, sort }) => {
  return defaultColumns.map(({ title, dataIndex }) => {
    let col = {}
    switch (dataIndex) {
      case 'id':
        col = {
          sortable: true,
          sortKey: 'name',
          sortOrder: sort.name,
          render: (field, row) => (
            <div className="tw-flex tw-items-center">
              <div className="tw-bg-neut-3 tw-rounded-full tw-p-1 tw-flex tw-items-center tw-justify-center">
                <Icon name="project" size="small" />
              </div>
              <div className="tw-ml-2">
                <div className="tw-font-semibold">{row.name}</div>
                <div className="tw-text-neut-8">{field}</div>
              </div>
            </div>
          ),
        }
        break
      case 'status':
        col = {
          filters: [
            { text: '活跃', value: '1' },
            { text: '已禁用', value: '2' },
          ],
          render: (field) => (
            <div
              className={clsx(
                field === 1
                  ? 'tw-bg-green-0 tw-text-green-13'
                  : 'tw-bg-[#FFFDED] tw-text-[#A16207]',
                'tw-px-2 tw-py-0.5 tw-rounded-[20px] tw-flex tw-items-center'
              )}
            >
              <div
                className={clsx(
                  field === 1 ? 'tw-bg-green-1' : 'tw-bg-[#FFD127]',
                  ' tw-w-3 tw-h-3 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mr-1'
                )}
              >
                <div
                  className={clsx(
                    field === 1 ? 'tw-bg-green-13' : 'tw-bg-[#A48A19]',
                    ' tw-w-1.5 tw-h-1.5 tw-rounded-full'
                  )}
                />
              </div>
              {field === 1 ? '活跃' : '已禁用'}
            </div>
          ),
        }
        break
      case 'owner':
        col = {
          render: (field) => (
            <div>
              <div>xxx@test.com</div>
              <div className="tw-text-neut-8">{field}</div>
            </div>
          ),
        }
        break
      case 'name':
        col = {
          render: () => {},
        }
        break
      case 'desc':
        break
      case 'created':
        col = {
          sortable: true,
          sortKey: 'created',
          sortOrder: sort.created,
          render: (filed) => formatDate(filed),
        }
        break
      case 'updated':
        col = {
          width: winW >= 1536 ? 380 : 330,
          render: (filed, row) => (
            <TableRowOpt space={row} regionId={regionId} />
          ),
        }
        break
      default:
        break
    }
    return { title, dataIndex, ...col }
  })
}

function SpaceTableView({ regionId }) {
  const stateStore = useWorkSpaceContext()
  const { defaultColumns, columnSettings, optSpaces } = stateStore
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const { width: winW } = useWindowSize()
  const [sort, setSort] = useImmer({ name: 'asc', created: 'desc' })
  const {
    workSpaceStore,
    workSpaceStore: { regions },
  } = useStore()
  const region = regions[regionId]
  const offset = get(region, 'filter.offset', 0)
  const workspaces = get(region, 'workspaces', [])
  const columns = utils.getTableColumnsBySetting(
    getDefaultColumns({ defaultColumns, regionId, winW, sort }),
    columnSettings
  )

  const total = get(region, 'total', 0)
  const pageSize = get(region, 'filter.limit', 10)
  const current = Math.floor(offset / pageSize) + 1

  useMount(() => {
    workSpaceStore.fetchData({
      regionId,
      cardView: false,
      offset: 0,
    })
  })

  useEffect(() => {
    if (optSpaces.length === 0) {
      setSelectedRowKeys([])
    }
  }, [optSpaces.length])

  const handleFilterChange = ({ status }) => {
    workSpaceStore.fetchData({
      regionId,
      cardView: false,
      offset: 0,
      status: status === 'all' ? '' : +status,
    })
  }

  const handleSort = (sortKey, sortOrder) => {
    setSort((draft) => {
      draft[sortKey] = sortOrder
    })

    workSpaceStore.fetchData({
      regionId,
      cardView: false,
      offset: 0,
      sort_by: sortKey,
      reverse: sortOrder === 'desc',
    })
  }

  const handlePageChange = (curPage) => {
    const { limit } = get(region, 'filter')

    workSpaceStore.fetchData({
      regionId,
      cardView: false,
      offset: (curPage - 1) * limit,
    })
  }

  const handleShowSizeChange = (limit) => {
    workSpaceStore.fetchData({
      regionId,
      cardView: false,
      limit,
      offset: 0,
    })
  }

  const handleSelect = (keys, rows) => {
    stateStore.set({ optSpaces: rows })
    setSelectedRowKeys(keys)
  }

  return (
    <Table
      rowKey="id"
      loading={get(region, 'loadStatus.state') === 'pending'}
      selectType="checkbox"
      selectedRowKeys={selectedRowKeys}
      onSelect={handleSelect}
      className="tw-table-auto"
      dataSource={workspaces}
      columns={columns}
      onFilterChange={handleFilterChange}
      onSort={handleSort}
      pagination={{
        total,
        current,
        pageSize,
        onPageChange: handlePageChange,
        onShowSizeChange: handleShowSizeChange,
      }}
    />
  )
}

SpaceTableView.propTypes = {
  regionId: PropTypes.string,
}

export default observer(SpaceTableView)
