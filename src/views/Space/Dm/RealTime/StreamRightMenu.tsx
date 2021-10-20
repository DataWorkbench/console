import { useState } from 'react'
import tw, { css, styled } from 'twin.macro'
import ScheSettingModal from './ScheSettingModal'

const MenuRoot = styled('div')(() => [
  tw`pt-3 space-y-4 align-middle bg-neut-17`,
  css`
    writing-mode: vertical-lr;
    span {
      ${tw`cursor-pointer font-semibold text-xs text-neut-5 leading-9 hover:text-white active:text-green-13`}
    }
  `,
])

const StreamRightMenu = () => {
  const [showScheSetting, setShowScheSetting] = useState(false)
  return (
    <>
      <MenuRoot>
        <span tw="cursor-default! hover:text-neut-5!">操 作 记 录</span>
        <span>环 境 参 数</span>
        <span onClick={() => setShowScheSetting(true)}>调 度 设 置</span>
        <span>操 作 记 录</span>
      </MenuRoot>
      {showScheSetting && (
        <ScheSettingModal onCancel={() => setShowScheSetting(false)} visible />
      )}
    </>
  )
}

export default StreamRightMenu
