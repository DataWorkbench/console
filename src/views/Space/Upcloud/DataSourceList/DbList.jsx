import React from 'react'
import PropTypes from 'prop-types'
import tw from 'twin.macro'

const propTypes = {
  items: PropTypes.array,
  onChange: PropTypes.func,
}

function DbList({ items, onChange }) {
  return (
    <div className="flex flex-wrap">
      {items.map(({ name, desc, image }, i) => (
        <div key={name} css={[tw`w-1/3 pb-4`, (i + 1) % 3 && tw`pr-4`]}>
          <div
            onClick={onChange}
            className="group"
            tw="flex p-3 border rounded-sm border-neut-2 cursor-pointer hover:border-green-11"
          >
            <div tw="w-10 flex-shrink-0">
              <img
                tw="w-full h-10"
                src={`data:image/gif;base64,${image}`}
                alt=""
              />
            </div>
            <div tw="flex-1 pl-2 leading-5">
              <div tw="font-medium group-hover:text-green-11">{name}</div>
              <div tw="text-neut-8 h-10 overflow-hidden">{desc}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

DbList.propTypes = propTypes

export default DbList
