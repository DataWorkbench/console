import { useParams, useLocation, useHistory } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { getShortSpaceName } from 'utils/convert'
import { useMount } from 'react-use'
import { useStore } from 'stores'
import { Center } from 'components'
import { Settings } from './Settings'
import { Navs } from './Navs'
import { BackMenu } from './BackMenu'
import { Root, SelectWrapper } from './styled'

export const Header = observer(() => {
  const { regionId, spaceId } =
    useParams<{ regionId: string; spaceId: string }>()
  const { pathname } = useLocation()
  const history = useHistory()
  const {
    spaceStore,
    spaceStore: { workspaces },
    globalStore: { darkMode },
  } = useStore()
  const matched = pathname.match(/workspace\/[^/]*\/([^/]*)/)
  const mod = matched ? matched[1] : 'upcloud'
  const space = workspaces?.find(({ id }) => id === spaceId)

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

  return (
    <Root>
      <Center tw="space-x-3">
        <BackMenu />
        <Center
          size={32}
          tw="text-sm rounded-sm bg-[#cfafe9] text-[#934bc5] font-semibold"
        >
          {getShortSpaceName(space?.name)}
        </Center>
        <SelectWrapper
          darkMode={darkMode}
          defaultValue={spaceId}
          isLoadingAtBottom
          searchable={false}
          onMenuScrollToBottom={loadData}
          bottomTextVisible={false}
          options={workspaces.map(({ id, name }) => ({
            value: id,
            label: name,
          }))}
          onChange={(v) => history.push(`/${regionId}/workspace/${v}/${mod}`)}
        />
      </Center>
      <Navs mod={mod} />
      <Settings darkMode={darkMode} />
    </Root>
  )
})

export default Header
