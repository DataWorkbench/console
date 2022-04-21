import tw, { styled } from 'twin.macro'

export const Tag = styled.div`
  ${tw`inline-flex items-center leading-4! text-xs h-4 rounded-[8px] px-3 bg-neut-13 text-white`}
`

export const JobItem = styled.div`
  ${tw`inline-flex gap-2 items-center bg-neut-13 rounded-[2px] px-2 h-6`}
  & > div {
    ${tw`inline-block`}
    & > span:first-child {
      ${tw`text-white mr-0.5`}
    }
    & > span:last-child {
      ${tw`text-neut-8`}
    }
  }
`
