import { useState } from 'react'
import tw, { css, styled } from 'twin.macro'
import { Icons } from 'components'
import { Select } from '@QCFE/lego-ui'

interface JobModeItemProps {
  selected?: boolean
  disabled?: boolean
  onClick?: (jobModeData: any, jobType: string | number) => void
  onTypeItemChange?: (item: any) => void
  defaultType?: string | number
  jobModeData: any
}

const Root = styled('div')(
  ({ selected = false, disabled = false }: { selected?: boolean; disabled?: boolean }) => [
    tw`flex flex-col w-1/2 rounded border-2 border-neut-13 transition-colors ease-in-out duration-300`,
    disabled ? tw`cursor-not-allowed` : tw`cursor-pointer`,
    selected &&
      css`
        ${tw`border-green-11!`}
      `
  ]
)

const JobModeIconWrapper = styled('div')(({ selected }: { selected?: boolean }) => [
  tw`w-[120px] h-[120px] rounded-[25px] flex items-center justify-center rounded-tr-none`,
  {
    background: selected
      ? 'linear-gradient(68.86deg, rgba(2, 77, 142, 0.8) 5.04%, rgba(76, 94, 112, 0) 122.58%);'
      : 'linear-gradient(68.86deg, rgba(76, 94, 112, 0.3) 5.04%, rgba(76, 94, 112, 0) 122.58%)'
  }
])

export const JobModeItem = ({
  jobModeData,
  selected,
  disabled,
  defaultType = -1,
  onClick,
  onTypeItemChange
}: JobModeItemProps) => {
  const { title, desc, icon, items } = jobModeData
  const [jobType, setJobType] = useState<number | string>(defaultType)

  const optionRenderer = (option) => (
    <div tw="flex items-center">
      <div>
        <Icons name={option.icon} size={24} />
      </div>
      <div tw="pl-2 leading-5">
        <div>{option.title}</div>
        <div tw="text-neut-8">{option.desc}</div>
      </div>
    </div>
  )

  const valueRenderer = (option) => (
    <div tw="flex items-center">
      <Icons name={option.icon} size={20} tw="mr-1" />
      <span>{option.title}</span>
    </div>
  )

  return (
    <Root
      className="group"
      selected={selected}
      disabled={disabled}
      onClick={() => {
        if (!disabled && onClick) {
          onClick(jobModeData, jobType)
        }
      }}
    >
      <div
        css={[
          tw`bg-neut-17 group-hover:bg-neut-18 h-40 2xl:h-52 flex justify-center items-center`,
          selected && tw`bg-neut-18`
        ]}
      >
        <JobModeIconWrapper selected={selected}>
          <Icons name={icon} size={80} css={selected && tw`text-green-11`} />
        </JobModeIconWrapper>
      </div>
      <div
        css={[
          tw`bg-neut-16 group-hover:bg-neut-15 py-3 px-3 2xl:py-5 2xl:pl-5 text-base flex-1`,
          selected && tw`bg-neut-15`
        ]}
      >
        <div tw="font-semibold text-lg leading-6">{title}</div>
        <div tw="h-10 mt-2 text-xs font-medium text-neut-8 space-x-2">{desc}</div>
        {items?.length > 0 && (
          <Select
            tw="mt-3 w-full"
            placeholder="请选择同步方式"
            optionRenderer={optionRenderer}
            valueRenderer={valueRenderer}
            value={jobType}
            onChange={(v) => {
              setJobType(v)
              if (onTypeItemChange) {
                onTypeItemChange(v)
              }
            }}
            options={items}
          />
        )}
      </div>
    </Root>
  )
}

export default JobModeItem
