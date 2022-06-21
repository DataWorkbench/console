import tw, { css, styled } from 'twin.macro'
import { observer } from 'mobx-react-lite'
import { useStore } from 'hooks'
import BaseSettingModal from '../Modal/BaseSettingModal'
import ClusterSettingModal from '../Modal/ClusterSettingModal'
import RequestSettingModal from '../Modal/RequestSettingModal'
import ResponseSettingModal from '../Modal/ResponseSettingModal'
import VersionsModal from '../Modal/VersionsModal'

const MenuRoot = styled('div')(() => [
  tw`pt-8 space-y-4 align-middle bg-neut-17 w-10`,
  css`
    writing-mode: vertical-lr;
    span {
      ${tw`cursor-pointer font-semibold text-xs text-neut-5 leading-9 hover:text-white active:text-green-13`}
    }
  `
])

const StreamRightMenu = observer(() => {
  const {
    dtsDevStore,
    dtsDevStore: {
      showBaseSetting,
      showClusterSetting,
      showRequestSetting,
      showResponseSetting,
      showVersions
    }
  } = useStore()
  return (
    <>
      <MenuRoot>
        <span onClick={() => dtsDevStore.set({ showBaseSetting: true })}>属 性</span>
        <span onClick={() => dtsDevStore.set({ showClusterSetting: true })}>服 务 集 群</span>
        <span onClick={() => dtsDevStore.set({ showRequestSetting: true })}>请 求 参 数</span>
        <span onClick={() => dtsDevStore.set({ showResponseSetting: true })}>返 回 参 数</span>
        <span onClick={() => dtsDevStore.set({ showVersions: true })}>历 史 版 本</span>
      </MenuRoot>

      {showBaseSetting && <BaseSettingModal />}
      {showClusterSetting && <ClusterSettingModal />}
      {showRequestSetting && <RequestSettingModal />}
      {showResponseSetting && <ResponseSettingModal />}
      {showVersions && <VersionsModal />}
    </>
  )
})

export default StreamRightMenu
