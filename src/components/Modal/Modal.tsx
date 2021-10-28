import tw, { styled, css } from 'twin.macro'
import { Modal } from '@QCFE/qingcloud-portal-ui'

interface IDarkModal {
  orient?: 'fullright' | 'center'
  dark?: boolean
}

export const ModalWrapper = styled(Modal)(({ orient }: IDarkModal) => [
  orient === 'fullright' &&
    css`
      .modal-card {
        ${tw`fixed top-0 right-0 bottom-0 max-h-full`}
        .modal-card-body {
          ${tw`p-0`}
        }
        .modal-card-head,
        .modal-card-foot {
          ${tw`rounded-none`}
        }
      }
    `,
])

export const DarkModal = ({ ...props }) => <ModalWrapper {...props} dark />

export default ModalWrapper
