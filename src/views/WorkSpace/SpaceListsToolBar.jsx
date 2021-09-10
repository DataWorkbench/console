import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react-lite'
import { Button, Icon, ToolBar, InputSearch } from '@QCFE/qingcloud-portal-ui'
import { RadioButton, RadioGroup, Dropdown, Menu } from '@QCFE/lego-ui'
import { useStore } from 'stores'
import { useWorkSpaceContext } from 'contexts'

function SpaceListsToolBar({ regionId }) {
  const stateStore = useWorkSpaceContext()
  const { defaultColumns, cardView, storageKey, optSpaces } = stateStore
  const { workSpaceStore } = useStore()
  const curSpacesLen = optSpaces.length

  const reloadWorkSpace = (isCardView) => {
    workSpaceStore.fetchData({
      regionId,
      cardView: isCardView,
      offset: 0,
      reload: isCardView,
    })
  }

  const toggleViewMode = (v) => {
    const isCardView = v === 'card'
    stateStore.set({ cardView: isCardView })
  }
  const toggleShowModal = () => {
    stateStore.set({ curSpaceOpt: 'create' })
  }

  const handleSaveColumns = (columnSettings) => {
    stateStore.set({ columnSettings })
  }

  const handleQuery = (v) => {
    workSpaceStore.fetchData({
      regionId,
      cardView,
      reload: true,
      offset: 0,
      search: v,
    })
  }

  const handleMenuClick = (e, key, value) => {
    stateStore.set({ curSpaceOpt: value })
  }

  return (
    <div tw="flex justify-between mb-5">
      <div>
        <Button
          type="primary"
          tw="font-medium px-5 mr-2"
          onClick={() => toggleShowModal()}
        >
          创建工作空间
        </Button>
        {!cardView && (
          <>
            <Dropdown
              content={
                <Menu onClick={handleMenuClick}>
                  <Menu.MenuItem
                    value="update"
                    disabled={curSpacesLen !== 1 || optSpaces[0].status === 2}
                  >
                    <Icon name="pen" />
                    修改工作空间
                  </Menu.MenuItem>
                  <Menu.MenuItem
                    value="disable"
                    disabled={
                      curSpacesLen === 0 ||
                      curSpacesLen ===
                        optSpaces.filter((o) => o.status === 2).length
                    }
                  >
                    <i className="if if-minus-square" tw="text-base mr-2" />
                    禁用工作空间
                  </Menu.MenuItem>
                  <Menu.MenuItem
                    value="enable"
                    disabled={
                      curSpacesLen === 0 ||
                      curSpacesLen ===
                        optSpaces.filter((o) => o.status === 1).length
                    }
                  >
                    <Icon name="start" />
                    启动工作空间
                  </Menu.MenuItem>
                  <Menu.MenuItem value="delete" disabled={curSpacesLen === 0}>
                    <Icon name="trash" />
                    删除
                  </Menu.MenuItem>
                </Menu>
              }
            >
              <Button tw="w-32 inline-flex justify-between items-center">
                <div tw="flex items-center">
                  <Icon name="if-layout-four" tw="text-base mr-1" />
                  更多操作
                </div>
                <Icon name="caret-down" />
              </Button>
            </Dropdown>
          </>
        )}
      </div>
      <div tw="flex items-center space-x-2">
        <InputSearch
          tw="w-64"
          placeholder="请输入工作名称/ID"
          onPressEnter={(e) => handleQuery(e.target.value)}
          onClear={() => handleQuery('')}
        />
        <Button>
          <Icon
            name="if-refresh"
            tw="text-xl"
            onClick={() => reloadWorkSpace(cardView)}
          />
        </Button>
        {!cardView && (
          <ToolBar.ColumnsSetting
            defaultColumns={defaultColumns}
            onSave={handleSaveColumns}
            storageKey={storageKey}
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
    </div>
  )
}

SpaceListsToolBar.propTypes = {
  regionId: PropTypes.string,
}

export default observer(SpaceListsToolBar)
