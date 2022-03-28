import tw, { css } from 'twin.macro'

const pageTabStyles = css`
  .page-tab-container {
    ${tw`shadow-none`}
    .collapse-transition {
      ${tw`transition-none`}
    }
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
      button.is-text {
        &:hover {
          ${tw`text-green-11`}
          > span {
            ${tw`text-green-11`}
          }
        }
        > span {
          ${tw`text-neut-8 font-medium`}
        }
      }
    }
  }
  .dark {
    .page-tab-container {
      ${tw`mb-5`}
      .collapse-panel {
        ${tw`bg-neut-16`}
        .tab-title {
          ${tw`text-white`}
        }
        button.is-text,
        .tab-description {
          ${tw`text-neut-8`}
        }
        button.is-text:hover {
          ${tw`text-green-11`}
        }
        svg {
          color: hsla(0, 0%, 100%, 0.9);
          fill: hsla(0, 0%, 100%, 0.4);
        }
      }
    }
  }
`

export default pageTabStyles
