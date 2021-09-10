import React from 'react'
import { observer } from 'mobx-react-lite'
import { useHistory } from 'react-router-dom'
import { Modal, Button } from '@QCFE/qingcloud-portal-ui'
import { useImmer } from 'use-immer'
import { useStore } from 'stores'
import WorkSpace from 'views/WorkSpace'

function SpaceListModal() {
  const history = useHistory()
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
    history.push(`/${curRegionId}/workspace/${curSpaceId}/${curItemName}`)
  }
  const handleSelected = (data) => {
    setState((draft) => {
      draft.curRegionId = data.curRegionId
      draft.curSpaceId = data.curSpaceId
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
        <div tw="w-full flex justify-between items-center">
          <div tw="text-neut-15">
            若无合适的工作空间，您也可以 创建新工作空间
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
        </div>
      }
    >
      <WorkSpace isModal onSpaceSelected={handleSelected} />
    </Modal>
  )
}

export default observer(SpaceListModal)
