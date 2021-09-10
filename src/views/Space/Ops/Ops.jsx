import React from 'react'
import { useParams } from 'react-router-dom'
import SideMenu from 'components/SideMenu'
import { useStore } from 'stores'
import OverView from './OverView'

function Ops() {
  const { regionId, spaceId, mod } = useParams()
  const {
    workSpaceStore: { funcList },
  } = useStore()
  const { subFuncList } = funcList.find(({ name }) => name === 'ops')
  const navMenu = subFuncList.map((func) => ({
    ...func,
    link: `/${regionId}/workspace/${spaceId}/ops/${func.name}`,
  }))

  const curFunc =
    subFuncList.find((func) => func.name === mod) || subFuncList[0]

  const store = useStore()
  const {
    globalStore: { darkMode },
  } = store
  return (
    <div tw="flex-1 flex h-full">
      <SideMenu
        menus={navMenu}
        darkMode={darkMode}
        defaultSelectedMenu={curFunc.name}
      />
      <div tw="flex-1 overflow-y-auto">
        {curFunc.name === 'overview' && <OverView />}
      </div>
    </div>
  )
}

export default Ops
