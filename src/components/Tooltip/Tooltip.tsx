import { useState } from 'react'
import { Instance } from 'tippy.js'
import Tippy, { TippyProps } from '@tippyjs/react'

export const Tooltip = (props: TippyProps) => {
  const [instance, setInstance] = useState<Instance | null>(null)

  const { content, children, ...rest } = props
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
      <span>{children}</span>
    </Tippy>
  )
}

export default Tooltip
