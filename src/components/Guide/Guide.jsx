import React from 'react'
import PropTypes from 'prop-types'
import GuideItem from './GuideItem'

function Guide({ title, items, className }) {
  return (
    <div className={className}>
      <div className="tw-text-xl tw-text-neut-15">{title}</div>
      <div className="tw-flex tw-justify-center tw-mt-5 tw-space-x-6">
        {items.map(({ ...item }, i) => (
          <GuideItem {...item} key={item.title} index={i + 1} />
        ))}
      </div>
    </div>
  )
}

Guide.propTypes = {
  title: PropTypes.string,
  items: PropTypes.array,
  className: PropTypes.string,
}

export default Guide
