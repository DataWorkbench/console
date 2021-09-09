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
        tw`tw-relative tw-transition-all`,
        narrowMode ? tw`tw-w-14 tw-text-center` : tw`tw-w-56`,
      ]}
    >
      <div
        tw="
          tw-overflow-auto tw-pt-5  tw-absolute tw-inset-0 tw-flex tw-flex-col tw-shadow-md tw-border-r tw-border-neut-3 dark:tw-bg-neut-17 dark:tw-border-neut-13"
      >
        {title && (
          <div
            css={[
              tw`tw-pb-4 tw-font-medium tw-text-lg tw-text-neut-15 dark:tw-text-white`,
              narrowMode ? '' : tw`tw-pl-5`,
            ]}
          >
            {narrowMode ? (
              <Icon
                name="if-menu"
                type={darkMode ? 'light' : 'dark'}
                className="tw-text-xl"
              />
            ) : (
              title
            )}
          </div>
        )}
        <div tw="tw-flex-1 tw-text-sm">
          {menus.map(({ title: t, name, icon, isSubTitle, link, items }) => {
            if (narrowMode) {
              return (
                <div tw="tw-py-2" key={name}>
                  {isSubTitle && (
                    <div tw="tw-border-b tw-border-neut-3 tw-mx-4" />
                  )}
                  {icon && (
                    <Icon
                      type={darkMode ? 'light' : 'dark'}
                      name={icon}
                      tw="tw-text-xl"
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
        <div tw="tw-flex tw-h-10 tw-items-center tw-bg-neut-2 tw-border-t tw-border-neut-3 hover:tw-bg-neut-1 tw-pl-5 dark:tw-bg-neut-17 dark:tw-border-neut-13">
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
