import { Menu } from '@QCFE/lego-ui'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import { get } from 'lodash-es'
import tw, { css, styled } from 'twin.macro'

import { Center, FlexBox, HelpCenterLink, Tooltip } from 'components'
import { useHistory } from 'react-router-dom'
import { emitter } from 'utils/index'
import { isDarkTheme } from 'utils/theme'

const menuList = [
  {
    label: '账户设置',
    icon: 'if-default-system',
    key: 'account'
  },
  // {
  //   label: 'api 密钥',
  //   icon: 'if-key',
  //   key: 'api',
  // },
  {
    label: '通知列表',
    icon: 'q-listViewFill',
    key: 'notify'
  },
  {
    label: '账户安全',
    icon: 'if-shield',
    key: 'security'
  },
  {
    label: null,
    key: 'divider'
  },
  {
    label: '退出',
    icon: 'q-shutdownFill',
    key: 'logout'
  }
]

// const platformAdminMenuKeys = new Set([''])
const iaasKeys = new Set(['account', 'security', 'notify', 'divider', 'logout'])
const privateKeys = new Set(['account', 'notify', 'divider', 'logout'])

// let isPrivate = (process.env.IS_PRIVATE)

const { MenuItem } = Menu as any
const IconBox = styled(Center)(() => [
  css`
    &:hover {
      .icon {
        .qicon {
          fill: #9ddfc9;
          color: #15a675;
        }
      }
    }
  `,
  tw`cursor-pointer hover:dark:bg-neut-13 hover:bg-neut-1`
])

const IconBoxWithTooltip = styled(Center)(() => [
  css`
    & {
      [aria-expanded='true'] {
        .header-icon-bg-box {
          ${tw`cursor-pointer dark:bg-neut-13 bg-neut-1`}
        }

        .icon {
          .qicon {
            fill: #9ddfc9;
            color: #15a675;
          }
        }
      }
  `
])

const UserInfoWrapper = styled.div(() => [
  css`
    .space-user-icon {
      ${tw`w-10 h-10 rounded-full bg-[#E2E8F0] dark:bg-[#4C5E70]`}
    }

    & {
      [aria-expanded='true'],
      &:hover {
        .space-user-icon {
          ${tw`bg-[#D5DEE7] dark:bg-[#1D2B3A]`}
        }
      }
    }
  `
])
const UserInfo = styled(FlexBox)(({ darkMode }: { darkMode: boolean }) => [
  tw`gap-2 text-font leading-5 pr-10 cursor-pointer`,
  darkMode && tw`text-white!`
])

export const Settings = ({ darkMode }: { darkMode: boolean }) => {
  // const handleOpenHelpCenter = (link: string) => {
  //   const openModal = Modal.open(HelpCenterModal, {
  //     link,
  //     onCancel: () => Modal.close(openModal),
  //   })
  // }

  const isPrivate = get(window, 'CONFIG_ENV.IS_PRIVATE', false)
  const filter = isPrivate ? privateKeys : iaasKeys

  const menus = menuList.filter((item) => filter.has(item.key))
  const handleMenu2Iaas = (key: string) => {
    switch (key) {
      case 'account':
        window.location.href = '/account/profile/basic/'
        break
      case 'notify':
        window.location.href = '/notify/recipient'
        break
      case 'security':
        window.location.href = '/account/security/center/'
        break
      case 'logout':
        emitter.emit('logout')
        break
      default:
        break
    }
  }

  const history = useHistory()
  const handleMenu2Page = (key: string) => {
    switch (key) {
      case 'notify':
        history.push(`/settings/notify`)
        break
      case 'account':
        history.push(`/settings/account`)
        break
      case 'logout':
        emitter.emit('logout')
        break
      default:
        break
    }
  }

  const handleMenu = (_: never, key: string) => {
    if (isPrivate) {
      handleMenu2Page(key)
    } else {
      handleMenu2Iaas(key)
    }
  }

  return (
    <Center>
      <IconBoxWithTooltip tw="mr-3">
        {/* <IconBox size={28} tw="mr-2">
        <Icon
          name="bell"
          size={20}
          type={darkMode ? 'light' : 'dark'}
          changeable
        />
      </IconBox>
      <IconBox size={28} tw="mr-2 ">
        <Icon
          name="cogwheel"
          type={darkMode ? 'light' : 'dark'}
          size={20}
          changeable
        />
      </IconBox> */}
        <Tooltip
          theme={darkMode ? 'light' : 'dark'}
          hasPadding
          content={
            <div css={[darkMode ? tw`text-neut-13` : tw`text-white`]} tw=" leading-5">
              帮助中心
            </div>
          }
        >
          <HelpCenterLink href="/intro/introduction/" tw="flex items-center">
            <IconBox
              className="header-icon-bg-box"
              size={28}
              tw="hover:dark:bg-neut-13 hover:bg-neut-1"
            >
              <Icon
                name="documentation"
                type={darkMode ? 'light' : 'dark'}
                changeable
                size={20}
                tw="cursor-pointer"
              />
            </IconBox>
          </HelpCenterLink>
        </Tooltip>
      </IconBoxWithTooltip>

      <UserInfoWrapper>
        <Tooltip
          theme="auto"
          trigger="click"
          arrow={false}
          content={
            <div
              css={[
                isDarkTheme()
                  ? css`
                      & {
                        border: 1px solid #4c5e70;
                        box-shadow: 0px 1px 6px rgba(50, 69, 88, 0.2);
                      }
                    `
                  : css`
                      & {
                        border: 1px solid #e5e9ee;
                        box-shadow: 0px 1px 6px rgba(50, 69, 88, 0.2);
                      }
                    `
              ]}
            >
              <Menu onClick={handleMenu}>
                {menus.map((item) => {
                  if (item.key === 'divider') {
                    return <li key="divider" tw="h-[1px] my-1 bg-separator pointer-events-none" />
                  }
                  return (
                    <MenuItem key={item.key}>
                      <>
                        <Icon name={item.icon} type={isDarkTheme() ? 'light' : 'dark'} />
                        {item.label}
                      </>
                    </MenuItem>
                  )
                })}
              </Menu>
            </div>
          }
        >
          <UserInfo darkMode={darkMode}>
            <Center className="space-user-icon">
              <Icon name="q-idCardDuotone" theme={darkMode ? 'dark' : 'light'} size={20} />
            </Center>
            <div>
              <div>租户管理员</div>
              <div>{get(window, isPrivate ? 'USER.name' : 'USER.user_name', '')}</div>
            </div>
          </UserInfo>
        </Tooltip>
      </UserInfoWrapper>
    </Center>
  )
}

export default Settings
