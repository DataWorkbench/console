import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { useToggle } from 'react-use'
import { Icon } from '@QCFE/qingcloud-portal-ui/lib/components'
import MenuItem from './MenuItem'

const propTypes = {
  title: PropTypes.string,
  menus: PropTypes.array,
  darkMode: PropTypes.bool,
  onClick: PropTypes.func,
}

const defaultProps = {
  title: '',
  menus: [],
  darkMode: false,
  onClick() {},
}

function SideMenu({ title, menus, onClick, darkMode }) {
  const [narrowMode, toggleNarrowMode] = useToggle(false)
  const [curSelectedMenu, setCurSelectedMenu] = useState(null)
  const handleMenuClick = (menuName) => {
    setCurSelectedMenu(menuName)
    onClick(menuName)
  }
  return (
    <div
      className={clsx(
        'tw-relative',
        narrowMode ? 'tw-w-14 tw-text-center' : 'tw-w-56'
      )}
    >
      <div
        className={clsx(
          'tw-overflow-auto tw-pt-5 tw-bg-white dark:tw-bg-neutral-N17 tw-absolute tw-inset-0 tw-flex tw-flex-col shadow-md tw-transition-all',
          'dark:tw-border-r dark:tw-border-neutral-N13'
        )}
      >
        {title && (
          <div
            className={clsx(
              'tw-pb-4 tw-font-medium tw-text-lg tw-text-neutral-N15 dark:tw-text-white',
              narrowMode ? '' : 'tw-pl-5'
            )}
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
        <div className="tw-flex-1 tw-text-sm">
          {menus.map(({ title: t, name, icon, isSubTitle, link, items }) => {
            if (narrowMode) {
              return (
                <div className="tw-py-2" key={name}>
                  {isSubTitle && (
                    <div className="tw-border-b tw-border-neutral-N3 tw-mx-4" />
                  )}
                  {icon && (
                    <Icon
                      type={darkMode ? 'light' : 'dark'}
                      name={icon}
                      className="tw-text-xl"
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
        <div
          className={clsx(
            'tw-flex tw-flex-none tw-h-10 tw-items-center tw-bg-neutral-N1 hover:tw-bg-neutral-N2 tw-cursor-pointer tw-pl-5',
            'dark:tw-bg-neutral-N17 dark:tw-border-t dark:tw-border-neutral-N13'
          )}
        >
          <Icon
            name={narrowMode ? 'expand' : 'collapse'}
            size={20}
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
