import { Button, ButtonProps, Icon } from '@QCFE/qingcloud-portal-ui'
import React, { PropsWithChildren } from 'react'
import tw, { styled, css } from 'twin.macro'

interface LinkInterface {
  hasIcon?: boolean
  type?: 'a' | 'button'
}

const Link = (
  props: PropsWithChildren<
    Partial<
      LinkInterface &
        React.DetailedHTMLProps<
          React.AnchorHTMLAttributes<HTMLAnchorElement>,
          HTMLAnchorElement
        > &
        ButtonProps
    >
  >
) => {
  const { hasIcon = true, type = 'a', children: childrenProp, ...rest } = props
  const children = !hasIcon ? (
    childrenProp
  ) : (
    <>
      {childrenProp}
      <Icon name="if-external-link" />
    </>
  )
  if (type !== 'a') {
    return <Button type="text">{children}</Button>
  }
  return <a {...rest}>{children}</a>
}

export const TextLink = styled(Link)(
  ({ color = 'blue' }: { color?: 'blue' | 'white' }) => [
    tw`font-semibold underline text-underline-offset[1px]`,
    color === 'blue' &&
      tw`text-deepblue-10 dark:text-blue-10 hover:text-deepblue-12 hover:dark:text-blue-12 active:text-deepblue-13 active:dark:text-blue-13`,
    color === 'white' &&
      tw`text-green-11 dark:text-white hover:text-green-12 hover:dark:text-green-11 active:text-green-13 active:dark:text-green-12`,
    css`
      & .if {
        ${tw`inline-block`}
      }
    `,
  ]
)

export default TextLink
