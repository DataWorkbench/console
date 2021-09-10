import React from 'react'
// import InfiniteScroll from 'react-infinite-scroller'
import { get } from 'lodash'
// import { useMount } from 'react-use'
import { observer } from 'mobx-react-lite'
import PropTypes from 'prop-types'
import { Loading, Icon } from '@QCFE/qingcloud-portal-ui'
import { useStore } from 'stores'
import tw, { css } from 'twin.macro'
import SpaceItem from './SpaceItem'
// import styles from './styles.module.css'
const itemVars = {
  backColors: ['#b3e7d6', '#f2c0c3', '#cfafe9', '#b8def9', '#fbdeb4'],
  fontColors: ['#2fb788', '#d44e4b', '#934bc5', '#229ce9', '#f59c2a'],
}
const styles = {
  item: (i) => css`
    border-top-color: ${itemVars.backColors[i]};
    .profile {
      background-color: #b8def9;
      color: #229ce9;
    }
  `,
}

function SpaceCardView({ regionId }) {
  const {
    // workSpaceStore,
    workSpaceStore: { regions },
  } = useStore()
  const curRegion = regions[regionId]
  const workspaces = get(curRegion, 'workspaces', [])
  const isFetch = get(curRegion, 'fetchPromise.state') === 'pending'
  // console.log('isFetch', isFetch)
  // useMount(() => {
  //   workSpaceStore.fetchData({
  //     regionId,
  //     cardView: true,
  //     force: true,
  //     offset: 0,
  //   })
  // })

  // const loadFunc = async () => {
  //   workSpaceStore.fetchData({
  //     regionId,
  //     cardView: true,
  //   })
  // }
  return (
    // <InfiniteScroll
    //   pageStart={0}
    //   loadMore={loadFunc}
    //   initialLoad={false}
    //   hasMore={get(curRegion, 'hasMore', true)}
    //   loader={
    //     <div key={0} className="h-40">
    //       <Loading size="medium" />
    //     </div>
    //   }
    //   useWindow={false}
    //   getScrollParent={() => scrollParent}
    // >
    // </InfiniteScroll>
    <>
      <div tw="grid grid-cols-2 flex-wrap 2xl:gap-x-4 gap-x-2">
        {workspaces.map((space, i) => (
          <SpaceItem
            key={space.id}
            regionId={regionId}
            space={space}
            css={styles.item(i)}
            // className={styles[`ws_${i % 5}`]}
          />
        ))}
      </div>
      <div css={[tw`h-40`, !isFetch && tw`hidden`]}>
        <Loading size="medium" />
      </div>
      {!isFetch && workspaces.length === 0 && (
        <div tw="flex justify-center w-full my-7">
          <div tw="text-center text-neut-8">
            <Icon name="display" size={56} tw="mb-2" />
            <div>{getText('LEGO_UI_NO_AVAILABLE_DATA')}</div>
          </div>
        </div>
      )}
    </>
  )
}

SpaceCardView.propTypes = {
  regionId: PropTypes.string,
  // scrollParent: PropTypes.object,
}

export default observer(SpaceCardView)
