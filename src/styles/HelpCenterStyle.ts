import tw, { css } from 'twin.macro'

const HelpCenterStyle = css`
  .dark {
    .help-center-modal {
      background-image: none;
      ${tw`bg-neut-16`}
      .modal-card-foot a {
        ${tw`text-white`}
      }
    }
  }
`

export default HelpCenterStyle
