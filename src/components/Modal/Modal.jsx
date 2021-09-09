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
        tw`tw-fixed tw-inset-0 tw-z-10`,
        isHide && tw`tw-hidden`,
        placement === 'center' && tw`tw-flex tw-items-center tw-justify-center`,
      ]}
    >
      <div
        tw="tw-opacity-70 tw-fixed tw-inset-0 tw-bg-black"
        onClick={() => {
          if (closeOnOverlayClick) {
            handleClose()
          }
        }}
      />
      <div
        className={contentClassName}
        css={[
          tw`tw-flex tw-flex-col tw-bg-white dark:tw-bg-neut-16 dark:tw-text-white tw-overflow-auto tw-z-20`,
          placement === 'rightFull' &&
            tw`tw-fixed tw-top-0 tw-right-0 tw-bottom-0 tw-w-1/2`,
          placement === 'center' && tw`tw-min-w-[600px] tw-h-auto`,
        ]}
      >
        <div tw="tw-flex tw-justify-between tw-px-5 tw-py-4 tw-shadow">
          <div tw="tw-font-medium tw-text-base">{title}</div>
          {closable && (
            <Icon
              name="close"
              type={darkMode ? 'light' : 'dark'}
              tw="tw-cursor-pointer"
              onClick={handleClose}
            />
          )}
        </div>
        <div tw="tw-flex-1 tw-shadow-sm">{children}</div>
        <div tw="tw-px-5 tw-py-3 dark:tw-border-t dark:tw-border-neut-13">
          {footer ||
            (footer !== null && (
              <div tw="tw-flex tw-justify-end">
                <div>
                  <Button tw="tw-mr-2" onClick={handleClose}>
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
