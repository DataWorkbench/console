import { Icon } from '@QCFE/qingcloud-portal-ui'
import { Menu } from '@QCFE/lego-ui'
import React, { SyntheticEvent } from 'react'
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

export const MoreAction = (props: IMoreActionProps) => {
  const { theme = 'darker', onMenuClick, items } = props

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
                  {text}
                </FlexBox>
              </MenuItem>
            ))}
          </Menu>
        }
      >
        <div tw="flex items-center p-0.5 cursor-pointer dark:hover:bg-line-dark rounded-sm">
          <Icon
            name="more"
            clickable
            changeable
            type={theme !== 'light' ? 'light' : 'dark'}
            size={20}
          />
        </div>
      </Tooltip>
    </Center>
  )
}

// export default MoreAction
