import { FC } from 'react'
import { observer } from 'mobx-react-lite'
import { get, isEqual } from 'lodash-es'
import { useWorkSpaceContext } from 'contexts'
import { useStore } from 'stores'
import { Box } from 'components'
import SpaceTableView from './SpaceTableView'
import SpaceListsEmpty from './SpaceListsEmpty'
import SpaceListsToolBar from './SpaceListsToolBar'
import SpaceCardView from './SpaceCardView'

interface SpaceListsProp {
  region: {
    id: string
    [propName: string]: any
  }
  className?: string
}

const SpaceLists: FC<SpaceListsProp> = ({ region }) => {
  const { isModal, cardView, curRegionId } = useWorkSpaceContext()
  const {
    workSpaceStore: { regions },
  } = useStore()
  const curRegion = regions[region.id]
  const isCurrent = curRegionId === region.id

  if (
    isEqual(get(curRegion, 'params'), { offset: 0, limit: 10 }) &&
    get(curRegion, 'hasMore') === false &&
    get(curRegion, 'total') === 0
  ) {
    return <SpaceListsEmpty />
  }
  return (
    <Box tw="px-5 py-3">
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
    </Box>
  )
}

export default observer(SpaceLists)
