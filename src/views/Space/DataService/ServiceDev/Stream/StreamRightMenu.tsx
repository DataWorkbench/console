import tw, { css, styled } from 'twin.macro'
import { observer } from 'mobx-react-lite'
import { useStore } from 'hooks'
import { Icon } from '@QCFE/lego-ui'
import { Tooltip } from 'components'
import { useEffect, useState } from 'react'
import BaseSettingModal from '../Modal/BaseSettingModal'
import ClusterSettingModal from '../Modal/ClusterSettingModal'
import RequestSettingModal from '../Modal/RequestSettingModal'
import ResponseSettingModal from '../Modal/ResponseSettingModal'
import VersionsModal from '../Modal/VersionsModal'
import TestModal from '../Modal/TestModal'

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
      showVersions,
      showTestModal,
      showClusterErrorTip
    }
  } = useStore()

  const [showTip, setShowTip] = useState<boolean>(showClusterErrorTip)

  useEffect(() => {
    if (showTip) {
      setTimeout(() => {
        setShowTip(false)
      }, 3000)
    }
  }, [showTip])

  return (
    <>
      <MenuRoot>
        <span onClick={() => dtsDevStore.set({ showBaseSetting: true })}>属 性</span>
        <span
          onClick={() => {
            dtsDevStore.set({ showClusterSetting: true })
            setShowTip(false)
          }}
          onMouseEnter={() => setShowTip(true)}
        >
          服 务 集 群
          {showClusterErrorTip && (
            <Tooltip
              content={
                <div tw="flex items-center">
                  <Icon
                    name="information"
                    tw="mr-2"
                    size={20}
                    color={{ secondary: '#CF3B37', primary: '#fff' }}
                  />
                  <span tw="text-red-10">测试 API 需要指定服务集群</span>
                </div>
              }
              placement="left"
              hasPadding
              theme="light"
              visible={showTip}
            >
              <Icon name="information" tw="mt-2" size={20} color={{ secondary: '#CF3B37' }} />
            </Tooltip>
          )}
        </span>
        <span onClick={() => dtsDevStore.set({ showRequestSetting: true })}>请 求 参 数</span>
        <span onClick={() => dtsDevStore.set({ showResponseSetting: true })}>返 回 参 数</span>
        <span onClick={() => dtsDevStore.set({ showVersions: true })}>历 史 版 本</span>
      </MenuRoot>

      {showBaseSetting && <BaseSettingModal />}
      {showClusterSetting && <ClusterSettingModal />}
      {showRequestSetting && <RequestSettingModal />}
      {showResponseSetting && <ResponseSettingModal />}
      {showVersions && <VersionsModal />}
      {showTestModal && <TestModal />}
    </>
  )
})

export default StreamRightMenu
