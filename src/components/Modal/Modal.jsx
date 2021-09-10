import React from 'react'
import PropTypes from 'prop-types'
import { useUnmount, useToggle } from 'react-use'
import tw from 'twin.macro'
import { Icon, Button } from '@QCFE/qingcloud-portal-ui'
import useScrollBlock from 'hooks/useScrollBlock'

const Modal = ({
  placement,
  title,
  closable,
  okText,
  cancelText,
  show,
  children,
  onOK,
  // onCancel,
  onHide,
  showConfirmLoading,
  closeOnOverlayClick,
  footer,
  rootClassName,
  contentClassName,
  darkMode,
}) => {
  const [isHide, toggleHide] = useToggle(!show)
  const [blockScroll, allowScroll] = useScrollBlock()
  if (show) {
    blockScroll()
  } else {
    allowScroll()
  }

  useUnmount(() => allowScroll())

  const handleClose = () => {
    toggleHide(true)
    onHide(true)
  }

  return (
    <div
      className={rootClassName}
      css={[
        tw`fixed inset-0 z-10`,
        isHide && tw`hidden`,
        placement === 'center' && tw`flex items-center justify-center`,
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
        className={contentClassName}
        css={[
          tw`flex flex-col bg-white dark:bg-neut-16 dark:text-white overflow-auto z-20`,
          placement === 'rightFull' && tw`fixed top-0 right-0 bottom-0 w-1/2`,
          placement === 'center' && tw`min-w-[600px] h-auto`,
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

Modal.propTypes = {
  placement: PropTypes.string,
  title: PropTypes.string,
  closable: PropTypes.bool,
  show: PropTypes.bool,
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  onOK: PropTypes.func,
  // onCancel: PropTypes.func,
  onHide: PropTypes.func,
  closeOnOverlayClick: PropTypes.bool,
  footer: PropTypes.node,
  children: PropTypes.node,
  rootClassName: PropTypes.string,
  contentClassName: PropTypes.string,
  darkMode: PropTypes.bool,
  showConfirmLoading: PropTypes.bool,
}

Modal.defaultProps = {
  title: '',
  closable: true,
  show: true,
  okText: '确定',
  cancelText: '取消',
  onOK() {},
  // onCancel() {},
  onHide() {},
  placement: 'rightFull',
  closeOnOverlayClick: true,
  showConfirmLoading: false,
}

export default Modal
