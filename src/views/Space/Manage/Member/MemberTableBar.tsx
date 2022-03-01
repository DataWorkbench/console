import {
  Icon,
  ToolBar,
  ToolBarLeft,
  ToolBarRight,
} from '@QCFE/qingcloud-portal-ui'
import { Button, InputSearch } from '@QCFE/lego-ui'
import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useMemberStore } from './store'

const { ColumnsSetting } = ToolBar as any

interface IMemberTableBarProps {
  columns: Record<string, any>[]
  setFilter: (_: (draft: { search: string }) => void) => void
}

const MemberTableBar = observer((props: IMemberTableBarProps) => {
  const { columns = [], setFilter } = props
  const { set, selectedKeys } = useMemberStore()
  const [searchName, setSearchName] = React.useState('')
  const handleQuery = (_searchName: string) => {
    setFilter((filter: Record<string, any>) => {
      filter.search = _searchName
    })
  }

  const [isReFetching, setIsReFetching] = useState(false)
  return (
    <ToolBar tw="bg-white">
      <ToolBarLeft>
        <Button
          type="primary"
          onClick={() => {
            set({
              op: 'create',
              activeKeys: [],
            })
          }}
        >
          <Icon name="add" />
          添加成员
        </Button>
        <Button
          type="default"
          disabled={!selectedKeys.length}
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
            // if (filter.search) {
            //   handleQuery('')
            // }
          }}
        />
        <Button loading={isReFetching} tw="px-[5px]">
          <Icon
            name="if-refresh"
            tw="text-xl"
            onClick={() => {
              setIsReFetching(true)
              // refetch().then(() => {
              //   setIsReFetching(false)
              // })
            }}
          />
        </Button>
        <ColumnsSetting
          defaultColumns={columns.map(({ title, dataIndex }) => ({
            title,
            dataIndex,
          }))}
          onSave={() => console.log('save')}
          storageKey="member-table-columns"
        />
      </ToolBarRight>
    </ToolBar>
  )
})

export default MemberTableBar
