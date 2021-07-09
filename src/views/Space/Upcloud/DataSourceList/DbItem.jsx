import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import clsx from 'clsx'

const propTypes = {
  title: PropTypes.string,
  disp: PropTypes.string,
  onSelect: PropTypes.func,
  selected: PropTypes.bool,
}

const defaultProps = {
  onSelect() {},
}

function DbItem({ title, disp, selected, onSelect }) {
  const [iconColor, setIconColor] = useState(null)
  const handleMouseEnter = useCallback(() => {
    setIconColor({
      primary: '#00aa72',
      secondary: '#90e0c5',
    })
  }, [])
  const handleMouseLeave = useCallback(() => {
    if (!selected) {
      setIconColor(null)
    }
  }, [selected])
  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onSelect}
      className={clsx(
        'tw-p-3 tw-group tw-border tw-rounded-sm tw-border-neutral-N2 tw-cursor-pointer hover:tw-border-brand-G11',
        {
          'tw-border-brand-G11': selected,
        }
      )}
    >
      <div className="tw-leading-5">
        <Icon
          name="container"
          className="tw-inline-block tw-align-middle tw-fill-current tw-text-brand-G11"
          color={iconColor}
        />
        <span
          className={clsx(
            'tw-font-medium tw-inline-block tw-pl-2 group-hover:tw-text-brand-G11',
            {
              'tw-text-brand-G11': selected,
            }
          )}
        >
          {title}
        </span>
      </div>
      <div className="tw-text-neutral-N8">{disp}</div>
    </div>
  )
}

DbItem.propTypes = propTypes
DbItem.defaultProps = defaultProps

export default DbItem
