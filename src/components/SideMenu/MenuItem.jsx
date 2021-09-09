import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import { Link } from 'react-router-dom'
// import clsx from 'clsx'
import tw, { css, theme } from 'twin.macro'
import { useToggle } from 'react-use'
// import styles from './styles.module.css'

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

const styles = {
  link: [
    tw`tw-text-neut-13 hover:tw-text-green-11`,
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
        css={[
          // isSelected ? styles.menuSelected : styles.menuLink,
          isSubTitle && tw`tw-cursor-default`,
          tw`tw-block tw-leading-6 tw-py-0 tw-pl-4 tw-pr-5 tw-cursor-pointer`,
        ]}
        onClick={handleClick}
      >
        <div
          css={[
            tw`tw-flex tw-items-center tw-justify-between tw-py-1 tw-select-none tw-rounded-sm`,
            tw`dark:tw-text-white dark:hover:tw-bg-neut-13 dark:tw-rounded-sm dark:tw-font-medium`,
            isSelected && tw`tw-bg-neut-16 tw-text-white dark:tw-bg-neut-13`,
            // !isSelected && 'hover:tw-bg-neut-16 hover:tw-text-white'
          ]}
        >
          <div tw="tw-flex tw-items-center">
            <div
              css={[
                tw`tw-w-0.5 tw-self-stretch tw-mr-2`,
                isSelected ? tw`tw-bg-green-11` : '',
              ]}
            />
            {icon && (
              <Icon
                tw="tw-ml-2"
                name={icon}
                type={darkMode ? 'light' : 'dark'}
                size={16}
              />
            )}
            {isSubTitle ? (
              <div tw="tw-mr-2 tw-whitespace-nowrap tw-overflow-hidden tw-text-xs tw-text-neut-8 tw-leading-8">
                {title}
              </div>
            ) : (
              <Link
                to={link}
                css={[
                  tw`tw-whitespace-nowrap tw-overflow-hidden tw-ml-2 tw-mr-2`,
                  tw`dark:hover:tw-text-white`,
                  isSelected && tw`hover:tw-text-white`,
                ]}
              >
                {title}
              </Link>
            )}
          </div>
          {items && <Icon name={expand ? 'caret-up' : 'caret-down'} />}
        </div>
      </div>
      {items && (
        <div css={[tw`tw-ml-8 tw-py-2`, !expand && tw`tw-hidden`]}>
          {items.map((item) => (
            <div
              key={item.name}
              css={styles.link}
              // className={clsx(
              //   curSelectedMenu === item.name
              //     ? styles.menuSelected
              //     : styles.menuLink
              // )}
              onClick={() => onClick(item.name)}
            >
              <div css="tw-flex tw-items-center tw-border-l-2 tw-border-neut-2 tw-pl-3 tw-py-1">
                {item.icon && (
                  <Icon
                    type={darkMode ? 'light' : 'dark'}
                    name={item.icon}
                    size={16}
                  />
                )}
                <div css="tw-ml-2">{item.title}</div>
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
