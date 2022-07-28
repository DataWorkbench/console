import { Button, Icon, InputSearch, Table, ToolBar } from '@QCFE/qingcloud-portal-ui'
import { MoreAction, FlexBox, Center } from 'components'
import { useQueryListApiServices, getQueryKeyListApiServices } from 'hooks'
import { useColumns } from 'hooks/useHooks/useColumns'
import useFilter from 'hooks/useHooks/useFilter'
import { assign, get, merge, omitBy } from 'lodash-es'
import { useState } from 'react'
import { useQueryClient } from 'react-query'
import { useParams, useHistory } from 'react-router-dom'
import { formatDate } from 'utils'
import { MappingKey } from 'utils/types'
// eslint-disable-next-line import/no-cycle
import SelectAuthKeyModal from './ApiServiceDetail/SelectAuthKeyModal'
import { apiGroupTableFieldMapping, apiGroupTableColumns } from '../constants'
import { NameWrapper } from '../styles'

const { ColumnsSetting } = ToolBar as any

interface ApiGroupTableProps {
  onSelect?: (selectedRowKeys: string[]) => void
  selectRowKeys?: string[] // 初始化选中的行
}

interface IRouteParams {
  regionId: string
  spaceId: string
}

const columnSettingsKey = 'DATA_SERVICE_API_GROUP_TABLE'

const getName = (name: MappingKey<typeof apiGroupTableFieldMapping>) =>
  apiGroupTableFieldMapping.get(name)!.apiField

const ApiGroupTable = (props: ApiGroupTableProps) => {
  const { onSelect, selectRowKeys = [] } = props

  const queryClient = useQueryClient()
  const { spaceId } = useParams<IRouteParams>()
  const history = useHistory()
  const [curOp, setCurOp] = useState<string>()
  const [curApiServiceId, setCurApiServiceId] = useState<string>()

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

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>(selectRowKeys)

  const tablePropsData = assign(
    {},
    !!onSelect && {
      selectType: 'checkbox',
      selectedRowKeys,
      disabledRowKeys: selectRowKeys,
      onSelect: (keys: string[]) => {
        onSelect?.(keys)
        setSelectedRowKeys(keys)
      }
    }
  )

  const { isRefetching, data } = useQueryListApiServices({
    uri: { space_id: spaceId },
    params: omitBy(filter, (v) => v === '')
  })

  // 刷新
  const refetchData = () => {
    queryClient.invalidateQueries(getQueryKeyListApiServices())
  }

  const goDetail = ({ id, key = 'api' }: { id: string; key?: string }) => {
    history.push(`./apiService/${id}?tab=${key === 'bingKey' ? 'authKey' : 'api'}`)
  }

  const handleMenuClick = (row: Record<string, any>, key: string) => {
    if (key === 'bindKey') {
      setCurOp('bindKey')
      setCurApiServiceId(row.id)
    } else {
      goDetail({ id: row.id, key })
    }
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
        ...merge(
          {
            text: '绑定密钥',
            icon: 'q-kmsFill',
            key: 'bindKey',
            value: row,
            disabled: row.auth_key_id !== ''
          },
          row.auth_key_id ? { help: '已绑定密钥（只支持绑定一个密钥）' } : {}
        )
      }
    ]
    return result
  }

  const columnsRender = {
    [getName('name')]: {
      render: (v: any, row: any) => (
        <NameWrapper
          isHover={!onSelect}
          onClick={() => {
            if (!onSelect) {
              goDetail({ id: row.id })
            }
          }}
        >
          <FlexBox tw="items-center space-x-1 truncate">
            <Center
              className="clusterIcon"
              tw="bg-neut-13 border-2 box-content border-neut-16 rounded-full w-6 h-6 mr-1.5 "
            >
              <Icon name="q-apps3Duotone" type="light" />
            </Center>
            <div tw="truncate">
              <div className="name">{row.name}</div>
              <div tw="dark:text-neut-8">{row.id}</div>
            </div>
          </FlexBox>
        </NameWrapper>
      )
    },
    [getName('domain')]: {
      render: (v: number, row: any) => (
        <span tw="dark:text-neut-0">{`http://${v}${row.pre_path}`}</span>
      )
    },
    [getName('update_time')]: {
      ...getSort(getName('update_time')),
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

  const TableColumns = onSelect
    ? apiGroupTableColumns.filter(
        (item) => !['api_count', 'pre_path'].includes(item.dataIndex as string)
      )
    : apiGroupTableColumns

  const { columns, setColumnSettings } = useColumns(
    columnSettingsKey,
    TableColumns,
    columnsRender,
    onSelect ? undefined : operation
  )

  const dataSource = get(data, 'entities', []) || []

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
      {curOp === 'bindKey' && (
        <SelectAuthKeyModal apiServiceId={curApiServiceId} onCancel={() => setCurOp('')} />
      )}
    </FlexBox>
  )
}

export default ApiGroupTable
