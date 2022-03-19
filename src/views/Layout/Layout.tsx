import { useRouteMatch } from 'react-router-dom'
import { flattenDeep } from 'lodash-es'
import { SideMenu } from '@QCFE/qingcloud-portal-ui'
import { observer } from 'mobx-react-lite'
import { FlexBox, ContentBox } from 'components'
import { useStore } from 'stores'
import { MenuType } from 'stores/GlobalStore'
import { EnFiHeader } from 'views/Space/Header/EnFiHeader'

const getLinks = (items: MenuType[]): any => {
  return items.map((item) => {
    return item.items ? getLinks(item.items) : `/${item.name}`
  })
}

const MainLayout = observer(({ children }) => {
  const {
    globalStore: {
      menuInfo: { title, menus, relationMenus },
    },
  } = useStore()

  const match = useRouteMatch(flattenDeep(getLinks(menus)))
  return (
    <FlexBox orient="column" tw="h-screen bg-neut-2">
      {/* <GlobalNav zoneNotSwitch /> */}
      <EnFiHeader />
      <FlexBox flex="1" tw="overflow-y-auto">
        {match && (
          <SideMenu title={title} menus={menus} relationMenus={relationMenus} />
        )}
        <ContentBox tw="flex-1 overflow-y-auto">{children}</ContentBox>
      </FlexBox>
    </FlexBox>
  )
})

export default MainLayout
