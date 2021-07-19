import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import DbItem from './DbItem'

const propTypes = {
  items: PropTypes.array,
  onChange: PropTypes.func,
}

function DbList({ items, onChange }) {
  const [selIdx, setSelIdx] = useState()
  const handleSelect = (i) => {
    setSelIdx(i)
    onChange(i)
  }
  return (
    <div className="tw-flex tw-flex-wrap">
      {items.map(({ name, disp }, i) => (
        <div
          key={name}
          className={clsx('tw-w-1/3 tw-pb-4', (i + 1) % 3 && 'tw-pr-4')}
        >
          <DbItem
            selected={selIdx === i}
            title={name}
            disp={disp}
            onSelect={() => handleSelect(i)}
          />
        </div>
      ))}
    </div>
  )
}

DbList.propTypes = propTypes

export default DbList
