import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

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
      className={clsx(
        'tw-flex tw-p-3 tw-group tw-border tw-rounded-sm tw-border-neutral-N2 tw-cursor-pointer hover:tw-border-brand-G11'
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
        <div className="tw-font-medium group-hover:tw-text-brand-G11">
          {title}
        </div>
        <div className="tw-text-neutral-N8 tw-h-10 tw-overflow-hidden">
          {desc}
        </div>
      </div>
    </div>
  )
}

DbItem.propTypes = propTypes
DbItem.defaultProps = defaultProps

export default DbItem
