import tw, { styled } from 'twin.macro'

export const OptButton = styled('button')(({ disabled }) => [
  tw`font-semibold text-xs rounded-sm text-neut-13  bg-neut-1 border border-neut-3 px-2 2xl:px-3 py-1 transition-colors`,
  tw`focus:outline-none hover:text-green-11 hover:bg-green-0 hover:border-green-11 hover:shadow`,
  disabled && tw`opacity-50`,
])

export default {}
