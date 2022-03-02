import { Form } from '@QCFE/lego-ui'
import tw, { css, styled } from 'twin.macro'
import { Modal } from 'components'

const { TextAreaField } = Form

export const FormWrapper = styled(Form)(() => [css``])

export const DisableTextField = styled.div(() => [
  tw`w-[330px] h-9 bg-neut-1 border-neut-3 border flex p-2 cursor-not-allowed rounded-sm gap-1`,
  css`
    & {
      span:first-of-type {
        ${tw`text-neut-15`}
      }

      span:last-child {
        ${tw`text-neut-8`}
      }
    }
  `,
])

export const TextAreaFieldWrapper = styled(TextAreaField)(() => [
  css`
    & {
      textarea.textarea {
        ${tw`min-w-[550px] min-h-[84px] w-auto`}
      }
    }
  `,
])

export const checkboxButtonStyles = {
  wrapper: ({ checked = false }: { checked: boolean }) => {
    return [
      // tw`inline-flex items-center h-9 rounded-sm gap-2 px-2 cursor-pointer`,
      tw`h-9`,
      checked
        ? tw`text-green-11! bg-green-0! border-green-11! border hover:bg-green-1! active:bg-green-2! `
        : tw``,
      checked &&
        css`
          & .icon .qicon {
            ${tw`text-green-11 fill-[#9DDFC9]`}
          }
        `,
    ]
  },
}

export const ModalWrapper = styled(Modal)(() => [
  css`
    .modal-card-head {
      border-bottom: 0;
    }

    .modal-card-body {
      padding: 0 32px;
    }

    .modal-card-foot {
      border-top: 0;
      padding: 16px 20px;
    }

    .tag .icon.close {
      ${tw`hidden`}
    }
  `,
])

export const OwnerWrapper = {
  isOwner: ({ isOwner = true }: { isOwner: boolean }) => {
    return [
      !isOwner &&
        css`
          .tag .icon.close,
          .tag-no-more {
            ${tw`hidden`}
          }
        `,
    ]
  },
}
