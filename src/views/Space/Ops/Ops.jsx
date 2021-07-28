import React from 'react'
import { useParams } from 'react-router-dom'
import SideMenu from 'components/SideMenu'
import { useStore } from 'stores'
import OverView from './OverView'

function Ops() {
  const { zone, space, mod } = useParams()
  const {
    workspaceStore: { funcList },
  } = useStore()
  const { subFuncList } = funcList.find(({ name }) => name === 'ops')
  const navMenu = subFuncList.map((func) => ({
    ...func,
    link: `/${zone}/workspace/${space}/ops/${func.name}`,
  }))

  const curFunc =
    subFuncList.find((func) => func.name === mod) || subFuncList[0]

  const store = useStore()
  const {
    globalStore: { darkMode },
  } = store
  return (
    <div className="tw-flex-1 tw-flex tw-h-full">
      <SideMenu
        menus={navMenu}
        darkMode={darkMode}
        defaultSelectedMenu={curFunc.name}
      />
      <div className="tw-flex-1 tw-overflow-y-auto">
        {curFunc.name === 'overview' && <OverView />}
      </div>
    </div>
  )
}

export default Ops
