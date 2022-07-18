import React from 'react'
import tw, { css, styled, theme } from 'twin.macro'
import { Icon } from '@QCFE/lego-ui'
import { Modal, ModalProps } from '@QCFE/qingcloud-portal-ui'

enum ConfirmType {
  'INFO' = 'info',
  'WARN' = 'warn',
  'ERROR' = 'error',
  'SUCCESS' = 'success'
}

export interface ConfirmProps {
  title?: React.ReactNode
  children?: React.ReactNode
  type?: 'info' | 'warn' | 'error' | 'success'
}

export const ModalWrapper = styled(Modal)(() => [
  css`
    .modal-card-foot {
      ${tw`border-none`}
    }
    .modal-card-body {
      ${tw`pt-0 px-6`}
    }
  `
])

export const Confirm = ({ title, children, type, ...otherProps }: ConfirmProps & ModalProps) => {
  const getIcon = () => {
    switch (type) {
      case ConfirmType.INFO:
        return <Icon name="info-circle" size={24} />
      case ConfirmType.WARN:
        return (
          <Icon
            name="exclamation"
            color={{
              secondary: '#FFD127'
            }}
            size={24}
          />
        )
      case ConfirmType.ERROR:
        return (
          <Icon
            name="error"
            size={24}
            color={{
              primary: theme('colors.white'),
              secondary: theme('colors.red.10')
            }}
          />
        )
      case ConfirmType.SUCCESS:
        return <Icon name="success" size={24} />
      default:
        return null
    }
  }
  return (
    <ModalWrapper {...otherProps}>
      <>
        {title && (
          <div tw="flex items-center text-base font-semibold">
            {getIcon()}
            <div tw="ml-3">{title}</div>
          </div>
        )}
        <div tw="ml-9 mt-2 leading-5 text-neut-8">{children}</div>
      </>
    </ModalWrapper>
  )
}

export default Confirm
