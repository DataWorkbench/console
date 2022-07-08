import { Tabs } from '@QCFE/lego-ui'
import tw, { css, styled } from 'twin.macro'
// @ts-ignore
import { CopyText } from '@QCFE/qingcloud-portal-ui'

export const Root = styled.div`
  ${tw`grid gap-3 h-full px-4 py-3 leading-[20px]`}
  grid-template-rows: auto auto 1fr;

  & {
    & .tabs {
      ${tw`flex-none`}
    }

    & .tab-content {
      ${tw`overflow-y-auto px-0 py-4 flex-auto`}
    }

    & .tab-panel.is-active {
      ${tw`min-h-full`}
    }
  }
`

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
          ${tw`text-white border-transparent font-medium`}
        }
        ${tw`mx-4 px-0 border-b-[3px] pt-4 pb-[13px] h-14`}

        &.is-active {
          ${tw`border-white! text-white`}
        }
      }
    }
    .tab-content {
      ${tw`py-5!`}
    }
    .grid-table-content {
      .grid-table-header {
        ${tw`bg-neut-16!`}
      }
      .grid-table-body {
        .table-row {
          ${tw`bg-neut-17! hover:bg-neut-16!`}
        }
      }
    }
    .grid-table-footer {
      ${tw`bg-neut-17!`}
    }
  `
])

export const GridItem = styled.div(({ labelWidth = 60 }: { labelWidth?: number }) => [
  css`
    & {
      ${tw`grid place-content-start gap-y-1`}
      grid-template-columns: ${labelWidth}px 1fr;

      & > span:nth-of-type(2n + 1) {
        ${tw`text-neut-8!`}
      }

      & > span:nth-of-type(2n) {
        ${tw`text-white!`}
      }
    }
  `
])

export const Circle = styled.div`
  ${tw`inline-flex items-center justify-center w-6 h-6 rounded-full text-white bg-line-dark mr-2 flex-none`}
`

export const CopyTextWrapper = styled(CopyText)`
  & {
    & .text-field {
      ${tw`text-neut-8!`}
    }
    .popper.tooltip {
      ${tw`bg-white`}
      .tooltip-content {
        ${tw`text-neut-15`}
      }
      .tooltip-arrow {
        ${tw`border-b-white`}
      }
    }
  }
  &:hover {
    & .text-field {
      ${tw`text-white!`}
    }
  }
`

export const FormWrapper = styled('div')(() => [
  css`
    form.is-horizon-layout {
      ${tw`pl-0`}
    }
  `
])

export const NameWrapper = styled('div')(({ isHover = true }: { isHover?: boolean }) => [
  isHover &&
    css`
      &:hover {
        .clusterIcon {
          ${tw`bg-[#13966a80] border-[#9ddfc966]`}
          .icon svg.qicon {
            ${tw`text-green-11`}
          }
        }
        .name {
          ${tw`text-green-11 cursor-pointer`}
        }
      }
    `
])
