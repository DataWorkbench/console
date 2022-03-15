import tw, { css, styled } from 'twin.macro'
import { observer } from 'mobx-react-lite'
import { useStore } from 'hooks'
import ScheSettingModal from './ScheSettingModal'
import ScheArgsModal from './ScheArgsModal'

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
    workFlowStore: { showScheSetting, showArgsSetting },
  } = useStore()
  return (
    <>
      <MenuRoot>
        {/* <span tw="cursor-not-allowed! hover:text-neut-5!">操 作 记 录</span> */}
        <span onClick={() => workFlowStore.set({ showArgsSetting: true })}>
          运 行 参 数
        </span>
        <span onClick={() => workFlowStore.set({ showScheSetting: true })}>
          调 度 设 置
        </span>
        {/* <span tw="cursor-not-allowed! hover:text-neut-5!">历 史 版 本</span> */}
      </MenuRoot>
      {showScheSetting && (
        <ScheSettingModal
          onCancel={() => {
            workFlowStore.set({ showScheSetting: false })
          }}
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
    </>
  )
})

export default StreamRightMenu
