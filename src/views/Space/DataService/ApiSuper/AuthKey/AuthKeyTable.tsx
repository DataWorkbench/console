import {
  Button,
  Icon,
  InputSearch,
  Table,
  ToolBar,
  Notification as Notify
} from '@QCFE/qingcloud-portal-ui'

import { MoreAction, FlexBox, Center, Confirm } from 'components'
import {
  useQueryListAuthKeys,
  getQueryKeyListAuthKeys,
  useMutationListApiServices,
  useMutationAuthKey
} from 'hooks'
import { useColumns } from 'hooks/useHooks/useColumns'
import useFilter from 'hooks/useHooks/useFilter'
import { assign, get } from 'lodash-es'

import { useQueryClient } from 'react-query'
import tw, { css } from 'twin.macro'
import { MappingKey } from 'utils/types'
import { PbmodelAuthKeyEntity } from 'types/types'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { formatDate } from 'utils'
import { authKeyTableFieldMapping, authKeyTableColumns } from '../constants'
import AuthKeyModal from './AuthKeyModal'
import SelectApiServiceModal from './SelectApiServiceModal'
import { NameWrapper } from '../styles'

interface AuthKeyTableProps {
  onSelect?: (selectedRowKeys: string[]) => void
}
const { ColumnsSetting } = ToolBar as any

const columnSettingsKey = 'DATA_SERVICE_AUTH_KEY_TABLE'

const getName = (name: MappingKey<typeof authKeyTableFieldMapping>) =>
  authKeyTableFieldMapping.get(name)!.apiField

const ApiGroupTable = ({ onSelect }: AuthKeyTableProps) => {
  const queryClient = useQueryClient()
  const { spaceId } = useParams<{ spaceId: string }>()

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

  const [curOp, setCurOp] = useState<string>()
  const [isDeleteKey, setIsDeleteKey] = useState<boolean>(false)
  const [infos, setInfos] = useState<any[]>([])
  const [curAuthRow, setCurAuthRow] = useState<PbmodelAuthKeyEntity | null>()
  const { isRefetching, data } = useQueryListAuthKeys({
    uri: { space_id: spaceId },
    params: { ...filter } as any
  })

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])

  const tablePropsData = assign(
    {},
    !!onSelect && {
      selectType: 'radio',
      selectedRowKeys,
      onSelect: (keys: string[]) => {
        onSelect?.(keys)
        setSelectedRowKeys(keys)
      }
    }
  )

  const mutation = useMutationListApiServices()
  const authMutation = useMutationAuthKey()

  // 刷新
  const refetchData = () => {
    queryClient.invalidateQueries(getQueryKeyListAuthKeys())
  }

  const handleCancel = () => {
    setCurOp('')
    setCurAuthRow(null)
  }

  const goDetail = (id: string) => {
    window.open(`./authKey/${id}`, '_blank')
  }

  const handleMenuClick = (row: PbmodelAuthKeyEntity, key: string) => {
    setCurOp(key)
    setCurAuthRow(row)
    if (['delete', 'bingKey'].includes(key)) {
      mutation.mutate(
        { auth_key_id: row.id },
        {
          onSuccess: (source) => {
            const entities = get(source, 'entities', []) || []
            setInfos(entities)
            setIsDeleteKey(entities.length === 0)
          }
        }
      )
    } else if (key === 'detail') {
      goDetail(row.id)
    }
  }
  const handleConfirmOK = () => {
    const paramsData = {
      option: 'delete' as any,
      id: curAuthRow?.id
    }
    authMutation.mutate(paramsData, {
      onSuccess: (res) => {
        if (res.ret_code === 0) {
          Notify.success({
            title: '操作提示',
            content: '删除密钥成功',
            placement: 'bottomRight'
          })
          handleCancel()
          refetchData()
        }
      }
    })
  }

  const getActions = (row: PbmodelAuthKeyEntity) => {
    const result = [
      {
        text: '查看详情',
        icon: 'q-noteFill',
        key: 'detail',
        value: row
      },
      {
        text: '编辑',
        icon: 'edit',
        key: 'update',
        value: row
      },
      {
        text: '绑定API服务',
        icon: 'q-apps3Fill',
        key: 'bingKey',
        value: row
      },
      {
        text: '删除',
        icon: 'if-trash',
        key: 'delete',
        value: row
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
              goDetail(row.id)
            }
          }}
        >
          <FlexBox tw="items-center space-x-1 truncate">
            <Center
              className="clusterIcon"
              tw="bg-neut-13 border-2 box-content border-neut-16 rounded-full w-6 h-6 mr-1.5"
            >
              <Icon name="q-kmsFill" type="light" />
            </Center>
            <div tw="truncate">
              <div className="name">{row.name}</div>
            </div>
          </FlexBox>
        </NameWrapper>
      )
    },
    [getName('create_time')]: {
      ...getSort(getName('create_time')),
      render: (v: number, row: any) => (
        <span tw="dark:text-neut-0">{formatDate(row.create_time)}</span>
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
    authKeyTableColumns,
    columnsRender,
    onSelect ? undefined : operation
  )

  const dataSource = get(data, 'entities') || []
  return (
    <FlexBox tw="w-full flex-1" orient="column">
      <div tw="mb-3">
        <FlexBox tw="justify-between">
          <Center tw="space-x-3">
            <Button
              type="primary"
              onClick={() => {
                setCurOp('create')
              }}
            >
              <Icon name="add" />
              创建密钥
            </Button>
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
        dataSource={dataSource}
        loading={isRefetching}
        columns={columns}
        rowKey="id"
        pagination={{
          total: get(data, 'total', 0),
          ...pagination
        }}
        onSort={sort}
        {...tablePropsData}
      />
      {(curOp === 'create' || curOp === 'update') && (
        <AuthKeyModal curOp={curOp} curAuthRow={curAuthRow} onCancel={handleCancel} />
      )}
      {curOp === 'bingKey' && !mutation.isLoading && (
        <SelectApiServiceModal curAuthRow={curAuthRow} infos={infos} onCancel={handleCancel} />
      )}
      {curOp === 'delete' && !mutation.isLoading && (
        <Confirm
          title={`${isDeleteKey ? '删除密钥：' : '不可删除密钥：'}密钥名称 ${curAuthRow?.name}`}
          visible
          css={css`
            .modal-card-head {
              ${tw`border-0`}
            }
          `}
          type="warn"
          width={400}
          maskClosable={false}
          appendToBody
          draggable
          onCancel={handleCancel}
          footer={
            <div tw="flex justify-end space-x-2">
              <Button onClick={() => handleCancel()} type={isDeleteKey ? 'default' : 'primary'}>
                {isDeleteKey ? '取消' : '确定'}
              </Button>
              {isDeleteKey && (
                <Button type="danger" onClick={handleConfirmOK}>
                  删除
                </Button>
              )}
            </div>
          }
        >
          <div>
            {isDeleteKey ? (
              `删除后不可恢复，确认删除密钥名称 ${curAuthRow?.name}?`
            ) : (
              <div>
                删除密钥 {curAuthRow?.name} 需先移除所有
                <span
                  tw=" text-blue-10 cursor-pointer underline"
                  onClick={() => goDetail(curAuthRow?.id as string)}
                >
                  {' '}
                  绑定的 API服务组
                </span>
              </div>
            )}
          </div>
        </Confirm>
      )}
    </FlexBox>
  )
}

export default ApiGroupTable
