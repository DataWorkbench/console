import {
  isValidElement,
  useState,
  cloneElement,
  PropsWithChildren,
  ReactNode,
  MouseEventHandler,
} from 'react'
import { Placement } from 'tippy.js'
import Tippy, { TippyProps } from '@tippyjs/react'
import tw, { css, TwStyle } from 'twin.macro'
import { omit } from 'lodash-es'

import { Icon } from '@QCFE/qingcloud-portal-ui'
import { Button } from '@QCFE/lego-ui'

import { FlexBox } from '../Box'

const iconConfig = {
  info: {
    name: 'if-information',
    color: '#2193d3',
  },
  // success: { // 未发现相关设计需求
  //   name: 'success',
  //   color: '#15a675',
  // },
  warning: {
    name: 'if-exclamation',
    color: '#ffd127',
  },
  error: {
    name: 'if-error',
    color: '#cf3b37',
  },
}

type PlacementMapper = {
  top: Placement
  left: Placement
  right: Placement
  bottom: Placement
  topLeft: Placement
  topRight: Placement
  leftTop: Placement
  leftBottom: Placement
  bottomLeft: Placement
  bottomRight: Placement
  rightTop: Placement
  rightBottom: Placement
}
const placementMapper: PlacementMapper = {
  top: 'top',
  left: 'left',
  right: 'right',
  bottom: 'bottom',
  topLeft: 'top-start',
  topRight: 'top-end',
  leftTop: 'left-start',
  leftBottom: 'left-end',
  bottomLeft: 'bottom-start',
  bottomRight: 'bottom-end',
  rightTop: 'right-start',
  rightBottom: 'right-end',
}

type PlacementType = keyof PlacementMapper

interface IPopConfirmProps {
  trigger?: 'hover' | 'click' | 'focus'
  type?: 'info' | 'warning' | 'error'
  content: ReactNode
  twChild?: TwStyle
  placement?: PlacementType
  showOk?: boolean
  showCancel?: boolean
  cancelText?: string
  okText?: string
  okType?: 'primary' | 'danger'
  visible?: boolean
  closeAfterClick?: boolean
  onClickOutside?: boolean
  onOk?: () => void
  onCancel?: () => void
  className?: string
}

export const PopConfirm = (
  props: PropsWithChildren<
    Omit<TippyProps, keyof IPopConfirmProps> & IPopConfirmProps
  >
) => {
  const {
    trigger,
    content,
    twChild,
    children,
    placement = 'top',
    showOk = true,
    type = 'info',
    showCancel = true,
    cancelText = '取消',
    okText = '确定',
    okType = 'primary',
    visible: visibleProp,
    closeAfterClick = true,
    onClickOutside = true,
    onOk,
    onCancel,
    className,
    ...rest
  } = props

  const [visible, setVisible] = useState(visibleProp ?? false)
  const show = () => setVisible(true)
  const hide = () => setVisible(false)

  const combProps: TippyProps = {
    interactive: true,
    theme: 'dark',
    appendTo: () => document.body as any,
    placement: placementMapper[placement] ? placementMapper[placement] : 'top',
    animation: 'fade',
    delay: 100,
    visible: visibleProp === undefined ? visible : visibleProp,
    className: `${className} popconfirm-box`,
    // arrow: roundArrow,
    ...omit(rest, 'data-tw'),
  }

  const handleCancel: MouseEventHandler = (e) => {
    hide()
    if (typeof onCancel === 'function') {
      onCancel()
    }
    e.stopPropagation()
  }

  const handleOk: MouseEventHandler = (e) => {
    if (typeof onOk === 'function') {
      onOk()
    }
    hide()
    e.stopPropagation()
  }

  const renderChildren = () => {
    if (!isValidElement(children)) {
      return children
    }
    const newProps = children.props ? { ...children.props } : {}

    switch (trigger) {
      case 'hover':
        Object.assign(newProps, {
          onMouseMove: (e: MouseEvent) => {
            if (typeof children.props?.onMouseMove === 'function') {
              newProps.onMouseMove(e)
            }
            show()
          },
        })
        break
      case 'focus':
        Object.assign(newProps, {
          onFocus: (e: FocusEvent) => {
            if (typeof children.props?.onFocus === 'function') {
              newProps.onFocus(e)
            }
            show()
          },
        })
        break
      default:
        Object.assign(newProps, {
          onClick: (e: MouseEvent) => {
            if (typeof children.props?.onClick === 'function') {
              newProps.onClick(e)
            }
            show()
          },
        })
        break
    }
    return cloneElement(children, { ...newProps })
  }

  return (
    <Tippy
      {...combProps}
      trigger={trigger}
      onClickOutside={onClickOutside ? hide : undefined}
      content={
        <div
          tw="p-5"
          onClick={closeAfterClick ? hide : undefined}
          onMouseLeave={trigger === 'hover' ? hide : undefined}
        >
          <FlexBox tw="space-x-3 mb-3">
            <Icon
              name={iconConfig[type].name}
              css={css`
                color: ${iconConfig[type].color};
                font-size: 22px;
                line-height: 24px;
              `}
            />
            <section tw="flex-1">{content}</section>
          </FlexBox>
          {(showCancel || showOk) && (
            <div tw="pt-5 text-right">
              <>
                {showCancel && (
                  <Button tw="mr-2 px-4" onClick={handleCancel}>
                    {cancelText}
                  </Button>
                )}
                {showOk && (
                  <Button tw="px-4" type={okType} onClick={handleOk}>
                    {okText}
                  </Button>
                )}
              </>
            </div>
          )}
        </div>
      }
    >
      <div css={[tw`inline-block`, [twChild]]}>{renderChildren()}</div>
    </Tippy>
  )
}
export default PopConfirm
