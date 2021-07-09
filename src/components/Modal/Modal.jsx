import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { get } from 'lodash'
import { Icon, Button } from '@QCFE/qingcloud-portal-ui'
import useScrollBlock from 'hooks/useScrollBlock'

const Pos = {
  rightFull: 'tw-fixed tw-top-0 tw-right-0 tw-bottom-0 tw-w-1/2',
  center: 'tw-w-[600px] tw-h-auto tw-justify-items-center tw-self-center',
}

const propTypes = {
  placement: PropTypes.string,
  title: PropTypes.string,
  closable: PropTypes.bool,
  show: PropTypes.bool,
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  onOK: PropTypes.func,
  onCancel: PropTypes.func,
  onHide: PropTypes.func,
  closeOnOverlayClick: PropTypes.bool,
  footer: PropTypes.node,
  children: PropTypes.node,
}

const defaultProps = {
  title: '',
  closable: true,
  show: false,
  okText: '确定',
  cancelText: '取消',
  onOK() {},
  onCancel() {},
  onHide() {},
  placement: 'rightFull',
  closeOnOverlayClick: true,
}

const Modal = ({
  placement,
  title,
  closable,
  okText,
  cancelText,
  show,
  children,
  onOK,
  onCancel,
  onHide,
  closeOnOverlayClick,
  footer,
}) => {
  const [blockScroll, allowScroll] = useScrollBlock()

  if (show) {
    blockScroll()
  } else {
    allowScroll()
  }

  return (
    <div
      className={clsx(
        { 'tw-hidden': !show, 'tw-flex': placement === 'center' },
        'tw-fixed tw-inset-0 tw-z-10'
      )}
    >
      <div
        className="tw-opacity-70 tw-fixed tw-inset-0 tw-bg-black"
        onClick={() => {
          if (closeOnOverlayClick) {
            onHide()
          }
        }}
      />
      <div
        className={clsx(
          'tw-flex tw-flex-col tw-bg-white tw-overflow-auto',
          get(Pos, placement, '')
        )}
      >
        <div className="tw-flex tw-justify-between tw-px-5 tw-py-4 tw-shadow">
          <div className="tw-font-medium tw-text-base">{title}</div>
          {closable && <Icon name="close" clickable onClick={onHide} />}
        </div>
        <div className="tw-flex-1 tw-shadow-sm">{children}</div>
        <div className="tw-px-5 tw-py-3">
          {footer ||
            (footer !== null && (
              <div className="tw-flex tw-justify-end">
                <div>
                  <Button className="tw-mr-2" onClick={onCancel}>
                    {cancelText}
                  </Button>
                  <Button type="primary" onClick={onOK}>
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

Modal.propTypes = propTypes

Modal.defaultProps = defaultProps

Modal.pos = Pos

export default Modal
