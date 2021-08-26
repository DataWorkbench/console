import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import produce from 'immer'
import styles from './tabs.module.css'

export default function Tabs({
  rootClassName,
  panelClassName,
  className,
  activeName,
  more,
  tabClick,
  children,
}) {
  const [curPanelName, setCurPanelName] = useState(activeName)
  const [panelNames, setPanelNames] = useState(() => {
    if (activeName) {
      return [activeName]
    }
    return []
  })

  const activeCurTab = useCallback((name) => {
    setCurPanelName(name)
    setPanelNames((prevNames) =>
      produce(prevNames, (draft) => {
        if (!draft.includes(name)) {
          draft.push(name)
        }
      })
    )
  }, [])

  useEffect(() => {
    if (activeName) {
      activeCurTab(activeName)
    }
  }, [activeName, activeCurTab])

  const handleTabClick = (name) => {
    activeCurTab(name, panelNames)
    tabClick(name)
  }

  return (
    <div className={rootClassName}>
      <div
        className={clsx(
          'tw-border-neut-3 tw-border-b tw-flex tw-pl-5 tw-align-middle',
          styles.tabs,
          className
        )}
      >
        <div className="tw-flex tw-border-r tw-border-neut-3">
          {React.Children.map(children, (child) => {
            const { label, name } = child.props
            return (
              <div
                className={clsx(
                  'tw-border-l tw-px-5 tw-border-neut-3 tw-text-center tw-py-3 tw-cursor-pointer',
                  curPanelName === name
                    ? 'tw-font-medium tw-text-green-11 tw-bg-white tw--mb-px !tw-border-t-green-11 tw-border-t-[3px]'
                    : 'tw-border-t'
                )}
                onClick={() => {
                  handleTabClick(name)
                }}
              >
                <span
                  className={clsx(
                    curPanelName === name &&
                      'tw-inline-block tw-transform tw--translate-y-0.5'
                  )}
                >
                  {label}
                </span>
              </div>
            )
          })}
        </div>
        <div className="tw-flex tw-items-center">{more}</div>
      </div>
      {React.Children.map(children, (child) => {
        const chidName = child.props.name
        return (
          <div
            className={clsx(panelClassName, {
              'tw-hidden': curPanelName !== chidName,
            })}
          >
            {panelNames.includes(chidName) && child}
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
  activeName: PropTypes.string,
  tabClick: PropTypes.func,
  more: PropTypes.node,
}

Tabs.defaultProps = {
  activeName: '',
  tabClick: () => {},
}
