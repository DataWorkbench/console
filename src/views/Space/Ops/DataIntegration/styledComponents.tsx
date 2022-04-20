/* eslint-disable no-bitwise */
import { Icon } from '@QCFE/qingcloud-portal-ui'
import tw, { css, styled, theme } from 'twin.macro'
import React, { ReactElement } from 'react'
import { isFunction } from 'lodash-es'
import { Tooltip, FlexBox, Center } from 'components'
import {
  AlarmStatus,
  alarmStatus,
  DataReleaseDevMode,
  dataReleaseDevModeType,
  DataReleaseSchedule,
  dataReleaseScheduleType,
  jobInstanceStatus,
  JobInstanceStatusType,
  JobType,
  jobType,
  sourceTypes,
} from './constants'

export const statusStyle = (
  type: JobInstanceStatusType | DataReleaseSchedule
) => {
  let wrapperBg
  let centerBorder
  let bg
  switch (type) {
    case JobInstanceStatusType.FAILED_AND_RETRY:
      wrapperBg = tw`bg-[#FAF5FF]`
      centerBorder = tw`border-[#F1E4FE]`
      bg = tw`bg-[#A855F7]`
      break
    case JobInstanceStatusType.RUNNING:
      wrapperBg = tw`bg-[#F0F9FF]`
      centerBorder = tw`border-[#E0EBFE]`
      bg = tw`bg-deepblue-12`
      break
    case JobInstanceStatusType.PREPARING:
      wrapperBg = tw`bg-[#F0F9FF]`
      centerBorder = tw`border-[#FFE278]`
      bg = tw`bg-[#FFD127]`
      break
    case JobInstanceStatusType.FAILED:
      wrapperBg = tw`bg-[#F6DBDA]`
      centerBorder = tw`border-[#E0A9A8]`
      bg = tw`bg-red-10`
      break
    case JobInstanceStatusType.TIMEOUT:
      wrapperBg = tw`bg-[#F0F9FF]`
      centerBorder = tw`border-[#FDEFD8]`
      bg = tw`bg-[#F97316]`
      break
    case JobInstanceStatusType.FINISHED:
      wrapperBg = tw`bg-[#DEE7F1]`
      centerBorder = tw`border-[#B7C8D8]`
      bg = tw`bg-neut-8`
      break
    case JobInstanceStatusType.SUCCEEDED:
      wrapperBg = tw`bg-[#C6F4E4]`
      centerBorder = tw`border-[#47CB9F]`
      bg = tw`bg-green-11`
      break

    case DataReleaseSchedule.RUNNING:
      wrapperBg = tw`bg-[#DEE7F1]`
      centerBorder = tw`border-[#B7C8D8]`
      bg = tw`bg-neut-8`
      break
    case DataReleaseSchedule.FINISHED:
      wrapperBg = tw`bg-[#DEE7F1]`
      centerBorder = tw`border-[#B7C8D8]`
      bg = tw`bg-neut-8`
      break
    case DataReleaseSchedule.DOWNED:
      wrapperBg = tw`bg-[#DEE7F1]`
      centerBorder = tw`border-[#B7C8D8]`
      bg = tw`bg-neut-8`
      break
    default:
      break
  }
  return {
    wrapper: [
      tw`inline-flex items-center justify-center w-3 h-3 rounded-full`,
      wrapperBg,
    ],
    item: [
      tw`inline-block w-2 h-2 rounded-full border`,
      // css`
      //   transform: translate(-0.5px, -0.5px);
      // `,
      centerBorder,
      bg,
    ],
  }
}

export const StatusCmp = ({
  label,
  type,
  className,
}: {
  label: string
  type?: JobInstanceStatusType | DataReleaseSchedule
  className?: string
}) => {
  if (type === undefined) {
    return null
  }
  const { wrapper, item } = statusStyle(type)
  return (
    <div tw="flex items-center gap-2" className={className}>
      <div css={wrapper}>
        <div css={item} />
      </div>
      <span>{label}</span>
    </div>
  )
}

export const JobInstanceStatusCmp = (props: {
  type: keyof typeof jobInstanceStatus
  className?: string
}) => {
  const { type, className } = props
  return (
    <StatusCmp
      label={jobInstanceStatus[type].label}
      type={jobInstanceStatus[type]?.type}
      className={className}
    />
  )
}

export const DataReleaseStatusCmp = (props: {
  type: keyof typeof dataReleaseScheduleType
  className?: string
}) => {
  const { type, className } = props
  return (
    <StatusCmp
      label={dataReleaseScheduleType[type].label}
      type={dataReleaseScheduleType[type]?.type}
      className={className}
    />
  )
}

export const AlarmStatusCmp = (props: {
  type: keyof typeof alarmStatus
  onClick?: Function
}) => {
  const { type, onClick } = props
  if (alarmStatus[type] === undefined) {
    return null
  }
  return (
    <div tw="items-center gap-2 inline-flex">
      <Icon
        name={
          alarmStatus[type].type === AlarmStatus.NORMAL
            ? 'if-information'
            : 'if-exclamation'
        }
        size={14}
        css={[
          alarmStatus[type].type === AlarmStatus.NORMAL
            ? tw`text-blue-10`
            : tw`text-[#FFD127]`,

          tw`text-[14px]`,
        ]}
      />
      {isFunction(onClick) ? (
        <span
          tw="hover:text-green-11 cursor-pointer hover:underline "
          onClick={onClick}
        >
          {alarmStatus[type].label}
        </span>
      ) : (
        <span>{alarmStatus[type].label}</span>
      )}
    </div>
  )
}

const jobTypeConfig = new Map([
  [
    JobType.REALTIME_UPDATE,
    {
      label: '实时',
      css: '#14B8A6',
    },
  ],

  [
    JobType.INCREMENT_UPDATE | JobType.FULL_UPDATE,
    {
      label: '离线',
      css: theme('colors.deepblue.12'),
    },
  ],
  [
    JobType.INCREMENT_UPDATE,
    {
      label: '增量',
      css: '#F97316',
    },
  ],
  [
    JobType.FULL_UPDATE,
    {
      label: '全量',
      css: '#A855F7',
    },
  ],
])

export const JobTypeCmp = (props: { type: keyof typeof jobType }) => {
  const { type } = props
  if (jobType[type] === undefined) {
    return null
  }
  const btns: ReactElement[] = []
  jobTypeConfig.forEach((item, i) => {
    if (jobType[type].type & Number(i)) {
      btns.push(
        <Center
          key={i.toString()}
          tw="rounded-[2px] px-2 text-xs h-4 border leading-4"
          css={css`
            color: ${item.css};
            border-color: ${item.css};
          `}
        >
          <span
            css={css`
              transform: scale(0.8);
            `}
          >
            {item.label}
          </span>
        </Center>
      )
      btns.push(<span tw="text-line-dark">-</span>)
    }
  })
  if (btns.length) {
    btns.pop()
  }
  return <FlexBox tw="items-center gap-0.5">{btns}</FlexBox>
}

export const Divider = styled.div`
  ${tw`inline-block h-4 w-[1px] bg-[#475569]`}
`

export const Circle = styled.div`
  ${tw`inline-flex items-center justify-center w-6 h-6 rounded-full text-white bg-line-dark mr-2 flex-none`}
`

export const DbTypeCmp = ({
  type,
  onClick,
  className,
  devMode,
}: {
  type: keyof typeof sourceTypes
  onClick?: Function
  className?: string
  devMode?: keyof typeof dataReleaseDevModeType
}) => {
  if (!sourceTypes[type]) {
    return null
  }

  const item = (
    <div
      onClick={onClick as any}
      css={[
        onClick
          ? tw`hover:text-green-11 cursor-pointer`
          : tw`hover:text-neut-19`,
        tw`inline-block h-4 bg-white text-neut-13 px-2 font-medium rounded-[2px] mr-2 leading-[16px]`,
      ]}
      className={className}
    >
      {sourceTypes[type]}
    </div>
  )
  if (
    devMode &&
    dataReleaseDevModeType[devMode!]?.type !== DataReleaseDevMode.UI
  ) {
    return (
      <Tooltip hasPadding content="脚本模式请查看开发内容" theme="light">
        {item}
      </Tooltip>
    )
  }
  return item
}
