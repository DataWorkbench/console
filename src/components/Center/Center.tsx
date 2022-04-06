import tw, { css, styled } from 'twin.macro'

export interface CenterProps {
  size?: number
}

export const Center = styled('div')(({ size }: CenterProps) => [
  tw`flex justify-center items-center`,
  size &&
    css`
      width: ${size}px;
      height: ${size}px;
    `,
])

export default Center
