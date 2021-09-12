import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import produce from 'immer'
import tw from 'twin.macro'

interface TabsProps {
  rootClassName?: string
  panelClassName?: string
  className?: string
  activeName: string
  more?: React.ReactElement
  tabClick?: any
  children?: any
}

export default function Tabs({
  rootClassName,
  panelClassName,
  className,
  activeName,
  more,
  tabClick,
  children,
}: TabsProps) {
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
    activeCurTab(name)
    tabClick(name)
  }

  return (
    <div className={rootClassName}>
      <div
        className={className}
        css={[tw`border-neut-3 border-b flex pl-5 align-middle`]}
      >
        <div tw="flex border-r border-neut-3">
          {React.Children.map(children, (child: any) => {
            const { label, name } = child.props
            return (
              <div
                css={[
                  tw`border-l px-5 border-neut-3 text-center py-3 cursor-pointer`,
                  curPanelName === name
                    ? tw`font-medium text-green-11 bg-white -mb-px border-t-[3px] (border-t-green-11)!`
                    : tw`border-t`,
                ]}
                onClick={() => {
                  handleTabClick(name)
                }}
              >
                <span
                  css={[
                    curPanelName === name &&
                      tw`inline-block transform -translate-y-0.5`,
                  ]}
                >
                  {label}
                </span>
              </div>
            )
          })}
        </div>
        <div tw="flex items-center">{more}</div>
      </div>
      {React.Children.map(children, (child: any) => {
        const chidName = child.props.name
        return (
          <div css={[panelClassName, curPanelName !== chidName && tw`hidden`]}>
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
