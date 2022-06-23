import { Button, Icon, InputSearch, Table, ToolBar } from '@QCFE/qingcloud-portal-ui'
import { MoreAction, FlexBox, Center, TextEllipsis } from 'components'
import dayjs from 'dayjs'
import { useQueryListRoutes, getQueryKeyListRoutes, useMutationAbolishDataServiceApis } from 'hooks'
import { useColumns } from 'hooks/useHooks/useColumns'
import useFilter from 'hooks/useHooks/useFilter'
import { get, omitBy } from 'lodash-es'
import { useState } from 'react'
import { useQueryClient } from 'react-query'
import tw from 'twin.macro'
import { MappingKey } from 'utils/types'
import { apiRoutersTableFieldMapping, apiRouterTableColumns } from '../constants'

const { ColumnsSetting } = ToolBar as any

const columnSettingsKey = 'DATA_SERVICE_API_SERVICE'

const getName = (name: MappingKey<typeof apiRoutersTableFieldMapping>) =>
  apiRoutersTableFieldMapping.get(name)!.apiField

const ApiGroupTable = () => {
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
    { sort_by: getName('update_time'), reverse: true },
    { pagination: true, sort: true },
    columnSettingsKey
  )
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])

  const { isRefetching, data } = useQueryListRoutes(omitBy(filter, (v) => v === '') as any)

  const mutation = useMutationAbolishDataServiceApis()

  // 刷新
  const refetchData = () => {
    queryClient.invalidateQueries(getQueryKeyListRoutes())
  }

  const abolishApi = (apiIds: string[]) => {
    mutation.mutate(apiIds, {
      onSuccess: () => {
        refetchData()
      }
    })
  }

  const handleMenuClick = (row: Record<string, any>, key: string) => {
    if (key === 'test') {
      // TODO: 测试弹框
      console.log('test')
    } else {
      abolishApi([row.id])
    }
  }

  const getActions = (row: Record<string, any>) => {
    const result = [
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
    [getName('update_time')]: {
      ...getSort(getName('update_time')),
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
    apiRouterTableColumns,
    columnsRender,
    operation
  )

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
                  abolishApi(selectedRowKeys)
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
        selectType="checkbox"
        selectedRowKeys={selectedRowKeys}
        onSelect={(keys: string[]) => {
          setSelectedRowKeys(keys)
        }}
        dataSource={get(data, 'entities', [])}
        loading={false}
        columns={columns}
        rowKey="id"
        pagination={{
          total: get(data, 'total', 0),
          ...pagination
        }}
        onSort={sort}
      />
    </FlexBox>
  )
}

export default ApiGroupTable
