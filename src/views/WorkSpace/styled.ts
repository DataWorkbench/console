import tw, { css, styled } from 'twin.macro'

export const OptButton = styled('button')(({ disabled }) => [
  tw`font-semibold text-xs rounded-sm text-neut-13  bg-neut-2 border border-neut-3 px-2 2xl:px-3 py-1 transition-colors`,
  disabled
    ? tw`cursor-not-allowed text-opacity-50`
    : tw`focus:outline-none hover:text-green-11 hover:bg-green-0 hover:border-green-11 hover:shadow`
])

export const RoleNameWrapper = styled.div(() => [
  tw`inline-flex items-center justify-center px-2 bg-neut-13 text-white  rounded-[20px]`
])

export const roleIcon = {
  item: ({
    zIndex = 1,
    spacing = 5,
    index
  }: {
    zIndex: number
    spacing?: number
    index: number
  }) => css`
      ${tw`w-6 h-6 bg-[#E2E8F0] rounded-full border-2 border-white flex justify-center items-center overflow-hidden`}
      z-index: ${zIndex};
      transform: translateX(-${index * spacing}px);
    }`
}
