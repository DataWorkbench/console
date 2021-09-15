import { styled, css, theme } from 'twin.macro'
import { Modal } from '@QCFE/qingcloud-portal-ui'

export const DarkModal = styled(Modal)(() => [
  css`
    .modal-card-head,
    .modal-card-foot,
    .modal-card-body {
      background-color: ${theme('colors.neut.16')};
      border-color: ${theme('colors.neut.13')};
    }
    .modal-card-title {
      color: ${theme('colors.white')};
    }
    .icon.icon-clickable:hover {
      background: ${theme('colors.neut.16')};
    }
    .modal-card-head {
      svg {
        color: #fff;
      }
    }
  `,
])

export default DarkModal
