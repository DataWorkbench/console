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

const IconBoxWithTootip = styled(Center)(() => [
  css`
    & {
      [aria-expanded='true'] {
        .icon svg.qicon {
          ${tw`fill-[#324558]  dark:fill-[#fff]`}
        }
      }
    }
  `
])

export const AffixLabel = ({
  required = true,
  help,
  children,
  placement = 'top',
  trigger = 'mouseenter focus',
  disabled = false,
  theme = 'darker',
  className
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
}) => (
  <div tw="flex items-center" className={className}>
    {required && <b tw="text-red-10 mr-1">*</b>}
    <div tw="mr-1 inline-block font-medium break-all">{children}</div>
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
              // tw="label-help-icon-light dark:label-help-icon-dark"
              css={[
                css`
                  svg {
                    ${tw`text-white fill-[#939ea9] dark:text-[#000] dark:fill-[#939ea9]`}
                  }
                `
              ]}
              size={16}
            />
          </Center>
        </Tooltip>
      </IconBoxWithTootip>
    )}
  </div>
)

export default AffixLabel
