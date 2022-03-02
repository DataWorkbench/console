import { PropsWithChildren } from 'react'
import tw, { styled, css } from 'twin.macro'

const orientationMap = {
  left: {
    before: '5%',
    after: '95%',
  },
  center: {
    before: '50%',
    after: '50%',
  },
  right: {
    before: '95%',
    after: '5%',
  },
}
const DividerWarp = styled.div(
  ({
    orientation = 'center',
  }: {
    orientation?: keyof typeof orientationMap
  }) => [
    css`
      ${tw`flex text-neut-15 whitespace-nowrap leading-5 border-neut-3`}
      &::after,
      &::before {
        ${tw`relative top-0 w-2/4 border-b-0 translate-y-1/2`}
        border-top: 1px solid transparent;
        border-top-color: inherit;
        content: '';
      }
      &::after {
        width: ${orientationMap[orientation].after};
      }
      &::before {
        width: ${orientationMap[orientation].before};
      }
    `,
  ]
)

type DividerPropsType = {
  orientation?: keyof typeof orientationMap
  className?: string
}

export const Divider = styled((props: PropsWithChildren<DividerPropsType>) => {
  const { className, orientation } = props
  return (
    <DividerWarp className={className} orientation={orientation}>
      <span tw="inline-block py-0 px-3">{props.children}</span>
    </DividerWarp>
  )
})``

export default Divider
