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
          'border-neutral-N3 border-b flex pl-5 align-middle',
          styles.tabs,
          className
        )}
      >
        <div className={`flex border-r border-neutral-N3  ${styles.wrap}`}>
          {React.Children.map(children, (child, i) => {
            const { label } = child.props
            return (
              <div
                className={clsx(
                  'border-l px-5 border-neutral-N3  py-3 cursor-pointer',
                  activeIndex === i ? styles.is_active : 'border-t'
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
        <div className="flex items-center">{more}</div>
      </div>
      {React.Children.map(children, (child, i) => {
        return (
          <div
            className={clsx({
              hidden: activeIndex !== i,
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
