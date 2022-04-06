import { FlexBox } from 'components/Box'
import tw, { css } from 'twin.macro'
import { JobStatusType, jobStatus } from './constants'

export const statusStyle = (type: JobStatusType) => {
  let wrapperBg
  let centerBorder
  let bg
  switch (type) {
    case JobStatusType.FAILED_AND_RETRY:
      wrapperBg = tw`bg-[#FAF5FF]`
      centerBorder = tw`border-[#F1E4FE]`
      bg = tw`bg-[#A855F7]`
      break
    case JobStatusType.RUNNING:
      wrapperBg = tw`bg-[#F0F9FF]`
      centerBorder = tw`border-[#E0EBFE]`
      bg = tw`bg-deepblue-12`
      break
    case JobStatusType.PREPARING:
      wrapperBg = tw`bg-[#F0F9FF]`
      centerBorder = tw`border-[#FFE278]`
      bg = tw`bg-[#FFD127]`
      break
    case JobStatusType.FAILED:
      wrapperBg = tw`bg-[#F6DBDA]`
      centerBorder = tw`border-[#E0A9A8]`
      bg = tw`bg-red-10`
      break
    case JobStatusType.TIMEOUT:
      wrapperBg = tw`bg-[#F0F9FF]`
      centerBorder = tw`border-[#FDEFD8]`
      bg = tw`bg-[#F97316]`
      break
    case JobStatusType.FINISHED:
      wrapperBg = tw`bg-[#DEE7F1]`
      centerBorder = tw`border-[#B7C8D8]`
      bg = tw`bg-neut-8`
      break
    case JobStatusType.SUCCEEDED:
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
      css`
        transform: translate(-0.5px, -0.5px);
      `,
      centerBorder,
      bg,
    ],
  }
}

export const JobStatus = (props: { type: keyof typeof jobStatus }) => {
  const { type } = props
  if (jobStatus[type] === undefined) {
    return null
  }
  const { wrapper, item } = statusStyle(jobStatus[type]?.type)
  return (
    <FlexBox tw="items-center gap-2">
      <div css={wrapper}>
        <div css={item} />
      </div>
      <span>{jobStatus[type].label}</span>
    </FlexBox>
  )
}
