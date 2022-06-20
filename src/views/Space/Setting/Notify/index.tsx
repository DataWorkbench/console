import {
  Button,
  Icon,
  InputSearch,
  PageTab,
  Table,
} from '@QCFE/qingcloud-portal-ui'
import useIcon from 'hooks/useHooks/useIcon'
import { Card, Center, FlexBox } from 'components'
import React from 'react'
import { get } from 'lodash-es'
import { useParams } from 'react-router-dom'
import { useQueryClient } from 'react-query'
import { useColumns } from 'hooks/useHooks/useColumns'
import useFilter from 'hooks/useHooks/useFilter'
import { getQueryKeyListNotifications, useQueryListNotifications } from 'hooks'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { set } from 'mobx'
import { PbmodelNotificationList } from 'types/types'
import { columnsRender, notifyColumns, pageTabsData } from './common/constants'
import icons from './common/icons'
import ActionModals from './ActionModals'

interface INotifyStore {
  op: 'list' | 'update' | 'delete' | 'create'
  selected: Record<string, any>[]
  set: (params: Record<string, any>) => void
}

const settingKeys = 'NOTIFY_TABLE_SETTING_KEY'
const Notify = observer(() => {
  useIcon(icons)

  const store: INotifyStore = useLocalObservable(() => ({
    op: 'list',
    selected: [],
    set(params: any) {
      set(this, { ...params })
    },
  }))

  const operations = {
    title: '操作',
    key: 'operation',
    render: (record: PbmodelNotificationList) => (
      <Center>
        <Button
          type="text"
          tw="font-semibold text-brand-primary! hover:text-brand-hover!"
          onClick={() => {
            store.set({
              op: 'update',
              selected: [record],
            })
          }}
        >
          修改
        </Button>
        <Button
          type="text"
          tw="font-semibold text-brand-primary! hover:text-brand-hover!"
          onClick={() => {
            store.set({
              op: 'delete',
              selected: [record],
            })
          }}
        >
          删除
        </Button>
      </Center>
    ),
  }

  const { columns } = useColumns(
    settingKeys,
    notifyColumns,
    columnsRender as any,
    operations
  )
  const { filter, setFilter, pagination } = useFilter<
    { search?: string },
    { pagination: true }
  >({}, { pagination: true })

  const { spaceId } = useParams<{ spaceId: string }>()
  const { data, isFetching } = useQueryListNotifications({
    uri: { space_id: spaceId },
    data: filter,
  })

  const queryClient = useQueryClient()
  const refetchData = () => {
    queryClient.invalidateQueries(getQueryKeyListNotifications())
  }

  const infos = get(data, 'notification_lists', [])
  return (
    <div tw="py-5">
      <PageTab tabs={pageTabsData} />
      <Card tw="mt-5 p-5">
        <FlexBox tw="justify-between mb-5">
          <Button
            type="primary"
            onClick={() => {
              store.set({
                op: 'create',
                selected: [],
              })
            }}
          >
            <Icon name="add" type="light" />
            创建
          </Button>
          <FlexBox tw="gap-2">
            <InputSearch
              placeholder="请输入关键词进行搜索"
              tw="dark:border-2 dark:rounded-sm dark:border-separator-light"
              value={filter.search}
              onPressEnter={(e: React.SyntheticEvent) => {
                setFilter((draft) => {
                  draft.search = (e.target as HTMLInputElement).value
                  draft.offset = 0
                })
              }}
              text
              onClear={() => {
                setFilter((draft) => {
                  draft.search = ''
                  draft.offset = 0
                })
              }}
            />
            <Button
              loading={isFetching}
              tw="px-[5px] dark:bg-neut-16! dark:hover:bg-neut-13!"
            >
              <Icon
                name="if-refresh"
                tw="text-xl"
                type="light"
                onClick={() => {
                  refetchData()
                }}
              />
            </Button>
          </FlexBox>
        </FlexBox>
        <Table
          columns={columns}
          dataSource={infos}
          pagination={{
            total: infos.length ?? 0,
            ...pagination,
          }}
        />
      </Card>
      <ActionModals store={store} />
    </div>
  )
})

export default Notify
