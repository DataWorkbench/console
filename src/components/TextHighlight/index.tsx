import * as React from 'react'
import tw, { styled } from 'twin.macro'

const FilterBox = styled.span(() => [tw`text-green-11`])

interface ITextHighlightProps {
  text: string
  filterText: string
  color?: string
}
export const TextHighlight = (props: ITextHighlightProps) => {
  const { text, filterText } = props

  return React.useMemo(() => {
    if (!text || !filterText) {
      return <span>{text}</span>
    }
    const arr: string[] = text.split(filterText)
    return React.createElement(
      'span',
      {},
      arr.reduce((prev, cur, index) => {
        if (cur) {
          prev.push(React.createElement('span', {}, cur))
        }
        if (index < arr.length - 1) {
          prev.push(React.createElement(FilterBox, {}, filterText))
        }
        return prev
      }, [] as React.ReactElement[])
    )
  }, [text, filterText])
}

export default TextHighlight
