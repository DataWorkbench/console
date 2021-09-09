import React from 'react'
import PropTypes from 'prop-types'

function GuideItem({ index, title, desc, link }) {
  return (
    <div tw="tw-flex-1">
      <div tw="tw-text-base tw-font-medium tw-flex">
        <div>
          <span tw="tw-inline-block tw-bg-green-11 tw-text-white tw-w-5 tw-h-5 tw-text-center tw-leading-5 tw-rounded-sm tw-mr-1.5">
            {index}
          </span>
          {title}
        </div>
        <div tw="tw-border-t tw-border-neut-3 tw-flex-1 tw-mt-3 tw-mx-3" />
      </div>
      <div tw="tw-text-neut-8 tw-mt-4 tw-w-10/12">
        {desc}
        <a href={link} tw="tw-text-link">
          查看
        </a>
      </div>
    </div>
  )
}

GuideItem.propTypes = {
  index: PropTypes.number,
  title: PropTypes.string,
  desc: PropTypes.string,
  link: PropTypes.string,
}

export default GuideItem
