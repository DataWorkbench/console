import tw from 'twin.macro'
import { ModalWrapper as Modal, DarkModal } from './Modal'
import ModalStep from './ModalStep'
import PortalModal from './PortalModal'

export * from './Confirm'

const ModalContent = tw.div`pt-4 px-5`

export { Modal, DarkModal, ModalStep, ModalContent, PortalModal }
export default Modal
