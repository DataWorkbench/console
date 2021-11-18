import tw, { css, styled } from 'twin.macro'

export const Card = styled('div')(() => [
  css`
    ${tw`rounded-sm bg-white shadow`}
  `,
])

export const CardContent = tw.div`px-5 pb-5`
