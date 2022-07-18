import React, { useEffect, useState } from 'react'
import { Button, Checkbox, CheckboxGroup, Icon } from '@QCFE/lego-ui'
import { Tooltip } from 'components/Tooltip'
import { FlexBox } from 'components/Box'

interface IRoleFilterProps {
  options: { label: string; value: string }[]
  value?: string[]
  onChange: (v: string[]) => void
}
const RoleFilter = (props: IRoleFilterProps) => {
  const { options, value: valueProp, onChange } = props

  const allKeys = options.map((i) => i.value)
  const [value, setValue] = useState(valueProp ?? allKeys)

  useEffect(() => {
    if (valueProp !== undefined && valueProp !== value) {
      setValue(valueProp)
    }
  }, [value, valueProp])

  const handleCheckAllChange = (_: any, checked: boolean) => {
    if (checked) {
      setValue(allKeys)
    } else {
      setValue([])
    }
  }

  const handleChange = (v: string[]) => {
    setValue(v)
  }

  const [visible, setVisible] = useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  return (
    <FlexBox tw="items-center">
      <span>角色</span>
      <Tooltip
        trigger="click"
        theme="light"
        arrow={false}
        placement="bottom"
        visible={visible}
        appendTo={() => document.body}
        onClickOutside={() => setVisible(false)}
        content={
          <div ref={ref}>
            <div tw="pl-4 py-2 mt-0.5">
              <div>
                <Checkbox
                  indeterminate={
                    Array.isArray(value)
                      ? !!value.length && value.length !== options.length
                      : false
                  }
                  onChange={handleCheckAllChange}
                  checked={
                    Array.isArray(value) &&
                    !!value.length &&
                    value.length === options.length
                  }
                  // style={{ marginBottom: 12 }}
                  tw="mb-3 mr-2"
                />
                全选
              </div>
              <CheckboxGroup
                options={options || []}
                value={value}
                onChange={handleChange}
                direction="column"
              />
            </div>
            <FlexBox tw="gap-2 p-2 border-t-neut-2 border-t">
              <Button onClick={() => setVisible(false)}>取消</Button>
              <Button
                type="primary"
                onClick={() => {
                  setVisible(false)
                  onChange(value)
                }}
              >
                确定
              </Button>
            </FlexBox>
          </div>
        }
      >
        <Icon
          name="filter"
          type="dark"
          clickable
          tw="ml-1 block"
          onClick={() => setVisible(true)}
        />
      </Tooltip>
    </FlexBox>
  )
}

export default RoleFilter
