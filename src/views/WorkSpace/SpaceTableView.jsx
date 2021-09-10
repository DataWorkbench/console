import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useWindowSize } from 'react-use'
import { observer } from 'mobx-react-lite'
import { get } from 'lodash'
import { useImmer } from 'use-immer'
import tw from 'twin.macro'
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
            <div tw="flex items-center">
              <div tw="bg-neut-3 rounded-full p-1 flex items-center justify-center">
                <Icon name="project" size="small" />
              </div>
              <div tw="ml-2">
                <div tw="font-semibold">{row.name}</div>
                <div tw="text-neut-8">{field}</div>
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
              css={[
                field === 1
                  ? tw`bg-green-0 text-green-13`
                  : tw`bg-[#FFFDED] text-[#A16207]`,
                tw`px-2 py-0.5 rounded-[20px] flex items-center`,
              ]}
            >
              <div
                css={[
                  field === 1 ? tw`bg-green-1` : tw`bg-[#FFD127]`,
                  tw`w-3 h-3 rounded-full flex items-center justify-center mr-1`,
                ]}
              >
                <div
                  css={[
                    field === 1 ? tw`bg-green-13` : tw`bg-[#A48A19]`,
                    tw`w-1.5 h-1.5 rounded-full`,
                  ]}
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
              <div tw="text-neut-8">{field}</div>
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
  const offset = get(region, 'params.offset', 0)
  const workspaces = get(region, 'workspaces', [])
  const columns = utils.getTableColumnsBySetting(
    getDefaultColumns({ defaultColumns, regionId, winW, sort }),
    columnSettings
  )

  const total = get(region, 'total', 0)
  const pageSize = get(region, 'params.limit', 10)
  const current = offset + 1 < pageSize ? 1 : Math.floor(offset / pageSize) + 1

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
    const { limit } = get(region, 'params')

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
      loading={get(region, 'fetchPromise.state') === 'pending'}
      selectType="checkbox"
      selectedRowKeys={selectedRowKeys}
      onSelect={handleSelect}
      tw="table-auto"
      dataSource={workspaces.slice(0, pageSize)}
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
