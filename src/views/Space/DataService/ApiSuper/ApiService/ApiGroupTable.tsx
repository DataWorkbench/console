import { Button, Icon, InputSearch, Table, ToolBar } from '@QCFE/qingcloud-portal-ui'
import { MoreAction, FlexBox, Center, TextEllipsis } from 'components'
import dayjs from 'dayjs'
import { useQueryListApiServices, getQueryKeyListApiServices } from 'hooks'
import { useColumns } from 'hooks/useHooks/useColumns'
import useFilter from 'hooks/useHooks/useFilter'
import { assign, get, omitBy } from 'lodash-es'
import { useState } from 'react'
import { useQueryClient } from 'react-query'
import tw from 'twin.macro'
import { MappingKey } from 'utils/types'
import { apiGroupTableFieldMapping, apiGroupTableColumns } from '../constants'

const { ColumnsSetting } = ToolBar as any

interface ApiGroupTableProps {
  onSelect?: (selectedRowKeys: string[]) => void
}

const columnSettingsKey = 'DATA_SERVICE_API_SERVICE'

const getName = (name: MappingKey<typeof apiGroupTableFieldMapping>) =>
  apiGroupTableFieldMapping.get(name)!.apiField

const ApiGroupTable = (props: ApiGroupTableProps) => {
  const { onSelect } = props

  const queryClient = useQueryClient()

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
    { sort_by: getName('create_time'), reverse: true },
    { pagination: true, sort: true },
    columnSettingsKey
  )

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])

  const tablePropsData = assign(
    {},
    !!onSelect && {
      selectType: 'checkbox',
      selectedRowKeys,
      onSelect: (keys: string[]) => {
        onSelect?.(keys)
        setSelectedRowKeys(keys)
      }
    }
  )

  const { isRefetching, data } = useQueryListApiServices(omitBy(filter, (v) => v === '') as any)

  // 刷新
  const refetchData = () => {
    queryClient.invalidateQueries(getQueryKeyListApiServices())
  }

  const handleMenuClick = (row: Record<string, any>, key: string) => {
    window.open(`./apiService/${row.id}?tab=${key === 'bingKey' ? 'authKey' : 'api'}`, '_blank')
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
        text: '绑定秘钥',
        icon: 'q-kmsFill',
        key: 'bingKey',
        value: row
      }
    ]
    return result
  }

  const columnsRender = {
    [getName('name')]: {
      render: (v: any, row: any) => (
        <FlexBox tw="items-center space-x-1 truncate">
          <Center
            className="clusterIcon"
            tw="bg-neut-13 border-2 box-content border-neut-16 rounded-full w-6 h-6 mr-1.5"
          >
            <Icon name="q-dockerHubDuotone" type="light" />
          </Center>
          <div tw="truncate">
            <TextEllipsis twStyle={tw`font-semibold`}>{row.name}</TextEllipsis>
            <div tw="dark:text-neut-8">{row.id}</div>
          </div>
        </FlexBox>
      )
    },
    [getName('create_time')]: {
      ...getSort(getName('create_time')),
      render: (v: number, row: any) => (
        <span tw="dark:text-neut-0">{dayjs(row.last_updated).format('YYYY-MM-DD HH:mm:ss')}</span>
      )
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

  const { columns, setColumnSettings } = useColumns(
    columnSettingsKey,
    apiGroupTableColumns,
    columnsRender,
    operation
  )

  const dataSource = get(data, 'entities', [])

  return (
    <FlexBox tw="w-full flex-1" orient="column">
      <div tw="mb-3">
        <FlexBox tw="justify-between">
          <Center tw="space-x-3" />
          <Center tw="space-x-3">
            <InputSearch
              tw="w-64 border-2 rounded-sm  dark:border-neut-15"
              placeholder="请输入关键词进行搜索"
              onPressEnter={(e: React.SyntheticEvent) => {
                setFilter((draft) => {
                  draft.search = (e.target as HTMLInputElement).value
                  draft.offset = 0
                })
              }}
              onClear={() => {
                setFilter((draft) => {
                  if (draft.search) {
                    draft.offset = 0
                    draft.search = ''
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
        dataSource={dataSource || []}
        loading={false}
        columns={columns}
        rowKey="id"
        pagination={{
          total: get(data, 'total', 0),
          ...pagination
        }}
        onSort={sort}
        {...tablePropsData}
      />
    </FlexBox>
  )
}

export default ApiGroupTable
