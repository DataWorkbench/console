import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { uniq } from 'lodash'
import styles from './tabs.module.css'

export default function Tabs({
  rootClassName,
  panelClassName,
  className,
  index,
  more,
  tabClick,
  children,
}) {
  const [activeIndex, setActiveIndex] = useState(index)
  const [renderedIdxs, setRenderedIdxs] = useState([index])
  useEffect(() => {
    setActiveIndex(index)
  }, [index])
  return (
    <div className={rootClassName}>
      <div
        className={clsx(
          'tw-border-neutral-N3 tw-border-b tw-flex tw-pl-5 tw-align-middle',
          styles.tabs,
          className
        )}
      >
        <div className="tw-flex tw-border-r tw-border-neutral-N3">
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
                  renderedIdxs.push(i)
                  setRenderedIdxs(uniq(renderedIdxs))
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
            className={clsx(panelClassName, {
              'tw-hidden': activeIndex !== i,
            })}
          >
            {renderedIdxs.includes(i) && child}
          </div>
        )
      })}
    </div>
  )
}

Tabs.propTypes = {
  children: PropTypes.node,
  rootClassName: PropTypes.string,
  panelClassName: PropTypes.string,
  className: PropTypes.string,
  index: PropTypes.number,
  tabClick: PropTypes.func,
  more: PropTypes.node,
}

Tabs.defaultProps = {
  index: 0,
  tabClick: () => {},
}
