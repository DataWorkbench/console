import {
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
  useState
} from 'react'
import { Connection, jsPlumb, jsPlumbInstance } from 'jsplumb'
import { useMeasure, useMount, useUnmount } from 'react-use'
import tw, { styled } from 'twin.macro'
import { get, intersectionBy, isEmpty, omit } from 'lodash-es'
import { Alert, Button, Icon } from '@QCFE/lego-ui'
import { nanoid } from 'nanoid'
import Tippy from '@tippyjs/react'
import { followCursor } from 'tippy.js'
import { Center } from 'components/Center'
import { FlexBox } from 'components/Box'
import { HelpCenterLink } from 'components/Link'
import useIcon from 'hooks/useHooks/useIcon'
import { Tooltip } from 'components/Tooltip'
// eslint-disable-next-line import/no-cycle
import { HbaseFieldMappings } from 'components/FieldMappings/HbaseFieldMappings'
import { SourceType } from 'views/Space/Upcloud/DataSourceList/constant'
import { KafkaFieldMappings } from 'components/FieldMappings/KafkaFieldMappings'
import {
  useFieldConfig,
  useFieldConfigRealSqlKafka,
  useHbaseSourceType
} from 'components/FieldMappings/Subjects'
import { AffixLabel } from 'components/AffixLabel'
import MappingItem, { FieldRow, TMappingField } from './MappingItem'
import icons from './icons'
import { PopConfirm } from '../PopConfirm'

/* @refresh reset */
const styles = {
  borderX: tw`border-l border-r border-neut-13 `,
  wrapper: tw`border-b border-t flex-1 border-neut-13 w-[40%]`,
  fieldType: tw`w-44 pl-5 xl:pl-12`,
  row: tw`flex border-b border-neut-13 last:border-b-0 p-1.5`,
  // row: tw`grid grid-template-columns[1fr 1.5fr 48px] text-left border-b border-neut-13 last:border-b-0 p-1.5`,
  header: tw`bg-neut-16`,
  rowbody: tw`hover:bg-[#1E2F41]`,
  // column: tw`w-44`,
  add: tw`bg-neut-16 text-white`
}

const Root = styled.div`
  ${tw`text-white space-y-2`}
`
const EmptyFieldWrapper = styled(Center)(() => [
  styles.wrapper,
  styles.borderX,
  tw`self-stretch text-neut-8 h-[280px]`
])

const OutlinedGreenButton = styled(Button)(
  () =>
    tw`
    text-green-12! border-green-12! hover:bg-[rgba(19,150,106,0.1)]! active:bg-[rgba(17,134,95,0.2)]! active:border-green-13! active:text-green-13!
  `
)

const Container = styled.div`
  ${tw`relative`}
  .jtk-endpoint {
    &.point-Right {
      &.jtk-hover,
      &.jtk-drag {
        ${tw`opacity-100`}
      }
    }
    &.point-Left,
    &.point-Right {
      ${tw`opacity-0 transition-opacity ease-in-out duration-200 delay-150`}
      &.jtk-endpoint-connected {
        ${tw`opacity-0`}
        &.jtk-hover {
          ${tw`z-10 opacity-80!`}
        }
      }
      &.jtk-endpoint-drop-allowed {
        ${tw`opacity-100`}
      }
    }
  }
  .jtk-connector {
  }
  [anchor='Left'].jtk-managed {
    ${tw`select-none`}
  }
  .jtk-source-hover,
  .jtk-target-hover {
    ${tw`bg-[#1E2F41]`}
  }
`

// export type TMappingField = {
//   type: string
//   name: string
//   is_primary_key?: boolean
// }

interface Column {
  format: string
  index: number
  is_part: boolean
  name: string
  type: string
  value: string
  readonly?: boolean
  hasHeader?: boolean
}

export interface IFieldMappingsProps {
  // onChange?: (value: Record<string, any>) => void
  leftFields: TMappingField[]
  rightFields: TMappingField[]
  leftTypeName?: string
  rightTypeName?: string
  topHelp?: ReactNode
  mappings?: [string, string][]
  columns?: [Column[], Column[]]
  readonly?: boolean
  hasHeader?: boolean
  onReInit: () => void
  sourceId?: string
  targetId?: string
  // jobType: 1 | 2 | 3
}

export interface IFieldMappingsRecord {
  rowMapping: () => void
  nameMapping: () => void
  clear: () => void
}

export const FieldMappings = forwardRef((props: IFieldMappingsProps, ref) => {
  const {
    onReInit,
    leftFields: leftFieldsProp,
    rightFields: rightFieldsProp,
    leftTypeName,
    rightTypeName,
    topHelp,
    mappings: mappingsProp,
    columns,
    readonly = false,
    hasHeader = true,
    sourceId,
    targetId
  } = props

  useIcon(icons)
  const [leftFields, setLeftFields] = useState(leftFieldsProp)
  const [rightFields, setRightFields] = useState(rightFieldsProp)
  const jsPlumbInstRef = useRef<jsPlumbInstance>()
  const [mappings, setMappings] = useState<[string, string][]>(mappingsProp || [])
  const [visible, setVisible] = useState<boolean>(false)
  const selectedConnection = useRef<Connection>()

  const [containerRef, rect] = useMeasure<HTMLDivElement>()

  const [atomKey, forceUpdate] = useReducer((x) => x + 1, 1)

  useEffect(() => {
    setLeftFields(leftFieldsProp)
    forceUpdate()
  }, [leftFieldsProp])

  useEffect(() => {
    setRightFields(rightFieldsProp)
    forceUpdate()
  }, [rightFieldsProp])

  useEffect(() => {
    if (mappingsProp) {
      setMappings(mappingsProp)
      forceUpdate()
    }
  }, [mappingsProp])

  // console.log(columns)

  useEffect(() => {
    const [leftColumns, rightColumns] = columns || [[], []]
    if (leftColumns?.length > 0 && rightColumns?.length > 0) {
      const mappingArr = leftColumns.map<[string, string]>((column, i) => [
        column.name,
        rightColumns[i].name
      ])
      setMappings(mappingArr)
      setLeftFields((fields) => {
        // const leftMappings = mappingArr.map(([left]) => left)
        const filedNames: string[] = []
        const mappingFields = leftColumns.map((c) => {
          filedNames.push(c.name)
          const field = fields.find((f) => f.name === c.name)
          const uuid = `source--${c.name}`
          if (field) {
            return {
              ...field,
              uuid: field.uuid || uuid,
              custom: !leftFieldsProp.find((f) => f.name === c.name)
            }
          }
          return {
            type: c.type,
            name: c.name,
            default: c.value,
            formatter: c.format,
            custom: true,
            uuid
          }
        })
        const filterFields = fields.filter((field) => !filedNames.includes(field.name))
        return [...mappingFields, ...filterFields]
      })
      setRightFields((fields) => {
        const filedNames: string[] = []
        const mappingFields = rightColumns?.map((c) => {
          filedNames.push(c.name)
          const field = fields.find((f) => f.name === c.name)
          const uuid = `target--${c.name}`
          if (field) {
            return { ...field, uuid, custom: !rightFieldsProp.find((f) => f.name === c.name) }
          }
          return {
            type: c.type,
            name: c.name,
            default: c.value,
            formatter: c.format,
            custom: true,
            uuid
          }
        })
        const filterFields = fields.filter((field) => !filedNames.includes(field.name))
        return [...mappingFields, ...filterFields]
      })
    } else {
      // console.log('in this.....')
      setMappings([])
    }
  }, [columns, atomKey, leftFieldsProp, rightFieldsProp])

  useEffect(() => {
    jsPlumbInstRef.current?.repaintEverything()
  }, [rect.width])

  const kafkaRef = useRef<{ rowMapping: () => Record<string, any>[] }>(null)
  const hbaseRef = useRef<{ getData: () => Record<string, any>[] }>(null)

  const [isRealSqlKafka] = useFieldConfigRealSqlKafka()
  const [config] = useFieldConfig()
  const [hbaseSourceType] = useHbaseSourceType()
  // const kafkaReadType = kafkaSource$.getValue()?.readType
  // const isKafkaSource = (leftTypeName as any).getType() === SourceType.Kafka && kafkaReadType === 1
  const {
    is: { isKafkaTarget, isHbaseTarget, isHbaseSource }
  } = config

  useImperativeHandle(ref, () => ({
    rowMapping: () => {
      if (isKafkaTarget && kafkaRef.current) {
        return kafkaRef.current.rowMapping()
      }
      const leftColumns: Record<string, any>[] = []
      const rightColumns: Record<string, any>[] = []
      mappings.forEach(([left, right], index) => {
        const leftField = leftFields.find(({ name }) => name === left)!
        const rightField = rightFields.find(({ name }) => name === right)!
        if (leftField && rightField) {
          leftColumns.push({
            format: leftField.formatter,
            index,
            is_part: false,
            name: leftField.name,
            key: leftField.name,
            type: leftField.type,
            value: leftField.default
          })
          rightColumns.push({
            format: rightField.formatter,
            index,
            is_part: false,
            name: rightField.name,
            key: rightField.name,
            type: rightField.type,
            value: rightField.default
          })
        }
      })
      if (leftColumns.length === 0 && rightColumns.length === 0) {
        return null
      }
      const setIndex = (i: Record<string, any>, index1: number) => {
        return {
          ...i,
          index: index1 + 1
        }
      }
      return [leftColumns.map(setIndex), rightColumns.map(setIndex)]
    },
    getOther: () => {
      if (!isHbaseTarget || !hbaseRef.current) {
        return {}
      }
      return hbaseRef.current?.getData()
    }
  }))

  // console.log(mappings)

  // useEffect(() => {
  //   if (mappings.length > 0) {
  //     setLeftFields((fields) => {
  //       const leftMappings = mappings.map(([left]) => left)
  //       const mappingFields = leftMappings.map(
  //         (v) => fields.find((field) => field.name === v)!
  //       )
  //       const filterFields = fields.filter(
  //         (field) => !leftMappings.includes(field.name)
  //       )
  //       return [...mappingFields, ...filterFields]
  //     })

  //     setRightFields((fields) => {
  //       const rightMappings = mappings.map(([, right]) => right)
  //       const mappingFields = rightMappings.map(
  //         (v) => fields.find((field) => field.name === v)!
  //       )
  //       const filterFields = fields.filter(
  //         (field) => !rightMappings.includes(field.name)
  //       )
  //       return [...mappingFields, ...filterFields]
  //     })
  //   }
  // }, [mappings])

  useEffect(() => {
    const jsPlumbInst = jsPlumbInstRef.current
    if (!jsPlumbInst) {
      return
    }
    // if (jsPlumbInst.getAllConnections().length === 0 && mappings.length > 0) {
    if (mappings.length > 0) {
      mappings.forEach(([left, right]) => {
        const leftField = leftFields.find((f) => f.name === left)
        const rightField = rightFields.find((f) => f.name === right)
        if (leftField && rightField) {
          jsPlumbInst.connect({
            uuids: [leftField.uuid, rightField.uuid]
          })
        }
      })
    }
    jsPlumbInst.repaintEverything()
  }, [leftFields, rightFields, mappings])

  useMount(() => {
    const instance = jsPlumb.getInstance({
      Container: containerRef.current,
      Connector: 'Straight',
      ConnectionOverlays: [
        [
          'Arrow',
          {
            location: 1,
            width: 12,
            length: 10,
            paintStyle: {
              fill: '#15a675',
              stroke: '#15a675'
            }
          }
        ]
      ]
    })
    jsPlumbInstRef.current = instance

    instance.bind('connection', (info, event) => {
      if (event) {
        const { connection } = info
        const { Left: leftAnchor, Right: rightAnchor } = connection.getParameters()

        setMappings((items) => {
          const filterItems = items.filter(
            ([l, r]) => l !== rightAnchor.name && r !== leftAnchor.name
          )
          return [...filterItems, [rightAnchor.name, leftAnchor.name]]
        })
      }
    })
    instance.bind('connectionDetached', ({ connection }, event) => {
      if (event) {
        const { Left: leftAnchor, Right: rightAnchor } = connection.getParameters()
        setMappings((items) =>
          items.filter(([l, r]) => l !== rightAnchor.name && r !== leftAnchor.name)
        )
      }
    })
    instance.bind('contextmenu', (component, event) => {
      const conIds = instance.getAllConnections().map((c) => c.id)
      const compId = get(component, 'id')
      event.preventDefault()
      if (compId && conIds.includes(compId)) {
        selectedConnection.current = component as any
        setVisible(true)
      }
    })
  })

  useUnmount(() => {
    const jsPlumbInst = jsPlumbInstRef.current
    if (jsPlumbInst) {
      jsPlumbInst.cleanupListeners()
      jsPlumbInst.reset()
      jsPlumbInstRef.current = undefined
    }
    setMappings([])
  })

  const handleParallel = () => {
    if (mappings.length > 0) {
      setLeftFields((fields) => {
        const leftMappings = mappings.map(([left]) => left)
        const mappingFields = leftMappings.map((v) => fields.find((field) => field.name === v)!)
        const filterFields = fields.filter((field) => !leftMappings.includes(field.name))
        return [...mappingFields, ...filterFields]
      })

      setRightFields((fields) => {
        const rightMappings = mappings.map(([, right]) => right)
        const mappingFields = rightMappings.map((v) => fields.find((field) => field.name === v)!)
        const filterFields = fields.filter((field) => !rightMappings.includes(field.name))
        return [...mappingFields, ...filterFields]
      })
    }
  }

  const handleNameMapping = () => {
    const jsPlumbInst = jsPlumbInstRef.current
    jsPlumbInst?.deleteEveryConnection()
    const filterMapping = intersectionBy(leftFields, rightFields, 'name')
    if (!isEmpty(filterMapping)) {
      setMappings(filterMapping.map((v) => [v.name, v.name]))
    }
  }

  const handleRowMapping = () => {
    const jsPlumbInst = jsPlumbInstRef.current
    jsPlumbInst?.deleteEveryConnection()
    const len = Math.min(leftFields.length, rightFields.length)

    setMappings(leftFields.filter((_, i) => i < len).map((v, i) => [v.name, rightFields[i].name]))
  }

  const handleClearMapping = () => {
    const jsPlumbInst = jsPlumbInstRef.current
    jsPlumbInst?.deleteEveryConnection()
    setMappings([])
  }

  const handleReset = () => {
    handleClearMapping()
    onReInit()
    // setLeftFields(leftFieldsProp)
    // setRightFields(rightFieldsProp)
  }

  const handleDeleteConnection = () => {
    const connection = selectedConnection.current
    if (connection) {
      const jsPlumbInst = jsPlumbInstRef.current
      const { Left: leftAnchor, Right: rightAnchor } = connection.getParameters()
      setMappings((items) =>
        items.filter(([l, r]) => l !== rightAnchor.name && r !== leftAnchor.name)
      )
      jsPlumbInst?.deleteConnection(connection)
      setVisible(false)
    }
  }

  const moveItem = useCallback((dragId: string, hoverId: string, isTop = false) => {
    setLeftFields((fields) => {
      const dragFieldIndex = fields.findIndex((field) => field.uuid === dragId)!
      const dragField = fields[dragFieldIndex]
      const newFields = [...fields]

      newFields.splice(dragFieldIndex, 1)
      const hoverFieldIndex = newFields.findIndex((field) => field.uuid === hoverId)!
      newFields.splice(isTop ? 0 : hoverFieldIndex + 1, 0, dragField)
      return newFields
    })
  }, [])

  const moveItemRight = useCallback((dragId: string, hoverId: string, isTop = false) => {
    setRightFields((fields) => {
      const dragFieldIndex = fields.findIndex((field) => field.uuid === dragId)!
      const dragField = fields[dragFieldIndex]
      const newFields = [...fields]

      newFields.splice(dragFieldIndex, 1)
      const hoverFieldIndex = newFields.findIndex((field) => field.uuid === hoverId)!
      newFields.splice(isTop ? 0 : hoverFieldIndex + 1, 0, dragField)
      return newFields
    })
  }, [])

  const addCustomField = () => {
    const hasUnFinish = leftFields.find(() => false)
    if (!hasUnFinish) {
      setLeftFields((fields) => [
        ...fields,
        {
          name: '',
          type: '',
          custom: true,
          default: '',
          isEditing: true,
          uuid: nanoid()
        }
      ])
    }
  }

  const addCustomFieldRight = () => {
    const hasUnFinish = rightFields.find(() => false)
    if (!hasUnFinish) {
      setRightFields((fields) => [
        ...fields,
        {
          name: '',
          type: '',
          custom: true,
          default: '',
          isEditing: true,
          uuid: nanoid()
        }
      ])
    }
  }

  // console.log(leftFields)

  const keepEditingField = (field: TMappingField, index?: number) => {
    const old = leftFields[index!]
    setLeftFields((fields) => {
      const newFields = [...fields]
      const itemIndex = index === undefined ? newFields.length - 1 : index

      newFields[itemIndex] = omit(
        {
          ...newFields[itemIndex],
          ...field
        },
        field.custom ? ['isEditing'] : ['isEditing', 'custom', 'default']
      )
      return newFields
    })
    setMappings((item) => {
      return item.map(([l, r]) => {
        if (l === old.name) {
          return [field.name, r]
        }
        return [l, r]
      })
    })
  }
  // console.log(222222222222, leftFields, leftFieldsProp, mappingsProp, mappings)

  const keepEditingFieldRight = (field: TMappingField, index?: number) => {
    const old = rightFields[index!]
    setRightFields((fields) => {
      const newFields = [...fields]
      const itemIndex = index === undefined ? newFields.length - 1 : index

      newFields[itemIndex] = omit(
        {
          ...newFields[itemIndex],
          ...field
        },
        field.custom ? ['isEditing'] : ['isEditing', 'custom', 'default']
      )
      return newFields
    })
    setMappings((item) => {
      return item.map(([l, r]) => {
        if (r === old.name) {
          return [l, field.name]
        }
        return [l, r]
      })
    })
  }

  const cancelAddCustomField = (field: TMappingField, index: number) => {
    // setLeftFields((fields) => fields.slice(0, -1)useSetRealtimeColumns)

    setLeftFields((fields) => {
      if (fields[index].name === '') {
        return fields.filter((_, i) => i !== index)
      }
      const newFields = [...fields]
      newFields[index] = omit(newFields[index], ['isEditing'])
      return newFields
    })
  }

  const cancelAddCustomFieldRight = (field: TMappingField, index: number) => {
    setRightFields((fields) => {
      if (fields[index].name === '') {
        return fields.filter((_, i) => i !== index)
      }
      const newFields = [...fields]
      newFields[index] = omit(newFields[index], ['isEditing'])
      return newFields
    })
  }

  if (!sourceId && !targetId) {
    return (
      <Root>
        <Alert
          message="提示：选择来源端与目的端的数据源，才会显示字段映射。"
          type="info"
          linkBtn={
            <HelpCenterLink
              href="/manual/integration_job/create_job_offline_1/#配置字段映射"
              isIframe={false}
              hasIcon={false}
            >
              查看详情 →
            </HelpCenterLink>
          }
        />
      </Root>
    )
  }

  function showSource() {
    if (
      [
        SourceType.Mysql,
        SourceType.PostgreSQL,
        SourceType.SqlServer
        // @ts-ignore
      ].includes(leftTypeName?.getType?.()) &&
      !leftFields.length
    ) {
      return false
    }
    if (!sourceId) {
      return false
    }
    return true
  }

  function showTarget() {
    if (
      [
        SourceType.Mysql,
        SourceType.PostgreSQL,
        SourceType.SqlServer,
        SourceType.MongoDB
        // @ts-ignore
      ].includes(rightTypeName?.getType?.()) &&
      !rightFields.length
    ) {
      return false
    }
    if (!targetId) {
      return false
    }
    return true
  }

  function showHeader() {
    if (
      [
        SourceType.HBase,
        SourceType.Kafka
        // SourceType.SqlServer,
        // SourceType.MongoDB
        // @ts-ignore
      ].includes(rightTypeName?.getType?.())
    ) {
      return false
    }
    return true
  }

  function renderTarget() {
    if (!showTarget()) {
      return <EmptyFieldWrapper>选择目的端数据源表（可获取表结构）后显示字段</EmptyFieldWrapper>
    }
    if (isKafkaTarget) {
      const filter = isRealSqlKafka
        ? leftFields
        : leftFields?.filter((field) => (mappings ?? []).map(([, i]) => i).includes(field.name))
      return (
        <div css={[styles.wrapper, styles.borderX]}>
          <KafkaFieldMappings
            sourceColumns={leftFields}
            ref={kafkaRef}
            ids={filter.map((i) => i.uuid)}
          />
        </div>
      )
    }

    const targetReadonly = [
      SourceType.Mysql,
      SourceType.PostgreSQL,
      SourceType.SqlServer,
      SourceType.ClickHouse,
      SourceType.SapHana,
      SourceType.DB2
    ].includes((rightTypeName as any)?.getType?.())

    return (
      <div css={styles.wrapper}>
        <div css={styles.borderX}>
          <FieldRow isHeader isReverse>
            <div>
              {isHbaseTarget ? (
                <AffixLabel
                  theme="green"
                  required={false}
                  help="来源字段连线到当前 rowkey 时，通过该连接符连接多个来源字段值，作为一行的 rowkey 写入 HBase "
                >
                  类型
                </AffixLabel>
              ) : (
                '类型'
              )}
            </div>
            <div>{isHbaseTarget ? 'valueColumn 字段' : '目标表字段'}</div>
          </FieldRow>
          {rightFields.map((item, i) => {
            return (
              <MappingItem
                jsplumb={jsPlumbInstRef.current}
                key={item.uuid}
                anchor="Left"
                item={item}
                index={i}
                hasConnection={!!mappings.find(([, r]) => r === item?.name)}
                typeName={rightTypeName}
                moveItem={moveItemRight}
                onOk={(info, index) => {
                  keepEditingFieldRight(info, index)
                }}
                config={config.target}
                onCancel={cancelAddCustomFieldRight}
                deleteItem={(field) => {
                  setRightFields((fields) => fields.filter((f) => f.uuid !== field.uuid))
                  setMappings((prevMappings) => prevMappings.filter(([, r]) => r !== field.name))
                }}
                exist={(name: string) => !!rightFields.find((f) => f.name === name)}
                getDeleteField={(name: string) => {
                  const delItem = rightFieldsProp.find((f) => f.name === name)
                  const existItem = rightFields.find((f) => f.name === name)
                  if (delItem && !existItem) {
                    return delItem
                  }
                  return undefined
                }}
                readonly={targetReadonly}
              />
            )
          })}
          {!readonly && config.target.add && (
            <Center tw="bg-neut-16 cursor-pointer h-8" onClick={addCustomFieldRight}>
              <Icon name="add" type="light" />
              添加字段
            </Center>
          )}
        </div>
        {(rightTypeName as any)?.getType() === SourceType.HBase && (
          <HbaseFieldMappings sourceColumns={leftFields} ref={hbaseRef} />
        )}
      </div>
    )
  }

  const getLeftFields = () => {
    return leftFields
  }

  function renderHbaseRowKey() {
    if (!isHbaseSource) {
      return null
    }
    return (
      <FieldRow tw="cursor-default">
        <div>{hbaseSourceType}</div>
        <div>rowkey</div>
        <div tw="text-neut-8">不可编辑</div>
      </FieldRow>
    )
  }

  return (
    <Root>
      <div tw="relative">
        {topHelp && <Center tw="absolute left-0 bottom-0">{topHelp}</Center>}
        {hasHeader && !showHeader() && (
          <Center>
            由于当前数据目的情况比较灵活，暂不提供快捷映射方式，请按照提示进行拖拽操作
          </Center>
        )}
        {hasHeader && showHeader() && (
          <Center tw="gap-4">
            <OutlinedGreenButton
              type="outlined"
              onClick={handleParallel}
              disabled={!(leftFields.length && rightFields.length)}
            >
              全部平行
            </OutlinedGreenButton>
            {
              // eslint-disable-next-line no-nested-ternary
              intersectionBy(leftFields, rightFields, 'name').length ? (
                mappings.length ? (
                  <PopConfirm
                    type="warning"
                    okType="danger"
                    okText="确认"
                    content="同名映射可能会覆盖之前自定义映射，确定同名映射么？"
                    onOk={handleNameMapping}
                  >
                    <OutlinedGreenButton type="outlined">同名映射</OutlinedGreenButton>
                  </PopConfirm>
                ) : (
                  <OutlinedGreenButton type="outlined" onClick={handleNameMapping}>
                    同名映射
                  </OutlinedGreenButton>
                )
              ) : (
                <Tooltip content="暂无同名字段" theme="light" hasPadding>
                  <OutlinedGreenButton type="outlined" disabled>
                    同名映射
                  </OutlinedGreenButton>
                </Tooltip>
              )
            }
            {mappings.length ? (
              <PopConfirm
                type="warning"
                okText="确认"
                content="同行映射可能会覆盖之前自定义映射，确定同行映射么？"
                onOk={handleRowMapping}
              >
                <OutlinedGreenButton
                  type="outlined"
                  disabled={!(leftFields.length && rightFields.length)}
                >
                  同行映射
                </OutlinedGreenButton>
              </PopConfirm>
            ) : (
              <OutlinedGreenButton
                type="outlined"
                onClick={handleRowMapping}
                disabled={!(leftFields.length && rightFields.length)}
              >
                同行映射
              </OutlinedGreenButton>
            )}
            <PopConfirm
              content="取消映射会去除所有现有映射，确定取消映射么？"
              type="warning"
              okText="解除全部映射"
              okType="danger"
              onOk={handleClearMapping}
            >
              <Button type="black" disabled={!mappings.length}>
                解除全部映射
              </Button>
            </PopConfirm>
            <PopConfirm
              content="置为初始状态会重新将表结构恢复到获取时的状态且去掉已有的映射和新增字段，确认置为初始状态么？"
              type="warning"
              okText="置为初始状态"
              okType="danger"
              onOk={handleReset}
            >
              <Button type="black">置为初始状态</Button>
            </PopConfirm>
          </Center>
        )}
      </div>
      <Container ref={containerRef}>
        <FlexBox tw="flex items-start transition-all duration-500 overflow-x-auto">
          {showSource() ? (
            <div css={[styles.wrapper, styles.borderX]}>
              <FieldRow isHeader>
                <div>类型</div>
                <div>来源表字段</div>
              </FieldRow>
              {renderHbaseRowKey()}
              {getLeftFields().map((item, i) => (
                <MappingItem
                  jsplumb={jsPlumbInstRef.current}
                  // hasMoreAction={!isKafkaSource}
                  item={item}
                  key={item.name}
                  index={i}
                  config={config.source}
                  isLeft={false}
                  hasConnection={!!mappings.find(([l]) => l === item?.name)}
                  anchor="Right"
                  typeName={leftTypeName}
                  moveItem={moveItem}
                  onOk={(info, index) => {
                    keepEditingField(info, index)
                  }}
                  onCancel={cancelAddCustomField}
                  deleteItem={(field) => {
                    setLeftFields((fields) => fields.filter((f) => f.uuid !== field.uuid))
                    setMappings((prevMappings) => prevMappings.filter(([l]) => l !== field.name))
                  }}
                  exist={(name: string) => !!leftFields.find((f) => f.name === name)}
                  getDeleteField={(name: string) => {
                    const delItem = leftFieldsProp.find((f) => f.name === name)
                    const existItem = leftFields.find((f) => f.name === name)
                    if (delItem && !existItem) {
                      return delItem
                    }
                    return undefined
                  }}
                />
              ))}
              {!readonly && config.source.add && (
                <Center tw="bg-neut-16 cursor-pointer h-8" onClick={addCustomField}>
                  <Icon name="add" type="light" />
                  添加字段
                </Center>
              )}
            </div>
          ) : (
            <EmptyFieldWrapper>选择来源端数据源表（可获取表结构）后显示字段</EmptyFieldWrapper>
          )}
          <Tippy
            followCursor="initial"
            plugins={[followCursor]}
            visible={visible}
            onClickOutside={() => setVisible(false)}
            content={
              <div
                tw="border border-neut-13 rounded-sm p-2.5 cursor-pointer flex items-center gap-1.5 hover:bg-neut-16"
                onClick={handleDeleteConnection}
              >
                <Icon name="trash" type="light" />
                <span>解除映射</span>
              </div>
            }
            interactive
            arrow={false}
            placement="right-start"
            theme="darker"
            duration={[100, 0]}
            offset={[5, 5]}
            appendTo={() => document.body}
          >
            <div tw="w-1/12 self-stretch min-w-[32px]" onContextMenu={(e) => e.preventDefault()} />
          </Tippy>
          {renderTarget()}
        </FlexBox>
      </Container>
    </Root>
  )
})
