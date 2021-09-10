import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useToggle } from 'react-use'
import tw from 'twin.macro'
import { Icon } from '@QCFE/qingcloud-portal-ui/lib/components'
import MenuItem from './MenuItem'

const propTypes = {
  title: PropTypes.string,
  menus: PropTypes.array,
  darkMode: PropTypes.bool,
  onClick: PropTypes.func,
  defaultSelectedMenu: PropTypes.string,
}

const defaultProps = {
  title: '',
  menus: [],
  darkMode: false,
  onClick() {},
}

function SideMenu({ title, menus, onClick, darkMode, defaultSelectedMenu }) {
  const [narrowMode, toggleNarrowMode] = useToggle(false)
  const [curSelectedMenu, setCurSelectedMenu] = useState(defaultSelectedMenu)
  const handleMenuClick = (menuName) => {
    setCurSelectedMenu(menuName)
    onClick(menuName)
  }

  return (
    <div
      css={[
        tw`relative transition-all`,
        narrowMode ? tw`w-14 text-center` : tw`w-56`,
      ]}
    >
      <div
        tw="
          overflow-auto pt-5  absolute inset-0 flex flex-col shadow-md border-r border-neut-3 dark:bg-neut-17 dark:border-neut-13"
      >
        {title && (
          <div
            css={[
              tw`pb-4 font-medium text-lg text-neut-15 dark:text-white`,
              narrowMode ? '' : tw`pl-5`,
            ]}
          >
            {narrowMode ? (
              <Icon
                name="if-menu"
                type={darkMode ? 'light' : 'dark'}
                className="text-xl"
              />
            ) : (
              title
            )}
          </div>
        )}
        <div tw="flex-1 text-sm">
          {menus.map(({ title: t, name, icon, isSubTitle, link, items }) => {
            if (narrowMode) {
              return (
                <div tw="py-2" key={name}>
                  {isSubTitle && <div tw="border-b border-neut-3 mx-4" />}
                  {icon && (
                    <Icon
                      type={darkMode ? 'light' : 'dark'}
                      name={icon}
                      tw="text-xl"
                    />
                  )}
                </div>
              )
            }
            return (
              <MenuItem
                title={t}
                name={name}
                key={name}
                icon={icon}
                isSubTitle={isSubTitle}
                link={link}
                curSelectedMenu={curSelectedMenu}
                items={items}
                darkMode={darkMode}
                onClick={handleMenuClick}
              />
            )
          })}
        </div>
        <div tw="flex h-10 items-center bg-neut-2 border-t border-neut-3 hover:bg-neut-1 pl-5 dark:bg-neut-17 dark:border-neut-13">
          <Icon
            name={narrowMode ? 'expand' : 'collapse'}
            size={20}
            clickable
            type={darkMode ? 'light' : 'dark'}
            onClick={toggleNarrowMode}
          />
        </div>
      </div>
    </div>
  )
}

SideMenu.propTypes = propTypes
SideMenu.defaultProps = defaultProps

export default SideMenu
