/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useMeasure } from 'react-use'
import { SVG } from '@svgdotjs/svg.js'
import tw from 'twin.macro'
import FlowCell from './FlowCell'

function renderBottomArrow(elem) {
  if (!elem) {
    return
  }
  const el = elem
  el.innerHTML = ''
  const draw = SVG().addTo(el).size('100%', '18').fill('none')
  const attr = {
    stroke: '#D5DEE7',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  }
  const r = 5
  const spoint = [10, 4]
  const len = el.offsetWidth - r * 2

  draw
    .circle(r * 2)
    .attr(attr)
    .move(...spoint)
  draw.line(spoint[0] + r * 2, spoint[1] + r, len, spoint[1] + r).attr(attr)
  draw
    .polyline([
      [len - 8, spoint[1] + r - 8],
      [len, spoint[1] + r],
      [len - 8, spoint[1] + r + 8]
    ])
    .attr(attr)
}

function renderBottomUpArrow(elem) {
  if (!elem) {
    return
  }
  const el = elem
  el.innerHTML = ''
  const draw = SVG().addTo(el).size('100%', '100%').fill('none')
  const attr = {
    stroke: '#D5DEE7',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  }
  draw.path(`M 28 6 v 60`).attr(attr)
  draw.circle(10).move(23, 66).attr(attr)
}

function renderTlArrow(elem) {
  if (!elem) {
    return
  }
  const el = elem
  el.innerHTML = ''
  const attr = {
    stroke: '#D5DEE7',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  }
  const arcr = 8
  const len = el.offsetWidth
  const w = len - arcr * 2
  const draw = SVG().addTo(el).size('100%', '100%').fill('none')
  draw.path(`M28 80 v -50 a 8 8 0 0 1 8 -8 H ${len - arcr}`).attr(attr)
  draw.circle(10).move(23, 80).attr(attr)
  draw.path(`M${w} 14 L ${w + 8} 22 L${w} 30 `).attr(attr)
}

function renderTrArrow(elem) {
  const el = elem
  el.innerHTML = ''
  const attr = {
    stroke: '#D5DEE7',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  }
  const r = 5
  const len = el.offsetWidth
  const iconhw = 28
  const draw = SVG().addTo(el).size('100%', '100%').fill('none')
  draw.path(`M${len - iconhw} 80 v -50 a 8 8 0 0 0 -8 -8 H 8`).attr(attr)
  draw
    .circle(r * 2)
    .move(len - iconhw - r, 80)
    .attr(attr)
  draw.path(`M16 14 L 8 22 L16 30`).attr(attr)
}

const Flow = ({ items }) => {
  const arrowEl = useRef([])
  // const bmArrowEl = useRef([])
  // const tlArrowEl = useRef(null)
  // const trArrowEl = useRef(null)
  const [rootRef, { width: rootWidth }] = useMeasure()
  const flowItems = items.slice(0, -1)
  // const opsItem = items.slice(-1)[0]
  const flowItemsLen = flowItems.length

  useEffect(() => {
    arrowEl.current.forEach((el) => renderBottomArrow(el))
    // bmArrowEl.current.forEach((el) => renderBottomUpArrow(el))
    // renderTlArrow(tlArrowEl.current)
    // renderTrArrow(trArrowEl.current)
  }, [rootWidth])

  return (
    <div tw="w-full" ref={rootRef}>
      {/* <div tw="flex justify-between h-24">
        <div tw="flex-1" ref={tlArrowEl} />
        <div tw="relative">
          <FlowCell item={opsItem} placement="top" />
        </div>
        <div tw="flex-1" ref={trArrowEl} />
      </div> */}
      <div tw="flex h-24">
        {flowItems.map((item, i) => (
          <React.Fragment key={item.text}>
            <div tw="relative">
              {/* {i !== 0 && i < flowItemsLen - 1 && (
                <div
                  ref={(el) => {
                    bmArrowEl.current.push(el)
                  }}
                  tw="absolute -top-20 bottom-24 left-0 right-0"
                />
              )} */}
              <FlowCell item={item} placement="bottom" />
            </div>
            {i < flowItemsLen - 1 && (
              <div
                ref={(el) => {
                  arrowEl.current[i] = el
                }}
                css={[tw`flex pt-12`, tw`flex-1`]}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

Flow.propTypes = {
  items: PropTypes.array
}

export default Flow
