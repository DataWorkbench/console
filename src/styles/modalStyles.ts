import tw, { css } from 'twin.macro'

const modalStyles = css`
  .dark {
    .modal.is-active {
      .modal-card-head,
      .modal-card-foot,
      .modal-card-body {
        ${tw`bg-neut-16 border-neut-13 text-white`}
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
      .modal-card-foot {
      }
    }
  }
`

export default modalStyles
