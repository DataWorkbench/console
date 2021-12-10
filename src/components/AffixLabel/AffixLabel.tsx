import { ReactNode } from 'react'
import { Icon } from '@QCFE/lego-ui'
import { Tooltip } from 'components/Tooltip'
import { Center } from 'components/Center'

// const TooltipWrapper = styled(Tooltip)(() => [
//   css`
//     .dark {
//       ${tw`bg-green-11`}
//       &[x-placement^=bottom] .tooltip-arrow {
//         ${tw`border-b-green-11!`}
//       }
//       &[x-placement^='top'] .tooltip-arrow {
//         ${tw`border-t-green-11!`}
//       }
//     }
//   `,
// ])

export const AffixLabel = ({
  required = true,
  help,
  children,
  placement = 'top',
  trigger = 'mouseenter focus',
  disabled = false,
  theme = 'darker',
  className,
}: {
  required?: boolean
  help?: ReactNode
  children?: ReactNode
  placement?:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'
    | 'auto'
    | 'auto-start'
    | 'auto-end'
  trigger?: string
  disabled?: boolean
  theme?: 'light' | 'dark' | 'darker' | 'green'
  className?: string
}) => {
  return (
    <div tw="flex items-center" className={className}>
      {required && <b tw="text-red-10 mr-1">*</b>}
      <div tw="mr-1 inline-block font-medium break-all">{children}</div>
      {help && (
        <Tooltip
          tw="break-all"
          content={help}
          placement={placement}
          trigger={trigger}
          theme={theme}
          disabled={disabled}
          hasPadding
        >
          <Center>
            <Icon name="information" size={16} />
          </Center>
        </Tooltip>
      )}
    </div>
  )
}

export default AffixLabel
