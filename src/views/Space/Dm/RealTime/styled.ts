import tw, { styled, css } from 'twin.macro'
import { Form, DatePicker, Alert } from '@QCFE/lego-ui'

const { DatePickerField } = Form

export const AlertWrapper = styled(Alert)(({ isJar }: { isJar?: boolean }) => [
  tw`h-9 mx-2 mt-2 mb-3 items-center text-[#FACC15]! bg-[#FEF9C3]! bg-opacity-10! border-[#F5C414]!`,
  isJar && tw`mb-6`,
])

export const Tag = styled('div')(({ selected }: { selected?: boolean }) => [
  tw`border border-neut-13 rounded-sm leading-5 px-1.5 text-neut-8 scale-75 origin-left`,
  tw`group-hover:(bg-white text-neut-13 border-white)`,
  selected && tw`bg-white text-neut-13 border-white`,
])

export const JobToolBar = styled('div')(
  () => [tw`flex px-2 pt-2 space-x-2`],
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
  `,
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
  `,
])

export const SmallDatePicker = styled(DatePicker)(() => [
  css`
    > input {
      ${tw`w-60!`}
    }
  `,
])

export const SmallDatePickerField = styled(DatePickerField)(() => [
  css`
    .control {
      > input {
        ${tw`w-28!`}
      }
    }
  `,
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
  `,
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
  `,
])

export const FormH7Wrapper = styled('div')(() => [
  tw`flex flex-col flex-1 relative`,
  css`
    button {
      ${tw`h-7!`}
    }
    .refresh-button {
      ${tw`h-7! w-7!`}
    }
    .select-control {
      ${tw`h-7! flex relative`}
      .select-multi-value-wrapper {
        ${tw`flex-1`}
      }
    }
    input {
      ${tw`h-7!`}
    }
    .radio-wrapper {
      ${tw`h-7! flex items-center`}
      &::before {
        ${tw` top-[6px]`}
      }
    }
    label.radio.checked::after {
      ${tw` top-[10px]`}
    }
    .radio-button {
      ${tw`h-7!`}
    }
    .clear-button {
      ${tw`h-7! w-7!`}
    }
    .label {
      ${tw`h-7!`}
      .control {
        ${tw`h-7!`}
        .input-number {
          ${tw`h-7!`}
        }
      }
    }
  `,
])
