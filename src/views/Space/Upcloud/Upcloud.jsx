import React from 'react'
import { useParams } from 'react-router-dom'
import { SideMenu } from '@QCFE/qingcloud-portal-ui'
import { useStore } from 'stores'
import DataSourceList from './DataSourceList'
import styles from '../styles.module.css'

function Upcloud() {
  const { space, mod } = useParams()
  const {
    workspaceStore: { funcList },
  } = useStore()
  const { subFuncList } = funcList.find(({ name }) => name === 'upcloud')
  const navMenu = subFuncList.map((func) => ({
    ...func,
    link: `/workspace/${space}/upcloud/${func.name}`,
  }))

  const curFunc =
    subFuncList.find((func) => func.name === mod) || subFuncList[0]

  return (
    <div className="tw-flex">
      <div className={styles.sideMenu}>
        <SideMenu menus={navMenu} defaultSelectedMenu={curFunc.name} />
      </div>
      <div className="tw-flex-1 tw-flex tw-items-stretch">
        {curFunc.name === 'dsl' && <DataSourceList />}
      </div>
    </div>
  )
}

export default Upcloud
