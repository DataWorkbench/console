import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import styles from './tabs.module.css'

export default function Tabs({ className, index, more, tabClick, children }) {
  const [activeIndex, setActiveIndex] = useState(index)
  useEffect(() => {
    setActiveIndex(index)
  }, [index])
  return (
    <div>
      <div
        className={clsx(
          'tw-border-neutral-N3 tw-border-b tw-flex tw-pl-5 tw-align-middle',
          styles.tabs,
          className
        )}
      >
        <div
          className={`tw-flex tw-border-r tw-border-neutral-N3  ${styles.wrap}`}
        >
          {React.Children.map(children, (child, i) => {
            const { label } = child.props
            return (
              <div
                className={clsx(
                  'tw-border-l tw-px-5 tw-border-neutral-N3  tw-py-3 tw-cursor-pointer',
                  activeIndex === i ? styles.is_active : 'tw-border-t'
                )}
                onClick={() => {
                  setActiveIndex(i)
                  tabClick(i)
                }}
              >
                <span>{label}</span>
              </div>
            )
          })}
        </div>
        <div className="tw-flex tw-items-center">{more}</div>
      </div>
      {React.Children.map(children, (child, i) => {
        return (
          <div
            className={clsx({
              'tw-hidden': activeIndex !== i,
            })}
          >
            {child}
          </div>
        )
      })}
    </div>
  )
}

Tabs.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  index: PropTypes.number,
  tabClick: PropTypes.func,
  more: PropTypes.node,
}

Tabs.defaultProps = {
  index: 0,
  tabClick: () => {},
}
