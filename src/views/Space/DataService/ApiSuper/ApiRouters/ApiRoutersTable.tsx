import { Button, Icon, InputSearch, Table, ToolBar } from '@QCFE/qingcloud-portal-ui'
import { MoreAction, FlexBox, Center } from 'components'
import { useQueryListRoutes, getQueryKeyListRoutes } from 'hooks'
import { useColumns } from 'hooks/useHooks/useColumns'
import useFilter from 'hooks/useHooks/useFilter'
import { get } from 'lodash-es'
import { useState } from 'react'
import { useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import { MappingKey } from 'utils/types'
import { formatDate } from 'utils'
import { PbmodelRoute } from 'types/types'
import { apiRoutersTableFieldMapping, apiRouterTableColumns } from '../constants'
import AbolishApiModal from './AbolishApiModal'
import { NameWrapper } from '../styles'
import { TestModal } from './TestModal'

interface ApiRouterTableProps {
  apiServiceId?: string
}
const { ColumnsSetting } = ToolBar as any

const columnSettingsKey = 'DATA_SERVICE_API_SERVICE_API_ROUTER'

const getName = (name: MappingKey<typeof apiRoutersTableFieldMapping>) =>
  apiRoutersTableFieldMapping.get(name)!.apiField

const ApiGroupTable = ({ apiServiceId }: ApiRouterTableProps) => {
  const queryClient = useQueryClient()
  const { spaceId } = useParams<{ spaceId: string }>()
  const [curOp, setOp] = useState<string>()
  const [currentRow, setCurrentRow] = useState<PbmodelRoute>()

  const {
    filter,
    setFilter,
    pagination,
    sort,
    getColumnSort: getSort
  } = useFilter<
    Record<ReturnType<typeof getName>, number | string | boolean>,
    { pagination: true; sort: true }
  >(
    { sort_by: getName('create_time'), reverse: true, curr_status: 1 },
    { pagination: true, sort: true },
    columnSettingsKey
  )
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])

  const { isRefetching, data } = useQueryListRoutes({
    uri: { space_id: spaceId },
    params: { api_service_id: apiServiceId, ...filter } as any
  })

  // 刷新
  const refetchData = () => {
    queryClient.invalidateQueries(getQueryKeyListRoutes())
  }

  const toServiceDev = (row: any) => {
    window.open(`./serviceDev/${row.id}?verId=${row.api_version_id}`)
  }

  const handleMenuClick = (row: PbmodelRoute, key: string) => {
    if (key === 'stop') {
      setSelectedRowKeys([row.id])
    } else if (key === 'detail') {
      window.open(`../serviceDev`, '_blank')
    }
    setOp(key)
    setCurrentRow(row)
  }

  const handleCancel = () => {
    setOp('')
    refetchData()
  }

  const getActions = (row: Record<string, any>) => {
    const result = [
      {
        text: '查看详情',
        icon: 'q-noteFill',
        key: 'detail',
        value: row
      },
      {
        text: '测试',
        icon: 'q-pingFill',
        key: 'test',
        value: row
      },
      {
        text: '下线',
        icon: 'q-down2Fill',
        key: 'stop',
        value: row
      }
    ]
    if (apiServiceId) {
      return result
    }
    return result.filter((item) => item.key !== 'detail')
  }

  const columnsRender = {
    [getName('name')]: {
      render: (v: any, row: any) => (
        <NameWrapper
          isHover={!apiServiceId}
          onClick={() => {
            if (!apiServiceId) {
              toServiceDev(row)
            }
          }}
        >
          <FlexBox tw="items-center space-x-1 truncate">
            <Center
              className="clusterIcon"
              tw="bg-neut-13 border-2 box-content border-neut-16 rounded-full w-6 h-6 mr-1.5"
            >
              <Icon name="q-apiDuotone" type="light" />
            </Center>
            <div tw="truncate">
              <div className="name">{row.name}</div>
              <div tw="dark:text-neut-8">{row.id}</div>
            </div>
          </FlexBox>
        </NameWrapper>
      )
    },
    [getName('uri')]: {
      render: (v: number, row: any) => (
        <span tw="dark:text-neut-0">{`${row?.host}${row?.uri}`}</span>
      )
    },
    [getName('create_time')]: {
      ...getSort(getName('create_time')),
      render: (v: number) => <span tw="dark:text-neut-0">{formatDate(v)}</span>
    }
  }

  const operation = {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    render: (_: never, record: any) => (
      <MoreAction theme="darker" items={getActions(record)} onMenuClick={handleMenuClick} />
    )
  }

  const tableColums = apiServiceId
    ? apiRouterTableColumns.filter((item) => !['api_service_id'].includes(item.dataIndex as string))
    : apiRouterTableColumns
  const { columns, setColumnSettings } = useColumns(
    columnSettingsKey,
    tableColums,
    columnsRender,
    operation
  )

  const dataSource = get(data, 'entities') || []

  return (
    <FlexBox tw="w-full flex-1" orient="column">
      <div tw="mb-3">
        <FlexBox tw="justify-between">
          <Center tw="space-x-3">
            {selectedRowKeys.length !== 0 && (
              <Button
                tw="w-[72px]"
                type="danger"
                onClick={() => {
                  setOp('stop')
                }}
              >
                下线
              </Button>
            )}
          </Center>
          <Center tw="space-x-3">
            <InputSearch
              tw="w-64 border-2 rounded-sm  dark:border-neut-15"
              placeholder="请输入关键词进行搜索"
              onPressEnter={(e: React.SyntheticEvent) => {
                setFilter((draft) => {
                  draft.name = (e.target as HTMLInputElement).value
                  draft.offset = 0
                })
              }}
              onClear={() => {
                setFilter((draft) => {
                  if (draft.name) {
                    draft.offset = 0
                    draft.name = ''
                  }
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
            <ColumnsSetting
              defaultColumns={columns}
              onSave={setColumnSettings}
              storageKey={columnSettingsKey}
            />
          </Center>
        </FlexBox>
      </div>
      <Table
        selectType="checkbox"
        selectedRowKeys={selectedRowKeys}
        onSelect={(keys: string[]) => {
          setSelectedRowKeys(keys)
        }}
        dataSource={dataSource}
        loading={isRefetching}
        columns={columns}
        rowKey="id"
        pagination={{
          total: get(data, 'total', 0),
          ...pagination
        }}
        onSort={sort}
      />

      {curOp === 'stop' && <AbolishApiModal selectKey={selectedRowKeys} onCancel={handleCancel} />}
      {curOp === 'test' && <TestModal currentRow={currentRow} onCancel={handleCancel} />}
    </FlexBox>
  )
}

export default ApiGroupTable
