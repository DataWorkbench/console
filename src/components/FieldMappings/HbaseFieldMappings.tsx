import tw, { css } from 'twin.macro'
import { MoreAction } from 'components/MoreAction'
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useImmer } from 'use-immer'
import { Select, Input, Icon } from '@QCFE/qingcloud-portal-ui'
import { AffixLabel } from 'components/AffixLabel'
import { FlexBox } from 'components/Box'
import { Center } from 'components/Center'
import { useDrag, useDrop, XYCoord } from 'react-dnd'
import { DragItem } from 'components/FieldMappings/MappingItem'
import { PopConfirm } from 'components/PopConfirm'
import { target$ } from 'views/Space/Dm/RealTime/Sync/common/subjects'
import { map } from 'rxjs'

const styles = {
  versionHeader: tw`bg-neut-16`,
  show: [
    css`
      .hover-active {
        opacity: 1 !important;
      }
    `,
  ],
  table: [
    tw`grid px-3 items-center h-8 border border-line-dark`,
    css`
      &:not(:first-of-type) {
        border-top: none;
      }
    `,
  ],
  versions: [
    tw`grid`,
    css`
      grid-template-columns: repeat(3, 1fr);
    `,
  ],
  valueColumns: [
    tw`grid`,
    css`
      grid-template-columns: repeat(2, 1fr) 40px;
    `,
  ],
  dndWrapper: [
    tw`grid border border-dashed border-neut-13 rounded-[2px]`,
    css`
      grid-column: 1 / -1;
    `,
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
    `,
  ],
  iconNumber: tw`w-4 h-4 border rounded-full bg-white text-brand-primary border-brand-primary`,
}

const Item = (props: any) => {
  const { item, index, moveItem, deleteItem } = props
  const dndType = 'item'
  const [isTop, setIsTop] = useState(false)

  const ref = useRef<HTMLDivElement>(null)
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: dndType,
      item: { ...item, index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [item.name, index]
  )
  const [{ isOver }, drop] = useDrop<any, any, any>(
    () => ({
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
      drop({ index: draggedIndex }: DragItem) {
        if (!ref.current) {
          return
        }
        if (draggedIndex !== index) {
          moveItem(draggedIndex, index, isTop)
        }
      },
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
        isOver && !isTop && tw`(border-b-green-11 border-b-2)!`,
      ]}
    >
      <div
        css={[
          styles.dndWrapper,
          styles.versions,
          styles.versionHeader,
          isDragging && tw`bg-green-4/10!`,
          tw`px-3`,
        ]}
      >
        <FlexBox tw="gap-1.5 items-center">
          <Center css={styles.iconNumber}>{index + 1}</Center>
          {item.name}
        </FlexBox>
        <div>{item.type}</div>
        <div tw="flex justify-end">
          <PopConfirm content="确认删除?" onOk={() => deleteItem(index)}>
            <Icon name="if-trash" size={16} />
          </PopConfirm>
        </div>
      </div>
    </div>
  )
}

interface ValueItem {
  family: string
  name: string
  type: string
}

// eslint-disable-next-line import/prefer-default-export
export const HbaseFieldMappings = forwardRef((props: any, ref) => {
  const { sourceColumns = [] } = props
  const [{ rowKeyString, versionTime, versionIndex }, setJob] = useState({
    rowKeyString: '',
    versionTime: undefined,
    versionIndex: -1,
  })

  useLayoutEffect(() => {
    const sub = target$
      .pipe(
        map((e) => {
          if (!e || !e.data || !e.data.id) {
            return {
              rowKeyString: '',
              versionTime: undefined,
              versionIndex: -1,
            }
          }
          return {
            rowKeyString: e.data.rowkey_express ?? '',
            versionIndex: e.data.version_column_index,
            versionTime: e.data.version_column_value ?? undefined,
          }
        })
      )
      .subscribe((e) => {
        setJob(e)
      })
    return () => {
      sub.unsubscribe()
    }
  }, [setJob])

  const [isEditingVersion, setIsEditingVersion] = useState(false)
  const [showVersionMoreAction, setShowVersionMoreAction] = useState(false)
  const [isEditingVersionTime, setIsEditingVersionTime] = useImmer({
    flag: false,
    time: '',
  })

  const [version, setVersion] = useImmer<{
    type: 1 | 2 | 3
    column?: string
    time?: string
  }>({ type: 1 })

  const [rowKeyIds, setRowKeyIds] = useImmer<string[]>([])

  useEffect(() => {
    const r = rowKeyIds.join('_')
    const list = rowKeyString.split('_')
    if (rowKeyString !== r) {
      setRowKeyIds(() => {
        return sourceColumns
          .filter((column: Record<string, any>) => list.includes(column.name))
          .map((item: Record<string, any>) => item.uuid)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowKeyString, setRowKeyIds, sourceColumns])

  useEffect(() => {
    if (versionIndex !== -1 && sourceColumns[versionIndex]) {
      setVersion({
        type: 2,
        column: sourceColumns[versionIndex].uuid,
      })
    } else if (versionTime) {
      setVersion({
        type: 3,
        time: versionTime,
      })
    } else {
      setVersion({ type: 1 })
    }
  }, [versionIndex, versionTime, setVersion, sourceColumns])

  const rowKeys = useMemo(() => {
    return rowKeyIds
      .map((id) => {
        const item = sourceColumns.find((i) => i.uuid === id)
        if (item) {
          return item
        }
        return null
      })
      .filter(Boolean)
  }, [rowKeyIds, sourceColumns])

  useImperativeHandle(ref, () => {
    return {
      getData: () => {
        return {
          rowkeyExpress: rowKeys.map((item) => item.name).join('_'),
          versionColumnIndex:
            version.type === 2
              ? sourceColumns.findIndex((i) => i.uuid === version.column)
              : -1,
          versionColumnValue: version.type === 3 ? version.time : undefined,
        }
      },
    }
  })

  const [editingValue, setEditingValue] = useImmer<{
    isAdd: boolean
    index?: number
    value: Partial<ValueItem>
  }>({ value: {}, isAdd: false })

  const leftDndType = String('Right')

  const [values, setValues] = useImmer<ValueItem[]>([])

  const [showValueIndex, setShowValueIndex] = useState<number | null>(null)

  const addCustomField = () => {
    setEditingValue({ value: {}, isAdd: true })
  }

  const handleShowEditVersion = () => {
    setIsEditingVersion(true)
  }

  function handleEditValue(
    value: { index: number; value: ValueItem },
    key: 'edit' | 'del'
  ) {
    if (key === 'edit') {
      setEditingValue({ index: value.index, value: value.value, isAdd: false })
    } else {
      setValues((draft) => {
        draft.splice(value.index, 1)
      })
    }
  }

  const renderVersionType = () => {
    if (!isEditingVersion) {
      return (
        <div>{['', '当前时间', '指定时间列', '指定时间'][version.type]}</div>
      )
    }
    return (
      <Select
        size="small"
        tw="w-[180px]"
        autoFocus
        value={version.type}
        onChange={(v: 1 | 2 | 3) => {
          setVersion((draft) => {
            draft.type = v
          })
          setIsEditingVersion(false)
        }}
        options={[
          {
            value: 1,
            label: '当前时间',
          },
          {
            value: 2,
            label: (
              <AffixLabel
                required={false}
                theme="green"
                help={
                  '指定写入 HBase 的时间戳，选择指定时间列，需要填写列索引（index）' +
                  '：指定对应 reader 端 column 的索引，从 0 开始，需保证能转换为 long ,' +
                  '若是 Date 类型，会尝试用 yyyy-MM-dd HH:mm:ss 和yyyy-MM-dd HH:mm:ss SSS 去解析；' +
                  '若不指定 index？？？（这后面是不是少了描述？）'
                }
              >
                指定时间列
              </AffixLabel>
            ),
          },
          {
            value: 3,
            label: (
              <AffixLabel
                required={false}
                theme="green"
                help="指定写入 HBase 的时间戳，选择指定时间，需要填写指定时间（value）
                ：指定时间的值，类型为字符串。配置格式如下：这里是不是没配置格式？？？"
              >
                指定时间
              </AffixLabel>
            ),
          },
        ]}
      />
    )
  }

  const [{ isOver: isVersionOver }, versionRef] = useDrop<
    { uuid: string },
    void,
    { isOver: boolean }
  >(() => ({
    accept: leftDndType,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    drop: ({ uuid }) => {
      setVersion((draft) => {
        draft.column = uuid
      })
    },
  }))

  const renderVersionColumn = () => {
    if (version.type !== 2) {
      return null
    }
    return (
      <div css={[styles.versions, styles.table]}>
        <div
          ref={versionRef}
          css={[
            styles.dndWrapper,
            styles.versions,
            tw`h-6`,
            isVersionOver && tw`bg-green-4/10!`,
          ]}
        >
          {!version.column && (
            <div
              css={[
                css`
                  grid-column: 1 / -1;
                `,
              ]}
            >
              请从左侧拖拽指定时间列到此处
            </div>
          )}
          {version.column && (
            <>
              <div>
                {sourceColumns.find((i) => i.uuid === version.column)?.name}
              </div>
              <div>
                {sourceColumns.find((i) => i.uuid === version.column)?.type}
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  const renderVersionTime = () => {
    if (version.type !== 3) {
      return null
    }
    if (!isEditingVersionTime.flag) {
      return (
        <div css={[styles.versions, styles.hoverShow, styles.table]}>
          <div
            css={css`
              grid-column: 1 / span 2;
            `}
            tw="ml-3"
          >
            {version.time || <span tw="text-font-secondary">暂未指定</span>}
          </div>
          <div tw="text-right" className="hover-active">
            <Icon
              clickable
              onClick={() =>
                setIsEditingVersionTime((draft) => {
                  draft.flag = true
                  draft.time = version.time || ''
                })
              }
              name="if-pen"
              size={16}
              type="light"
            />
          </div>
        </div>
      )
    }
    return (
      <div css={[styles.versions, styles.table]}>
        <div
          css={css`
            grid-column: 1 / span 2;
            input.input {
              ${tw`h-7!`}
            }
          `}
        >
          <Input
            size="small"
            tw="h-7"
            value={isEditingVersionTime.time}
            onChange={(e, v) => {
              setIsEditingVersionTime((draft) => {
                draft.time = v as string
              })
            }}
          />
        </div>
        <div tw="flex justify-end gap-4">
          <Icon
            size={16}
            name="if-close"
            theme="light"
            clickable
            onClick={() => {
              setIsEditingVersionTime((draft) => {
                draft.flag = false
              })
            }}
          />
          <Icon
            size={16}
            name="if-check"
            theme="light"
            onClick={() => {
              setIsEditingVersionTime((draft) => {
                draft.flag = false
              })
              setVersion((draft) => {
                draft.time = isEditingVersionTime.time
              })
            }}
          />
        </div>
      </div>
    )
  }

  function renderValueItemEdit() {
    return (
      <div key="editing" css={[styles.table, styles.valueColumns]}>
        <FlexBox
          tw="items-center"
          css={css`
            input.input {
              ${tw`h-7!`}
            }
          `}
        >
          <Input
            size="small"
            tw="w-[40%]"
            value={editingValue.value?.family}
            onChange={(e, v) => {
              setEditingValue((draft) => {
                draft.value.family = v as string
              })
            }}
          />
          <span>:</span>
          <Input
            tw="w-[40%]"
            size="small"
            value={editingValue.value?.name}
            onChange={(e, v) => {
              setEditingValue((draft) => {
                draft.value.name = v as string
              })
            }}
          />
        </FlexBox>
        <div>
          <Select size="small" />
        </div>
        <div tw="flex justify-end gap-4">
          <Icon
            size={16}
            name="if-close"
            theme="light"
            clickable
            onClick={() => {
              setEditingValue((draft) => {
                draft.index = undefined
                draft.value = {}
              })
            }}
          />
          <Icon
            size={16}
            name="if-check"
            theme="light"
            onClick={() => {
              const { index, isAdd, value: v } = editingValue
              setValues((draft) => {
                if (isAdd) {
                  return [...draft, v]
                }
                draft[index as number] = v as ValueItem
                return draft
              })
              setEditingValue((draft) => {
                draft.index = undefined
                draft.isAdd = false
              })
            }}
          />
        </div>
      </div>
    )
  }

  function renderValueItem(column: ValueItem, index: number) {
    if (!editingValue.isAdd && editingValue.index === index) {
      return renderValueItemEdit()
    }
    return (
      <div
        key={`${column.family}:${column.name}`}
        css={[
          styles.table,
          styles.valueColumns,
          styles.hoverShow,
          showValueIndex === index && styles.show,
        ]}
      >
        <div>{`${column.family}:${column.name}`}</div>
        <div tw="flex-auto">{column.type}</div>
        <div tw="text-right" className="hover-active">
          <MoreAction<'edit' | 'del'>
            childClick={() => setShowValueIndex(index)}
            onHide={() => setShowValueIndex(null)}
            onMenuClick={handleEditValue}
            items={[
              {
                icon: 'if-pen',
                text: '编辑 version 来源',
                key: 'edit',
                value: {
                  value: column,
                  index,
                },
              },
              {
                key: 'del',
                icon: 'if-trash',
                text: '删除',
                value: {
                  value: column,
                  index,
                },
              },
            ]}
          />
        </div>
      </div>
    )
  }

  const [{ isOver }, leftRef] = useDrop<
    { uuid: string },
    void,
    { isOver: boolean }
  >(() => ({
    accept: leftDndType,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    drop: ({ uuid }) => {
      setRowKeyIds((draft) => {
        draft.push(uuid)
      })
    },
  }))

  function renderAddRowKey() {
    return (
      <div
        css={[
          styles.dndWrapper,
          styles.versionHeader,
          isOver && tw`bg-green-4/10!`,
          tw`text-font-placeholder text-center`,
        ]}
        ref={leftRef}
      >
        请从左侧拖拽需要用连接符拼接写入 rowkey 的列
      </div>
    )
  }

  return (
    <div>
      <div>
        <div
          css={[styles.versions, styles.versionHeader, styles.table]}
          tw="mt-6"
        >
          <div tw="ml-3">字段名</div>
          <div>字段值</div>
          <div>Version 来源</div>
        </div>
        <div
          css={[
            styles.versions,
            styles.hoverShow,
            styles.table,
            showVersionMoreAction && styles.show,
          ]}
        >
          <div tw="ml-3">version</div>
          <div>long</div>
          <FlexBox tw="justify-between items-center">
            {renderVersionType()}
            <div>
              <span className="hover-active">
                <MoreAction<'edit'>
                  onHide={() => setShowVersionMoreAction(false)}
                  childClick={() => setShowVersionMoreAction(true)}
                  onMenuClick={handleShowEditVersion}
                  items={[
                    {
                      icon: 'if-pen',
                      text: '编辑 version 来源',
                      key: 'edit',
                    },
                  ]}
                />
              </span>
            </div>
          </FlexBox>
        </div>
        {renderVersionColumn()}
        {renderVersionTime()}
      </div>

      {false && (
        <div>
          <div css={[styles.valueColumns, styles.versionHeader, styles.table]}>
            <div>valueColumn字段</div>
            <div>
              <AffixLabel
                required={false}
                theme="green"
                help="指定源数据的类型，format 指定日期类型的格式，value 指定当前类型为常量，不从 hbase读取数据，而是根据value值自动生成对应的列。"
              >
                类型
              </AffixLabel>
            </div>
          </div>
          {values.map((column, index) => {
            return renderValueItem(column, index)
          })}
          {editingValue.isAdd && renderValueItemEdit()}
          <Center tw="bg-neut-16 cursor-pointer h-8" onClick={addCustomField}>
            <Icon name="add" type="light" />
            添加字段
          </Center>
        </div>
      )}
      <div tw="mt-6">
        <div css={[styles.table, styles.versionHeader, styles.versions]}>
          <div>字段名</div>
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
          <div>rowKey</div>
          <div>STRING</div>
          <div>-</div>
        </div>
        {rowKeys.map((column, index) => {
          return (
            <Item
              key={index.toString()}
              item={column}
              index={index}
              deleteItem={(s: number) => {
                setRowKeyIds((draft) => {
                  draft.splice(s, 1)
                })
              }}
              moveItem={(s: number, t: number, isTop: boolean) => {
                setRowKeyIds((draft) => {
                  const newFields = [...draft]
                  newFields.splice(s, 1)
                  newFields.splice(isTop ? 0 : t + 1, 0, draft[s])
                  setRowKeyIds(newFields)
                })
              }}
            />
          )
        })}
        <div css={[styles.table]}>{renderAddRowKey()}</div>
        <FlexBox css={[styles.table, tw`flex bg-neut-18 items-center`]}>
          <span>原理：</span>
          {new Array(Math.max(0, 2 * (rowKeys || []).length - 1))
            .fill(0)
            .map((_, index) =>
              index % 2 === 1 ? (
                <span tw="inline-flex">_</span>
              ) : (
                <Center
                  tw="inline-flex"
                  key={index.toString()}
                  css={styles.iconNumber}
                >
                  {index / 2 + 1}
                </Center>
              )
            )}
          <span tw="ml-1">写入到 rowkey</span>
        </FlexBox>
      </div>
    </div>
  )
})
