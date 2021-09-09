import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import produce from 'immer'
import tw from 'twin.macro'
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
        className={className}
        css={[
          tw`tw-border-neut-3 tw-border-b tw-flex tw-pl-5 tw-align-middle`,
          styles.tabs,
        ]}
      >
        <div tw="tw-flex tw-border-r tw-border-neut-3">
          {React.Children.map(children, (child) => {
            const { label, name } = child.props
            return (
              <div
                css={[
                  tw`tw-border-l tw-px-5 tw-border-neut-3 tw-text-center tw-py-3 tw-cursor-pointer`,
                  curPanelName === name
                    ? tw`tw-font-medium tw-text-green-11 tw-bg-white tw--mb-px tw-border-t-[3px] (tw-border-t-green-11)!`
                    : tw`tw-border-t`,
                ]}
                onClick={() => {
                  handleTabClick(name)
                }}
              >
                <span
                  css={[
                    curPanelName === name &&
                      tw`tw-inline-block tw-transform tw--translate-y-0.5`,
                  ]}
                >
                  {label}
                </span>
              </div>
            )
          })}
        </div>
        <div tw="tw-flex tw-items-center">{more}</div>
      </div>
      {React.Children.map(children, (child) => {
        const chidName = child.props.name
        return (
          <div
            css={[panelClassName, curPanelName !== chidName && tw`tw-hidden`]}
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
