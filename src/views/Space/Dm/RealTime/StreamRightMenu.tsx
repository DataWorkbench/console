import { useState, useEffect } from 'react'
import tw, { css, styled } from 'twin.macro'
import ScheSettingModal from './ScheSettingModal'
import ScheArgsModal from './ScheArgsModal'

const MenuRoot = styled('div')(() => [
  tw`pt-3 space-y-4 align-middle bg-neut-17`,
  css`
    writing-mode: vertical-lr;
    span {
      ${tw`cursor-pointer font-semibold text-xs text-neut-5 leading-9 hover:text-white active:text-green-13`}
    }
  `,
])

const StreamRightMenu = ({
  showScheSetting = false,
  onScheSettingClose = () => {},
}: {
  showScheSetting?: boolean
  onScheSettingClose?: () => void
}) => {
  const [showSetting, setShowSetting] = useState(false)
  const [showArgs, setShowArgs] = useState(false)
  useEffect(() => {
    if (showScheSetting) {
      setShowSetting(true)
    }
  }, [showScheSetting, setShowSetting])
  return (
    <>
      <MenuRoot>
        {/* <span tw="cursor-not-allowed! hover:text-neut-5!">操 作 记 录</span> */}
        <span onClick={() => setShowArgs(true)}>运 行 参 数</span>
        <span onClick={() => setShowSetting(true)}>调 度 设 置</span>
        {/* <span tw="cursor-not-allowed! hover:text-neut-5!">历 史 版 本</span> */}
      </MenuRoot>
      {showSetting && (
        <ScheSettingModal
          onCancel={() => {
            setShowSetting(false)
            onScheSettingClose()
          }}
          visible
        />
      )}
      {showArgs && <ScheArgsModal onCancel={() => setShowArgs(false)} />}
    </>
  )
}

export default StreamRightMenu
