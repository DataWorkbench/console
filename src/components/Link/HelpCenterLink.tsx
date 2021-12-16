import { PropsWithChildren } from 'react'
import { Modal, HelpCenterModal } from '@QCFE/qingcloud-portal-ui'
import { getHelpCenterLink } from 'utils'
import { TextLink } from './TextLink'

interface LinkInterface {
  isIframe?: boolean
  hasIcon?: boolean
  type?: 'a' | 'button'
}

const HelpCenterLink = (
  props: PropsWithChildren<
    Partial<
      LinkInterface &
        React.DetailedHTMLProps<
          React.AnchorHTMLAttributes<HTMLAnchorElement>,
          HTMLAnchorElement
        >
    >
  >
) => {
  const { href, isIframe = true, ...rest } = props

  const handleOpenHelpCenter = (link: string) => {
    const openModal = Modal.open(HelpCenterModal, {
      link,
      onCancel: () => Modal.close(openModal),
    })
  }
  const linkProps = isIframe
    ? {
        onClick: () => href && handleOpenHelpCenter(href),
        hasIcon: false,
        ...rest,
      }
    : {
        href: href ? getHelpCenterLink(href) : '###',
        target: '_blank',
        hasIcon: true,
        ...rest,
      }
  return <TextLink type={isIframe ? 'button' : 'a'} {...linkProps} />
}

export default HelpCenterLink