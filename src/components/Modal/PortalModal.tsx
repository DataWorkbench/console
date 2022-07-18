import { createPortal } from 'react-dom'
import { Modal, ModalProps } from '@QCFE/qingcloud-portal-ui'

const PortalModal = (props: ModalProps) => {
  const { appendToBody, ...rest } = props
  if (appendToBody) {
    return createPortal(<Modal {...rest} />, document.body)
  }
  return <Modal {...rest} />
}

export default PortalModal
