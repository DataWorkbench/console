import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { dropRight, last } from 'lodash'
import { SVG } from '@svgdotjs/svg.js'
import Icon from 'components/Icon'

const lifeCycleItems = [
  { text: '数据上云', xlink: 'icon_service_0' },
  { text: '云上加工', xlink: 'icon_service_1' },
  { text: '数据仓库', xlink: 'icon_service_2' },
  { text: '数据服务', xlink: 'icon_service_3' },
  { text: '数据治理', xlink: 'icon_service_4' },
]

function renderBottomArrow(elem) {
  const el = elem
  el.innerHTML = ''
  const draw = SVG().addTo(el).size('100%', '100%').fill('none')
  const attr = {
    stroke: '#D5DEE7',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  }
  const r = 5
  const spoint = [10, 23]
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
      [len - 8, spoint[1] + r + 8],
    ])
    .attr(attr)
}

function renderTlArrow(elem) {
  const el = elem
  el.innerHTML = ''
  const attr = {
    stroke: '#D5DEE7',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  }
  const r = 5

  const len = el.offsetWidth - 30
  const draw = SVG().addTo(el).size('100%', '100%').fill('none')
  draw
    .path(`M${len} 8.88867 H25 C13.9543 8.88867 5 17.843 5 28.8887 V60`)
    .attr(attr)
  draw
    .circle(r * 2)
    .move(0, 60)
    .attr(attr)
  draw.path(`M${len - 8} 0 L ${len} 8.88867 L${len - 8} 16`).attr(attr)
}

function renderTrArrow(elem) {
  const el = elem
  el.innerHTML = ''
  const attr = {
    stroke: '#D5DEE7',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  }
  const r = 5
  const len = el.offsetWidth - 50
  const draw = SVG().addTo(el).size('100%', '100%').fill('none')
  draw
    .path(`M3 9 H${len} C${len + 11} 9 ${len + 11} 18 ${len + 11} 29 V60`)
    .attr(attr)
  draw
    .circle(r * 2)
    .move(len + 6, 60)
    .attr(attr)
  draw.path(`M8 1 L 1 8 L8 17`).attr(attr)
}

const LifeCycle = ({ className }) => {
  const arrowEl = useRef([])
  const ltArrowEl = useRef(null)
  const rtArrowEl = useRef(null)
  useEffect(() => {
    arrowEl.current.forEach((el) => renderBottomArrow(el))
    renderTlArrow(ltArrowEl.current)
    renderTrArrow(rtArrowEl.current)
  }, [])
  return (
    <div className={className}>
      <div className="flex justify-between h-24 align-middle">
        <div className="flex-1 pl-6 pt-2" ref={ltArrowEl} />
        <div className="w-14">
          <div>
            <Icon name={last(lifeCycleItems).xlink} width={56} height={56} />
            <div className="pt-3">{last(lifeCycleItems).text}</div>
          </div>
        </div>
        <div className="flex-1 pl-2 pt-2" ref={rtArrowEl} />
      </div>
      <div className="flex h-24">
        {dropRight(lifeCycleItems).map((item, i) => (
          <React.Fragment key={item.text}>
            <div className="text-center w-14">
              <div className="flex">
                <Icon name={item.xlink} size={56} />
              </div>
              <div className="pt-3">{item.text}</div>
            </div>
            {i < 3 && (
              <div
                ref={(el) => {
                  arrowEl.current[i] = el
                }}
                className="flex flex-1 items-center arrow"
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

LifeCycle.propTypes = {
  className: PropTypes.string,
}

export default LifeCycle
