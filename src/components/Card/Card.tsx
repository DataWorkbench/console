import tw, { css, styled } from 'twin.macro'

export const Card = styled('div')(
  ({ hasBoxShadow }: { hasBoxShadow?: boolean }) => [
    css`
      ${tw`rounded-sm bg-white`}
      box-shadow: ${hasBoxShadow
        ? '0px 1px 3px rgba(26, 30, 34, 0.08)'
        : 'none'};
    `,
  ]
)

export const CardContent = tw.div`px-5 pb-5`
