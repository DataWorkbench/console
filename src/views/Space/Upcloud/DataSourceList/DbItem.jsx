import React from 'react'
import PropTypes from 'prop-types'

const propTypes = {
  title: PropTypes.string,
  desc: PropTypes.string,
  image: PropTypes.string,
  onSelect: PropTypes.func,
}

const defaultProps = {
  onSelect() {},
}

function DbItem({ title, desc, image, onSelect }) {
  return (
    <div
      onClick={onSelect}
      tw="flex p-3 group border rounded-sm border-neut-2 cursor-pointer hover:border-green-11"
    >
      <div tw="w-10 flex-shrink-0">
        <img tw="w-full h-10" src={`data:image/gif;base64,${image}`} alt="" />
      </div>
      <div tw="flex-1 pl-2 leading-5">
        <div tw="font-medium group-hover:text-green-11">{title}</div>
        <div tw="text-neut-8 h-10 overflow-hidden">{desc}</div>
      </div>
    </div>
  )
}

DbItem.propTypes = propTypes
DbItem.defaultProps = defaultProps

export default DbItem
