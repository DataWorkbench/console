import Tippy, { TippyProps } from '@tippyjs/react'
import { Global } from '@emotion/react'
import tw, { css } from 'twin.macro'

export const Tooltip = (props: TippyProps) => {
  const combProps: TippyProps = {
    // interactive: false,
    theme: 'dark',
    animation: 'fade',
    hideOnClick: true,
    placement: 'top',
    ...props,
  }
  return (
    <>
      {!combProps.interactive && (
        <Global
          styles={css`
            [data-tippy-root] {
              ${tw`pointer-events-auto!`}
            }
          `}
        />
      )}
      <Tippy {...combProps} />
    </>
  )
}

export default Tooltip
