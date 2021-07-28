import React from 'react'
import { useParams } from 'react-router-dom'
// import { SideMenu } from '@QCFE/qingcloud-portal-ui'
import SideMenu from 'components/SideMenu'
import { useStore } from 'stores'
import Setting from './Setting'

function Manage() {
  const { zone, space, mod } = useParams()
  const {
    workspaceStore: { funcList },
  } = useStore()
  const { subFuncList } = funcList.find(({ name }) => name === 'manage')
  const navMenu = subFuncList.map((func) => ({
    ...func,
    link: `/${zone}/workspace/${space}/manage/${func.name}`,
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
        {curFunc.name === 'setting' && <Setting />}
      </div>
    </div>
  )
}

export default Manage
