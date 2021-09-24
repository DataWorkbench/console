import React, { useEffect } from 'react'
import { useUnmount, useToggle } from 'react-use'
import tw from 'twin.macro'
import { Icon, Button } from '@QCFE/qingcloud-portal-ui'
import useScrollBlock from 'hooks/useScrollBlock'

interface ModalProps {
  placement?: string
  title?: string
  closable?: boolean
  show?: boolean
  okText?: string
  cancelText?: string
  onOK?: () => void
  onHide?: () => void
  closeOnOverlayClick?: boolean
  footer?: React.ReactNode
  children: React.ReactNode
  rootClassName?: string
  contentClassName?: any
  darkMode?: boolean
  showConfirmLoading?: boolean
}

const Modal = ({
  placement = 'rightFull',
  title = '',
  closable = true,
  okText = '确定',
  cancelText = '取消',
  show = true,
  children,
  onOK = () => {},
  onHide = () => {},
  showConfirmLoading = false,
  closeOnOverlayClick = true,
  footer,
  rootClassName,
  contentClassName,
  darkMode,
}: ModalProps) => {
  const [isHide, toggleHide] = useToggle(!show)
  const [blockScroll, allowScroll] = useScrollBlock()

  if (!isHide) {
    blockScroll()
  } else {
    allowScroll()
  }

  useUnmount(() => allowScroll())
  useEffect(() => {
    toggleHide(!show)
  }, [show, toggleHide])

  const handleClose = () => {
    toggleHide(true)
    onHide()
  }

  return (
    <div
      css={[
        tw`fixed inset-0 z-10`,
        placement === 'center' && tw`flex items-center justify-center`,
        isHide && tw`hidden`,
        rootClassName,
      ]}
    >
      <div
        tw="opacity-70 fixed inset-0 bg-black"
        onClick={() => {
          if (closeOnOverlayClick) {
            handleClose()
          }
        }}
      />
      <div
        css={[
          tw`flex flex-col bg-white dark:bg-neut-16 dark:text-white overflow-auto z-20`,
          placement === 'rightFull' && tw`fixed top-0 right-0 bottom-0 w-1/2`,
          placement === 'center' && tw`min-w-[600px] h-auto`,
          contentClassName,
        ]}
      >
        <div tw="flex justify-between px-5 py-4 shadow">
          <div tw="font-medium text-base">{title}</div>
          {closable && (
            <Icon
              name="close"
              type={darkMode ? 'light' : 'dark'}
              tw="cursor-pointer"
              onClick={handleClose}
            />
          )}
        </div>
        <div tw="flex-1 shadow-sm">{children}</div>
        <div tw="px-5 py-3 dark:border-t dark:border-neut-13">
          {footer ||
            (footer !== null && (
              <div tw="flex justify-end">
                <div>
                  <Button tw="mr-2" onClick={handleClose}>
                    {cancelText}
                  </Button>
                  <Button
                    type="primary"
                    loading={showConfirmLoading}
                    onClick={onOK}
                  >
                    {okText}
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default Modal
