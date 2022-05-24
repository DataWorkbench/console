import tw, { css, styled } from 'twin.macro'
import { Form, Icon, Control } from '@QCFE/lego-ui'
import { useState, forwardRef, useCallback, useEffect } from 'react'
import { uniq, isFunction } from 'lodash-es'
import { Tree } from 'components/Tree'

export interface SelectTreeProps {
  name: string
  label?: React.ReactNode
  value?: string | null
  placeholder?: string
  disabled?: boolean
  onChange?: (value: any, treeNode: any) => void
  onOpened?: (value: boolean) => void
  validateOnChange?: boolean
  treeHeight?: number
  schemas: Record<string, any>[]
}

const SelectInputWrapper = styled('div')(
  ({
    focused = false,
    disabled,
  }: {
    focused?: boolean
    disabled?: boolean
  }) => [
    tw`flex-1 flex max-w-[328px] items-center w-full px-3 py-2 rounded-sm cursor-pointer h-8 border border-neut-13  border-solid hover:border-neut-5`,
    focused && tw`border-green-11!`,
    disabled && tw`bg-neut-11 cursor-not-allowed`,
    css`
      &.is-danger {
        ${tw`border-red-11!`}
      }
      input {
        ${disabled
          ? tw`(bg-neut-11 text-neut-8)! focus:outline-none cursor-not-allowed`
          : tw`flex-1 cursor-pointer (bg-neut-16 text-white)! focus:outline-none`}
      }
    `,
  ]
)

const TreeWrapper = styled('div')(
  ({ show = false, treeHeight }: { show?: boolean; treeHeight?: number }) => [
    tw`absolute max-w-[328px] left-0 top-9 border border-solid border-neut-15 rounded-sm py-1 z-10 w-full bg-neut-17`,
    !show && tw`hidden`,
    treeHeight && {
      maxHeight: `${treeHeight}px`,
      overflowY: 'auto',
    },
  ]
)

const findTreeNode: any = (treeData: any[], nodeKey: string) => {
  let find = null
  treeData.forEach((node) => {
    if (node.key === nodeKey) {
      find = node
    } else if (node.children?.length) {
      const findInChildren = findTreeNode(node.children, nodeKey)
      if (findInChildren) {
        find = findInChildren
      }
    }
  })
  return find
}

export const SelectTree = forwardRef<SelectTreeProps, any>(
  (
    {
      name,
      value,
      placeholder = '请选择',
      treeData = [],
      onChange,
      onOpened,
      disabled,
      treeHeight,
      ...restProps
    },
    ref
  ) => {
    const [val, setVal] = useState(value)
    const [focused, setFocused] = useState(false)
    const [opened, setOpened] = useState(false)
    const [selectedKeys, setSelectedKeys] = useState<string[]>([])
    const folderName = findTreeNode(treeData, val)?.title || ''

    useEffect(() => {
      if (isFunction(onOpened)) {
        onOpened(opened)
      }
    }, [opened, onOpened])

    const handleSelect = useCallback(
      (keys: string[], { node }) => {
        setOpened(false)
        setSelectedKeys(uniq([...keys, node.key]))
        setVal(node.key)

        if (onChange) {
          onChange(node.key, node)
        }
      },
      [onChange]
    )
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
        tw="flex-none relative max-w-[328px]"
        onFocus={() => {
          setFocused(true)
        }}
        onBlur={handleBlur}
      >
        <SelectInputWrapper
          focused={focused}
          disabled={disabled}
          onClick={() => {
            if (!disabled) {
              setOpened(!opened)
            }
          }}
        >
          <input
            autoComplete="off"
            placeholder={placeholder}
            name={name}
            type="text"
            value={folderName}
            ref={ref}
            readOnly
          />

          <Icon
            name={`caret-${opened ? 'up' : 'down'}`}
            type="light"
            disabled={disabled}
            size={16}
          />
        </SelectInputWrapper>
        <TreeWrapper show={opened} treeHeight={treeHeight}>
          <Tree
            focusable={false}
            selectedKeys={selectedKeys}
            treeData={treeData}
            onSelect={handleSelect}
            {...restProps}
          />
        </TreeWrapper>
      </Control>
    )
  }
)

export default SelectTree

export const SelectTreeField: (props: any) => any = (Form as any).getFormField(
  SelectTree
)
