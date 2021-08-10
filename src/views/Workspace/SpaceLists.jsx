import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { get } from 'lodash'
import InfiniteScroll from 'react-infinite-scroller'
import { Button, Input, Control } from '@QCFE/lego-ui'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import { useStore } from 'stores'
import SpaceItem from './SpaceItem'
import SpaceModal from './SpaceModal'
import styles from './styles.module.css'

const propTypes = {
  className: PropTypes.string,
  zone: PropTypes.string,
  isCurrent: PropTypes.bool,
  isModal: PropTypes.bool,
  scrollParent: PropTypes.object,
}

const SpaceLists = ({ zone, className, isCurrent, scrollParent, isModal }) => {
  const {
    workspaceStore,
    workspaceStore: { showModal, zones },
  } = useStore()
  const {
    hasMore = true,
    loadStatus = null,
    workspaces = [],
  } = zones[zone] || {}

  const loadFunc = async () => {
    if (!isCurrent) {
      return
    }
    if (
      hasMore &&
      (loadStatus === null || get(loadStatus, 'state') === 'fulfilled')
    ) {
      workspaceStore.load(zone)
    }
  }

  const toggleShowModal = (v) => {
    workspaceStore.set({ showModal: v, curOpt: 'create' })
  }
  return (
    <div className={className}>
      {!isModal && (
        <div className="tw-flex tw-justify-between tw-mb-5 ">
          <div>
            <Button
              type="primary"
              className="tw-font-medium tw-px-5"
              onClick={() => toggleShowModal(true)}
            >
              创建工作空间
            </Button>
          </div>
          <div className="tw-flex tw-items-stretch">
            <Control className="has-icons-left tw-mr-2">
              <Icon className="is-left" name="magnifier" />
              <Input
                type="text"
                className="tw-w-64"
                placeholder="请输入工作名称/ID"
              />
            </Control>
            <Button className="tw-mr-2">
              <Icon
                name="if-refresh"
                className="tw-text-xl"
                onClick={() => workspaceStore.clean(zone)}
              />
            </Button>
          </div>
        </div>
      )}

      <div>
        <InfiniteScroll
          pageStart={0}
          loadMore={loadFunc}
          hasMore={hasMore}
          loader={<div key={0}>数据加载中...</div>}
          useWindow={false}
          getScrollParent={() => scrollParent}
        >
          <div className="tw-flex tw-flex-wrap">
            {workspaces &&
              workspaces.map((space, i) => {
                return (
                  <div
                    key={space.id}
                    className={`${styles.workspace} tw-w-1/2`}
                  >
                    <SpaceItem
                      zone={zone}
                      space={space}
                      isModal
                      className={styles[`ws_${i % 5}`]}
                    />
                  </div>
                )
              })}
          </div>
        </InfiniteScroll>
      </div>

      {showModal && (
        <SpaceModal zone={zone} onHide={() => toggleShowModal(false)} />
      )}
    </div>
  )
}

SpaceLists.propTypes = propTypes

export default observer(SpaceLists)
