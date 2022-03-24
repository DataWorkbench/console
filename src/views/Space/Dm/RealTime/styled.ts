import tw, { styled, css } from 'twin.macro'
import { Form, DatePicker } from '@QCFE/lego-ui'

const { DatePickerField } = Form

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
  `,
])

export const ScheSettingForm = styled(ScheForm)(() => [
  css`
    &.is-horizon-layout {
      .field {
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
