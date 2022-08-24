import tw from 'twin.macro'
import { ModalWrapper as Modal, DarkModal } from './Modal'
import ModalStep from './ModalStep'
import PortalModal from './PortalModal'
import { ResizeModal } from './ResizeModal'

export * from './Confirm'

const ModalContent = tw.div`pt-4 px-5`

export { Modal, DarkModal, ModalStep, ModalContent, PortalModal, ResizeModal }
export default Modal
