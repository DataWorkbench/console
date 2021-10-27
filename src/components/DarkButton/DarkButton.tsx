import tw, { css, styled } from 'twin.macro'
import { Button } from '@QCFE/qingcloud-portal-ui'

export const DarkButton = styled(Button)(() => [
  css`
    &.button.is-dark {
      background-color: inherit;
      ${tw`border-neut-13 text-white`}
      &:hover {
        ${tw`bg-neut-13 text-white border-neut-13`}
      }
      &:active {
        ${tw`bg-neut-15 text-white border-neut-13`}
      }
    }
    &.button.is-default {
      ${tw`border-neut-13 bg-neut-13 text-white`}
      &:hover {
        ${tw`bg-neut-15 text-white border-neut-13`}
      }
      &:active {
        ${tw`bg-neut-17 text-white border-neut-13`}
      }
    }
  `,
])

export default DarkButton
