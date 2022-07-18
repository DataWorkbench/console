import { CSSProperties, useState } from 'react'
import { Instance } from 'tippy.js'
import Tippy, { TippyProps } from '@tippyjs/react'
import tw, { TwStyle } from 'twin.macro'
import { omit } from 'lodash-es'
import { isDarkTheme } from 'utils/theme'

const getTheme = (theme?: string) => {
  if (!theme) {
    return 'dark'
  }
  if (theme === 'auto') {
    if (isDarkTheme()) {
      return 'darker'
    }
    return 'light'
  }
  if (theme === 'instead') {
    if (isDarkTheme()) {
      return 'light'
    }
    return 'darker'
  }
  return theme
}

export const Tooltip = (
  props: TippyProps & {
    hasPadding?: boolean
    childStyle?: CSSProperties
    twChild?: TwStyle
  }
) => {
  const [instance, setInstance] = useState<Instance | null>(null)
  const { content, children, hasPadding = false, childStyle, twChild, theme, ...rest } = props

  const combProps: TippyProps = {
    interactive: true,
    theme: getTheme(theme),
    appendTo: () => document.body,
    animation: 'fade',
    delay: 100,
    // arrow: roundArrow,
    ...omit(rest, 'data-tw'),
    content: (
      <div
        css={[hasPadding && tw`px-3 py-2`, tw`leading-5`]}
        onClick={() => {
          instance?.hide()
        }}
      >
        {content}
      </div>
    )
  }
  return (
    <Tippy {...combProps} onCreate={(o) => setInstance(o)}>
      <div css={[tw`inline-block `, [twChild]]}>{children}</div>
    </Tippy>
  )
}

export default Tooltip
