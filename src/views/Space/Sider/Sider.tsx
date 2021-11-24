import { useParams } from 'react-router-dom'
import tw, { css, styled } from 'twin.macro'
import { useStore } from 'stores'
import { SideMenu } from '@QCFE/qingcloud-portal-ui'

const SideMenuWrapper = styled('div')(() => [
  tw`relative`,
  css`
    .side-menu-wrap {
      .side-menu {
        height: calc(100vh - 60px);
        ${tw`border-r border-neut-3 bg-neut-2 dark:(bg-neut-17 border-neut-15) shadow-none`}
        .side-title {
          display: none;
        }
        .side-content {
          ${tw`px-2`}
        }
        .level-row {
          ${tw`pl-0 text-xs h-10 font-semibold text-neut-15 dark:(text-white)`}
          .icon-title {
            ${tw`pl-4 border-l-2 border-neut-2 dark:(border-neut-17)`}
          }
        }
        .level-expand {
          .icon-title {
            ${tw`border-0`}
          }
          .level-row {
            ${tw`border-0`}
          }
        }
        .selected-row {
          ${tw`bg-neut-16 dark:(bg-neut-13) rounded-sm border-l-0`}
          .icon-title {
            ${tw`text-white border-green-11!`}
            svg.qicon {
              color: #fff;
              fill: rgba(255, 255, 255, 0.4);
            }
          }
        }
      }
      .side-menu-pickup {
        box-shadow: none;
        ${tw`border-r border-neut-3 bg-neut-2 dark:(bg-neut-17 border-neut-15) shadow-none`}
        .side-title,
        .divider-horizon {
          display: none;
        }
        .side-content {
          ${tw`px-2`}
          .icon-li {
            ${tw`px-0 border-0 flex items-center h-10 `}
            span.icon {
              ${tw`border-l-2 border-neut-2 dark:(border-neut-17) pl-2 box-content`}
              svg {
                color: #fff;
                fill: rgba(255, 255, 255, 0.4);
              }
            }
            &.selected {
              ${tw`bg-neut-2 dark:(bg-neut-13) rounded-sm`}
              span.icon {
                ${tw`border-l-2 border-green-11`}
              }
            }
          }
        }
      }
      .side-menu-footer {
        ${tw`border-t border-r bg-neut-2 dark:(bg-neut-17 border-neut-15) border-neut-3`}
      }
    }
  `,
])

export const Sider = ({ funcMod }: { funcMod: string }) => {
  const { regionId, spaceId, mod } =
    useParams<{ regionId: string; spaceId: string; mod: string }>()
  const {
    globalStore: { darkMode },
    workSpaceStore: { funcList },
  } = useStore()

  const func = funcList.find(({ name }) => name === funcMod)
  if (!func) {
    return <div>empty</div>
  }
  const curFunc =
    func.subFuncList.find((fn: any) => fn.name === mod) || func.subFuncList[0]

  const navMenu = func?.subFuncList.map((fn: any) => {
    let items = []

    if (fn.items) {
      items = fn.items.map((subFn: any) => ({
        ...subFn,
        link: `/${regionId}/workspace/${spaceId}/${funcMod}/${subFn.name}`,
      }))
      return {
        ...fn,
        items,
      }
    }
    return {
      ...fn,
      link: `/${regionId}/workspace/${spaceId}/${funcMod}/${fn.name}`,
    }
  })

  return (
    <SideMenuWrapper>
      <SideMenu
        darkMode={darkMode}
        menus={navMenu}
        defaultSelectedMenu={curFunc.name}
      />
    </SideMenuWrapper>
  )
}

export default Sider
