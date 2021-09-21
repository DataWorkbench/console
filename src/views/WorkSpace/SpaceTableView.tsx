import { useState, useEffect } from 'react'
import { useWindowSize } from 'react-use'
import { observer } from 'mobx-react-lite'
import { get } from 'lodash-es'
import { useImmer } from 'use-immer'
import tw from 'twin.macro'
import { formatDate } from 'utils/convert'
import { Icon, Table, utils, Loading } from '@QCFE/qingcloud-portal-ui'
import { useWorkSpaceContext } from 'contexts'
import { useQueryPageWorkSpace } from 'hooks'
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
          render: (field: number) => (
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
          render: (field: string) => (
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
          render: (filed: number) => formatDate(filed),
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

const SpaceTableView = observer(({ regionId }: { regionId: string }) => {
  const stateStore = useWorkSpaceContext()
  const {
    defaultColumns,
    columnSettings,
    optSpaces,
    queryKeyWord,
    queryRefetch,
  } = stateStore
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const { width: winW } = useWindowSize()
  const [sort, setSort] = useImmer<{
    name: string
    created: string
    [p: string]: unknown
  }>({
    name: 'asc',
    created: 'desc',
  })
  const columns = utils.getTableColumnsBySetting(
    getDefaultColumns({ defaultColumns, regionId, winW, sort }),
    columnSettings
  )
  const [filter, setFilter] = useImmer<{
    regionId: string
    offset: number
    limit: number
    [p: string]: unknown
  }>({
    regionId,
    reverse: true,
    offset: 0,
    limit: 10,
  })
  const { isLoading, data, refetch } = useQueryPageWorkSpace(filter)
  const workspaces = get(data, 'infos') || []

  useEffect(() => {
    if (queryRefetch) {
      refetch().then(() => {
        stateStore.set({ queryRefetch: false })
      })
    }
  }, [queryRefetch, refetch, stateStore])

  useEffect(() => {
    setFilter((draft) => {
      draft.offset = 0
      draft.search = queryKeyWord
    })
  }, [queryKeyWord, setFilter])

  useEffect(() => {
    if (optSpaces.length === 0) {
      setSelectedRowKeys([])
    }
  }, [optSpaces.length])

  if (isLoading) {
    return (
      <div tw="h-72">
        <Loading />
      </div>
    )
  }

  const handleFilterChange = ({ status }: { status: string }) => {
    setFilter((draft) => {
      draft.status = status === 'all' ? '' : +status
    })
  }

  const handleSort = (sortKey: string, sortOrder: 'asc' | 'desc') => {
    setFilter((draft) => {
      draft.reverse = sortOrder === 'desc'
      draft.sort_by = sortKey
    })
    setSort((draft) => {
      draft[sortKey] = sortOrder
    })
  }

  const handlePageChange = (page: number) => {
    setFilter((draft) => {
      draft.offset = (page - 1) * draft.limit
    })
  }

  const handleShowSizeChange = (limit: number) => {
    setFilter((draft) => {
      draft.limit = limit
    })
  }

  const handleSelect = (keys, rows) => {
    stateStore.set({ optSpaces: rows })
    setSelectedRowKeys(keys)
  }

  return (
    <Table
      rowKey="id"
      loading={isLoading}
      selectType="checkbox"
      selectedRowKeys={selectedRowKeys}
      onSelect={handleSelect}
      tw="table-auto"
      dataSource={workspaces}
      columns={columns}
      onFilterChange={handleFilterChange}
      onSort={handleSort}
      pagination={{
        total: get(data, 'total', 0),
        current: Math.floor(filter.offset / filter.limit) + 1,
        pageSize: filter.limit,
        onPageChange: handlePageChange,
        onShowSizeChange: handleShowSizeChange,
      }}
    />
  )
})

export default SpaceTableView
