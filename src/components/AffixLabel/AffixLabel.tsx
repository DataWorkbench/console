import { ReactNode } from 'react'
import { Tooltip, Icon } from '@QCFE/lego-ui'
import tw, { css, styled } from 'twin.macro'

const TooltipWrapper = styled(Tooltip)(() => [
  css`
    ${tw`bg-green-11`}
    &[x-placement^=bottom] .tooltip-arrow {
      ${tw`border-b-green-11!`}
    }
    &[x-placement^='top'] .tooltip-arrow {
      ${tw`border-t-green-11!`}
    }
  `,
])

export const AffixLabel = ({
  required = true,
  help,
  children,
  placement = 'top',
  trigger = 'hover',
  disabled = false,
}: {
  required?: boolean
  help?: string
  children?: ReactNode
  placement?:
    | 'top'
    | 'left'
    | 'right'
    | 'bottom'
    | 'topLeft'
    | 'topRight'
    | 'leftTop'
    | 'leftBottom'
    | 'bottomLeft'
    | 'bottomRight'
    | 'rightTop'
    | 'rightBottom'
  trigger?: 'hover' | 'click' | 'focus'
  disabled: boolean
}) => {
  return (
    <div tw="inline-flex items-center">
      {required && <b tw="text-red-10 mr-1">*</b>}
      <span tw="mr-1">{children}</span>
      {help && (
        <TooltipWrapper
          content={help}
          placement={placement}
          trigger={trigger}
          disabled={disabled}
        >
          <Icon name="information" size={14} />
        </TooltipWrapper>
      )}
    </div>
  )
}

export default AffixLabel
