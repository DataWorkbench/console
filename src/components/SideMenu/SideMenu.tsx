import { useState } from 'react'
import { useToggle } from 'react-use'
import tw from 'twin.macro'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import { motion } from 'framer-motion'
import MenuItem from './MenuItem'

interface SideMenuProps {
  title?: string
  menus?: any[]
  darkMode?: boolean
  onClick?: (name: string) => void
  defaultSelectedMenu?: string
}

export const SideMenu = ({
  title = '',
  menus = [],
  onClick = () => {},
  darkMode = false,
  defaultSelectedMenu = '',
}: SideMenuProps) => {
  const [narrowMode, toggleNarrowMode] = useToggle(false)
  const [curSelectedMenu, setCurSelectedMenu] = useState(defaultSelectedMenu)
  const handleMenuClick = (menuName: string) => {
    setCurSelectedMenu(menuName)
    onClick(menuName)
  }

  return (
    <motion.div
      animate={{ width: narrowMode ? 56 : 224 }}
      transition={{ ease: 'easeOut', duration: 0.3 }}
      initial={false}
      css={[tw`relative`, narrowMode && tw`text-center`]}
    >
      <div
        tw="
          overflow-auto pt-5 absolute inset-0 flex flex-col shadow-md border-r border-neut-3  dark:border-neut-13"
      >
        {title && (
          <div
            css={[
              tw`pb-4 font-medium text-lg text-neut-15 dark:text-white`,
              narrowMode ? '' : tw`pl-5`,
            ]}
          >
            {narrowMode ? (
              <Icon
                name="if-menu"
                type={darkMode ? 'light' : 'dark'}
                className="text-xl"
              />
            ) : (
              title
            )}
          </div>
        )}
        <div tw="flex-1 text-sm">
          {menus.map(({ title: t, name, icon, isSubTitle, link, items }) => {
            if (narrowMode) {
              return (
                <div tw="py-2" key={name}>
                  {isSubTitle && <div tw="border-b border-neut-3 mx-4" />}
                  {icon && (
                    <Icon
                      type={darkMode ? 'light' : 'dark'}
                      name={icon}
                      tw="text-xl"
                    />
                  )}
                </div>
              )
            }
            return (
              <MenuItem
                title={t}
                name={name}
                key={name}
                icon={icon}
                isSubTitle={isSubTitle}
                link={link}
                curSelectedMenu={curSelectedMenu}
                items={items}
                darkMode={darkMode}
                onClick={handleMenuClick}
              />
            )
          })}
        </div>
        <div tw="flex h-10 items-center bg-neut-2 border-t border-neut-3 hover:bg-neut-1 pl-5 dark:bg-neut-17 dark:border-neut-13">
          <Icon
            name={narrowMode ? 'expand' : 'collapse'}
            size={20}
            clickable
            type={darkMode ? 'light' : 'dark'}
            onClick={toggleNarrowMode}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default SideMenu
