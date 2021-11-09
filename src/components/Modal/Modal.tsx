import tw, { styled, css } from 'twin.macro'
import { Modal } from '@QCFE/qingcloud-portal-ui'

interface IDarkModal {
  orient?: 'fullright' | 'center'
  dark?: boolean
  noBorder?: boolean
}

export const ModalWrapper = styled(Modal)(
  ({ orient, noBorder = false }: IDarkModal) => [
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
    noBorder &&
      css`
        .modal-content {
          > .modal-card-head,
          > .modal-card-foot {
            ${tw`border-none`}
          }
          > .modal-card-body {
            ${tw`px-8`}
          }
        }
      `,
  ]
)

export const DarkModal = ({ ...props }) => <ModalWrapper {...props} dark />

export default ModalWrapper
