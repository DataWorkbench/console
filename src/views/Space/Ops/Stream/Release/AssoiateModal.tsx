import { Modal } from 'components'
import { useStore } from 'hooks'
import { observer } from 'mobx-react-lite'
import { InstanceTable } from './InstanceTable'

export const AssoiateModal = observer(({ visible, toggle }: any) => {
  const {
    dmStore: { modalData, setModalData },
  } = useStore()

  return (
    <Modal
      width={1000}
      orient="fullright"
      visible={visible}
      title={`作业: ${modalData?.name}的关联实例`}
      footer={null}
      onCancel={() => {
        toggle()
        setModalData({})
      }}
    >
      <InstanceTable type="modal" />
    </Modal>
  )
})

export default {}
