import tw, { css } from 'twin.macro'

const selectStyles = css`
  .select > .select-menu-outer {
    ${tw`!max-h-[270px]`}
    .select-menu {
      ${tw`!max-h-[270px]`}
    }
  }
  .dark {
    .select {
      &.is-danger {
        > .select-control {
          ${tw`border-red-10`}
        }
      }
      > .select-control {
        ${tw`bg-neut-16 border-neut-13`}
        &:hover,
        &:active {
          ${tw`bg-neut-16 border-neut-8`}
        }
        &:focus {
          ${tw`border-green-11`}
        }
        .select-value > .select-value-label {
          ${tw`text-white!`}
        }
        & > .select-arrow-zone {
          .qicon {
            ${tw`text-white`}
          }
        }
        & > .select-multi-value-wrapper {
          .select-value > span.tag {
            ${tw`bg-neut-13! text-white!`}
          }
        }
      }
      & > .select-menu-outer {
        ${tw`bg-neut-17 border-neut-13`}

        .select-option {
          ${tw`bg-neut-17 text-white`}
          &.is-selected,
          &:hover {
            ${tw`bg-neut-16`}
          }
        }
      }
    }
  }
`

export default selectStyles
