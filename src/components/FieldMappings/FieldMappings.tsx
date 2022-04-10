import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { Connection, jsPlumb, jsPlumbInstance } from 'jsplumb'
import { useMount, useUnmount, useMeasure } from 'react-use'
import tw, { styled } from 'twin.macro'
import { intersectionBy, isEmpty, get, omit } from 'lodash-es'
import { Button, Icon, Alert } from '@QCFE/lego-ui'
import { nanoid } from 'nanoid'
import Tippy from '@tippyjs/react'
import { followCursor } from 'tippy.js'
import { Center } from 'components/Center'
import { FlexBox } from 'components/Box'
import { HelpCenterLink } from 'components/Link'
import MappingItem, { TMappingField, FieldRow } from './MappingItem'
import { PopConfirm } from '../PopConfirm'

/* @refresh reset */
const styles = {
  wrapper: tw`border flex-1 border-neut-13`,
  fieldType: tw`w-44 pl-5 xl:pl-12`,
  row: tw`flex border-b border-neut-13 last:border-b-0 p-1.5`,
  // row: tw`grid grid-template-columns[1fr 1.5fr 48px] text-left border-b border-neut-13 last:border-b-0 p-1.5`,
  header: tw`bg-neut-16`,
  rowbody: tw`hover:bg-[#1E2F41]`,
  // column: tw`w-44`,
  add: tw`bg-neut-16 text-white`,
}

const Root = styled.div`
  ${tw`text-white space-y-2`}
`
const EmptyFieldWrapper = styled(Center)(() => [
  styles.wrapper,
  tw`self-stretch text-neut-8`,
])

const OutlinedGreenButton = styled(Button)(() => tw`text-green-11!`)

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

export interface IFieldMappingsProps {
  onChange?: (value: Record<string, any>) => void
  leftFields: TMappingField[]
  rightFields: TMappingField[]
  topHelp?: ReactNode
  mappings?: [string, string][]
}

export interface IFieldMappingsRecord {
  rowMapping: () => void
  nameMapping: () => void
  clear: () => void
}

export const FieldMappings = (props: IFieldMappingsProps) => {
  const {
    leftFields: leftFieldsProp,
    rightFields: rightFieldsProp,
    topHelp,
    mappings: mappingsProp = [],
  } = props

  const [leftFields, setLeftFields] = useState(leftFieldsProp)
  const [rightFields, setRightFields] = useState(rightFieldsProp)
  const jsPlumbInstRef = useRef<jsPlumbInstance>()
  const [mappings, setMappings] = useState<[string, string][]>(mappingsProp)
  const [visible, setVisible] = useState<boolean>(false)
  const selectedConnection = useRef<Connection>()

  const [containerRef, rect] = useMeasure<HTMLDivElement>()

  useEffect(() => {
    setLeftFields(leftFieldsProp)
    setMappings([])
  }, [leftFieldsProp])

  useEffect(() => {
    setRightFields(rightFieldsProp)
    setMappings([])
  }, [rightFieldsProp])

  useEffect(() => {
    jsPlumbInstRef.current?.repaintEverything()
  }, [rect.width])

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
    if (jsPlumbInst.getAllConnections().length === 0 && mappings.length > 0) {
      mappings.forEach(([left, right]) => {
        const leftField = leftFields.find((f) => f.name === left)
        const rightField = rightFields.find((f) => f.name === right)
        if (leftField && rightField) {
          jsPlumbInst.connect({
            uuids: [leftField.uuid, rightField.uuid],
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
              stroke: '#15a675',
            },
          },
        ],
      ],
    })
    jsPlumbInstRef.current = instance

    instance.bind('connection', (info, event) => {
      if (event) {
        const { connection } = info
        const { Left: leftAnchor, Right: rightAnchor } =
          connection.getParameters()

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
        const { Left: leftAnchor, Right: rightAnchor } =
          connection.getParameters()
        setMappings((items) =>
          items.filter(
            ([l, r]) => l !== rightAnchor.name && r !== leftAnchor.name
          )
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
        const mappingFields = leftMappings.map(
          (v) => fields.find((field) => field.name === v)!
        )
        const filterFields = fields.filter(
          (field) => !leftMappings.includes(field.name)
        )
        return [...mappingFields, ...filterFields]
      })

      setRightFields((fields) => {
        const rightMappings = mappings.map(([, right]) => right)
        const mappingFields = rightMappings.map(
          (v) => fields.find((field) => field.name === v)!
        )
        const filterFields = fields.filter(
          (field) => !rightMappings.includes(field.name)
        )
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

    setMappings(
      leftFields
        .filter((_, i) => i < len)
        .map((v, i) => [v.name, rightFields[i].name])
    )
  }

  const handleClearMapping = () => {
    const jsPlumbInst = jsPlumbInstRef.current
    jsPlumbInst?.deleteEveryConnection()
    setMappings([])
  }

  const handleReset = () => {
    handleClearMapping()
    setLeftFields(leftFieldsProp)
    setRightFields(rightFieldsProp)
  }

  const handleDeleteConnection = () => {
    const connection = selectedConnection.current
    if (connection) {
      const jsPlumbInst = jsPlumbInstRef.current
      const { Left: leftAnchor, Right: rightAnchor } =
        connection.getParameters()
      setMappings((items) =>
        items.filter(
          ([l, r]) => l !== rightAnchor.name && r !== leftAnchor.name
        )
      )
      jsPlumbInst?.deleteConnection(connection)
      setVisible(false)
    }
  }

  const moveItem = useCallback(
    (dragId: string, hoverId: string, isTop = false) => {
      setLeftFields((fields) => {
        const dragFieldIndex = fields.findIndex(
          (field) => field.uuid === dragId
        )!
        const dragField = fields[dragFieldIndex]
        const newFields = [...fields]

        newFields.splice(dragFieldIndex, 1)
        const hoverFieldIndex = newFields.findIndex(
          (field) => field.uuid === hoverId
        )!
        newFields.splice(isTop ? 0 : hoverFieldIndex + 1, 0, dragField)
        return newFields
      })
    },
    []
  )

  const addCustomField = () => {
    const hasUnFinish = leftFields.find(
      (field) => field.custom && field.default === ''
    )
    if (!hasUnFinish) {
      setLeftFields((fields) => [
        ...fields,
        {
          name: '',
          type: '',
          custom: true,
          default: '',
          isEditing: true,
          uuid: nanoid(),
        },
      ])
    }
  }

  // console.log(leftFields)

  const keepEditingField = (field: TMappingField, index?: number) => {
    setLeftFields((fields) => {
      const newFields = [...fields]
      const itemIndex = index === undefined ? newFields.length - 1 : index

      newFields[itemIndex] = omit(
        {
          ...newFields[itemIndex],
          ...field,
        },
        field.custom ? ['isEditing'] : ['isEditing', 'custom', 'default']
      )
      return newFields
    })
  }
  const cancelAddCustomField = (field: TMappingField, index: number) => {
    // setLeftFields((fields) => fields.slice(0, -1))

    setLeftFields((fields) => {
      if (fields[index].name === '') {
        return fields.filter((_, i) => i !== index)
      }
      const newFields = [...fields]
      newFields[index] = omit(newFields[index], ['isEditing'])
      return newFields
    })
  }

  if (leftFields.length === 0 && rightFields.length === 0) {
    return (
      <Root>
        <Alert
          message="提示：选择来源端与目的端的数据源与表，才会显示字段映射。"
          type="info"
          linkBtn={
            <HelpCenterLink href="/xxx" isIframe={false} hasIcon={false}>
              查看详情 →
            </HelpCenterLink>
          }
        />
      </Root>
    )
  }

  return (
    <Root>
      <div tw="relative">
        {topHelp && <Center tw="absolute left-0 bottom-0">{topHelp}</Center>}
        <Center tw="gap-4">
          <OutlinedGreenButton type="outlined" onClick={handleParallel}>
            全部平行
          </OutlinedGreenButton>
          <PopConfirm
            type="warning"
            okType="danger"
            okText="确认"
            content="同名映射可能会覆盖之前自定义映射，确定同名映射么？"
            onOk={handleNameMapping}
          >
            <OutlinedGreenButton type="outlined">同名映射</OutlinedGreenButton>
          </PopConfirm>
          <PopConfirm
            type="warning"
            okText="确认"
            content="同行映射可能会覆盖之前自定义映射，确定同行映射么？"
            onOk={handleRowMapping}
          >
            <OutlinedGreenButton type="outlined">同行映射</OutlinedGreenButton>
          </PopConfirm>
          <PopConfirm
            content="取消映射会去除所有现有映射，确定取消映射么？"
            type="warning"
            okText="解除全部映射"
            okType="danger"
            onOk={handleClearMapping}
          >
            <Button type="black">解除全部映射</Button>
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
      </div>
      <Container ref={containerRef}>
        <FlexBox tw="flex items-start transition-all duration-500">
          {leftFields.length ? (
            <div css={styles.wrapper}>
              <FieldRow isHeader>
                <div>类型</div>
                <div>来源表字段</div>
              </FieldRow>
              {leftFields.map((item, i) => (
                <MappingItem
                  jsplumb={jsPlumbInstRef.current}
                  item={item}
                  key={item.name}
                  index={i}
                  hasConnection={!!mappings.find(([l]) => l === item.name)}
                  anchor="Right"
                  moveItem={moveItem}
                  onOk={(info, index) => {
                    keepEditingField(info, index)
                  }}
                  onCancel={cancelAddCustomField}
                  deleteItem={(field) => {
                    setLeftFields((fields) =>
                      fields.filter((f) => f.uuid !== field.uuid)
                    )
                    setMappings((prevMappings) =>
                      prevMappings.filter(([l]) => l !== field.name)
                    )
                  }}
                  exist={(name: string) =>
                    !!leftFields.find((f) => f.name === name)
                  }
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
              <Center
                tw="bg-neut-16 cursor-pointer h-8"
                onClick={addCustomField}
              >
                <Icon name="add" type="light" />
                添加字段
              </Center>
            </div>
          ) : (
            <EmptyFieldWrapper>
              选择来源端数据源表（可获取表结构）后显示字段
            </EmptyFieldWrapper>
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
            <div
              tw="w-1/12 self-stretch"
              onContextMenu={(e) => e.preventDefault()}
            />
          </Tippy>
          {rightFields.length ? (
            <div css={styles.wrapper}>
              <FieldRow isHeader isReverse>
                <div>类型</div>
                <div>目标表字段</div>
              </FieldRow>
              {rightFields.map((item, i) => {
                return (
                  <MappingItem
                    jsplumb={jsPlumbInstRef.current}
                    key={item.name}
                    anchor="Left"
                    item={item}
                    index={i}
                  />
                )
              })}
            </div>
          ) : (
            <EmptyFieldWrapper>
              选择目的端数据源表（可获取表结构）后显示字段
            </EmptyFieldWrapper>
          )}
        </FlexBox>
      </Container>
    </Root>
  )
}
