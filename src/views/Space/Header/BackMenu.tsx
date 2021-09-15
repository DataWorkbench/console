import { useHistory } from 'react-router-dom'
import tw, { css, styled, theme } from 'twin.macro'
import { Tooltip, Menu } from '@QCFE/lego-ui'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import { useStore } from 'stores'
import { Center } from 'components'

interface BackMenuProp {
  darkMode?: boolean
}

const Root = styled('div')(({ darkMode }: BackMenuProp) => [
  darkMode &&
    css`
      .popper {
        padding: 1px;
        background: ${theme('colors.neut.13')};
        .tooltip-arrow {
          border-bottom-color: ${theme('colors.neut.13')};
        }
      }
    `,
])
const MenuWrapper = styled(Menu)(() => [
  tw`bg-neut-17 text-xs text-white font-semibold dark:border dark:border-neut-13`,
  css`
    .menu-inline-submenu-title {
      svg {
        color: rgba(255, 255, 255, 0.9);
        fill: rgba(255, 255, 255, 0.4);
      }
    }
    .menu-item,
    .menu-inline-submenu-title {
      color: ${theme('colors.white')};
      &:hover {
        background-color: ${theme('colors.neut.16')};
      }
    }
  `,
])

export const BackMenu = ({ darkMode }: BackMenuProp) => {
  const history = useHistory()
  const {
    globalStore: {
      menuInfo: { menus },
    },
  } = useStore()
  const workSpaceMenu = menus.find((m) => m.name === 'workspace')
  const otherMenus = menus.filter((m) => m.name !== 'workspace')
  const handleMenuClick = (e, k) => history.push(`/${k}`)
  return (
    <Root darkMode={darkMode}>
      <Tooltip
        trigger="hover"
        tw="px-0 dark:bg-neut-17"
        placement="bottom"
        content={
          <MenuWrapper mode="inline" onClick={handleMenuClick} width={200}>
            <Menu.MenuItem key={workSpaceMenu.name}>
              <Icon name="return" type="light" />
              返回{workSpaceMenu.title}列表
            </Menu.MenuItem>
            <div tw="border-t border-neut-8 dark:border-neut-13 my-3" />
            {otherMenus.map((menu) => {
              if (menu.items) {
                return (
                  <Menu.SubMenu
                    title={
                      <div tw="flex items-center">
                        <Icon name={menu.icon} type="light" />
                        {menu.title}
                      </div>
                    }
                    key={menu.name}
                  >
                    {menu.items.map(({ name, icon, title }) => (
                      <Menu.MenuItem key={name}>
                        <Icon name={icon} type="light" />
                        {title}
                      </Menu.MenuItem>
                    ))}
                  </Menu.SubMenu>
                )
              }
              return (
                <Menu.MenuItem key={menu.name}>
                  <Icon name={menu.icon} />
                  {menu.title}
                </Menu.MenuItem>
              )
            })}
          </MenuWrapper>
        }
      >
        <Center
          size={56}
          tw="bg-neut-1 dark:bg-neut-13 cursor-pointer hover:bg-green-11 hover:text-white"
        >
          <Icon
            name="if-ninedot"
            style={{ fontSize: 32 }}
            tw="dark:text-white"
          />
        </Center>
      </Tooltip>
    </Root>
  )
}

export default BackMenu
