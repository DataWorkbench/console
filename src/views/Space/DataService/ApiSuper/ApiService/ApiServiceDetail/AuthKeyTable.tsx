import { Button, Icon, InputSearch, Table, ToolBar } from '@QCFE/qingcloud-portal-ui'
import { FlexBox, Center, Confirm } from 'components'
import dayjs from 'dayjs'
import { useQueryListAuthKeys, getQueryKeyListAuthKeys, useMutationAuthKey } from 'hooks'
import { useColumns } from 'hooks/useHooks/useColumns'
import useFilter from 'hooks/useHooks/useFilter'
import { get } from 'lodash-es'

import { useQueryClient } from 'react-query'
import { MappingKey } from 'utils/types'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Tooltip } from 'components/Tooltip'
import tw, { css } from 'twin.macro'
import { authKeyTableFieldMapping, authKeyTableColumns } from '../../constants'
import { NameWrapper } from '../../styles'
import SelectAuthKeyModal from './SelectAuthKeyModal'

interface AuthKeyTableProps {
  authKeyId?: string
  apiServiceId?: string
}
const { ColumnsSetting } = ToolBar as any

const columnSettingsKey = 'DATA_SERVICE_AUTH_KEY_TABLE'

const getName = (name: MappingKey<typeof authKeyTableFieldMapping>) =>
  authKeyTableFieldMapping.get(name)!.apiField

const ApiGroupTable = ({ authKeyId, apiServiceId }: AuthKeyTableProps) => {
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
    { sort_by: getName('create_time'), reverse: true },
    { pagination: true, sort: true },
    columnSettingsKey
  )

  const [curOp, setCurOp] = useState<string>()
  const [curAuthKey, setCurAuthKey] = useState<{ id: string; name: string }>()
  const { isRefetching, data } = useQueryListAuthKeys({
    uri: { space_id: spaceId },
    params: { ids: authKeyId, ...filter } as any
  })

  // const mutation = useMutationListApiServices()
  const authMutation = useMutationAuthKey()

  // 刷新
  const refetchData = () => {
    queryClient.invalidateQueries(getQueryKeyListAuthKeys())
  }

  const handleCancel = () => {
    setCurOp('')
  }

  const handleUnbind = () => {
    const paramsData = {
      option: 'unbind' as any,
      auth_key_id: curAuthKey?.id,
      api_service_ids: [apiServiceId]
    }
    authMutation.mutate(paramsData, {
      onSuccess: () => {
        refetchData()
        handleCancel()
      }
    })
  }
  const columnsRender = {
    [getName('name')]: {
      render: (v: any, row: any) => (
        <NameWrapper isHover={false}>
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
        <span tw="dark:text-neut-0">{dayjs(row.last_updated).format('YYYY-MM-DD HH:mm:ss')}</span>
      )
    }
  }

  const operation = {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    render: (_: never, record: any) => (
      <div
        tw="cursor-pointer hover:text-green-11"
        onClick={() => {
          setCurOp('unbind')
          setCurAuthKey(record)
        }}
      >
        解绑
      </div>
    )
  }

  const { columns, setColumnSettings } = useColumns(
    columnSettingsKey,
    authKeyTableColumns,
    columnsRender,
    operation
  )

  const dataSource = get(data, 'entities') || []
  return (
    <FlexBox tw="w-full flex-1" orient="column">
      <div tw="mb-3">
        <FlexBox tw="justify-between">
          <Center tw="space-x-3">
            <Tooltip
              theme="light"
              content="当前支持绑定单个密钥，如需换绑，请先解绑密钥"
              hasPadding
              twChild={tw`flex items-center`}
            >
              <Button
                type="primary"
                // disabled={dataSource.length !== 0}
                onClick={() => {
                  setCurOp('bindKey')
                }}
              >
                <Icon name="add" />
                绑定密钥
              </Button>
            </Tooltip>
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
        dataSource={dataSource}
        loading={false}
        columns={columns}
        rowKey="id"
        pagination={{
          total: get(data, 'total', 0),
          ...pagination
        }}
        onSort={sort}
        emptyPlaceholder={{ icon: 'q-kmsFill', text: '暂未绑定密钥，请点击左上方按钮绑定密钥' }}
      />
      {curOp === 'bindKey' && (
        <SelectAuthKeyModal apiServiceId={apiServiceId} onCancel={() => setCurOp('')} />
      )}
      {curOp === 'unbind' && (
        <Confirm
          title={`解绑密钥: ${curAuthKey?.name}`}
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
              <Button onClick={() => setCurOp('')}>取消</Button>

              <Button type="danger" onClick={handleUnbind}>
                解绑
              </Button>
            </div>
          }
        >
          <div>解绑后，密钥将不再限制 API 访问， 请谨慎操作。确认解绑？</div>
        </Confirm>
      )}
    </FlexBox>
  )
}

export default ApiGroupTable
