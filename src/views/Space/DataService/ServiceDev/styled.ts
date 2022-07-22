import tw, { styled, css } from 'twin.macro'
import { Form, DatePicker, Alert } from '@QCFE/lego-ui'
import { Table as LegoTable } from '@QCFE/qingcloud-portal-ui'

const { DatePickerField } = Form

export const AlertWrapper = styled(Alert)(({ isJar }: { isJar?: boolean }) => [
  tw`h-9 mx-2 mt-2 mb-3 items-center text-[#FACC15]! bg-[#FEF9C3]! bg-opacity-10! border-[#F5C414]!`,
  isJar && tw`mb-6`
])

export const Tag = styled('div')(({ selected }: { selected?: boolean }) => [
  tw`border border-neut-13 rounded-sm leading-5 px-1.5 text-neut-8 scale-75 origin-left`,
  tw`group-hover:(bg-white text-neut-13 border-white)`,
  selected && tw`bg-white text-neut-13 border-white`
])

export const JobToolBar = styled('div')(
  () => [tw`flex px-2 pt-4 space-x-2`],
  css`
    button.button {
      ${tw`h-7`}
      &.is-black {
        svg.qicon {
          color: rgba(255, 255, 255, 0.9);
          fill: rgba(255, 255, 255, 0.4);
        }
      }
      &.is-primary {
        svg.qicon.qicon-export {
          color: rgba(255, 255, 255, 0.4);
        }
      }
      &.is-default {
        svg.qicon.qicon-data {
          color: rgba(255, 255, 255, 0.4);
          fill: rgba(255, 255, 255);
        }
      }
    }
  `
)

export const ScheForm = styled(Form)(() => [
  css`
    &.is-horizon-layout {
      ${tw`pl-0`}
      .field {
        > .label {
          ${tw`w-28`}
        }
        > .control {
          ${tw`w-auto`}
        }
        > .help {
          ${tw`w-full ml-28`}
        }

        &.toggle-field {
          ${tw`items-center`}
        }
        &.slider-field {
          > div.control {
            ${tw`max-w-none`}
            .slider {
              ${tw`w-96`}
            }
          }
        }
      }
    }
  `
])

export const ScheSettingForm = styled(ScheForm)(() => [
  css`
    &.is-horizon-layout {
      .field {
        ${tw`flex-wrap`}
        > .control {
          ${tw`flex`}
        }
        > label.label {
          ${tw`flex-none`}
        }
        > .control {
          div.select {
            ${tw`w-28`}
            &.select--multi {
              ${tw`w-96`}
              .select-value-label {
                ${tw`text-xs`}
              }
            }
          }
        }
      }
    }
  `
])

export const SmallDatePicker = styled(DatePicker)(() => [
  css`
    > input {
      ${tw`w-60!`}
    }
  `
])

export const SmallDatePickerField = styled(DatePickerField)(() => [
  css`
    .control {
      > input {
        ${tw`w-28!`}
      }
    }
  `
])

export const HorizonFiledsWrapper = styled('div')(() => [
  css`
    ${tw`mb-4`}
    .radio-wrapper {
      ${tw`flex`}
      &::before {
        ${tw`top-2`}
      }
      &.checked::after {
        ${tw`top-3`}
      }
      &.radio:hover {
        ${tw`text-white`}
      }
      .label-value {
        ${tw`flex items-center space-x-2`},

        > .field {
          ${tw`mb-0 flex items-center`}
          & > .label {
            ${tw`w-16 mb-0`}
          }
          & > .help {
            ${tw`ml-1 mt-0`}
          }
          .select {
            ${tw`w-28`}
          }
        }
      }
    }
  `
])

export const HourFiledsWrapper = styled('div')(() => [
  css`
    ${tw`mb-4`}
    .radio-wrapper {
      ${tw`flex`}
      &::before {
        ${tw`top-2`}
      }
      &.checked::after {
        ${tw`top-3`}
      }
      &.radio:hover {
        ${tw`text-white`}
      }
      .label-value {
        ${tw`flex items-center space-x-2`},

        > .field {
          ${tw`mb-0 flex items-center`}
          & > .label {
            ${tw`w-16 mb-0`}
          }
          & > .help {
            ${tw`ml-1 mt-0`}
          }
          .select {
            ${tw`w-24`}
          }
        }
      }
    }
  `
])

export const OrderText = styled('div')(() => [
  tw`h-4 w-4 text-green-11 border-green-11 border-[1px] text-center leading-[15px] rounded-[50%]`
])

export const Table = styled(LegoTable)(() => [
  css`
    .grid-table-content {
      ${tw` border-[1px] border-neut-13 border-solid border-b-0`}
    }
    .grid-table-header {
      ${tw`h-11 bg-neut-16!`}
    }
    .table-row {
      ${tw`hover:bg-neut-16! bg-neut-17!`}
    }
    .table-col {
      ${tw`h-11`}
    }
  `
])

export const tableSelectStyled = [
  tw`w-full flex-1`,
  css`
    .help {
      ${tw`w-full`}
    }
  `
]

export const TitleInformation = styled('div')(() => [
  css`
    .css-1gwa5h8-Center-IconBoxWithTootip-IconBoxWithTootip {
      ${tw` w-2`}
    }
    .css-d0n3c1-Center {
      ${tw`m-2! mr-0!`}
    }
    .css-15pkzwa-Tooltip {
      ${tw`m-0! w-3!`}
    }
  `
])

export const TitleItem = styled('div')(() => [
  css`
    ${tw` border-l-4 border-solid border-green-11  pl-3`}
  `
])

export const TestContent = styled('div')(() => [
  css`
    ${tw`h-[370px] w-full whitespace-pre-wrap my-5 p-2 bg-neut-19 text-neut-7 rounded overflow-y-auto`}
  `
])

export const MessageBox = styled('div')(({ color = 'green' }: { color?: 'red' | 'green' }) => [
  tw`h-9 rounded border-solid border-[1px] mt-3 px-3 flex items-center `,
  color === 'red' && tw`bg-[rgba(207, 59, 55, 0.1)] border-red-11  text-red-11 `,
  color === 'green' && tw`bg-[ rgba(21, 166, 117, 0.1)]  border-green-11 text-green-11`,
  css`
    > span {
      ${tw`mr-1`}
    }
  `
])

export const PathInput = styled('div')(() => [
  tw`block! items-center! space-x-1 bg-[rgba(76, 94, 112)] h-8 px-3 py-2 box-border`
])
