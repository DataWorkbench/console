import React from 'react'
import { renderRoutes } from 'react-router-config'
import { useRouteMatch } from 'react-router-dom'
import PropTypes from 'prop-types'
import { flattenDeep } from 'lodash'
import { GlobalNav, SideMenu } from '@QCFE/qingcloud-portal-ui'
import { observer } from 'mobx-react-lite'
import { useStore } from 'stores'

const getLinks = (items) => {
  return items.map((item) => {
    return item.items ? getLinks(item.items) : `/${item.name}`
  })
}

const MainLayout = ({ route }) => {
  const {
    globalStore: {
      menuInfo: { title, menus, relationMenus },
    },
  } = useStore()

  const match = useRouteMatch(flattenDeep(getLinks(menus)))
  return (
    <div className="tw-bg-neut-2 tw-flex tw-flex-col tw-h-screen">
      <GlobalNav />
      <div className="tw-flex tw-flex-1 tw-overflow-y-auto">
        {match && (
          <SideMenu title={title} menus={menus} relationMenus={relationMenus} />
        )}
        <div className="tw-flex-1 tw-overflow-y-auto">
          {renderRoutes(route.routes)}
        </div>
      </div>
    </div>
  )
}
MainLayout.propTypes = {
  route: PropTypes.object.isRequired,
}

export default observer(MainLayout)
