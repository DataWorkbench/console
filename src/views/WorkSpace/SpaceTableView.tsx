import { useEffect, useMemo } from 'react'
import { useWindowSize } from 'react-use'
import { observer } from 'mobx-react-lite'
import { get, omitBy } from 'lodash-es'
import { useImmer } from 'use-immer'
import tw, { css } from 'twin.macro'
import { formatDate } from 'utils/convert'
import { Menu } from '@QCFE/lego-ui'
import { Icon, Table } from '@QCFE/qingcloud-portal-ui'
import { useWorkSpaceContext } from 'contexts'
import { useQueryPageWorkSpace } from 'hooks'
import { Tooltip, FlexBox, TextEllipsis } from 'components'
import { useHistory } from 'react-router-dom'
import TableRowOpt from './TableRowOpt'

const { MenuItem } = Menu as any

const SpaceTableView = observer(({ regionId }: { regionId: string }) => {
  const stateStore = useWorkSpaceContext()
  const {
    defaultColumns,
    columnSettings,
    selectedSpaces,
    queryKeyWord,
    queryRefetch,
  } = stateStore
  // const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const selectedRowKeys = selectedSpaces.map((i: Record<string, any>) => i.id)
  const { width: winW } = useWindowSize()
  const [sort, setSort] = useImmer<{
    name: string
    created: string
    [p: string]: unknown
  }>({
    name: 'asc',
    created: 'desc',
  })

  const history = useHistory()

  interface IFilter {
    regionId: string
    limit: number
    name: string
    offset: number
    reverse: boolean
    search: string
    sort_by: string
    status: string | number
  }
  const [filter, setFilter] = useImmer<IFilter>({
    regionId,
    limit: 10,
    name: '',
    offset: 0,
    reverse: true,
    search: '',
    sort_by: '',
    status: '',
  })

  const ifExceedMaxWidth = winW > 1535

  const columns = useMemo(() => {
    return defaultColumns.map(
      ({ title, dataIndex }: { title: string; dataIndex: string }) => {
        if (dataIndex === 'id') {
          return {
            title,
            dataIndex,
            sortable: true,
            sortKey: 'name',
            sortOrder: sort.name,
            render: (field: string, row: any) => (
              <div tw="flex items-center w-full">
                <div
                  className="list-icon-wrap"
                  tw="bg-neut-3 rounded-full p-1 flex items-center justify-center border-2 border-solid border-white"
                >
                  <Icon name="project" size="small" className="list-icon" />
                </div>
                <div tw="ml-2 flex-1 overflow-hidden">
                  <TextEllipsis>
                    <span
                      className={row.status === 1 && 'row-name'}
                      css={[
                        tw`font-semibold`,
                        row.status === 1 && tw`cursor-pointer`,
                      ]}
                      onClick={() => {
                        if (row.status === 1) {
                          history.push(`${regionId}/workspace/${field}/upcloud`)
                        }
                      }}
                    >
                      {row.name}
                    </span>
                  </TextEllipsis>
                  <div tw="text-neut-8">{field}</div>
                </div>
              </div>
            ),
          }
        }
        if (dataIndex === 'status') {
          const filterMenus = [
            { value: '', text: '全部' },
            { value: 1, text: '活跃' },
            { value: 2, text: '已禁用' },
          ]
          return {
            title: (
              <FlexBox tw="items-center">
                <span>{title}</span>
                <Tooltip
                  theme="light"
                  trigger="click"
                  offset={[-10, 5]}
                  placement="bottom-start"
                  content={
                    <Menu
                      selectedKey={String(filter.status || 'all')}
                      onClick={(
                        e: React.SyntheticEvent,
                        k: string,
                        v: number
                      ) => {
                        setFilter((draft) => {
                          draft.status = k === 'all' ? '' : v
                          draft.offset = 0
                        })
                      }}
                    >
                      <div />
                      {filterMenus.map((o) => {
                        return (
                          <MenuItem value={o.value} key={o.value || 'all'}>
                            <FlexBox tw="items-center w-full justify-between">
                              <span>{o.text}</span>
                              {o.value === filter.status && (
                                <i
                                  className="if if-check"
                                  tw="text-green-11 text-sm"
                                />
                              )}
                            </FlexBox>
                          </MenuItem>
                        )
                      })}
                    </Menu>
                  }
                >
                  <div className="table-thead-filter">
                    <Icon name="if-filter" type="dark" className="icon-dark" />
                  </div>
                </Tooltip>
              </FlexBox>
            ),
            dataIndex,
            // width: 180,
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
        }
        if (dataIndex === 'owner') {
          return {
            title,
            dataIndex,
            // width: 180,
            render: (field: string) => (
              <div>
                {/* <div>xxx@test.com</div> */}
                <div tw="text-neut-8">{field}</div>
              </div>
            ),
          }
        }
        if (dataIndex === 'user_number') {
          return {
            title,
            dataIndex,
            sortable: true,
            sortKey: 'user_number',
            sortOrder: sort.user_number,
            render: () => {},
          }
        }
        if (dataIndex === 'desc') {
          return {
            title,
            dataIndex,
            // width: 200,
            render: (field: string) => (
              <div tw="truncate">
                <TextEllipsis>{field || '暂无描述'}</TextEllipsis>
              </div>
            ),
          }
        }
        if (dataIndex === 'created') {
          return {
            title,
            dataIndex,
            sortable: true,
            sortKey: 'created',
            sortOrder: sort.created,
            render: (filed: number) => formatDate(filed),
          }
        }
        if (dataIndex === 'updated') {
          return {
            title,
            dataIndex,
            width: ifExceedMaxWidth ? 380 : 330,
            // width: ifExceedMaxWidth ? 320 : 280,
            render: (filed: any, row: any) => (
              <TableRowOpt space={row} regionId={regionId} />
            ),
          }
        }
        return null
      }
    )
  }, [
    defaultColumns,
    sort.name,
    sort.user_number,
    sort.created,
    filter.status,
    ifExceedMaxWidth,
    history,
    regionId,
    setFilter,
  ])

  const filterColumn = columnSettings
    .map((o: { key: string; checked: boolean }) => {
      return o.checked && columns.find((col: any) => col.dataIndex === o.key)
    })
    .filter((o: any) => o)

  const { isFetching, data, refetch } = useQueryPageWorkSpace(
    omitBy(filter, (v) => v === '')
  )

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
      draft.offset = 0
    })
  }

  const handleSelect = (keys, rows) => {
    stateStore.set({ selectedSpaces: rows })
    // setSelectedRowKeys(keys)
  }

  return (
    <Table
      rowKey="id"
      loading={isFetching}
      selectType="checkbox"
      selectedRowKeys={selectedRowKeys}
      onSelect={handleSelect}
      css={[
        tw`table-auto`,
        css`
          .table-row:hover {
            .row-name {
              ${tw`text-green-11`}
            }
            .list-icon-wrap {
              background-color: #ecfdf5;
            }
            .list-icon svg {
              color: #059669;
              fill: #31cd88;
            }
          }
        `,
      ]}
      dataSource={data?.infos || []}
      columns={filterColumn.length > 0 ? filterColumn : columns}
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
