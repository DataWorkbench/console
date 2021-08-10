import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

const propTypes = {
  items: PropTypes.array,
  onChange: PropTypes.func,
}

function DbList({ items, onChange }) {
  return (
    <div className="tw-flex tw-flex-wrap">
      {items.map(({ name, desc, image }, i) => (
        <div
          key={name}
          className={clsx('tw-w-1/3 tw-pb-4', (i + 1) % 3 && 'tw-pr-4')}
        >
          <div
            onClick={onChange}
            className={clsx(
              'tw-flex tw-p-3 tw-group tw-border tw-rounded-sm tw-border-neut-2 tw-cursor-pointer hover:tw-border-green-11'
            )}
          >
            <div className="tw-w-10 tw-flex-shrink-0">
              <img
                className="tw-w-full tw-h-10"
                src={`data:image/gif;base64,${image}`}
                alt=""
              />
            </div>
            <div className="tw-flex-1 tw-pl-2 tw-leading-5">
              <div className="tw-font-medium group-hover:tw-text-green-11">
                {name}
              </div>
              <div className="tw-text-neut-8 tw-h-10 tw-overflow-hidden">
                {desc}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

DbList.propTypes = propTypes

export default DbList
