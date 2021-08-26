import React from 'react'
import { useParams } from 'react-router-dom'
// import { SideMenu } from '@QCFE/qingcloud-portal-ui'
import SideMenu from 'components/SideMenu'
import { useStore } from 'stores'
import RealTime from './RealTime'

function Dm() {
  const { zone, space, mod } = useParams()
  const {
    workSpaceStore: { funcList },
  } = useStore()
  const { subFuncList } = funcList.find(({ name }) => name === 'dm')
  const navMenu = subFuncList.map((func) => ({
    ...func,
    link: `/${zone}/workspace/${space}/dm/${func.name}`,
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
        {curFunc.name === 'realtime' && <RealTime />}
      </div>
    </div>
  )
}

export default Dm
