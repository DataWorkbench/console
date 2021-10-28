import tw, { styled, css } from 'twin.macro'
import { Collapse, Form } from '@QCFE/lego-ui'

const { DatePickerField } = Form

export const StreamToolBar = styled('div')(
  () => [tw`flex px-2 pt-4 space-x-2`],
  css`
    button.button {
      ${tw`h-7`}
    }
  `
)

export const DarkCollapse = styled(Collapse)(() => [
  css`
    ${tw`text-white w-full border-0`}
    .collapse-item-label {
      ${tw`bg-neut-17 text-white border-neut-13 border-t-0`}
      > span {
        svg {
          color: #fff;
        }
      }
    }
    .collapse-item-content {
      ${tw`bg-neut-16`}
    }
  `,
])

export const ScheForm = styled(Form)(() => [
  css`
    &.is-horizon-layout {
      ${tw`pl-5`}
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
