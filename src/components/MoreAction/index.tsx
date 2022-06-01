import { Icon, Button } from '@QCFE/qingcloud-portal-ui'
import { Menu } from '@QCFE/lego-ui'
import React, { ReactElement, ReactNode, SyntheticEvent } from 'react'
import tw, { css } from 'twin.macro'
import { FlexBox } from 'components/Box'
import { isDarkTheme } from 'utils/theme'
import { Center } from '../Center'
import { Tooltip } from '../Tooltip'
import { AffixLabel } from '../AffixLabel'

export interface IMoreActionItem {
  key: string
  text: string | ReactNode
  icon?: string
  value?: any
  disabled?: boolean
  help?: string
}
export interface IMoreActionProps<T> {
  theme?: 'darker' | 'light' | 'auto' | 'instead'
  onMenuClick?: (selectedData: any, menuKey: T) => void
  items: IMoreActionItem[]
  type?: 'icon' | 'button'
  buttonText?: string
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
}

const { MenuItem } = Menu as any

export const moreActionStyle = {
  child: () => [
    css`
      &[aria-expanded='true'] {
        .button.is-outlined,
        & > div {
          ${tw`bg-button-thirdly-hover`}
        }
      }
      svg {
        ${tw`text-icon-single-dark! dark:text-icon-single-white! bg-transparent! fill-[transparent]!`}
      }
    `
  ]
}

const getTheme = (theme?: string) => {
  if (!theme) {
    return 'darker'
  }
  if (theme === 'auto') {
    if (isDarkTheme()) {
      return 'darker'
    }
    return 'light'
  }
  if (theme === 'instead') {
    if (isDarkTheme()) {
      return 'light'
    }
    return 'darker'
  }
  return theme
}

const getStyles = () => ({
  button: [
    tw`border border-separator! text-font! bg-transparent! hover:text-font! hover:bg-transparent!`,
    css`
      & .icon svg.qicon {
        ${tw`text-icon-single-dark! dark:text-icon-single-white!`}
      }
    `
  ],
  icon: tw`h-6 w-6 flex justify-center items-center hover:bg-button-thirdly-hover!`
})

export const MoreAction = <T extends string>(props: IMoreActionProps<T>) => {
  const {
    theme: themeProp,
    onMenuClick,
    items,
    type = 'icon',
    buttonText,
    placement = 'bottom-end'
  } = props

  const theme = getTheme(themeProp)
  const handleMenuClick = (e: SyntheticEvent, key: T, value: string | number) => {
    // e.stopPropagation()
    if (onMenuClick) {
      onMenuClick(value, key)
    }
  }

  const styles = getStyles()
  let children: ReactElement

  switch (type) {
    case 'button':
      children = (
        <Button type="outlined">
          <Icon
            name="more"
            clickable
            changeable
            type={theme !== 'light' ? 'light' : 'dark'}
            size={20}
            tw="bg-transparent! hover:bg-transparent!"
          />
          <span>{buttonText}</span>
        </Button>
      )
      break
    default:
      children = (
        <div css={styles.icon}>
          <Icon
            name="more"
            clickable
            changeable
            type={theme !== 'light' ? 'light' : 'dark'}
            size={20}
          />
        </div>
      )
      break
  }

  return (
    <Center>
      <Tooltip
        arrow={false}
        trigger="click"
        placement={placement}
        theme={theme}
        twChild={moreActionStyle.child() as any}
        content={
          <Menu onClick={handleMenuClick} tw="dark:border-separator dark:border">
            {items.map(({ key, value, text, icon, disabled, help }) => (
              <MenuItem key={key} value={value} disabled={disabled}>
                <FlexBox tw="justify-between items-center">
                  {icon ? (
                    <Icon name={icon} size={16} type={theme !== 'light' ? 'light' : 'dark'} />
                  ) : null}

                  {help ? (
                    <AffixLabel required={false} help={help} theme="light">
                      {text}
                    </AffixLabel>
                  ) : (
                    <span>{text}</span>
                  )}
                </FlexBox>
              </MenuItem>
            ))}
          </Menu>
        }
      >
        {children}
      </Tooltip>
    </Center>
  )
}

// export default MoreAction
