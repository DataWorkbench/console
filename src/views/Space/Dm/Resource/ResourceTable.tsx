import { useCallback, useMemo, useState } from 'react'
import { Table, ToolBar, localstorage, Icon } from '@QCFE/qingcloud-portal-ui'
import { Tabs, Alert, Button, InputSearch, Menu } from '@QCFE/lego-ui'
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

const columnSettingsKey = 'RESOURCE_TABLE_COLUMN_SETTINGS'

const { TabPanel } = Tabs
const { MenuItem } = Menu

const DarkTabs = styled(Tabs)(
  () => css`
    .tabs ul {
      ${tw`text-neut-8 border-0`}
      background-color: #1e2f41;
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
    const [defaultFields, setDefaultFields] = useState({})
    const [packageType, setPackageType] = useState('program')
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
    const [visible, setVisible] = useState(false)
    const [columnSettings, setColumnSettings] = useState(
      localstorage.getItem(columnSettingsKey) || []
    )
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
      setVisible(!visible)
    }, [visible])

    const handleUploadClick = () => {
      setOp('create')
      toggle()
    }

    const handleTabChange = (name: string) => {
      setPackageType(name)
      setFilter((draft) => {
        draft.resource_type = name === 'program' ? 1 : 2
      })
    }

    const handleEdit = useCallback(
      (row) => {
        setOp('edit')
        toggle()
        setDefaultFields(row)
      },
      [setOp, toggle]
    )

    const handleDelete = useCallback(
      (row?: any) => {
        mutation.mutate(
          {
            op: 'delete',
            resourceIds: row ? [row.id] : selectedRowKeys,
          },
          {
            onSuccess: async () => {
              if (!row) setSelectedRowKeys([])
              refetchData()
            },
          }
        )
      },
      [selectedRowKeys, refetchData, mutation]
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
        mutation.mutate({
          op: 'enable',
          resource_id: row.id,
        })
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
          title: `${packageType === 'program' ? '程序包' : '函数包'}名称`,
          dataIndex: 'name',
          key: 'name',
          sortable: true,
          sortOrder: filter.reverse ? 'asc' : 'desc',
        },
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
        },
        {
          title: '语言类型',
          dataIndex: 'type',
          key: 'type',
          render: (value: any) => <>{value === 1 ? '程序包' : '函数包'}</>,
        },
        {
          title: '描述',
          dataIndex: 'description',
          key: 'description',
        },
        {
          title: '上传时间',
          dataIndex: 'updated',
          key: 'updated',
          sortable: true,
          sortOrder: filter.reverse ? 'asc' : 'desc',
          render: (value: number) =>
            dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          title: '操作',
          render: (value: any, row: any) => (
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
                  <Icon name="more" clickable changeable type="light" />
                </Tooltip>
              </Center>
            </FlexBox>
          ),
        },
      ]
    }, [
      packageType,
      filter.reverse,
      handleEdit,
      handleDownload,
      handleDelete,
      handleReupload,
    ])

    const filterColumn = columnSettings
      .map((o: { key: string; checked: boolean }) => {
        return o.checked && columns.find((col) => col.key === o.key)
      })
      .filter((o: any) => o)

    return (
      <div>
        <DarkTabs defaultActiveName={packageType} onChange={handleTabChange}>
          <TabPanel key="program" label="程序包" name="program" />
          <TabPanel key="function" label="函数包" name="function" />
        </DarkTabs>
        <div tw="bg-neut-16 p-5" className={className}>
          <Alert
            type="info"
            tw="bg-neut-16! mb-4"
            message={`提示: ${
              packageType === 'program' ? '程序包' : '函数包'
            }用于业务流程中的代码开发模式`}
            linkBtn={<Button type="text">查看详情 →</Button>}
          />
          <div tw="mt-4 mb-3">
            <FlexBox tw="justify-between">
              <Center tw="space-x-3">
                <Button type="primary" onClick={handleUploadClick}>
                  <Icon name="upload" />
                  上传{packageType === 'program' ? '程序包' : '函数包'}
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
                  tw="w-64"
                  placeholder="请输入关键词进行搜索"
                  onPressEnter={(e: React.SyntheticEvent) => {
                    setFilter((draft) => {
                      draft.resource_name = (e.target as HTMLInputElement).value
                    })
                  }}
                  onClear={() => {
                    setFilter((draft) => {
                      draft.resource_name = ''
                    })
                  }}
                />
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
            loading={isFetching}
            dataSource={infos || []}
            columns={filterColumn.length > 0 ? filterColumn : columns}
            selectedRowKeys={selectedRowKeys}
            onSelect={(keys: string[]) => {
              setSelectedRowKeys(keys)
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
          visible={visible}
          type={packageType}
          handleCancel={toggle}
          defaultFields={defaultFields}
        />
      </div>
    )
  }
)

export default ResourceTable
