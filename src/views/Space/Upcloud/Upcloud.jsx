import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { SideMenu } from '@QCFE/qingcloud-portal-ui'
import DataSourceList from './DataSourceList'
import styles from '../styles.module.css'

const propTypes = {}

function Upcloud() {
  const { space, mod } = useParams()

  const navMenu = useMemo(() => {
    return [
      {
        name: 'datasource_list',
        title: '数据源列表',
        icon: 'blockchain',
        link: `/workspace/${space}/upcloud/datasource_list`,
      },
      {
        name: 'network_tool',
        title: '网络连通工具',
        icon: 'earth',
        link: `/workspace/${space}/upcloud/network_tool`,
      },
      {
        name: 'migration',
        title: '整库迁移',
        icon: 'loadbalancer-policies',
        link: `/workspace/${space}/upcloud/migration`,
      },
    ]
  }, [space])

  const tabName = navMenu.map((nav) => nav.name).includes(mod)
    ? mod
    : 'datasource_list'
  return (
    <div className="tw-flex">
      <div className={styles.sideMenu}>
        <SideMenu menus={navMenu} defaultSelectedMenu={tabName} />
      </div>
      <div className="tw-flex-1">
        {tabName === 'datasource_list' && <DataSourceList />}
      </div>
    </div>
  )
}

Upcloud.propTypes = propTypes

export default Upcloud
