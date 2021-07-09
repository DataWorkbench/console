import React from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
// import { SideMenu } from '@QCFE/qingcloud-portal-ui'
import SideMenu from 'components/SideMenu'
import { useStore } from 'stores'

const propTypes = {
  route: PropTypes.object.isRequired,
}

const navMenus = [
  {
    name: 'realtime_computing',
    title: '实时计算',
    icon: 'cogwheel',
  },
  {
    name: 'resource_manage',
    title: '资源管理',
    icon: 'resource',
    link: '/security',
  },
  {
    name: 'func_manage',
    title: '函数管理',
    icon: 'textarea',
  },
  {
    name: 'taskrun_history',
    title: '任务运行历史',
    icon: 'paper',
  },
]
function Dm({ route }) {
  const store = useStore()
  const {
    globalStore: { darkMode },
  } = store
  const { space } = useParams()
  const menus = navMenus.map((menu) => ({
    ...menu,
    link: `/workspace/${space}/dm/${menu.name}`,
  }))
  return (
    <div className="tw-flex tw-h-full">
      <SideMenu title="" menus={menus} darkMode={darkMode} />
      <div className="tw-flex-1"> {renderRoutes(route.routes)}</div>
    </div>
  )
}

Dm.propTypes = propTypes

export default Dm
