import { useParams } from 'react-router-dom'
import { useStore } from 'stores'
import { SideMenu } from 'components'

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

  const navMenu = func?.subFuncList.map((fn: any) => ({
    ...fn,
    link: `/${regionId}/workspace/${spaceId}/${funcMod}/${func.name}`,
  }))

  return (
    <SideMenu
      darkMode={darkMode}
      menus={navMenu}
      defaultSelectedMenu={curFunc.name}
    />
  )
}

export default Sider
