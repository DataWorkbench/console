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
  const draw = SVG().addTo(el).size('100%', '18').fill('none')
  const attr = {
    stroke: '#D5DEE7',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
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
  const iconhw = 28
  const arcr = 8
  const len = el.offsetWidth
  const w = len - arcr * 2
  const draw = SVG().addTo(el).size('100%', '100%').fill('none')
  draw.path(`M${iconhw} 80 v -50 a 8 8 0 0 1 8 -8 H ${len - arcr}`).attr(attr)
  draw
    .circle(r * 2)
    .move(23, 80)
    .attr(attr)
  draw.path(`M${w} 14 L ${w + 8} 22 L${w} 30 `).attr(attr)
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
      <div className="tw-flex tw-justify-between tw-h-24 tw-align-middle">
        <div className="tw-flex-1" ref={ltArrowEl} />
        <div className="tw-w-14">
          <div>
            <Icon name={last(lifeCycleItems).xlink} width={56} height={56} />
            <div className="tw-pt-3">{last(lifeCycleItems).text}</div>
          </div>
        </div>
        <div className="tw-flex-1" ref={rtArrowEl} />
      </div>
      <div className="tw-flex tw-h-24">
        {dropRight(lifeCycleItems).map((item, i) => (
          <React.Fragment key={item.text}>
            <div className="tw-text-center tw-w-14">
              <div className="tw-flex">
                <Icon name={item.xlink} size={56} />
              </div>
              <div className="tw-pt-3">{item.text}</div>
            </div>
            {i < 3 && (
              <div
                ref={(el) => {
                  arrowEl.current[i] = el
                }}
                className="tw-flex tw-flex-1 tw-pt-6"
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
