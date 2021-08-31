import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react-lite'
import { get, isEqual } from 'lodash'
import { useWorkSpaceContext } from 'contexts'
import { useStore } from 'stores'
import SpaceTableView from './SpaceTableView'
import SpaceListsEmpty from './SpaceListsEmpty'
import SpaceListsToolBar from './SpaceListsToolBar'
import SpaceCardView from './SpaceCardView'

const SpaceLists = ({ region, className }) => {
  const { isModal, cardView, curRegionId } = useWorkSpaceContext()
  const {
    workSpaceStore: { regions },
  } = useStore()
  const curRegion = regions[region.id]
  const isCurrent = curRegionId === region.id

  if (
    isEqual(get(curRegion, 'params') === { offset: 0, limit: 10 }) &&
    get(curRegion, 'hasMore') === false &&
    get(curRegion, 'total') === 0
  ) {
    return <SpaceListsEmpty />
  }
  return (
    <div className={className}>
      {!isModal && <SpaceListsToolBar regionId={region.id} />}
      {isCurrent && (
        <>
          {cardView ? (
            <SpaceCardView regionId={region.id} />
          ) : (
            <SpaceTableView regionId={region.id} />
          )}
        </>
      )}
    </div>
  )
}

SpaceLists.propTypes = {
  className: PropTypes.string,
  region: PropTypes.object,
}

export default observer(SpaceLists)
