import tw, { css } from 'twin.macro'

const collapseStyles = css`
  .dark {
    .collapse {
      ${tw`text-white border-neut-13 border-0 w-full`}
    }
    .collapse-item-label {
      ${tw`bg-neut-17 text-white flex items-center border-t-0 border-b-line-dark border-b`}

      > span.icon {
        top: 50%;
        transform: translateY(-50%);
        svg {
          color: #fff;
        }
      }
    }
    .collapse-item-content {
      ${tw`bg-neut-16`}
    }
  }
`
export default collapseStyles
