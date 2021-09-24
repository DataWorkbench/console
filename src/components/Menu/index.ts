import tw, { styled } from 'twin.macro'

export const Menu = styled('ul')(() => [
  tw`list-none py-2 rounded bg-white z-50 min-w-[120px]`,
])

export const MenuItem = styled('li')(({ disabled }: { disabled?: boolean }) => [
  tw`px-3 flex items-center h-8 cursor-pointer hover:bg-neut-1`,
  disabled && tw`cursor-not-allowed opacity-50`,
])
