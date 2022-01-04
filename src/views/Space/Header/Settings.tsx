import { Icon } from '@QCFE/lego-ui'
import { get } from 'lodash-es'
import tw, { styled, css } from 'twin.macro'

import { Center, Tooltip, HelpCenterLink } from 'components'

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
export const Settings = ({ darkMode }) => {
  // const handleOpenHelpCenter = (link: string) => {
  //   const openModal = Modal.open(HelpCenterModal, {
  //     link,
  //     onCancel: () => Modal.close(openModal),
  //   })
  // }

  return (
    <Center>
      <IconBoxWithTootip>
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
          <HelpCenterLink href="/intro/introduction/">
            <IconBox
              // onClick={
              //   // TODO:  设置文档 url
              //   () => handleOpenHelpCenter('/')
              // }
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
      </IconBoxWithTootip>

      <span tw="ml-5 mr-2 dark:text-white font-semibold">
        {get(window, 'USER.user_name', '')}
      </span>
      <span tw="leading-5 mr-5 inline-block bg-neut-2 dark:bg-neut-13 dark:text-white px-2 py-0.5 rounded-2xl">
        项目所有者
      </span>
    </Center>
  )
}

export default Settings
