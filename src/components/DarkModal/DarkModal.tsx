import tw, { styled, css } from 'twin.macro'
import { Modal } from '@QCFE/qingcloud-portal-ui'

interface IDarkModal {
  orient?: 'fullright'
}

export const DarkModal = styled(Modal)(({ orient }: IDarkModal) => [
  css`
    .modal-card-head,
    .modal-card-foot,
    .modal-card-body {
      ${tw`bg-neut-16 border-neut-13`}
    }
    .modal-card-title {
      ${tw`text-white`}
    }
    .icon.icon-clickable:hover {
      ${tw`bg-neut-16`}
    }
    .modal-card-head {
      svg {
        color: #fff;
      }
    }
  `,
  orient === 'fullright' &&
    css`
      .modal-card {
        ${tw`fixed top-0 right-0 bottom-0 max-h-full text-white`}
        .modal-card-body {
          ${tw`p-0`}
        }
      }
    `,
])

export default DarkModal
