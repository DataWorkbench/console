import { Icon } from '@QCFE/lego-ui'
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
    tw`rounded-sm! border border-neut-13 transition-colors ease-in-out duration-300 w-[556px] mb-2 ml-0! rounded`,
    disabled ? tw`cursor-not-allowed` : tw`cursor-pointer`,
    selected &&
      css`
        ${tw`border-green-11 rounded-sm!`}
      `
  ]
)

// css 直角三角形
const Triangle = styled('div')(() => [
  tw`absolute top-0 right-0 rounded`,
  css`
    &:before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 0;
      height: 0;
      border-color: #15a675 #15a675 transparent transparent;
      border-width: 14px 14px 14px 14px;
      border-style: solid;
    }
    .icon {
      ${tw`hover:bg-[#15a675]!`}
    }
  `
])

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
          tw`bg-neut-16 group-hover:bg-neut-15 py-2 px-3 text-base flex-1 relative`,
          selected && tw`bg-[rgba(21, 166, 117, 0.1)]`
        ]}
      >
        {selected && (
          <Triangle>
            <Icon name="check" size={14} tw="absolute top-0 right-0" />
          </Triangle>
        )}
        <div tw="font-semibold text-sm leading-6">{title}</div>
        <div tw="h-10 mt-2 text-xs font-medium text-neut-8 space-x-2">{desc}</div>
      </div>
    </Root>
  )
}

export default ModeItem
