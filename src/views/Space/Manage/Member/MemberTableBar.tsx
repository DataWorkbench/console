import {
  Icon,
  ToolBar,
  ToolBarLeft,
  ToolBarRight,
} from '@QCFE/qingcloud-portal-ui'
import { Button, InputSearch } from '@QCFE/lego-ui'
import React, { useCallback, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useQueryClient } from 'react-query'
import { columnSettingsKey } from 'views/Space/Manage/Member/constants'
import { getMemberKeys } from 'hooks'
import { useMemberStore } from './store'

const { ColumnsSetting } = ToolBar as any

interface IMemberTableBarProps {
  columns: Record<string, any>[]
  setFilter: (_: (draft: { search: string }) => void) => void
  filter: { search: string }
  setColumnSettings: (_: Record<string, any>[]) => void
  isOwner: boolean
  modalView?: boolean
  spaceItem?: Record<string, any>
}

const MemberTableBar = observer((props: IMemberTableBarProps) => {
  const {
    columns = [],
    setFilter,
    filter,
    setColumnSettings,
    isOwner = true,
    modalView = false,
    spaceItem,
  } = props
  const { set, selectedKeys = [] } = useMemberStore()
  const [searchName, setSearchName] = React.useState('')
  const handleQuery = (_searchName: string) => {
    setFilter((_filter: Record<string, any>) => {
      _filter.search = _searchName
    })
  }

  const [isReFetching, setIsReFetching] = useState(false)

  const queryClient = useQueryClient()

  const refetch = useCallback(async () => {
    await queryClient.invalidateQueries(getMemberKeys())
  }, [queryClient])

  return (
    <ToolBar tw="bg-white">
      <ToolBarLeft>
        <Button
          type="primary"
          disabled={!isOwner}
          onClick={() => {
            set({
              op: 'create',
              activeKeys: [],
              spaceItem,
            })
          }}
        >
          <Icon name="add" />
          添加成员
        </Button>
        <Button
          type="default"
          disabled={!isOwner || !selectedKeys.length}
          onClick={() => {
            set({
              op: 'delete',
              activeKeys: selectedKeys,
            })
          }}
        >
          <Icon name="trash" />
          移除成员
        </Button>
      </ToolBarLeft>
      <ToolBarRight>
        <InputSearch
          placeholder="请输入关键词进行搜索"
          value={searchName}
          onChange={(e, v) => setSearchName(String(v))}
          onPressEnter={() => handleQuery(searchName)}
          onClear={() => {
            setSearchName('')
            if (filter.search) {
              handleQuery('')
            }
          }}
        />
        {!modalView && (
          <>
            <Button loading={isReFetching} tw="px-[5px]">
              <Icon
                name="if-refresh"
                tw="text-xl"
                onClick={() => {
                  setIsReFetching(true)
                  refetch().then(() => {
                    setIsReFetching(false)
                  })
                }}
              />
            </Button>
            <ColumnsSetting
              defaultColumns={columns.map(({ title, dataIndex }) => ({
                title,
                dataIndex,
              }))}
              onSave={setColumnSettings}
              storageKey={columnSettingsKey}
            />
          </>
        )}
      </ToolBarRight>
    </ToolBar>
  )
})

export default MemberTableBar
