import { ReactElement, useEffect, useRef, useState } from 'react'
import tw, { TwStyle } from 'twin.macro'
import { Tooltip } from '../Tooltip'

export const TextEllipsis = ({
  children: text,
  twStyle,
}: {
  children: ReactElement | string
  twStyle?: TwStyle
}) => {
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
    <div
      key="mount"
      ref={ref}
      css={[
        hasRender ? tw`relative visible` : tw`invisible absolute`,
        !isOver ? '' : tw`truncate`,
        hasRender && {
          maxWidth: !isOver
            ? undefined
            : boxRef.current?.getBoundingClientRect()?.width,
        },
        twStyle,
      ]}
    >
      {text}
    </div>
  )
  return (
    <div tw="flex flex-auto" ref={boxRef}>
      {isOver ? (
        <Tooltip content={text} theme="dark" hasPadding>
          {children}
        </Tooltip>
      ) : (
        children
      )}
    </div>
  )
}

export default TextEllipsis
