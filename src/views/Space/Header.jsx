import React from 'react'
import { Link, useParams, useLocation, useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react-lite'
import { Tooltip, Menu } from '@QCFE/lego-ui'
import { Icon, Select } from '@QCFE/qingcloud-portal-ui'
import tw from 'twin.macro'
import { get } from 'lodash'
import { getShortSpaceName } from 'utils/convert'
import { useMount } from 'react-use'
import { useStore } from 'stores'
import styles from './styles.module.css'

// const { MenuItem, SubMenu } = Menu

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
    <div tw="tw-h-14 tw-flex tw-items-center tw-justify-between  tw-shadow-lg tw-bg-white dark:tw-bg-neut-16 dark:tw-text-neut-8">
      <div tw="tw-flex tw-items-center">
        <Tooltip
          trigger="hover"
          tw="tw-px-0"
          always
          content={
            <Menu
              mode="inline"
              tw="tw-bg-neut-17 tw-text-xs tw-font-semibold"
              onClick={handleMenuClick}
              width={200}
            >
              <Menu.MenuItem
                key={workSpaceMenu.name}
                // onClick={(e, k) => console.log(k)}
                // tw="tw-text-white hover:tw-bg-neut-16 hover:tw-text-white"
                // className="tw-text-white hover:tw-bg-neut-16 hover:tw-text-white"
              >
                <Icon name="return" type="light" />
                返回{workSpaceMenu.title}列表
              </Menu.MenuItem>
              <div className="tw-border-t tw-border-neut-8 tw-my-3" />
              {otherMenus.map((menu) => {
                if (menu.items) {
                  return (
                    <Menu.SubMenu
                      title={
                        <div className="tw-flex tw-items-center">
                          <Icon name={menu.icon} type="light" />
                          {menu.title}
                        </div>
                      }
                      key={menu.name}
                      className={styles.headerSubMenu}
                    >
                      {menu.items.map(({ name, icon, title }) => (
                        <Menu.MenuItem
                          key={name}
                          // className="tw-text-white hover:tw-bg-neut-16 hover:tw-text-white"
                        >
                          <Icon name={icon} type="light" />
                          {title}
                        </Menu.MenuItem>
                      ))}
                    </Menu.SubMenu>
                  )
                }
                return (
                  <Menu.MenuItem
                    // className="tw-text-white hover:tw-bg-neut-16 hover:tw-text-white"
                    key={menu.name}
                  >
                    <Icon name={menu.icon} />
                    {menu.title}
                  </Menu.MenuItem>
                )
              })}
            </Menu>
          }
        >
          <div tw="tw-flex tw-justify-center tw-h-14 tw-items-center tw-w-14 tw-bg-neut-1 dark:tw-bg-neut-13 tw-cursor-pointer hover:tw-bg-green-11 hover:tw-text-white">
            <Icon
              name="if-ninedot"
              style={{ fontSize: 32 }}
              className="dark:tw-text-white"
            />
          </div>
        </Tooltip>
        <div tw="tw-text-sm tw-w-8 tw-h-8 tw-mx-3 tw-bg-neut-3 tw-rounded-sm tw-flex tw-justify-center tw-items-center tw-bg-[#cfafe9] tw-text-[#934bc5] tw-font-semibold">
          {getShortSpaceName(space?.name)}
        </div>
        <div className={styles.headerSelectWrapper}>
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
            css={[
              mod === name &&
                'tw-font-semibold tw-relative after:tw-absolute after:tw-content-[" "] after:tw-w-3/5 after:tw-h-0.5 after:tw-left-[20%] after:tw-bottom-0.5 after:tw-bg-green-11 dark:tw-text-white',
              tw`tw-inline-block tw-py-3 tw-mr-6 tw-text-sm hover:(dark:tw-text-white)`,
            ]}
            to={`/${regionId}/workspace/${spaceId}/${name}`}
          >
            {title}
          </Link>
        ))}
      </div>
      <div tw="tw-flex tw-items-center">
        <Icon
          name="bell"
          size="medium"
          type={darkMode ? 'light' : 'dark'}
          changeable
          tw="tw-mr-2 tw-cursor-pointer"
        />
        <Icon
          name="cogwheel"
          type={darkMode ? 'light' : 'dark'}
          size="medium"
          changeable
          tw="tw-mr-2 tw-cursor-pointer"
        />
        <Icon
          name="documentation"
          type={darkMode ? 'light' : 'dark'}
          size="medium"
          changeable
          tw="tw-mr-2 tw-cursor-pointer"
        />
        <span tw="tw-mr-2 dark:tw-text-white">
          {get(window, 'USER.user_name', '')}
        </span>
        <span tw="tw-mr-6 tw-inline-block tw-bg-neut-2 dark:tw-bg-neut-13 dark:tw-text-white tw-px-2 tw-py-0.5 tw-rounded-2xl">
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
