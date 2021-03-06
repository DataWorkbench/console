import React from 'react'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import { useHistory } from 'react-router-dom'
import tw, { css, theme } from 'twin.macro'
import { useToggle } from 'react-use'

const styles = {
  link: [
    tw`text-neut-13 hover:text-green-11`,
    css`
      svg {
        fill: rgba(255, 255, 255, 0.6);
      }
      &:hover {
        svg {
          color: ${theme('colors.green.11')};
          fill: ${theme('colors.green.4')})
        }
      }
    `,
  ],
}

interface Item {
  name: string
  title: string
  icon: string
}

interface MenuItemProps {
  name: string
  title: string
  icon: string
  link: string
  isSubTitle: boolean
  items: Item[]
  darkMode: boolean
  curSelectedMenu: string
  onClick: (name: string) => void
}

const MenuItem = ({
  name = '',
  title = '',
  icon = '',
  link = '',
  isSubTitle = false,
  items = [],
  darkMode = false,
  curSelectedMenu = '',
  onClick = () => {},
}: MenuItemProps) => {
  const history = useHistory()
  const [expand, toggleExpand] = useToggle(false)
  const handleClick = () => {
    if (items && items.length) {
      toggleExpand()
    } else if (!isSubTitle) {
      onClick(name)
      history.push(link)
    }
  }
  const isSelected = curSelectedMenu === name
  return (
    <>
      <div
        css={[
          // isSelected ? styles.menuSelected : styles.menuLink,
          isSubTitle && tw`cursor-default`,
          tw`block leading-6 py-0 pl-4 pr-5 cursor-pointer`,
        ]}
        onClick={handleClick}
      >
        <div
          css={[
            tw`flex items-center justify-between py-1 select-none rounded-sm`,
            tw`dark:text-white dark:hover:bg-neut-13 dark:rounded-sm dark:font-medium`,
            isSelected && tw`bg-neut-16 text-white dark:bg-neut-13`,
            // !isSelected && 'hover:bg-neut-16 hover:text-white'
          ]}
        >
          <div tw="flex items-center">
            <div
              css={[
                tw`w-0.5 self-stretch mr-2`,
                isSelected ? tw`bg-green-11` : '',
              ]}
            />
            {icon && (
              <Icon
                tw="ml-2"
                name={icon}
                type={darkMode ? 'light' : 'dark'}
                size={16}
              />
            )}
            {isSubTitle ? (
              <div tw="mr-2 whitespace-nowrap overflow-hidden text-xs text-neut-8 leading-8">
                {title}
              </div>
            ) : (
              <div
                // to={link}
                css={[
                  tw`whitespace-nowrap overflow-hidden ml-2 mr-2`,
                  tw`dark:hover:text-white`,
                  isSelected && tw`hover:text-white`,
                ]}
              >
                {title}
              </div>
            )}
          </div>
          {items.length > 0 && (
            <Icon name={expand ? 'caret-up' : 'caret-down'} />
          )}
        </div>
      </div>
      {items.length > 0 && (
        <div css={[tw`ml-8 py-2`, !expand && tw`hidden`]}>
          {items.map((item) => (
            <div
              key={item.name}
              css={styles.link}
              onClick={() => onClick(item.name)}
            >
              <div css="flex items-center border-l-2 border-neut-2 pl-3 py-1">
                {item.icon && (
                  <Icon
                    type={darkMode ? 'light' : 'dark'}
                    name={item.icon}
                    size={16}
                  />
                )}
                <div css="ml-2">{item.title}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default MenuItem
