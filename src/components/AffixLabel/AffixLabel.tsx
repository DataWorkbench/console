import { ReactNode } from 'react'
import { Icon } from '@QCFE/lego-ui'
import { Tooltip } from 'components/Tooltip'
import { Center } from 'components/Center'
import tw, { styled, css } from 'twin.macro'

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

const IconBoxWithTootip = styled(Center)(() => {
  return [
    css`
      &{
        [aria-expanded='true'] {
        ${tw`label-help-icon-light-hover dark:label-help-icon-dark-hover`}
      }
    `,
  ]
})

export const AffixLabel = ({
  required = true,
  help,
  children,
  placement = 'top',
  trigger = 'mouseenter focus',
  disabled = false,
  theme = 'darker',
}: {
  required?: boolean
  help?: string
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
}) => {
  return (
    <div tw="flex items-center">
      {required && <b tw="text-red-10 mr-1">*</b>}
      <span tw="mr-1 font-medium break-all">{children}</span>
      {help && (
        <IconBoxWithTootip>
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
              <Icon
                name="information"
                tw="label-help-icon-light dark:label-help-icon-dark"
                size={16}
              />
            </Center>
          </Tooltip>
        </IconBoxWithTootip>
      )}
    </div>
  )
}

export default AffixLabel
