import tw, { styled } from 'twin.macro'

const flexVariants = {
  1: tw`flex-1`,
  auto: tw`flex-auto`,
  initial: tw`flex-initial`,
  none: tw`flex-none`,
}

export interface FlexBoxProps {
  orient?: 'row' | 'column'
  flex?: '1' | 'auto' | 'initial' | 'none'
}

const Box = tw.div``
const FlexBox = styled.div(({ orient, flex }: FlexBoxProps) => [
  tw`flex`,
  orient === 'row' && tw`flex-row`,
  orient === 'column' && tw`flex-col`,
  () => flex && flexVariants[flex],
])

const ContentBox = styled.div(() => [tw`h-full`])

export { Box, FlexBox, ContentBox }
