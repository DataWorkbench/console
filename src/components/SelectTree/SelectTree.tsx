import tw, { css, styled } from 'twin.macro'
import { Form, Icon, Control } from '@QCFE/lego-ui'
import React, { useState, forwardRef, useCallback } from 'react'
import Tree from 'rc-tree'

export interface SelectTreeProps {
  name: string
  value: string | null
  placeholder?: string
  onChange: (value: any) => void
  treeData: any[]
}

const SelectInputWrapper = styled('div')(
  ({ focused = false }: { focused?: boolean }) => [
    tw`flex-1 flex max-w-[328px] items-center w-full px-3 py-2 rounded-sm cursor-pointer h-8 border border-neut-13  border-solid hover:border-neut-5`,
    focused && tw`border-green-11!`,
    css`
      &.is-danger {
        ${tw`border-red-11!`}
      }
      input {
        ${tw`flex-1 cursor-pointer (bg-neut-16 text-white)! focus:outline-none`}
      }
    `,
  ]
)

const TreeWrapper = styled('div')(({ show = false }: { show?: boolean }) => [
  tw`absolute left-0 top-9 border border-solid border-neut-15 rounded-sm py-1 z-10 w-full bg-neut-17`,
  !show && tw`hidden`,
])

export const SelectTree = forwardRef<SelectTreeProps, any>(
  (
    {
      name,
      value,
      placeholder = '请选择',
      treeData = [],
      onChange,
      ...restProps
    },
    ref
  ) => {
    const [val, setVal] = useState(value)
    const [focused, setFocused] = useState(false)
    const [opened, setOpened] = useState(false)
    const [selectedKeys, setSelectedKeys] = useState([])

    const handleSelect = (keys: any[], info) => {
      setOpened(false)
      if (keys.length > 0) {
        setVal(info.selected ? info.node.title : '')
        setSelectedKeys(keys)
      }
      if (onChange) {
        onChange(info.node.pid)
      }
    }
    const handleBlur = useCallback((e) => {
      setFocused(false)
      const { currentTarget, relatedTarget } = e
      if (!currentTarget.contains(relatedTarget)) {
        setOpened(false)
      }
    }, [])
    return (
      <Control
        tabIndex="0"
        tw="flex-1 relative max-w-[328px]"
        onFocus={() => {
          setFocused(true)
        }}
        onBlur={handleBlur}
      >
        <SelectInputWrapper
          focused={focused}
          onClick={() => {
            setOpened(!opened)
          }}
          {...restProps}
        >
          <input
            autoComplete="off"
            placeholder={placeholder}
            name={name}
            type="text"
            value={val === null ? '' : val}
            ref={ref}
            readOnly
          />

          <Icon
            name={`caret-${opened ? 'up' : 'down'}`}
            type="light"
            size={16}
          />
        </SelectInputWrapper>
        <TreeWrapper show={opened}>
          <Tree
            focusable={false}
            selectedKeys={selectedKeys}
            treeData={treeData}
            onSelect={handleSelect}
          />
        </TreeWrapper>
      </Control>
    )
  }
)

export default SelectTree

export const SelectTreeField: (props: SelectTreeProps) => any =
  Form.getFormField(SelectTree)
