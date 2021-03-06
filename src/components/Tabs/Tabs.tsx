import React, { FC, useState, useEffect, useCallback } from 'react'
import produce from 'immer'
import tw from 'twin.macro'

export interface TabsProps {
  rootClassName?: string
  panelClassName?: string
  className?: string
  activeName: string
  more?: React.ReactElement
  tabClick?: any
  children?: any
}

export const Tabs: FC<TabsProps> = ({
  rootClassName,
  panelClassName,
  className,
  activeName = '',
  more,
  tabClick = () => {},
  children,
}) => {
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
                  tw`border-l -mb-px text-xs px-5 border-neut-3 text-center pb-3 pt-[9px] cursor-pointer`,
                  curPanelName === name
                    ? tw`font-medium text-green-11 bg-white  border-t-[3px] (border-t-green-11)!`
                    : tw`border-t pt-[11px]`,
                ]}
                onClick={() => {
                  handleTabClick(name)
                }}
              >
                <span>{label}</span>
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
