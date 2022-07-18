import { Button, Icon, InputSearch, Table, ToolBar } from '@QCFE/qingcloud-portal-ui'
import { FlexBox, Center } from 'components'
import { useQueryListApiServices, getQueryKeyListApiServices } from 'hooks'
import { useColumns } from 'hooks/useHooks/useColumns'
import useFilter from 'hooks/useHooks/useFilter'
import { get } from 'lodash-es'
import { useState } from 'react'
import { useQueryClient } from 'react-query'
import { MappingKey } from 'utils/types'
import { PbmodelAuthKeyEntity } from 'types/types'
import { useParams } from 'react-router-dom'
import { formatDate } from 'utils'
import { apiGroupTableFieldMapping, apiGroupTableColumns } from '../../constants'
import SelectApiServiceModal from '../SelectApiServiceModal'
import UnBindApiModal from './UnBindApiModal'
import { NameWrapper } from '../../styles'

interface ApiGroupTableProps {
  authKey: PbmodelAuthKeyEntity
}

const { ColumnsSetting } = ToolBar as any

const columnSettingsKey = 'DATA_SERVICE_BIND_API_TABLE'

const getName = (name: MappingKey<typeof apiGroupTableFieldMapping>) =>
  apiGroupTableFieldMapping.get(name)!.apiField

const ApiGroupTable = (props: ApiGroupTableProps) => {
  const { detail: authId, spaceId } = useParams<{ detail: string; spaceId: string }>()
  const { authKey } = props

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
  const [curOp, setOp] = useState<string>()

  const { isRefetching, data } = useQueryListApiServices({
    uri: { space_id: spaceId },
    params: { auth_key_id: authId, ...filter } as any
  })

  // 跳转到API服务详情页
  const goDetail = (id: string) => {
    window.open(`../apiService/${id}?tab=authKey`, '_blank')
  }

  // 刷新
  const refetchData = () => {
    queryClient.invalidateQueries(getQueryKeyListApiServices())
  }

  const handleCancel = () => {
    setOp('')
    refetchData()
    setSelectedRowKeys([])
  }

  const columnsRender = {
    [getName('name')]: {
      render: (v: any, row: any) => (
        <NameWrapper
          isHover
          onClick={() => {
            goDetail(row.id)
          }}
        >
          <FlexBox tw="items-center space-x-1 truncate">
            <Center
              className="clusterIcon"
              tw="bg-neut-13 border-2 box-content border-neut-16 rounded-full w-6 h-6 mr-1.5"
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
    [getName('update_time')]: {
      ...getSort(getName('update_time')),
      render: (v: number, row: any) => (
        <span tw="dark:text-neut-0">{formatDate(row.update_time)}</span>
      )
    }
  }

  const operation = {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    render: (_: any, row: any) => (
      <div
        tw="cursor-default hover:text-green-13"
        onClick={() => {
          setSelectedRowKeys([row.id])
          setOp('unbind')
        }}
      >
        解绑
      </div>
    )
  }

  const { columns, setColumnSettings } = useColumns(
    columnSettingsKey,
    apiGroupTableColumns,
    columnsRender,
    operation
  )

  const infos = get(data, 'entities', []) || []

  return (
    <FlexBox tw="w-full flex-1" orient="column">
      <div tw="mb-3">
        <FlexBox tw="justify-between">
          <Center tw="space-x-3">
            {selectedRowKeys.length !== 0 ? (
              <Button
                tw="w-[72px]"
                type="danger"
                onClick={() => {
                  setOp('unbind')
                }}
              >
                解绑
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={() => {
                  setOp('bind')
                }}
              >
                <Icon name="add" />
                绑定 API 服务
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
                  if (draft.search) {
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
        dataSource={infos}
        loading={isRefetching}
        columns={columns}
        rowKey="id"
        pagination={{
          total: get(data, 'total', 0),
          ...pagination
        }}
        onSort={sort}
      />
      {curOp === 'bind' && (
        <SelectApiServiceModal curAuthRow={authKey} infos={infos} onCancel={handleCancel} />
      )}
      {curOp === 'unbind' && <UnBindApiModal selectKey={selectedRowKeys} onCancel={handleCancel} />}
    </FlexBox>
  )
}

export default ApiGroupTable
