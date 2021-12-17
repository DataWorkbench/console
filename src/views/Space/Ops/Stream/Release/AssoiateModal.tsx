import { Modal } from 'components'
import { observer } from 'mobx-react-lite'
import { InstanceTable } from './InstanceTable'

export const AssoiateModal = observer(({ visible, toggle, modalData }: any) => {
  return (
    <Modal
      width={1000}
      orient="fullright"
      visible={visible}
      title={`作业: ${modalData?.name}的关联实例`}
      footer={null}
      onCancel={() => {
        toggle()
      }}
    >
      <div tw="px-5">
        <InstanceTable type="modal" modalData={modalData} />
      </div>
    </Modal>
  )
})

export default {}
