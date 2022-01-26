import { PropsWithChildren, useEffect, useRef, useState } from 'react'
import tw, { TwStyle } from 'twin.macro'
import { Tooltip } from '../Tooltip'

export const TextEllipsis = ({
  children: text,
  twStyle,
  theme = 'darker',
}: PropsWithChildren<{
  twStyle?: TwStyle
  theme?: 'dark' | 'light' | 'darker'
}>) => {
  const ref = useRef<HTMLDivElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const [isOver, setIsOver] = useState(false)
  const [hasRender, setHasRender] = useState(false)
  useEffect(() => {
    setHasRender(true)
    if (ref.current && boxRef.current) {
      if (
        ref.current.getBoundingClientRect().width >
        boxRef.current?.getBoundingClientRect().width
      ) {
        setIsOver(true)
      }
    }
  }, [])
  const children = (
    <div tw="overflow-hidden block relative" ref={boxRef}>
      {!hasRender && (
        <div ref={ref} tw="invisible absolute break-normal">
          {text}
        </div>
      )}
      <div key="mount" css={[tw`truncate`, twStyle]}>
        {text}
      </div>
    </div>
  )
  return isOver ? (
    <Tooltip
      content={text}
      theme={theme}
      twChild={tw`block overflow-hidden`}
      hasPadding
    >
      {children}
    </Tooltip>
  ) : (
    children
  )
}

export default TextEllipsis
