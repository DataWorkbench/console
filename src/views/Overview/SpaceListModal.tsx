import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useHistory } from 'react-router-dom'
import { Modal, Button } from '@QCFE/qingcloud-portal-ui'
import { useImmer } from 'use-immer'
import { useStore } from 'stores'
import { FlexBox } from 'components'
import WorkSpace from 'views/WorkSpace'

const SpaceListModal = observer(() => {
  const history = useHistory()
  const [showCreate, setShowCreate] = useState(false)
  const [state, setState] = useImmer({ curRegionId: '', curSpaceId: '' })
  const { curRegionId, curSpaceId } = state
  const {
    overViewStore,
    overViewStore: { showSpaceModal, curItemName },
  } = useStore()

  const handleHide = () => {
    overViewStore.set({ showSpaceModal: false })
  }
  const handleClick = () => {
    handleHide()
    history.push(`/${curRegionId}/workspace/${curSpaceId}/${curItemName}`)
  }

  const handleItemCheck = (regionId: string, spaceId: string) => {
    setState((draft) => {
      draft.curRegionId = regionId
      draft.curSpaceId = spaceId
    })
  }

  return (
    <Modal
      title="选择要进入的工作空间"
      visible={showSpaceModal}
      appendToBody
      width={1000}
      height={536}
      bodyStyle={{ padding: 0 }}
      onCancel={handleHide}
      footer={
        <FlexBox tw="w-full justify-between">
          <div tw="text-neut-15 mr-4">
            若无合适的工作空间，您也可以
            <span
              tw="text-link ml-1 cursor-pointer"
              onClick={() => setShowCreate(true)}
            >
              创建新工作空间
            </span>
          </div>
          <div>
            <Button type="default" onClick={handleHide}>
              取消
            </Button>
            <Button
              type="primary"
              onClick={handleClick}
              disabled={curRegionId === '' && curSpaceId === ''}
            >
              进入空间
            </Button>
          </div>
        </FlexBox>
      }
    >
      <WorkSpace
        isModal
        onItemCheck={handleItemCheck}
        showCreate={showCreate}
        onHide={() => {
          setShowCreate(false)
        }}
      />
    </Modal>
  )
})

export default SpaceListModal
