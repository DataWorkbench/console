import { Select } from '@QCFE/qingcloud-portal-ui'
import tw, { styled, css, theme } from 'twin.macro'
import { Center } from 'components'

export const Root = tw(
  Center
)`justify-between h-14 shadow-lg dark:text-neut-8 dark:bg-neut-16 transition-colors duration-500`

export const SelectWrapper = styled(Select)(
  ({ darkMode }: { darkMode: boolean }) => [
    darkMode &&
      css`
        .select-control {
          background: ${theme('colors.neut.16')};
          border: 1px solid ${theme('colors.neut.13')};
          &:hover {
            background: ${theme('colors.neut.16')} !important;
          }
          .select-value > .select-value-label {
            color: #fff !important;
          }
        }
        &.is-open > .select-control,
        &.is-focused > .select-control {
          background-color: ${theme('colors.neut.16')} !important;
        }
        .select-arrow-zone {
          .icon.icon-clickable:hover {
            background: ${theme('colors.neut.16')};
          }
          svg {
            color: rgba(255, 255, 255, 0.9);
            fill: rgba(255, 255, 255, 0.4);
          }
        }
        .select-option {
          background: ${theme('colors.neut.16')};
          color: #fff;
          &.is-focused {
            background: ${theme('colors.neut.13')};
            color: #fff;
          }
          &.is-selected {
            background: ${theme('colors.neut.15')};
            color: #fff;
          }
        }
        .select-input > input {
          color: #fff;
        }
        .select-menu-outer {
          margin: 0 !important;
          border-color: ${theme('colors.neut.13')};
          background: ${theme('colors.neut.13')};
        }
        .bottom-wrapper {
          color: #fff;
        }
      `,
  ]
)
