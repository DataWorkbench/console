/* eslint-disable no-bitwise */
import { Icon } from '@QCFE/qingcloud-portal-ui'
import { FlexBox } from 'components/Box'
import tw, { css, styled, theme } from 'twin.macro'
import { ReactElement } from 'react'
import { Center } from 'components/Center'
import {
  AlarmStatus,
  alarmStatus,
  jobInstanceStatus,
  JobInstanceStatusType,
  JobType,
  jobType,
} from './constants'

export const statusStyle = (type: JobInstanceStatusType) => {
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

export const JobInstanceStatusCmp = (props: {
  type: keyof typeof jobInstanceStatus
}) => {
  const { type } = props
  if (jobInstanceStatus[type] === undefined) {
    return null
  }
  const { wrapper, item } = statusStyle(jobInstanceStatus[type]?.type)
  return (
    <FlexBox tw="items-center gap-2">
      <div css={wrapper}>
        <div css={item} />
      </div>
      <span>{jobInstanceStatus[type].label}</span>
    </FlexBox>
  )
}

export const AlarmStatusCmp = (props: { type: keyof typeof alarmStatus }) => {
  const { type } = props
  if (alarmStatus[type] === undefined) {
    return null
  }
  return (
    <FlexBox tw="items-center gap-2">
      <Icon
        name={
          alarmStatus[type].type === AlarmStatus.NORMAL
            ? 'if-information'
            : 'if-exclamation'
        }
        size={14}
        css={
          alarmStatus[type].type === AlarmStatus.NORMAL
            ? tw`text-blue-10`
            : tw`text-[#FFD127]`
        }
      />
      <span>{alarmStatus[type].label}</span>
    </FlexBox>
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
  console.log(1111, jobType[type])
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
