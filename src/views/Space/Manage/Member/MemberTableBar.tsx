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
}

const MemberTableBar = observer((props: IMemberTableBarProps) => {
  const { columns = [] } = props
  console.log(columns)
  const { op, setOp } = useMemberStore()
  const [searchName, setSearchName] = React.useState('')
  const handleQuery = (_searchName: string) => {
    console.log('query', _searchName)
  }
  console.log(op)
  const [isReFetching, setIsReFetching] = useState(false)
  // const handleRefresh = () => {}
  return (
    <ToolBar tw="bg-white">
      <ToolBarLeft>
        <Button
          type="primary"
          onClick={() => {
            setOp('add')
          }}
        >
          <Icon name="add" />
          添加成员
        </Button>
        <Button type="default" disabled onClick={() => console.log('delete')}>
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
