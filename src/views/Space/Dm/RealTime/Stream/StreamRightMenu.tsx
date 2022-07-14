import tw, { css, styled } from 'twin.macro'
import { observer } from 'mobx-react-lite'
import { useStore } from 'hooks'
import { useDataReleaseStore } from 'views/Space/Ops/DataIntegration/DataRelease/store'
import { JobMode } from 'views/Space/Dm/RealTime/Job/JobUtils'
import { useAlertStore } from 'views/Space/Ops/Alert/AlertStore'
import { useParams } from 'react-router-dom'
import ScheSettingModal from '../Modal/ScheSettingModal'
import ScheArgsModal from '../Modal/ScheArgsModal'
import VersionsModal from '../Modal/VersionsModal'

const MenuRoot = styled('div')(() => [
  tw`pt-8 space-y-4 align-middle bg-neut-17 w-10`,
  css`
    writing-mode: vertical-lr;
    span {
      ${tw`cursor-pointer font-semibold text-xs text-neut-5 leading-9 hover:text-white active:text-green-13`}
    }
  `,
])

const StreamRightMenu = observer(() => {
  const {
    workFlowStore,
    workFlowStore: { curJob, showScheSetting, showArgsSetting },
  } = useStore()
  const drStore = useDataReleaseStore()
  const alertStore = useAlertStore()
  const { spaceId, regionId } =
    useParams<{ regionId: string; spaceId: string }>()
  return (
    <>
      <MenuRoot>
        {/* <span tw="cursor-not-allowed! hover:text-neut-5!">操 作 记 录</span> */}
        {curJob?.jobMode === 'RT' && (
          <span onClick={() => workFlowStore.set({ showArgsSetting: true })}>
            运 行 参 数
          </span>
        )}
        <span onClick={() => workFlowStore.set({ showScheSetting: true })}>
          调 度 设 置
        </span>
        <span
          onClick={() =>
            drStore.set({
              showVersion: true,
            })
          }
        >
          历 史 版 本
        </span>
        <span
          onClick={() => {
            alertStore.set({
              showMonitor: true,
              jobDetail: {
                jobId: curJob?.id,
                jobName: curJob?.name,
                spaceId,
                regionId,
                jobType: curJob?.jobMode! === 'RT' ? 1 : 2,
              },
            })
          }}
        >
          告 警 策 略
        </span>
        {/* <span tw="cursor-not-allowed! hover:text-neut-5!">历 史 版 本</span> */}
      </MenuRoot>
      {showScheSetting && (
        <ScheSettingModal
          onCancel={() => {
            workFlowStore.set({ showScheSetting: false })
          }}
          defaultschedulePolicy={
            curJob?.jobMode === JobMode.DI && curJob.type === 2 ? 1 : 2
          }
          visible
        />
      )}
      {showArgsSetting && (
        <ScheArgsModal
          onCancel={() => {
            workFlowStore.set({ showArgsSetting: false })
          }}
        />
      )}
      <VersionsModal jobId={curJob?.id!} type={JobMode[curJob?.jobMode!]} />
    </>
  )
})

export default StreamRightMenu
