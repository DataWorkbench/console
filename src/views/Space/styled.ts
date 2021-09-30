import tw, { css, styled } from 'twin.macro'
import { Button } from '@QCFE/lego-ui'

export const DarkButton = styled(Button)(({ type }: { type?: string }) => [
  tw`px-2 h-7`,
  (type === 'dark' || type === 'grey') &&
    css`
      &.is-grey,
      &.is-dark {
        ${tw`inline-flex items-center justify-center border border-neut-13 rounded-sm bg-neut-18 text-white text-xs`}
      }
      &.is-grey {
        ${tw`bg-neut-12`}
      }
      > span.icon {
        ${tw`mr-1.5`}
        svg {
          ${tw`text-white`}
        }
      }
      &:hover {
        ${tw`bg-neut-13 text-white border-neut-13`}
      }
      &:active,
      &:focus {
        ${tw`bg-neut-15 text-white border-neut-13`}
      }
    `,
])

export const StreamToolBar = styled('div')(() => [tw`flex px-2 pt-4 space-x-2`])
