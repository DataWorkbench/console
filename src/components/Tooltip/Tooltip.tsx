import { useState } from 'react'
import { Instance } from 'tippy.js'
import Tippy, { TippyProps } from '@tippyjs/react'
import { TwStyle } from 'twin.macro'

export const Tooltip = (
  props: TippyProps & {
    haveComponentChildren?: boolean
    twChild?: TwStyle
  }
) => {
  const [instance, setInstance] = useState<Instance | null>(null)

  const {
    content,
    children,
    haveComponentChildren = true,
    twChild,
    ...rest
  } = props
  const combProps: TippyProps = {
    interactive: true,
    theme: 'dark',
    appendTo: () => document.body,
    animation: 'fade',
    delay: 100,
    // arrow: roundArrow,
    ...rest,
    content: (
      <div
        onClick={() => {
          instance?.hide()
        }}
      >
        {content}
      </div>
    ),
  }
  return (
    <Tippy {...combProps} onCreate={(o) => setInstance(o)}>
      {haveComponentChildren ? (
        <div css={[twChild]}>{children}</div>
      ) : (
        <>{children}</>
      )}
    </Tippy>
  )
}

export default Tooltip
