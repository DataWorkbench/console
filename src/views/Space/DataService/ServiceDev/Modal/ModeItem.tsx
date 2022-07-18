import React from 'react'
import tw, { css, styled } from 'twin.macro'

interface ModeDataProps {
  value: number
  title: string
  desc: React.ReactNode
  disabled?: boolean
}

interface ModeItemProps {
  selected?: boolean
  onClick?: (modeData: any) => void
  modeData: ModeDataProps
}

const Root = styled('div')(
  ({ selected = false, disabled = false }: { selected?: boolean; disabled?: boolean }) => [
    tw`rounded-sm! border border-neut-13 transition-colors ease-in-out duration-300 w-[556px] mb-2 ml-0!`,
    disabled ? tw`cursor-not-allowed` : tw`cursor-pointer`,
    selected &&
      css`
        ${tw`border-green-11 rounded-sm!`}
      `
  ]
)

const ModeItem = ({ modeData, selected, onClick }: ModeItemProps) => {
  const { title, desc, disabled } = modeData

  return (
    <Root
      className="group"
      selected={selected}
      disabled={disabled}
      onClick={() => {
        if (!disabled && onClick) {
          onClick(modeData)
        }
      }}
    >
      <div
        css={[
          tw`bg-neut-16 group-hover:bg-neut-15 py-3 px-3 2xl:py-5 2xl:pl-5 text-base flex-1`,
          selected && tw`bg-neut-15`
        ]}
      >
        <div tw="font-semibold text-sm leading-6">{title}</div>
        <div tw="h-10 mt-2 text-xs font-medium text-neut-8 space-x-2">{desc}</div>
      </div>
    </Root>
  )
}

export default ModeItem
