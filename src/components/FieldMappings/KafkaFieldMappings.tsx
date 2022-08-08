import tw, { css } from 'twin.macro'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { useImmer } from 'use-immer'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import { AffixLabel } from 'components/AffixLabel'
import { FlexBox } from 'components/Box'
import { Center } from 'components/Center'
import { useDrag, useDrop, XYCoord } from 'react-dnd'
import { DragItem } from 'components/FieldMappings/MappingItem'
import { PopConfirm } from 'components/PopConfirm'
import { isEqual } from 'lodash-es'
import { useFieldConfigRealSqlKafka } from 'components/FieldMappings/Subjects'

const styles = {
  versionHeader: tw`bg-neut-16`,
  show: [
    css`
      .hover-active {
        opacity: 1 !important;
      }
    `
  ],
  table: [
    tw`grid px-3 items-center h-8 border-t border-b border-line-dark`,
    css`
      &:not(:first-of-type) {
        border-top: none;
      }
    `
  ],
  versions: [
    tw`grid`,
    css`
      grid-template-columns: repeat(3, 1fr);
    `
  ],
  valueColumns: [
    tw`grid`,
    css`
      grid-template-columns: repeat(2, 1fr) 40px;
    `
  ],
  dndWrapper: [
    tw`grid border border-dashed border-neut-13 rounded-[2px]`,
    css`
      grid-column: 1 / -1;
    `
  ],
  hoverShow: [
    css`
      &:hover {
        .hover-active {
          opacity: 1;
        }
      }

      .hover-active {
        opacity: 0;
      }
    `
  ],
  iconNumber: tw`w-4 h-4 border rounded-full bg-white text-brand-primary border-brand-primary`
}

const Item = (props: any) => {
  const { item, index, moveItem, deleteItem, isRealSql } = props
  const dndType = 'item'
  const [isTop, setIsTop] = useState(false)

  const ref = useRef<HTMLDivElement>(null)
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: dndType,
      item: { ...item, index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      })
    }),
    [item.name, index]
  )
  const [{ isOver }, drop] = useDrop<any, any, any>(
    () => ({
      accept: dndType,
      collect: (monitor) => ({
        isOver: monitor.isOver()
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
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
        const clientOffset = monitor.getClientOffset()
        const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

        if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY && hoverIndex === 0) {
          setIsTop(true)
        } else {
          setIsTop(false)
        }
      },
      drop({ index: draggedIndex }: DragItem) {
        if (!ref.current) {
          return
        }
        if (draggedIndex !== index) {
          moveItem(draggedIndex, index, isTop)
        }
      }
    }),
    [item.uuid, index]
  )
  drag(drop(ref))
  return (
    <div
      ref={ref}
      css={[
        styles.table,
        isOver && isTop && tw`(border-t-green-11 border-t-2)!`,
        isOver && !isTop && tw`(border-b-green-11 border-b-2)!`
      ]}
    >
      <div
        css={[
          styles.dndWrapper,
          styles.versions,
          styles.versionHeader,
          isDragging && tw`bg-green-4/10!`,
          tw`px-3`
        ]}
      >
        <FlexBox tw="gap-1.5 items-center">
          <Center css={styles.iconNumber}>{index + 1}</Center>
          {item.name}
        </FlexBox>
        <div>{item.type}</div>
        <div tw="flex justify-end">
          {!isRealSql && (
            <PopConfirm content="确认删除?" onOk={() => deleteItem(index)}>
              <Icon name="if-trash" size={16} />
            </PopConfirm>
          )}
        </div>
      </div>
    </div>
  )
}

const setIndex = (i: Record<string, any>, index1: number) => {
  return {
    ...i,
    index: index1 + 1
  }
}

// eslint-disable-next-line import/prefer-default-export
export const KafkaFieldMappings = forwardRef((props: any, ref) => {
  const { sourceColumns, ids } = props

  const idsRef = useRef(ids ?? [])
  const [rowKeyIds, setRowKeyIds] = useImmer<string[]>(ids ?? [])

  const [isRealSql] = useFieldConfigRealSqlKafka()

  useEffect(() => {
    const v = ids ?? []
    if (!isEqual(v, idsRef.current)) {
      setRowKeyIds(v)
      idsRef.current = v
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids, setRowKeyIds])

  const rowKeys = useMemo(
    () =>
      rowKeyIds
        .map((id) => {
          const item = sourceColumns.find((i) => i.uuid === id)
          if (item) {
            return item
          }
          return null
        })
        .filter(Boolean),
    [rowKeyIds, sourceColumns]
  )

  useImperativeHandle(ref, () => ({
    rowMapping: () => [rowKeys.map(setIndex), rowKeys.map(setIndex)]
  }))

  const leftDndType = String('Right')
  const [{ isOver }, leftRef] = useDrop<{ uuid: string }, void, { isOver: boolean }>(() => ({
    accept: leftDndType,
    collect: (monitor) => ({
      isOver: monitor.isOver()
    }),
    drop: ({ uuid }) => {
      if (rowKeyIds.includes(uuid)) {
        return
      }
      setRowKeyIds((draft) => {
        draft.push(uuid)
      })
    }
  }))

  function renderAddRowKey() {
    return (
      <div
        css={[
          styles.dndWrapper,
          styles.versionHeader,
          isOver && tw`bg-green-4/10!`,
          tw`text-font-placeholder text-center`
        ]}
        ref={leftRef}
      >
        请从左侧拖拽需要用连接符拼接写入 message 的列
      </div>
    )
  }

  return (
    <div>
      <div>
        <div css={[styles.table, styles.versionHeader, styles.versions]}>
          <div>目的表字段</div>
          <div>字段类型</div>
          <div>
            <AffixLabel
              required={false}
              help="来源字段连线到当前 rowkey 时，通过该连接符连接多个来源字段值，作为一行的 rowkey 写入 HBase "
              theme="green"
            >
              连接符
            </AffixLabel>
          </div>
        </div>
        <div css={[styles.table, styles.versions]}>
          <div>message</div>
          <div>STRING</div>
          <div>,</div>
        </div>
        {rowKeys.map((column, index) => (
          <Item
            key={column.uuid}
            item={column}
            index={index}
            deleteItem={(s: number) => {
              setRowKeyIds((draft) => {
                draft.splice(s, 1)
              })
            }}
            isRealSql={isRealSql}
            moveItem={(s: number, t: number, isTop: boolean) => {
              setRowKeyIds((draft) => {
                const newFields = [...draft]
                newFields.splice(s, 1)
                newFields.splice(isTop ? 0 : t + 1, 0, draft[s])
                setRowKeyIds(newFields)
              })
            }}
          />
        ))}
        {!isRealSql && <div css={[styles.table]}>{renderAddRowKey()}</div>}

        <FlexBox css={[styles.table, tw`flex bg-neut-18 items-center`]}>
          <span>原理：</span>
          {new Array(Math.max(0, 2 * (rowKeys || []).length - 1)).fill(0).map((_, index) =>
            index % 2 === 1 ? (
              <span tw="inline-flex">_</span>
            ) : (
              <Center tw="inline-flex" key={Math.random()} css={styles.iconNumber}>
                {index / 2 + 1}
              </Center>
            )
          )}
          <span tw="ml-1">写入到 message</span>
        </FlexBox>
      </div>
    </div>
  )
})
