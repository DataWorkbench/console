import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Table,
  ToolBar,
  localstorage,
  Icon,
  InputSearch,
} from '@QCFE/qingcloud-portal-ui'
import { Tabs, Alert, Button, Menu } from '@QCFE/lego-ui'
import tw, { styled, css } from 'twin.macro'
import {
  getResourcePageQueryKey,
  useMutationResource,
  useQueryResourceByPage,
  useStore,
} from 'hooks'
import { get, omitBy } from 'lodash-es'
import { FlexBox, Center, Tooltip } from 'components'
import { useQueryClient } from 'react-query'
import { useImmer } from 'use-immer'
import dayjs from 'dayjs'
import { observer } from 'mobx-react-lite'
import UploadModal from './UploadModal'
import DeleteModal from './DeleteModal'

const columnSettingsKey = 'RESOURCE_TABLE_COLUMN_SETTINGS'

const { TabPanel } = Tabs
const { MenuItem } = Menu

const DarkTabs = styled(Tabs)(
  () => css`
    .tabs ul {
      background-color: #1e2f41;
      ${tw`text-neut-8 border-0`}
      li {
        ${tw`px-0! py-4!  ml-5! mr-4! mb-0! leading-6`}
        ${tw`border-b-4! border-transparent!`}
      &:hover {
          ${tw`text-white border-0`}
        }
        & + li {
          ${tw`ml-4! mr-5!`}
        }
      }
      > li.is-active {
        ${tw`border-b-4 border-white! text-white`}
      }
    }
    .tab-content {
      ${tw`p-0`}
    }
  `
)

interface IFilter {
  limit: number
  offset: number
  resource_name: string
  resource_type: number
  reverse: boolean
  search?: string
  sort_by: string
}

const ResourceTable: React.FC<{ className?: string }> = observer(
  ({ className }) => {
    const {
      dmStore: { setOp },
    } = useStore()

    const [uploadVisible, setUploadVisible] = useState(false)
    const [deleteVisible, setDeleteVisible] = useState(false)
    const [deleteData, setDeleteData] = useState<any>({})
    const [defaultFields, setDefaultFields] = useState({})
    const [packageType, setPackageType] = useState('program')
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
    const [selectedRows, setSelectedRows] = useState<any>([])
    const [selectedMap, setSelectedMap] = useState<any>({})
    const [columnSettings, setColumnSettings] = useState(
      localstorage.getItem(columnSettingsKey) || []
    )

    const packageTypeName = packageType === 'program' ? '程序包' : '函数包'

    const [filter, setFilter] = useImmer<IFilter>({
      limit: 10,
      offset: 0,
      resource_name: '',
      resource_type: packageType === 'program' ? 1 : 2,
      reverse: true,
      search: '',
      sort_by: '',
    })

    const queryClient = useQueryClient()
    const mutation = useMutationResource()

    const refetchData = useCallback(() => {
      queryClient.invalidateQueries(getResourcePageQueryKey())
    }, [queryClient])

    const toggle = useCallback(() => {
      setUploadVisible(!uploadVisible)
    }, [uploadVisible])

    const handleUploadClick = () => {
      setOp('create')
      toggle()
    }

    const handleTabChange = (name: string) => {
      setPackageType(name)
      setFilter((draft) => {
        draft.resource_type = name === 'program' ? 1 : 2
      })

      setSelectedRows([])
      setSelectedRowKeys([])
      setSelectedMap([])
    }

    const handleEdit = useCallback(
      (row) => {
        setOp('edit')
        toggle()
        setDefaultFields(row)
      },
      [setOp, toggle]
    )

    const handleDelSuccess = () => {
      refetchData()
      if (deleteData.type === 'batch') {
        setSelectedRowKeys([])
        setSelectedRows([])
      } else {
        const newSelectedRows = selectedRows.filter(
          (el: any) => el.resource_id !== deleteData.value[0].resource_id
        )
        const newSelectedKeys = selectedRowKeys.filter(
          (el: string) => el !== deleteData.value[0].resource_id
        )
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

    const handleReupload = useCallback(
      (row: any) => {
        setDefaultFields(row)
        toggle()
        setOp('view')
      },
      [toggle, setOp]
    )

    const handleDownload = useCallback(
      (row: any) => {
        mutation.mutate(
          {
            op: 'enable',
            resource_id: row.resource_id,
          },
          {
            onSuccess: (data) => {
              const blob = new Blob([data], {
                type: 'application/x-java-archive',
              })
              const ele = document.createElement('a')
              ele.style.display = 'none'
              ele.download = `${row.name}.jar`
              ele.href = window.URL.createObjectURL(blob)
              document.body.appendChild(ele)
              ele.click()
              window.URL.revokeObjectURL(ele.href)
              document.body.removeChild(ele)
            },
          }
        )
      },
      [mutation]
    )

    const { isFetching, isRefetching, data } = useQueryResourceByPage(
      omitBy(filter, (v) => v === '')
    )
    const infos = get(data, 'infos', [])

    const columns = useMemo(() => {
      return [
        {
          title: `${packageTypeName}名称`,
          dataIndex: 'name',
          sortable: true,
          sortOrder: filter.reverse ? 'asc' : 'desc',
          render: (_: string, row: Record<string, any>) => {
            return (
              <FlexBox tw="items-center space-x-1">
                <Icon
                  name={packageType === 'program' ? 'coding' : 'terminal'}
                  type="light"
                  color={{
                    primary: '#219861',
                    secondary: '#8EDABD',
                  }}
                />
                <div>{row.name}</div>
              </FlexBox>
            )
          },
        },
        {
          title: 'ID',
          dataIndex: 'resource_id',
          render: (value: string) => {
            return <div tw="text-neut-8">{value}</div>
          },
        },
        {
          title: '文件大小',
          dataIndex: 'size',
          render: (value: number) => <>{Math.round(value / 1000)}kb</>,
        },
        {
          title: '描述',
          dataIndex: 'description',
          render: (value: string) => {
            return <div tw="text-neut-8">{value}</div>
          },
        },
        {
          title: '上传时间',
          dataIndex: 'updated',
          sortable: true,
          sortOrder: filter.reverse ? 'asc' : 'desc',
          render: (value: number) => {
            return (
              <div tw="text-neut-8">
                {dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss')}
              </div>
            )
          },
        },
        {
          title: '操作',
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
                  <div tw="flex items-center">
                    <Icon name="more" clickable changeable type="light" />
                  </div>
                </Tooltip>
              </Center>
            </FlexBox>
          ),
        },
      ]
    }, [
      packageTypeName,
      filter.reverse,
      packageType,
      handleEdit,
      handleDownload,
      handleReupload,
      handleDelete,
    ])

    const filterColumn = columnSettings
      .map((o: { key: string; checked: boolean }) => {
        return o.checked && columns.find((col: any) => col.key === o.key)
      })
      .filter((o: any) => o)

    useEffect(() => {
      setSelectedRows(selectedRowKeys.map((el: string) => selectedMap[el]))
    }, [selectedMap, selectedRowKeys])

    return (
      <>
        <DarkTabs defaultActiveName={packageType} onChange={handleTabChange}>
          <TabPanel key="program" label="程序包" name="program" />
          <TabPanel key="function" label="函数包" name="function" />
        </DarkTabs>
        <div tw="bg-neut-16 p-5" className={className}>
          <Alert
            type="info"
            tw="bg-neut-16! mb-4"
            message={`提示: ${packageTypeName}用于作业中的代码开发模式`}
            linkBtn={<Button type="text">查看详情 →</Button>}
          />
          <div tw="mt-4 mb-3">
            <FlexBox tw="justify-between">
              <Center tw="space-x-3">
                <Button type="primary" onClick={handleUploadClick}>
                  <Icon name="upload" />
                  上传{packageTypeName}
                </Button>
                <Button
                  disabled={!selectedRowKeys.length}
                  onClick={() => handleDelete()}
                >
                  <Icon name="trash" type="light" />
                  <span>删除</span>
                </Button>
              </Center>
              <Center tw="space-x-3">
                <InputSearch
                  tw="w-64 border-[#4C5E70]!"
                  placeholder="请输入关键词进行搜索"
                  onPressEnter={(e: React.SyntheticEvent) => {
                    setFilter((draft) => {
                      draft.search = (e.target as HTMLInputElement).value
                    })
                  }}
                  onClear={() => {
                    setFilter((draft) => {
                      draft.search = ''
                    })
                  }}
                />
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
            rowKey="resource_id"
            selectType="checkbox"
            loading={isFetching}
            dataSource={infos || []}
            columns={filterColumn.length > 0 ? filterColumn : columns}
            selectedRowKeys={selectedRowKeys}
            onSelect={(keys: string[], rows: any) => {
              setSelectedRowKeys(keys)
              const rowsMap = rows.reduce((acc: any, cur: any) => {
                acc[cur.resource_id] = cur
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
              },
            }}
            onSort={(sortKey: any, order: string) => {
              setFilter((draft) => {
                draft.sort_by = sortKey
                draft.reverse = order === 'asc'
              })
            }}
          />
        </div>

        <UploadModal
          visible={uploadVisible}
          type={packageType}
          handleCancel={toggle}
          defaultFields={defaultFields}
        />

        {Object.keys(deleteData).length && (
          <DeleteModal
            visible={deleteVisible}
            packageType={packageType}
            deleteData={deleteData}
            toggle={() => setDeleteVisible(!deleteVisible)}
            mutation={mutation}
            success={handleDelSuccess}
          />
        )}
      </>
    )
  }
)

export default ResourceTable
