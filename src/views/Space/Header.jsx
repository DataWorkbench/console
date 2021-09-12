import React from 'react'
import { Link, useParams, useLocation, useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react-lite'
import { Tooltip, Menu } from '@QCFE/lego-ui'
import { Icon, Select } from '@QCFE/qingcloud-portal-ui'
import tw, { css, theme } from 'twin.macro'
import { get } from 'lodash-es'
import { getShortSpaceName } from 'utils/convert'
import { useMount } from 'react-use'
import { useStore } from 'stores'

const menuStyle = [
  tw`bg-neut-17 text-xs text-white font-semibold`,
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
]

const navStyle = (selected) => [
  tw`inline-block py-3 mr-6 text-sm hover:(dark:text-white)`,
  // after:content-[" "] after:absolute  after:w-3/5 after:h-0.5 after:left-[20%] after:bottom-0.5 after:bg-green-11
  selected && tw`font-semibold relative dark:text-white`,
  css`
    &::after {
      position: absolute;
      content: ' ';
      width: 60%;
      height: 0.125rem;
      left: 20%;
      bottom: 1px;
      background-color: ${theme('colors.green.11')};
    }
  `,
]

function Header({ darkMode }) {
  const { regionId, spaceId } = useParams()
  const { pathname } = useLocation()
  const history = useHistory()
  const {
    globalStore: {
      // user,
      menuInfo: { menus },
    },
    spaceStore,
    spaceStore: { workspaces },
    workSpaceStore: { funcList },
  } = useStore()
  const matched = pathname.match(/workspace\/[^/]*\/([^/]*)/)
  const mod = matched ? matched[1] : 'upcloud'
  const space = workspaces?.find(({ id }) => id === spaceId)
  const workSpaceMenu = menus.find((m) => m.name === 'workspace')
  const otherMenus = menus.filter((m) => m.name !== 'workspace')

  const loadData = () =>
    spaceStore.fetchSpaces({
      regionId,
    })

  useMount(async () => {
    spaceStore.fetchSpaces({
      regionId,
      reload: true,
    })
  })

  const handleMenuClick = (e, k) => history.push(`/${k}`)

  return (
    <div tw="h-14 flex items-center justify-between  shadow-lg bg-white dark:bg-neut-16 dark:text-neut-8">
      <div tw="flex items-center">
        <Tooltip
          trigger="hover"
          tw="px-0"
          content={
            <Menu
              mode="inline"
              css={menuStyle}
              onClick={handleMenuClick}
              width={200}
            >
              <Menu.MenuItem key={workSpaceMenu.name}>
                <Icon name="return" type="light" />
                返回{workSpaceMenu.title}列表
              </Menu.MenuItem>
              <div tw="border-t border-neut-8 my-3" />
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
            </Menu>
          }
        >
          <div tw="flex justify-center h-14 items-center w-14 bg-neut-1 dark:bg-neut-13 cursor-pointer hover:bg-green-11 hover:text-white">
            <Icon
              name="if-ninedot"
              style={{ fontSize: 32 }}
              className="dark:text-white"
            />
          </div>
        </Tooltip>
        <div tw="text-sm w-8 h-8 mx-3 rounded-sm flex justify-center items-center bg-[#cfafe9] text-[#934bc5] font-semibold">
          {getShortSpaceName(space?.name)}
        </div>
        <div className="styles.headerSelectWrapper">
          <Select
            defaultValue={spaceId}
            isLoadingAtBottom
            searchable
            onMenuScrollToBottom={loadData}
            bottomTextVisible
            options={workspaces.map(({ id, name }) => ({
              value: id,
              label: name,
            }))}
            onChange={(v) => history.push(`/${regionId}/workspace/${v}/${mod}`)}
          />
        </div>
      </div>
      <div>
        {funcList.map(({ title, name }) => (
          <Link
            key={name}
            css={navStyle(mod === name)}
            // css={[
            //   mod === name &&
            //     'font-semibold relative after:absolute after:content-[" "] after:w-3/5 after:h-0.5 after:left-[20%] after:bottom-0.5 after:bg-green-11 dark:text-white',
            //   tw`inline-block py-3 mr-6 text-sm hover:(dark:text-white)`,
            // ]}
            to={`/${regionId}/workspace/${spaceId}/${name}`}
          >
            {title}
          </Link>
        ))}
      </div>
      <div tw="flex items-center">
        <Icon
          name="bell"
          size="medium"
          type={darkMode ? 'light' : 'dark'}
          changeable
          tw="mr-2 cursor-pointer"
        />
        <Icon
          name="cogwheel"
          type={darkMode ? 'light' : 'dark'}
          size="medium"
          changeable
          tw="mr-2 cursor-pointer"
        />
        <Icon
          name="documentation"
          type={darkMode ? 'light' : 'dark'}
          size="medium"
          changeable
          tw="mr-2 cursor-pointer"
        />
        <span tw="mr-2 dark:text-white">
          {get(window, 'USER.user_name', '')}
        </span>
        <span tw="mr-6 inline-block bg-neut-2 dark:bg-neut-13 dark:text-white px-2 py-0.5 rounded-2xl">
          项目所有者
        </span>
      </div>
    </div>
  )
}

Header.propTypes = {
  darkMode: PropTypes.bool,
}

export default observer(Header)
