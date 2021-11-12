import { Select, Control, Button } from '@QCFE/lego-ui'

import { Icon } from '@QCFE/qingcloud-portal-ui'
import { useState } from 'react'

interface ISelectWithRefreshProps {
  onRefresh: () => void
  [propName: string]: any
}
const SelectWithRefresh = (props: ISelectWithRefreshProps) => {
  const { onRefresh, help, labelClassName, label, ...rest } = props
  const [domId] = useState(Math.random().toString(32))
  return (
    <Control className="field text-field">
      <label className={`label ${labelClassName}`} htmlFor={domId}>
        {label}
      </label>
      <Select {...rest} id={domId} />
      <Button tw="w-8 ml-3 p-0">
        <Icon
          name="refresh"
          tw="text-xl  text-white"
          size={20}
          onClick={() => onRefresh && onRefresh()}
        />
      </Button>
      {help && <div className="help">{help}</div>}
    </Control>
  )
}

export default SelectWithRefresh
