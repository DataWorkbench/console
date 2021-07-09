import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { useToggle } from 'react-use'
import styles from './styles.module.css'

const propTypes = {
  name: PropTypes.string,
  title: PropTypes.string,
  icon: PropTypes.string,
  link: PropTypes.string,
  isSubTitle: PropTypes.bool,
  items: PropTypes.array,
  curSelectedMenu: PropTypes.string,
  darkMode: PropTypes.bool,
  onClick: PropTypes.func,
}

const defaultProps = {
  onClick() {},
}

function MenuItem({
  name,
  title,
  icon,
  link,
  isSubTitle,
  items,
  darkMode,
  curSelectedMenu,
  onClick,
}) {
  const [expand, toggleExpand] = useToggle(false)
  const handleClick = () => {
    if (items && items.length) {
      toggleExpand()
    } else if (!isSubTitle) {
      onClick(name)
    }
  }
  const isSelected = curSelectedMenu === name
  return (
    <>
      <div
        className={clsx(
          // isSelected ? styles.menuSelected : styles.menuLink,
          isSubTitle && 'tw-cursor-default',
          'tw-block tw-leading-6 tw-py-0 tw-pl-4  tw-pr-5 tw-cursor-pointer'
        )}
        onClick={handleClick}
      >
        <div
          className={clsx(
            'tw-flex tw-items-center tw-justify-between tw-py-1 tw-select-none',
            'dark:tw-text-white dark:hover:tw-bg-neutral-N13 dark:tw-rounded-sm',
            isSelected && 'dark:tw-bg-neutral-N13'
          )}
        >
          <div className="tw-flex tw-items-center">
            <div
              className={clsx(
                'tw-w-0.5 tw-self-stretch  first:tw-mr-2',
                isSelected ? 'tw-bg-brand-G11' : ''
              )}
            />
            {icon && (
              <Icon
                className="first:tw-ml-2"
                name={icon}
                type={darkMode ? 'light' : 'dark'}
                size={16}
              />
            )}
            {isSubTitle ? (
              <div className="first:tw-mr-2 tw-whitespace-nowrap tw-overflow-hidden tw-text-xs tw-text-neutral-N8 tw-leading-8">
                {title}
              </div>
            ) : (
              <Link
                to={link}
                className={clsx(
                  'tw-whitespace-nowrap tw-overflow-hidden tw-ml-2 first:tw-mr-2',
                  'dark:hover:tw-text-white'
                )}
              >
                {title}
              </Link>
            )}
          </div>
          {items && <Icon name={expand ? 'caret-up' : 'caret-down'} />}
        </div>
      </div>
      {items && (
        <div className={clsx('tw-ml-8 tw-py-2', !expand && 'tw-hidden')}>
          {items.map((item) => (
            <div
              key={item.name}
              className={clsx(
                curSelectedMenu === item.name
                  ? styles.menuSelected
                  : styles.menuLink
              )}
              onClick={() => onClick(item.name)}
            >
              <div className="tw-flex tw-items-center tw-border-l-2 tw-border-neutral-N2 tw-pl-3 tw-py-1">
                {item.icon && (
                  <Icon
                    type={darkMode ? 'light' : 'dark'}
                    name={item.icon}
                    size={16}
                  />
                )}
                <div className="tw-ml-2">{item.title}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

MenuItem.propTypes = propTypes
MenuItem.defaultProps = defaultProps
export default MenuItem
