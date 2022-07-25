import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Button, Icon, ToolBar, InputSearch } from '@QCFE/qingcloud-portal-ui'
import { RadioButton, RadioGroup, Dropdown, Menu } from '@QCFE/lego-ui'
import { useWorkSpaceContext } from 'contexts'
import { FlexBox, Center } from 'components'
import { useIsFetching } from 'react-query'
import { getQueryKeyDescribePlatformConfig } from 'hooks'
import tw, { css } from 'twin.macro'

const { MenuItem } = Menu as any
const { ColumnsSetting } = ToolBar as any

const SpaceListsToolBar = observer(() => {
  const stateStore = useWorkSpaceContext()
  const {
    defaultColumns,
    cardView,
    columnSettingsKey,
    queryRefetch,
    queryKeyWord,
    ifNoData,
    selectedSpaces,
    isAdmin
  } = stateStore
  const [searchName, setSearchName] = useState(queryKeyWord)
  const curSpacesLen = selectedSpaces.length

  const reloadWorkSpace = () => {
    stateStore.set({ queryRefetch: true })
  }

  const toggleViewMode = (v: string) => {
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

  const handleMenuClick = (_: never, __: never, value: string) => {
    stateStore.set({ curSpaceOpt: value, optSpaces: selectedSpaces })
  }

  const isPlatformLoading = useIsFetching(getQueryKeyDescribePlatformConfig())

  return (
    <FlexBox tw="justify-between mb-5">
      <FlexBox
        tw="gap-3"
        css={css`
          .radio-group.field {
            ${tw`mb-0!`}
          }
        `}
      >
        <RadioGroup
          value={isAdmin ? 1 : 0}
          onChange={(v) => {
            stateStore.set({
              isAdmin: !!v
            })
          }}
        >
          <RadioButton value={1}>我创建的</RadioButton>
          <RadioButton value={0}>我加入的</RadioButton>
        </RadioGroup>
        <div>
          {!ifNoData && (
            <Button
              type="primary"
              tw="font-medium px-5 mr-2"
              onClick={toggleShowModal}
              loading={!!isPlatformLoading}
            >
              创建工作空间
            </Button>
          )}
          {!cardView && isAdmin && (
            <Dropdown
              content={
                <Menu onClick={handleMenuClick}>
                  <MenuItem
                    value="update"
                    disabled={curSpacesLen !== 1 || selectedSpaces[0].status === 2}
                  >
                    <Icon name="pen" />
                    修改工作空间
                  </MenuItem>
                  <MenuItem
                    value="disable"
                    disabled={
                      curSpacesLen === 0 ||
                      curSpacesLen ===
                        selectedSpaces.filter((o: Record<string, any>) => o.status === 2).length
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
                        selectedSpaces.filter((o: Record<string, any>) => o.status === 1).length
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
                      lineHeight: '14px'
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
      </FlexBox>
      {!ifNoData && (
        <div tw="flex items-center space-x-2">
          <InputSearch
            tw="w-64"
            placeholder="请输入工作空间名称"
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
          <Button loading={queryRefetch} tw="px-[5px]">
            <Icon name="if-refresh" tw="text-xl" onClick={() => reloadWorkSpace()} />
          </Button>
          {!cardView && (
            <ColumnsSetting
              defaultColumns={defaultColumns}
              onSave={handleSaveColumns}
              storageKey={columnSettingsKey}
            />
          )}
          <div tw="border-l h-full border-neut-3" />
          <RadioGroup value={cardView ? 'card' : 'table'} onChange={toggleViewMode} size="default">
            <RadioButton value="card">卡片视图</RadioButton>
            <RadioButton value="table">列表视图</RadioButton>
          </RadioGroup>
        </div>
      )}
    </FlexBox>
  )
})

export default SpaceListsToolBar
