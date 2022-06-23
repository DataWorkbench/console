import { useEffect } from 'react'

const prepend = (el: any, target: HTMLElement) => {
  if (target.firstChild) {
    target.insertBefore(el, target.firstChild)
  } else {
    target.appendChild(el)
  }
}

const appendSvg = (icons: string) => {
  const svgContainer = document.createElement('div')
  svgContainer.innerHTML = icons
  const svg = svgContainer.getElementsByTagName('svg')[0]
  if (svg) {
    svg.setAttribute('aria-hidden', 'true')
    svg.style.position = 'absolute'
    svg.style.width = '0'
    svg.style.height = '0'
    svg.style.overflow = 'hidden'
    prepend(svg, document.body)
  }
  return svg
}

export default function useIcon(icons: string) {
  useEffect(() => {
    const svg = appendSvg(icons)
    return () => {
      if (document.body.contains(svg)) {
        document.body.removeChild(svg)
      }
    }
  }, [icons])
}
