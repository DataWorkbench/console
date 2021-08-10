import React from 'react'
import { observer } from 'mobx-react'
import { Modal, Button } from '@QCFE/qingcloud-portal-ui'
import { useStore } from 'stores'
import Workspace from 'views/Workspace'

function SpaceListModal() {
  const {
    overViewStore,
    overViewStore: { showSpaceModal },
  } = useStore()
  const handleCancel = () => {
    overViewStore.set({ showSpaceModal: false })
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
            <Button type="primary">进入空间</Button>
          </div>
        </div>
      }
    >
      <Workspace isModal />
    </Modal>
  )
}

export default observer(SpaceListModal)
