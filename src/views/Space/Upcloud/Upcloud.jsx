import React from 'react'
import { useParams } from 'react-router-dom'
// import { SideMenu } from '@QCFE/qingcloud-portal-ui'
import SideMenu from 'components/SideMenu'
import { useStore } from 'stores'
import DataSourceList from './DataSourceList/DataSourceList'

function Upcloud() {
  const { zone, space, mod } = useParams()
  const {
    workspaceStore: { funcList },
  } = useStore()
  const { subFuncList } = funcList.find(({ name }) => name === 'upcloud')
  const navMenu = subFuncList.map((func) => ({
    ...func,
    link: `/${zone}/workspace/${space}/upcloud/${func.name}`,
  }))

  const curFunc =
    subFuncList.find((func) => func.name === mod) || subFuncList[0]

  return (
    <>
      <SideMenu menus={navMenu} defaultSelectedMenu={curFunc.name} />
      <div className="tw-flex-1 tw-flex tw-items-stretch tw-overflow-auto">
        {curFunc.name === 'dsl' && <DataSourceList />}
      </div>
    </>
  )
}

export default Upcloud
