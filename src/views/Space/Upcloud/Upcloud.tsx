import { useParams } from 'react-router-dom'
import SideMenu from 'components/SideMenu'
import { useStore } from 'stores'
import { ContentBox } from 'components'
import DataSourceList from './DataSourceList/DataSourceList'

const Upcloud = () => {
  const { regionId, spaceId, mod } =
    useParams<{ regionId: string; spaceId: string; mod: string }>()
  const {
    workSpaceStore: { funcList },
  } = useStore()
  const { subFuncList } = funcList.find(({ name }) => name === 'upcloud')
  const navMenu = subFuncList.map((func) => ({
    ...func,
    link: `/${regionId}/workspace/${spaceId}/upcloud/${func.name}`,
  }))

  const curFunc =
    subFuncList.find((func) => func.name === mod) || subFuncList[0]

  return (
    <>
      <SideMenu menus={navMenu} defaultSelectedMenu={curFunc.name} />
      <ContentBox tw="flex-1 overflow-y-auto ">
        <ContentBox tw="m-5">
          {curFunc.name === 'dsl' && <DataSourceList />}
        </ContentBox>
      </ContentBox>
    </>
  )
}

export default Upcloud
