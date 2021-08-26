import React from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { get } from 'lodash'
import { useMount } from 'react-use'
import { observer } from 'mobx-react-lite'
import PropTypes from 'prop-types'
import { Loading, Icon } from '@QCFE/qingcloud-portal-ui'
import { useStore } from 'stores'
import SpaceItem from './SpaceItem'
import styles from './styles.module.css'

function SpaceCardView({ regionId, scrollParent }) {
  const {
    workSpaceStore,
    workSpaceStore: { regions },
  } = useStore()
  const curRegion = regions[regionId]
  const workspaces = get(curRegion, 'workspaces', [])
  useMount(() => {
    workSpaceStore.fetchData({
      regionId,
      cardView: true,
      force: true,
      offset: 0,
    })
  })

  const loadFunc = async () => {
    workSpaceStore.fetchData({
      regionId,
      cardView: true,
    })
  }
  return (
    <InfiniteScroll
      pageStart={0}
      loadMore={loadFunc}
      initialLoad={false}
      hasMore={get(curRegion, 'hasMore', true)}
      loader={
        <div key={0} className="tw-h-40">
          <Loading size="medium" />
        </div>
      }
      useWindow={false}
      getScrollParent={() => scrollParent}
    >
      <div className="tw-grid tw-grid-cols-2 tw-flex-wrap 2xl:tw-gap-x-4 tw-gap-x-2">
        {workspaces.map((space, i) => (
          <SpaceItem
            key={space.id}
            regionId={regionId}
            space={space}
            className={styles[`ws_${i % 5}`]}
          />
        ))}
      </div>
      {get(curRegion, 'loadStatus.state') === 'fulfilled' &&
        workspaces.length === 0 && (
          <div className="tw-flex tw-justify-center tw-w-full tw-my-7">
            <div className="tw-text-center tw-text-neut-8">
              <Icon name="display" size={56} className="tw-mb-2" />
              <div>{getText('LEGO_UI_NO_AVAILABLE_DATA')}</div>
            </div>
          </div>
        )}
    </InfiniteScroll>
  )
}

SpaceCardView.propTypes = {
  regionId: PropTypes.string,
  scrollParent: PropTypes.object,
}

export default observer(SpaceCardView)
