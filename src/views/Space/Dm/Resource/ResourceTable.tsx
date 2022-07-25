import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Table, ToolBar, localstorage, Icon, InputSearch } from '@QCFE/qingcloud-portal-ui'
import { Button, Menu } from '@QCFE/lego-ui'
import tw, { css } from 'twin.macro'
import {
  getResourcePageQueryKey,
  useMutationResource,
  useQueryDescribeWorkspaceConfig,
  useQueryResourceByPage
} from 'hooks'
import { get, omitBy } from 'lodash-es'
import { FlexBox, Center, Tooltip, TextEllipsis } from 'components'
import { useQueryClient } from 'react-query'
import { useImmer } from 'use-immer'
import dayjs from 'dayjs'
import { observer } from 'mobx-react-lite'
import { formatBytes } from 'utils/convert'
import { useParams } from 'react-router-dom'
import UploadModal from './UploadModal'
import DeleteModal from './DeleteModal'

const { MenuItem } = Menu as any

const types = [
  {
    label: 'JAR',
    value: 1,
    icon: 'q-jar-duotone'
  },
  {
    label: 'PYTHON',
    value: 2,
    icon: 'q-python-duotone'
  },
  {
    label: 'ZIP',
    value: 3,
    icon: 'q-zip-duotone'
  }
]
const columnSettingsKey = 'RESOURCE_TABLE_COLUMN_SETTINGS'
interface IFilter {
  limit: number
  offset: number
  name: string
  reverse: boolean
  search?: string
  sort_by: string
  type: number
}

const ResourceTable: React.FC<{ className?: string }> = observer(({ className }) => {
  const [operation, setOperation] = useState('')
  const [uploadVisible, setUploadVisible] = useState(false)
  const [deleteVisible, setDeleteVisible] = useState(false)
  const [deleteData, setDeleteData] = useState<any>({})
  const [defaultFields, setDefaultFields] = useState(undefined)
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [selectedRows, setSelectedRows] = useState<any>([])
  const [selectedMap, setSelectedMap] = useState<any>({})
  const [columnSettings, setColumnSettings] = useState(
    localstorage.getItem(columnSettingsKey) || []
  )

  const [filter, setFilter] = useImmer<IFilter>({
    limit: 10,
    offset: 0,
    name: '',
    reverse: true,
    search: '',
    sort_by: '',
    type: 0
  })

  const queryClient = useQueryClient()
  const mutation = useMutationResource()

  const refetchData = useCallback(() => {
    queryClient.invalidateQueries(getResourcePageQueryKey())
  }, [queryClient])

  const handleUploadClick = () => {
    setOperation('create')
    setUploadVisible(true)
  }

  const handleEdit = useCallback((row) => {
    setDefaultFields(row)
    setOperation('edit')
    setUploadVisible(true)
  }, [])

  const handleDelSuccess = () => {
    refetchData()
    if (deleteData.type === 'batch') {
      setSelectedRowKeys([])
      setSelectedRows([])
    } else {
      const newSelectedRows = selectedRows.filter((el: any) => el.id !== deleteData.value[0].id)
      const newSelectedKeys = selectedRowKeys.filter((el: string) => el !== deleteData.value[0].id)
      setSelectedRows(newSelectedRows)
      setSelectedRowKeys(newSelectedKeys)
    }
    setDeleteData({})
  }

  const handleDelete = useCallback(
    (row?: any) => {
      const rows: any = row ? [row] : selectedRows
      setDeleteData({ type: row ? 'single' : 'batch', value: rows })
      setDeleteVisible(true)
    },
    [selectedRows]
  )

  const handleReupload = useCallback((row: any) => {
    setDefaultFields(row)
    setUploadVisible(true)
    setOperation('view')
  }, [])

  const handleDownload = useCallback(
    (row: any) => {
      mutation.mutate(
        {
          op: 'enable',
          id: row.id
        },
        {
          onSuccess: (data) => {
            const blob = new Blob([data], {
              type: 'application/java-archive'
            })
            const ele = document.createElement('a')
            ele.style.display = 'none'
            ele.download = row.name
            ele.href = window.URL.createObjectURL(blob)
            document.body.appendChild(ele)
            ele.click()
            window.URL.revokeObjectURL(ele.href)
            document.body.removeChild(ele)
          }
        }
      )
    },
    [mutation]
  )

  const { isFetching, isRefetching, data } = useQueryResourceByPage(omitBy(filter, (v) => v === ''))
  const infos = get(data, 'infos', [])

  const columns = useMemo(
    () => [
      {
        title: '程序包名称',
        width: 200,
        dataIndex: 'name',
        sortable: true,
        sortOrder:
          //  filter.reverse ? 'asc' : 'desc',
          // eslint-disable-next-line no-nested-ternary
          filter.sort_by === 'name' ? (filter.reverse ? 'asc' : 'desc') : '',
        render: (value: string, record: Record<string, any>) => {
          const { type } = record
          return (
            <FlexBox tw="items-center space-x-1 overflow-hidden">
              <div tw="w-5 h-5">
                <Icon
                  className="is-left"
                  type="light"
                  name={types.find((el) => el.value === type)?.icon || 'q-jar-duotone'}
                />
              </div>
              <TextEllipsis twStyle={tw`font-medium`}>{value}</TextEllipsis>
            </FlexBox>
          )
        }
      },
      {
        title: 'ID',
        width: 160,
        dataIndex: 'id',
        render: (value: string) => <div tw="text-neut-8">{value}</div>
      },
      {
        title: (
          <FlexBox tw="items-center">
            <span>文件格式</span>
            <Tooltip
              trigger="click"
              placement="bottom-start"
              content={
                <Menu
                  selectedKey={String(filter?.type || 0)}
                  onClick={(e: React.SyntheticEvent, k: string, v: number) => {
                    setFilter((draft) => {
                      draft.type = v
                      draft.offset = 0
                    })
                  }}
                >
                  <MenuItem value="" key={0}>
                    全部
                  </MenuItem>
                  {types.map((st) => (
                    <MenuItem value={st.value} key={st.value}>
                      {st.label}
                    </MenuItem>
                  ))}
                </Menu>
              }
            >
              <Icon name="filter" type="light" clickable tw="ml-1 block" />
            </Tooltip>
          </FlexBox>
        ),
        dataIndex: 'type',
        render: (v: number) => types.find((st) => st.value === v)?.label
      },
      {
        title: '文件大小',
        dataIndex: 'size',
        render: (value: number) => <>{formatBytes(value, 2)}</>
      },
      {
        title: '描述',
        dataIndex: 'desc',
        render: (value: string) => (
          <div tw="overflow-hidden">
            <TextEllipsis>{value}</TextEllipsis>
          </div>
        )
      },
      {
        title: '上传时间',
        dataIndex: 'updated',
        sortable: true,
        sortOrder:
          // filter.reverse ? 'asc' : 'desc',
          // eslint-disable-next-line no-nested-ternary
          filter.sort_by === 'updated' ? (filter.reverse ? 'asc' : 'desc') : '',
        render: (value: number) => (
          <div tw="text-neut-8">{dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss')}</div>
        )
      },
      {
        title: '操作',
        dataIndex: 'table_actions',
        render: (_: string, row: Record<string, any>) => (
          <FlexBox tw="items-center">
            <Button type="text" onClick={() => handleEdit(row)}>
              编辑
            </Button>
            <Button type="text" onClick={() => handleDownload(row)}>
              导出
            </Button>
            <Center>
              <Tooltip
                trigger="click"
                placement="bottom"
                arrow={false}
                twChild={
                  css`
                    &[aria-expanded='true'] {
                      ${tw`bg-line-dark`}
                    }
                    svg {
                      ${tw`text-white! bg-transparent! fill-[transparent]!`}
                    }
                  ` as any
                }
                content={
                  <Menu
                    onClick={(e: any, key: any) => {
                      if (key === 'upload') {
                        handleReupload(row)
                      } else {
                        handleDelete(row)
                      }
                    }}
                  >
                    <MenuItem key="upload">重新上传</MenuItem>
                    <MenuItem key="delete">删除</MenuItem>
                  </Menu>
                }
              >
                <div tw="flex items-center p-0.5 cursor-pointer hover:bg-line-dark rounded-sm">
                  <Icon name="more" clickable changeable type="light" size={20} />
                </div>
              </Tooltip>
            </Center>
          </FlexBox>
        )
      }
    ],
    [
      setFilter,
      filter.type,
      filter.reverse,
      filter.sort_by,
      handleEdit,
      handleDownload,
      handleReupload,
      handleDelete
    ]
  )

  const filterColumn = columnSettings
    .map(
      (o: { key: string; checked: boolean }) =>
        o.checked && columns.find((col: any) => col.key === o.key)
    )
    .filter((o: any) => o)

  useEffect(() => {
    setSelectedRows(selectedRowKeys.map((el: string) => selectedMap[el]))
  }, [selectedMap, selectedRowKeys])

  const { spaceId } = useParams<{ spaceId: string }>()
  const { data: configData } = useQueryDescribeWorkspaceConfig({
    uri: { space_id: spaceId }
  })

  const sizeConf = get(configData!, 'quota_set.file.size_single', 100 * 1024 * 1024)
  return (
    <>
      <div tw="bg-neut-16 p-5" className={className}>
        <div tw="mt-4 mb-3">
          <FlexBox tw="justify-between">
            <Center tw="space-x-3">
              <Button type="primary" onClick={handleUploadClick}>
                <Icon name="upload" />
                上传程序包
              </Button>
              <Button disabled={!selectedRowKeys.length} onClick={() => handleDelete()}>
                <Icon name="trash" type="light" />
                <span>删除</span>
              </Button>
            </Center>
            <Center tw="space-x-3">
              <InputSearch
                tw="w-64 border-line-dark!"
                placeholder="请输入关键词进行搜索"
                onPressEnter={(e: React.SyntheticEvent) => {
                  setFilter((draft) => {
                    draft.search = (e.target as HTMLInputElement).value
                    draft.offset = 0
                  })
                }}
                onClear={() => {
                  setFilter((draft) => {
                    draft.search = ''
                  })
                }}
              />
              <Button type="black" loading={isRefetching} tw="px-[5px] border-line-dark!">
                <Icon
                  name="if-refresh"
                  tw="text-xl text-white"
                  type="light"
                  onClick={() => {
                    refetchData()
                  }}
                />
              </Button>
              <ToolBar tw="bg-neut-16 p-0 border-neut-13">
                <ToolBar.ColumnsSetting
                  defaultColumns={columns}
                  onSave={setColumnSettings}
                  storageKey={columnSettingsKey}
                />
              </ToolBar>
            </Center>
          </FlexBox>
        </div>
        <Table
          rowKey="id"
          selectType="checkbox"
          loading={isFetching || mutation.isLoading}
          dataSource={infos || []}
          columns={filterColumn.length > 0 ? filterColumn : columns}
          selectedRowKeys={selectedRowKeys}
          onSelect={(keys: string[], rows: any) => {
            setSelectedRowKeys(keys)
            const rowsMap = rows.reduce((acc: any, cur: any) => {
              acc[cur.id] = cur
              return acc
            }, {})
            setSelectedMap({ ...selectedMap, ...rowsMap })
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
            }
          }}
          onSort={(sortKey: any, order: string) => {
            setFilter((draft) => {
              draft.sort_by = sortKey
              draft.reverse = order === 'asc'
            })
          }}
        />
      </div>

      {uploadVisible && (
        <UploadModal
          operation={operation}
          visible={uploadVisible}
          initFields={defaultFields}
          handleCancel={() => {
            setUploadVisible(false)
            setDefaultFields(undefined)
            setOperation('')
          }}
          handleSuccess={refetchData}
          size={sizeConf}
        />
      )}

      {Object.keys(deleteData).length && (
        <DeleteModal
          visible={deleteVisible}
          deleteData={deleteData}
          toggle={() => setDeleteVisible(!deleteVisible)}
          mutation={mutation}
          success={handleDelSuccess}
        />
      )}
    </>
  )
})

export default ResourceTable
