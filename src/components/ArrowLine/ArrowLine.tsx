import tw, { styled, css } from 'twin.macro'

export const ArrowLine = styled('div')(
  ({
    direction = 'right',
    dotWidth = 4,
  }: {
    direction?: 'right'
    dotWidth?: number
  }) => [
    tw`h-[1px] relative flex-1 w-9`,
    css({
      backgroundSize: `${dotWidth * 2}px 1px`,
      backgroundImage: `linear-gradient(90deg, #fff ${dotWidth}px, rgba(0,0,0,0) 0)`,
    }),
    tw`after:(absolute top-[-5px] right-[-6px] content-[' '] inline-block h-0 w-0 border-[5px] border-transparent )`,
    direction === 'right' && tw`after:border-l-white`,
  ]
)

export default ArrowLine
