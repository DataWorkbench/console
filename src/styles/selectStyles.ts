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
        .select-input input {
          ${tw`text-white`}
        }
        .select-value > .tag {
          ${tw`align-middle`}
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
        .select-noresults {
          ${tw`min-h-[32px] items-center`}
        }
        .select-option {
          ${tw`bg-neut-17 text-white items-center`}
          &.is-selected,
          &:hover {
            ${tw`bg-neut-16`}
          }
          .option-checkbox-area {
            ${tw`h-4`}
          }
        }
      }
      &.is-searchable.select--multi {
        .select-input {
          ${tw`h-[3px] block!`}/* transition: height 0s 0.18s; */ /* 延迟点击 label 不会闪动，会产生 options 跟随 bug */
        }
        &.is-focused {
          .select-input {
            ${tw`h-[30px] inline-block!`}
          }
        }
      }
    }
  }
`

export default selectStyles
