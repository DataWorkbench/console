import { useRouteMatch } from 'react-router-dom'
import { flattenDeep, get } from 'lodash-es'
import { GlobalNav, SideMenu } from '@QCFE/qingcloud-portal-ui'
import { observer } from 'mobx-react-lite'
import { FlexBox, ContentBox } from 'components'
import { useStore } from 'stores'
import { MenuType } from 'stores/GlobalStore'
import { EnFiHeader } from 'views/Space/Header/EnFiHeader'
import EnfiLayout from './EnfiLayout'

const getLinks = (items: MenuType[]): any =>
  items.map((item) => (item.items ? getLinks(item.items) : `/${item.name}`))

const MainLayout = observer(({ children }) => {
  const isPrivate = get(window, 'CONFIG_ENV.IS_PRIVATE', false)
  const {
    globalStore: {
      menuInfo: { title, menus, relationMenus }
    }
  } = useStore()

  const match = useRouteMatch(flattenDeep(getLinks(menus)))
  if (isPrivate) {
    return <EnfiLayout>{children}</EnfiLayout>
  }
  return (
    <FlexBox orient="column" tw="h-screen bg-neut-2">
      {!isPrivate && <GlobalNav zoneNotSwitch />}
      {isPrivate && <EnFiHeader />}
      <FlexBox flex="1" tw="overflow-y-auto">
        {match && <SideMenu title={title} menus={menus} relationMenus={relationMenus} />}
        <ContentBox tw="flex-1 overflow-y-auto">{children}</ContentBox>
      </FlexBox>
    </FlexBox>
  )
})

export default MainLayout
