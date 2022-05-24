import { useEffect, useRef, useState } from 'react'
import { AnchorSpec, Endpoint, jsPlumbInstance } from 'jsplumb'
import { noop, isEmpty } from 'lodash-es'
import { useDrag, useDrop, XYCoord } from 'react-dnd'
import { useUnmount } from 'react-use'
import tw, { styled, css } from 'twin.macro'
import { Button, Form, Icon, Input, Menu } from '@QCFE/lego-ui'
import { Center } from 'components/Center'
import { FlexBox } from 'components/Box'
import { Tooltip } from 'components/Tooltip'
import { nameMatchRegex } from 'utils/convert'
import Tippy from '@tippyjs/react'
import { useImmer } from 'use-immer'
import { fieldTypeMapper } from './constant'

const { SelectField, TextField } = Form
const { MenuItem } = Menu

export type TMappingField = {
  type: string
  name: string
  uuid: string
  is_primary_key?: boolean
  custom?: boolean
  isEditing?: boolean
  default?: string
  formatter?: string
}

export type DragItem = TMappingField & { id: string | number; index: number }

// const Root = styled.div`pl-0`

export const FieldRow = styled('div')(
  ({
    isHeader = false,
    isDragging,
    isOver,
    isTop,
    isEditing,
    isReverse,
  }: {
    isHeader?: boolean
    isDragging?: boolean
    isOver?: boolean
    isTop?: boolean
    isEditing?: boolean
    isReverse?: boolean
  }) => [
    tw`flex flex-wrap border-b border-neut-13 last:border-b-0 p-1.5`,
    isReverse && tw`flex-row-reverse`,
    isHeader ? tw`bg-neut-16` : tw`hover:bg-[#1E2F41] `,
    isDragging && tw`bg-green-4/10!`,
    !isReverse && !isHeader && !isEditing && tw`cursor-move`,
    isOver && tw`border-dashed`,
    isOver && isTop && tw`(border-t-green-11 border-t-2)!`,
    isOver && !isTop && tw`(border-b-green-11 border-b-2)!`,
    isReverse
      ? css`
          & > div {
            &:first-of-type {
              ${tw`flex-1`}
            }
            &:last-of-type {
              ${tw`pl-5 xl:pl-10 flex-1`}
            }
          }
        `
      : css`
          & > div {
            &:first-of-type {
              ${tw`pl-5 xl:pl-10 w-56`}
              .select {
                ${tw`w-[180px]`}
              }
            }
            &:nth-of-type(2) {
              ${tw`flex-1`}
              .input {
                ${tw`w-[180px]`}
              }
            }
            &.field:last-of-type {
              ${tw`pl-5 xl:pl-10 mt-1`}
              .input {
                ${tw`w-[384px] xl:w-[364px]`}
              }
            }
          }
        `,
  ]
)

interface MappingItemProps {
  anchor: AnchorSpec
  item: TMappingField
  index: number
  className?: string
  jsplumb?: jsPlumbInstance
  typeName?: string
  // hasConnection?: boolean
  moveItem?: (dragId: string, hoverId: string, isTop: boolean) => void
  deleteItem?: (item: TMappingField) => void
  onCancel?: (item: TMappingField, index: number) => void
  onOk?: (v: TMappingField, index?: number) => void
  getDeleteField?: (name: string) => TMappingField | undefined
  exist?: (name: string) => boolean
}

const MappingItem = (props: MappingItemProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const formRef = useRef<any>(null)
  const {
    jsplumb,
    anchor,
    index,
    item: itemProps,
    className,
    typeName,
    moveItem = noop,
    deleteItem = noop,
    onOk = noop,
    onCancel = noop,
    getDeleteField,
    exist,
  } = props
  const [isTop, setIsTop] = useState(false)
  const [item, setItem] = useImmer(itemProps)
  const [popuState, setPopuState] =
    useState<'delete' | 'parse' | 'constant' | null>(null)
  const [showMoreMenu, setShowMoreMenu] = useState(false)

  const endPointRef = useRef<Endpoint | null>(null)
  const dndType = String(anchor)

  useEffect(() => {
    setItem(itemProps)
  }, [itemProps, setItem])

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: dndType,
      item: { ...item, index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      canDrag: () => !item.isEditing,
    }),
    [item.name, index, item.isEditing]
  )

  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: dndType,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    hover({ index: dragIndex }, monitor) {
      if (!ref.current) {
        return
      }
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      if (
        dragIndex > hoverIndex &&
        hoverClientY < hoverMiddleY &&
        hoverIndex === 0
      ) {
        setIsTop(true)
      } else {
        setIsTop(false)
      }
    },
    drop({ uuid: draggedId }: DragItem) {
      if (!ref.current) {
        return
      }
      if (draggedId !== item.uuid) {
        moveItem(draggedId, item.uuid, isTop)
        jsplumb?.repaintEverything()
      }
    },
  })

  useEffect(() => {
    if (ref.current && jsplumb) {
      let endPoint = endPointRef.current
      const parameters = { [String(anchor)]: itemProps }
      if (endPoint) {
        jsplumb.deleteEndpoint(endPoint)
        endPoint = null
      }
      if (!endPoint) {
        endPoint = jsplumb.addEndpoint(ref.current, {
          anchor,
          parameters,
          isSource: anchor !== 'Left',
          isTarget: anchor === 'Left',
          connectorStyle: {
            gradient: {
              stops: [
                [0, '#229CE9'],
                [1, '#15A675'],
              ],
            },
            strokeWidth: 2,
            stroke: '#fff',
          },
          connectorHoverStyle: {
            strokeWidth: 4,
          },
          endpoint: [
            'Dot',
            {
              cssClass: `point-${anchor}`,
              radius: 6,
            },
          ],
          paintStyle: {
            fill: anchor === 'Left' ? '#9DDFC9' : '#BAE6FD',
            stroke: '#fff',
            strokeWidth: 2,
          },
          'connector-pointer-events': 'visible',
          uuid: itemProps.uuid,
        } as any) as Endpoint
        endPointRef.current = endPoint
      }
      endPoint.setParameters(parameters)
    }
  }, [itemProps, jsplumb, anchor])

  useEffect(() => {
    if (isEmpty(itemProps.name)) {
      endPointRef.current?.setVisible(!item.isEditing)
    }
    jsplumb?.repaintEverything()
  }, [item.isEditing, itemProps.name, jsplumb])

  useUnmount(() => {
    const endPoint = endPointRef.current
    if (jsplumb && endPoint) {
      jsplumb.deleteEndpoint(endPoint)
    }
    endPointRef.current = null
  })

  const handleMoreClick = (key: string) => {
    if (key === 'edit') {
      setItem((draft) => {
        draft.isEditing = true
      })
    } else if (key === 'delete' || key === 'parse' || key === 'constant') {
      setPopuState(key)
    }
    setShowMoreMenu(false)
  }

  const renderMore = () => {
    return (
      <Tippy
        content={
          <Menu
            tw="bg-neut-16"
            onClick={(_: any, key: string) => handleMoreClick(key)}
          >
            {item.custom && (
              <>
                <MenuItem key="edit">
                  <Icon name="pen" />
                  编辑
                </MenuItem>

                <MenuItem key="constant">
                  <Icon name="pen" />
                  设置常量
                </MenuItem>
                <MenuItem key="parse">
                  <Icon name="pen" />
                  时间转换
                </MenuItem>
              </>
            )}
            <MenuItem key="delete">
              <Icon name="pen" />
              删除
            </MenuItem>
          </Menu>
        }
        arrow={false}
        theme="dark"
        animation="fade"
        delay={100}
        visible={showMoreMenu}
        interactive
        onClickOutside={() => setShowMoreMenu(false)}
        placement="bottom-start"
        // appendTo={document.body}
      >
        <FlexBox
          tw="items-center justify-end cursor-pointer mr-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-150"
          onClick={() => setShowMoreMenu(!showMoreMenu)}
        >
          <Icon name="more" size={20} type="light" clickable />
        </FlexBox>
      </Tippy>
    )
  }

  const renderConfirmContent = () => {
    return (
      <div tw="p-3 space-y-2 w-[264px]">
        {popuState === 'delete' && (
          <FlexBox>
            <Icon
              name="exclamation"
              size={20}
              tw="mr-1.5 flex-shrink-0 inline-block"
              color={{
                primary: '#000',
                secondary: '#FFD127',
              }}
            />
            <div>
              删除字段后，无法撤回，如误删需手动添加，确认删除此字段么？
            </div>
          </FlexBox>
        )}
        {(popuState === 'parse' || popuState === 'constant') && (
          <>
            <Input
              type="text"
              placeholder={
                popuState === 'constant' ? '' : 'yyyy-MM-dd hh:mm:ss'
              }
              tw="w-60"
              defaultValue={
                (popuState === 'parse' ? item.formatter : item.default) || ''
              }
              onChange={(e, v) => {
                setItem((draft) => {
                  if (popuState === 'parse') {
                    draft.formatter = String(v)
                  } else {
                    draft.default = String(v)
                  }
                })
              }}
            />
            <div tw="text-neut-8">
              {popuState === 'constant'
                ? '常量字段值'
                : '将字段类型转为日期格式返回'}
            </div>
          </>
        )}
        <div tw="flex justify-end space-x-2">
          <Button tw="h-6" onClick={() => setPopuState(null)}>
            取消
          </Button>
          <Button
            type="primary"
            tw="h-6"
            onClick={() => {
              if (popuState === 'delete') {
                deleteItem(item)
                setPopuState(null)
              } else if (popuState === 'parse') {
                onOk(item, index)
                setPopuState(null)
              } else if (popuState === 'constant') {
                if (!isEmpty(item.default)) {
                  onOk(item, index)
                  setPopuState(null)
                }
              }
            }}
          >
            确认
          </Button>
        </div>
      </div>
    )
  }
  const renderEditContent = () => {
    return (
      <Form ref={formRef} tw="pl-0!">
        <FieldRow isEditing tw="p-0 ">
          <div>
            <SelectField
              placeholder="字段类型"
              value={item.type}
              name="fieldType"
              validateOnChange
              schemas={[
                {
                  rule: { required: true },
                  status: 'error',
                },
              ]}
              options={
                typeName
                  ? fieldTypeMapper
                      .get(typeName)
                      ?.map((v) => ({ label: v, value: v }))
                  : []
              }
              onChange={(v: string) =>
                setItem((draft) => {
                  draft.type = v
                })
              }
            />
          </div>
          <FlexBox>
            <TextField
              name="fieldName"
              placeholder="请输入字段名"
              defaultValue={item.name}
              validateOnChange
              schemas={[
                {
                  rule: {
                    required: true,
                    matchRegex: nameMatchRegex,
                  },
                  status: 'error',
                },
                {
                  rule: (v: string) => {
                    if (exist) {
                      return !exist(v)
                    }
                    return true
                  },
                  status: 'error',
                },
              ]}
              onChange={(v: string) => {
                setItem((draft) => {
                  draft.name = v
                  if (draft.custom === false) {
                    draft.custom = true
                  }
                })
                if (getDeleteField) {
                  const delField = getDeleteField(v)
                  if (delField) {
                    onOk(delField, index)
                  }
                }
              }}
            />
          </FlexBox>
          <Center css={[tw`space-x-3`, item.custom && tw`translate-y-4`]}>
            <Tooltip
              theme="light"
              content="关闭"
              hasPadding
              twChild={tw`flex items-center`}
            >
              <Icon
                name="close"
                type="light"
                size={16}
                clickable
                onClick={() => onCancel(item, index)}
              />
            </Tooltip>
            <Tooltip
              theme="light"
              content="保存"
              hasPadding
              twChild={tw`flex items-center`}
            >
              <Icon
                name="check"
                type="light"
                clickable
                size={16}
                onClick={() => {
                  if (formRef.current?.validateFields()) {
                    if (!isEmpty(item.type) && !isEmpty(item.name)) {
                      onOk(item, index)
                    }
                  }
                }}
              />
            </Tooltip>
          </Center>
          {item.custom && (
            <TextField
              name="fieldValue"
              defaultValue={item.default}
              validateOnChange
              schemas={[
                {
                  rule: { required: true },
                  status: 'error',
                },
              ]}
              placeholder="请输入字段值"
              onChange={(v: string) => {
                setItem((draft) => {
                  draft.default = v
                })
              }}
            />
          )}
        </FieldRow>
      </Form>
    )
  }

  const renderContent = () => {
    return (
      <>
        <div>{item.type}</div>
        <div>{item.name}</div>
        {itemProps.formatter && (
          <Tooltip
            hasPadding
            content={
              <div>
                时间转换: {itemProps.formatter} （将字段类型转为日期格式返回）
              </div>
            }
            theme="light"
          >
            <span tw="bg-neut-0 rounded-sm px-1 h-5 text-deepblue-12 font-medium inline-block mr-1">
              时
            </span>
          </Tooltip>
        )}
        {itemProps.default && (
          <Tooltip
            hasPadding
            content={<div>{itemProps.default}</div>}
            theme="light"
          >
            <span tw="bg-[#F1E4FE] rounded-sm px-1 h-5 text-[#A855F7] font-medium inline-block mr-1">
              常
            </span>
          </Tooltip>
        )}
        {renderMore()}
      </>
    )
  }

  if (anchor === 'Left') {
    return (
      <FieldRow ref={ref} className={className} isReverse>
        <div>{item.type}</div>
        <div>{item.name}</div>
      </FieldRow>
    )
  }
  drag(drop(ref))
  return (
    <Tippy
      content={renderConfirmContent()}
      visible={
        popuState === 'delete' ||
        popuState === 'parse' ||
        popuState === 'constant'
      }
      onClickOutside={() => setPopuState(null)}
      theme="popconfirm"
      animation="fade"
      interactive
      appendTo={document.body}
    >
      <FieldRow
        isDragging={isDragging}
        isOver={isOver}
        isTop={isTop}
        isEditing={item.isEditing}
        className={`${className || ''} group`}
        ref={ref}
      >
        {item.isEditing ? renderEditContent() : renderContent()}
      </FieldRow>
    </Tippy>
  )
}

export default MappingItem
