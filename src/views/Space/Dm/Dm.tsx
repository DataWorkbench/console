import React from 'react'
import { useParams } from 'react-router-dom'
// import { SideMenu } from '@QCFE/qingcloud-portal-ui'
import SideMenu from 'components/SideMenu'
import { useStore } from 'stores'
import RealTime from './RealTime'
import Resource from './Resource'

function Dm() {
  const { regionId, spaceId, mod } = useParams()
  const {
    workSpaceStore: { funcList },
  } = useStore()
  const { subFuncList } = funcList.find(({ name }) => name === 'dm')
  const navMenu = subFuncList.map((func) => ({
    ...func,
    link: `/${regionId}/workspace/${spaceId}/dm/${func.name}`,
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
        {curFunc.name === 'realtime' && <RealTime />}
        {curFunc.name === 'resource' && <Resource />}
      </div>
    </div>
  )
}

export default Dm
