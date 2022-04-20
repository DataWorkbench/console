import { Icon, Button } from '@QCFE/qingcloud-portal-ui'
import { Menu } from '@QCFE/lego-ui'
import React, { ReactElement, SyntheticEvent } from 'react'
import tw, { css } from 'twin.macro'
import { FlexBox } from 'components/Box'
import { Center } from '../Center'
import { Tooltip } from '../Tooltip'

export interface IMoreActionItem {
  key: string
  text: string
  icon?: string
  value?: any
}
export interface IMoreActionProps {
  theme?: 'darker' | 'light'
  onMenuClick?: (selectedData: any, menuKey: string) => void
  items: IMoreActionItem[]
  type?: 'icon' | 'button'
  buttonText?: string
}

const { MenuItem } = Menu as any

export const moreActionStyle = {
  child: ({ theme = 'darker' }: { theme: 'darker' | 'light' }) => {
    return [
      theme === 'darker' &&
        css`
          &[aria-expanded='true'] {
            ${tw`bg-line-dark`}
          }

          svg {
            ${tw`text-white! bg-transparent! fill-[transparent]!`}
          }
        `,
    ]
  },
}

const getStyles = (theme: 'darker') => {
  switch (theme) {
    case 'darker':
      return {
        button: tw`border border-line-dark! text-white hover:bg-line-dark! hover:text-white`,
        icon: tw`flex items-center p-0.5 cursor-pointer dark:hover:bg-line-dark rounded-sm`,
      }
    default:
      return {}
  }
}

export const MoreAction = (props: IMoreActionProps) => {
  const {
    theme = 'darker',
    onMenuClick,
    items,
    type = 'icon',
    buttonText,
  } = props

  const handleMenuClick = (
    e: SyntheticEvent,
    key: string,
    value: string | number
  ) => {
    // e.stopPropagation()
    if (onMenuClick) {
      onMenuClick(value, key)
    }
  }

  // todo light style
  const styles = getStyles(theme as 'darker')
  let children: ReactElement

  switch (type) {
    case 'button':
      children = (
        <Button css={styles.button} type="outlined">
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
        placement="bottom-end"
        twChild={moreActionStyle.child({ theme }) as any}
        content={
          <Menu onClick={handleMenuClick}>
            {items.map(({ key, value, text, icon }) => (
              <MenuItem key={key} value={value}>
                <FlexBox tw="justify-between items-center">
                  {icon ? (
                    <Icon
                      name={icon}
                      size={16}
                      type={theme !== 'light' ? 'light' : 'dark'}
                    />
                  ) : null}
                  <span>{text}</span>
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
