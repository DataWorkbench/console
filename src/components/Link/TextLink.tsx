import { ButtonProps, Icon } from '@QCFE/qingcloud-portal-ui'
import React, { PropsWithChildren } from 'react'
import tw, { styled, css } from 'twin.macro'
import { Link as ReactRouterLink } from 'react-router-dom'

interface LinkInterface {
  hasIcon?: boolean
  linkType?: 'a' | 'button'
}

const Link = (
  props: PropsWithChildren<
    Partial<
      React.DetailedHTMLProps<
        React.AnchorHTMLAttributes<HTMLAnchorElement>,
        HTMLAnchorElement
      > &
        ButtonProps &
        LinkInterface
    >
  >
) => {
  const {
    hasIcon = true,
    linkType: type = 'a',
    children: childrenProp,
    ...rest
  } = props
  const children = !hasIcon ? (
    childrenProp
  ) : (
    <>
      {childrenProp}
      <Icon name="if-external-link" size={14} tw="text-sm font-normal ml-0.5" />
    </>
  )
  if (type !== 'a') {
    return (
      <button type="button" {...rest}>
        {children}
      </button>
    )
  }
  return <a {...rest}>{children}</a>
}

const colorThemes = {
  blue: tw`text-deepblue-10 dark:text-blue-10 hover:text-deepblue-12 hover:dark:text-blue-12 active:text-deepblue-13 active:dark:text-blue-13`,
  white: tw`text-green-11 dark:text-white hover:text-green-12 hover:dark:text-green-11 active:text-green-13 active:dark:text-green-12`,
}

export const TextLink = styled(Link)(
  ({
    color = 'blue',
    disabled = false,
  }: {
    color?: 'blue' | 'white'
    disabled: Boolean
  }) => [
    tw`font-semibold underline text-underline-offset[1px]`,
    () => colorThemes[color],
    disabled && tw`cursor-not-allowed opacity-50`,
    css`
      & .if {
        ${tw`inline-block`}
      }
    `,
  ]
)

export const RouterLink = styled(ReactRouterLink)(
  ({ color = 'white' }: { color?: 'blue' | 'white' }) => [
    tw`font-semibold underline text-underline-offset[1px]`,
    () => colorThemes[color],
  ]
)

export default TextLink
