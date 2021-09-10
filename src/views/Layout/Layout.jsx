import React from 'react'
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

const MainLayout = ({ children }) => {
  const {
    globalStore: {
      menuInfo: { title, menus, relationMenus },
    },
  } = useStore()

  const match = useRouteMatch(flattenDeep(getLinks(menus)))
  return (
    <div tw="bg-neut-2 flex flex-col h-screen">
      <GlobalNav />
      <div tw="flex flex-1 overflow-y-auto">
        {match && (
          <SideMenu title={title} menus={menus} relationMenus={relationMenus} />
        )}
        <div tw="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
MainLayout.propTypes = {
  children: PropTypes.object,
}

export default observer(MainLayout)
