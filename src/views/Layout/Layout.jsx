import React from 'react'
import { renderRoutes } from 'react-router-config'
import { useRouteMatch } from 'react-router-dom'
import PropTypes from 'prop-types'
import { GlobalNav, SideMenu } from '@QCFE/qingcloud-portal-ui'
import { observer } from 'mobx-react'
import { useStore } from 'stores'

const MainLayout = ({ route }) => {
  const store = useStore()
  const {
    sideMenuStore: { title, menus, relationMenus, menuLinks },
  } = store

  const match = useRouteMatch(menuLinks)
  return (
    <div className="flex flex-col bg-neutral-N2 min-h-screen">
      <nav>
        <GlobalNav />
      </nav>
      <div className="flex-1 flex">
        {match && (
          <SideMenu title={title} menus={menus} relationMenus={relationMenus} />
        )}
        <div className="flex-1">{renderRoutes(route.routes)}</div>
      </div>
    </div>
  )
}
MainLayout.propTypes = {
  route: PropTypes.object.isRequired,
}

export default observer(MainLayout)
