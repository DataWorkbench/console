import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Button, Icon, ToolBar, InputSearch } from '@QCFE/qingcloud-portal-ui'
import { RadioButton, RadioGroup, Dropdown, Menu } from '@QCFE/lego-ui'
import { useWorkSpaceContext } from 'contexts'
import { FlexBox, Center } from 'components'

const { MenuItem } = Menu

const SpaceListsToolBar = observer(() => {
  const stateStore = useWorkSpaceContext()
  const {
    defaultColumns,
    cardView,
    columnSettingsKey,
    optSpaces,
    queryRefetch,
    queryKeyWord,
    ifNoData,
  } = stateStore
  const [searchName, setSearchName] = useState(queryKeyWord)
  const curSpacesLen = optSpaces.length

  const reloadWorkSpace = () => {
    stateStore.set({ queryRefetch: true })
  }

  const toggleViewMode = (v) => {
    const isCardView = v === 'card'
    stateStore.set({ cardView: isCardView })
  }
  const toggleShowModal = () => {
    stateStore.set({ curSpaceOpt: 'create' })
  }

  const handleSaveColumns = (columnSettings: []) => {
    stateStore.set({ columnSettings })
  }

  const handleQuery = () => {
    stateStore.set({ queryKeyWord: searchName })
  }

  const handleMenuClick = (e, key, value) => {
    stateStore.set({ curSpaceOpt: value })
  }

  return (
    <FlexBox tw="justify-between mb-5">
      <div>
        {!ifNoData && (
          <Button
            type="primary"
            tw="font-medium px-5 mr-2"
            onClick={toggleShowModal}
          >
            创建工作空间
          </Button>
        )}
        {!cardView && (
          <Dropdown
            content={
              <Menu onClick={handleMenuClick}>
                <MenuItem
                  value="update"
                  disabled={curSpacesLen !== 1 || optSpaces[0].status === 2}
                >
                  <Icon name="pen" />
                  修改工作空间
                </MenuItem>
                <MenuItem
                  value="disable"
                  disabled={
                    curSpacesLen === 0 ||
                    curSpacesLen ===
                      optSpaces.filter((o) => o.status === 2).length
                  }
                >
                  <i className="if if-minus-square" tw="text-base mr-2" />
                  禁用工作空间
                </MenuItem>
                <MenuItem
                  value="enable"
                  disabled={
                    curSpacesLen === 0 ||
                    curSpacesLen ===
                      optSpaces.filter((o) => o.status === 1).length
                  }
                >
                  <Icon name="start" />
                  启动工作空间
                </MenuItem>
                <MenuItem value="delete" disabled={curSpacesLen === 0}>
                  <Icon name="trash" />
                  删除
                </MenuItem>
              </Menu>
            }
          >
            <Button tw="w-32 justify-start">
              <Center tw="">
                <Icon
                  name="if-layout-four"
                  style={{
                    width: '14px',
                    height: '14px',
                    lineHeight: '14px',
                  }}
                  tw="mr-1"
                />
                <span>更多操作</span>
              </Center>
              <div tw="ml-auto">
                <Icon name="caret-down" />
              </div>
            </Button>
          </Dropdown>
        )}
      </div>
      {!ifNoData && (
        <div tw="flex items-center space-x-2">
          <InputSearch
            tw="w-64"
            placeholder="请输入工作空间名称/ID"
            value={searchName}
            onChange={(e, v: string | number) => {
              setSearchName(v)
            }}
            onPressEnter={handleQuery}
            onClear={() => {
              setSearchName('')
              stateStore.set({ queryKeyWord: '' })
            }}
          />
          <Button loading={queryRefetch} tw="px-1.5">
            <Icon
              name="if-refresh"
              tw="text-xl"
              onClick={() => reloadWorkSpace()}
            />
          </Button>
          {!cardView && (
            <ToolBar.ColumnsSetting
              defaultColumns={defaultColumns}
              onSave={handleSaveColumns}
              storageKey={columnSettingsKey}
            />
          )}
          <div tw="border-l h-full border-neut-3" />
          <RadioGroup
            value={cardView ? 'card' : 'table'}
            onChange={toggleViewMode}
            size="default"
          >
            <RadioButton value="card">卡片视图</RadioButton>
            <RadioButton value="table">列表视图</RadioButton>
          </RadioGroup>
        </div>
      )}
    </FlexBox>
  )
})

export default SpaceListsToolBar
