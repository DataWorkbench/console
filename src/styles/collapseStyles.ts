import tw, { css } from 'twin.macro'

const collapseStyles = css`
  .dark {
    .collapse {
      ${tw`text-white border-neut-13 border-0 w-full`}
      .collapse-item-label {
        ${tw`bg-neut-17 text-white  border-t-0 border-b-[#4C5E70] border-b`}

        > span {
          svg {
            color: #fff;
          }
        }
      }
      .collapse-item-content {
        ${tw`bg-neut-16`}
      }
    }
  }
`
export default collapseStyles
