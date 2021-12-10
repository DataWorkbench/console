import { Button, ButtonProps, Icon } from '@QCFE/qingcloud-portal-ui'
import React, { PropsWithChildren } from 'react'
import tw, { styled } from 'twin.macro'

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

const getLink = (isLink: boolean) =>
  styled(Link)(() => {
    return isLink
      ? tw`underline text-[#2563EB] dark:text-[#2193D3] hover:text-[#3B82F6] hover:dark:text-[#0EA5E9] active:text-[#1D4ED8] active:dark:text-[#0369A1]`
      : tw`underline text-green-11 dark:text-[#F7FCFF] hover:text-green-12 hover:dark:text-green-11 active:text-green-13 active:dark:text-green-12`
  })

export const TextLink = getLink(true)

export const ActionLink = getLink(false)
