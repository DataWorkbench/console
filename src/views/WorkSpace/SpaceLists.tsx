import { observer } from 'mobx-react-lite'
import { useWorkSpaceContext } from 'contexts'
import { Box } from 'components'
import { IRegion } from 'hooks'
import SpaceTableView from './SpaceTableView'
import SpaceListsToolBar from './SpaceListsToolBar'
import SpaceCardView from './SpaceCardView'

const SpaceLists = ({ region }: { region: IRegion }) => {
  const { isModal, cardView } = useWorkSpaceContext()
  return (
    <Box tw="px-5 py-4">
      {!isModal && <SpaceListsToolBar />}
      {cardView ? <SpaceCardView /> : <SpaceTableView regionId={region.id} />}
    </Box>
  )
}

export default observer(SpaceLists)
