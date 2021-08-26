import React from 'react'
import { observer } from 'mobx-react-lite'
import { useHistory } from 'react-router-dom'
import { Modal, Button, Message } from '@QCFE/qingcloud-portal-ui'
import { useStore } from 'stores'
import WorkSpace from 'views/WorkSpace'

function SpaceListModal() {
  const history = useHistory()
  const {
    overViewStore,
    overViewStore: { showSpaceModal, curItemName, curSpaceId },
    workSpaceStore: { curRegionId },
  } = useStore()
  const handleCancel = () => {
    overViewStore.set({ showSpaceModal: false })
  }
  const handleClick = () => {
    if (!curSpaceId) {
      Message.open({
        content: '请先选择工作空间',
        placement: 'bottomRight',
        type: 'warning',
      })
      return
    }
    history.push(`/${curRegionId}/workspace/${curSpaceId}/${curItemName}`)
  }
  return (
    <Modal
      title="选择要进入的工作空间"
      visible={showSpaceModal}
      appendToBody
      width={1000}
      height={536}
      bodyStyle={{ padding: 0 }}
      onCancel={handleCancel}
      footer={
        <div className="tw-w-full tw-flex tw-justify-between tw-items-center">
          <div className="tw-text-neut-15">
            若无合适的工作空间，您也可以 创建新工作空间
          </div>
          <div>
            <Button type="default" onClick={handleCancel}>
              取消
            </Button>
            <Button type="primary" onClick={handleClick}>
              进入空间
            </Button>
          </div>
        </div>
      }
    >
      <WorkSpace isModal />
    </Modal>
  )
}

export default observer(SpaceListModal)
