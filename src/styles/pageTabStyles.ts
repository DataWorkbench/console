import tw, { css } from 'twin.macro'

const pageTabStyles = css`
  .page-tab-container {
    .collapse-panel {
      .tab-title {
        ${tw`font-medium`}
      }
      .panel-right .icon {
        ${tw`-top-12`}
      }
      .panel-left {
        ${tw`py-6`}
        .button-list {
          ${tw`h-5`}
          .if {
            ${tw`text-base`}
          }
        }
      }
    }
  }
`

export default pageTabStyles
