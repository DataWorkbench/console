import { Tabs } from '@QCFE/lego-ui'
import { FlexBox } from 'components'
import tw, { css, styled } from 'twin.macro'

export const HorizonTabs = styled(Tabs)(
  () => [tw`bg-neut-16 text-neut-8`],
  css`
    .tabs.is-horizon > ul {
      ${tw`border-neut-16`}
      > li {
        &:first-of-type {
          ${tw`ml-4`}
        }
        &:hover {
          ${tw`border-neut-8`}
        }
        ${tw`mx-4 px-0 border-b-2`}

        &.is-active {
          ${tw`border-white! text-white`}
        }
      }
    }
  `
)

export const LetterIcon = styled.div(
  () => [tw`inline-block w-5 h-5 text-center overflow-hidden rounded-sm mr-2`],
  css`
    background-color: #00a0aa;
    span {
      ${tw`font-mono capitalize text-xs`}
      width: 2ch;
    }
  `
)

export const TableActions = styled(FlexBox)(() => [
  css`
    ${tw`items-center relative`}
    button.is-text {
      ${tw`text-link px-2 hover:text-link border-0 focus:text-link`}
    }
  `,
])
export default HorizonTabs
