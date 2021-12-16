import { Tabs } from '@QCFE/lego-ui'
import { FlexBox } from 'components'
import tw, { css, styled } from 'twin.macro'

export const HorizonTabs = styled(Tabs)(() => [
  tw`bg-neut-16 text-neut-8`,
  css`
    .tabs.is-horizon > ul {
      ${tw`border-neut-16 bg-[#1E2F41]`}
      > li {
        ${tw`pt-4`}
        &:first-of-type {
          ${tw`ml-4 h-14`}
        }
        &:hover {
          ${tw`text-white border-transparent`}
        }
        ${tw`mx-4 px-0 border-b-[3px] pt-4 pb-[13px] h-14`}

        &.is-active {
          ${tw`border-white! text-white`}
        }
      }
    }
  `,
])

export const LetterIcon = styled.div(
  () => [tw`inline-block w-5 h-5 text-center overflow-hidden rounded-sm mr-1`],
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
  `,
])
export default HorizonTabs
