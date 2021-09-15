import { Icon } from '@QCFE/lego-ui'
import { get } from 'lodash-es'
import { Center } from 'components'

export const Settings = ({ darkMode }) => (
  <Center>
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
    <span tw="mr-2 dark:text-white">{get(window, 'USER.user_name', '')}</span>
    <span tw="mr-6 inline-block bg-neut-2 dark:bg-neut-13 dark:text-white px-2 py-0.5 rounded-2xl">
      项目所有者
    </span>
  </Center>
)

export default Settings
