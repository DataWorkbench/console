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
    <div className="tw-flex tw-justify-between tw-mb-5 ">
      <div>
        <Button
          type="primary"
          className="tw-font-medium tw-px-5 tw-mr-2"
          onClick={() => toggleShowModal()}
        >
          创建工作空间
        </Button>
        {!cardView && (
          <>
            <Dropdown
              content={
                <Menu onClick={handleMenuClick}>
                  <Menu.MenuItem value="update" disabled={curSpacesLen !== 1}>
                    <Icon name="pen" />
                    修改工作空间
                  </Menu.MenuItem>
                  <Menu.MenuItem value="disable" disabled={curSpacesLen === 0}>
                    <i className="if if-minus-square tw-text-base tw-mr-2" />
                    禁用工作空间
                  </Menu.MenuItem>
                  <Menu.MenuItem value="enable" disabled={curSpacesLen === 0}>
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
              <Button className="tw-w-32 tw-inline-flex tw-justify-between tw-items-center">
                <div className="tw-flex tw-items-center">
                  <Icon
                    name="if-layout-four"
                    className="tw-text-base tw-mr-1"
                  />
                  更多操作
                </div>
                <Icon name="caret-down" />
              </Button>
            </Dropdown>
          </>
        )}
      </div>
      <div className="tw-flex tw-items-center tw-space-x-2">
        <InputSearch
          className="tw-w-64"
          placeholder="请输入工作名称/ID"
          onPressEnter={(e) => handleQuery(e.target.value)}
          onClear={() => handleQuery('')}
        />
        <Button>
          <Icon
            name="if-refresh"
            className="tw-text-xl"
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
        <div className="tw-border-l tw-h-full tw-border-neut-3" />
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
