import { Menu } from '@QCFE/lego-ui'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import { get } from 'lodash-es'
import tw, { styled, css } from 'twin.macro'

import { Center, Tooltip, HelpCenterLink, FlexBox } from 'components'

const menuList = [
  {
    label: '账户设置',
    icon: 'if-default-system',
    key: 'account',
  },
  {
    label: 'api 密钥',
    icon: 'if-key',
    key: 'api',
  },
  {
    label: '通知列表',
    icon: 'q-listViewFill',
    key: 'notification',
  },
  {
    label: '账户安全',
    icon: 'if-shield',
    key: 'security',
  },
  {
    label: null,
    key: 'divider',
  },
  {
    label: '退出',
    icon: 'q-shutdownFill',
    key: 'logout',
  },
]

// const platformAdminMenuKeys = new Set([''])

const { MenuItem } = Menu as any
const IconBox = styled(Center)(() => {
  return [
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
    tw`cursor-pointer hover:dark:bg-neut-13 hover:bg-neut-1`,
  ]
})

const IconBoxWithTootip = styled(Center)(() => {
  return [
    css`
      &{
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
    `,
  ]
})

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
  `,
])
const UserInfo = styled(FlexBox)(() => [tw`gap-2 text-font leading-5 pr-10`])

export const Settings = ({ darkMode }: { darkMode: boolean }) => {
  // const handleOpenHelpCenter = (link: string) => {
  //   const openModal = Modal.open(HelpCenterModal, {
  //     link,
  //     onCancel: () => Modal.close(openModal),
  //   })
  // }

  return (
    <Center>
      <IconBoxWithTootip tw="mr-3">
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
            <div tw="text-white dark:text-neut-13 leading-5">帮助中心</div>
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
                size={40}
                tw="cursor-pointer"
              />
            </IconBox>
          </HelpCenterLink>
        </Tooltip>
      </IconBoxWithTootip>

      <UserInfoWrapper>
        <Tooltip
          theme="auto"
          trigger="click"
          content={
            <Menu>
              {menuList.map((item) => {
                if (item.key === 'divider') {
                  return (
                    <li
                      key="divider"
                      tw="h-[1px] my-1 bg-separator pointer-events-none"
                    />
                  )
                }
                return (
                  <MenuItem key={item.key}>
                    <>
                      <Icon
                        name={item.icon}
                        type={darkMode ? 'light' : 'dark'}
                      />
                      {item.label}
                    </>
                  </MenuItem>
                )
              })}
            </Menu>
          }
        >
          <UserInfo>
            <Center className="space-user-icon">
              <Icon
                name="q-idCardDuotone"
                theme={darkMode ? 'dark' : 'light'}
                size={20}
              />
            </Center>
            <div>
              <div>{get(window, 'USER.user_name', '')}</div>
              <div>
                {
                  // TODO 角色
                  '超级管理员'
                }
              </div>
            </div>
          </UserInfo>
        </Tooltip>
      </UserInfoWrapper>
    </Center>
  )
}

export default Settings
