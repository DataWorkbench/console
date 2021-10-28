import { Tabs } from '@QCFE/lego-ui'
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

export default HorizonTabs
