import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { Connection, jsPlumb, jsPlumbInstance } from 'jsplumb'
import { useMount, useUnmount, useMeasure } from 'react-use'
import tw, { css, styled } from 'twin.macro'
import { intersectionBy, isEmpty, get } from 'lodash-es'
import { Button, Icon, Alert, Select, Input } from '@QCFE/lego-ui'
import Tippy from '@tippyjs/react'
import { nanoid } from 'nanoid'
import { followCursor } from 'tippy.js'
import { Center } from 'components/Center'
import { FlexBox } from 'components/Box'
import { HelpCenterLink } from 'components/Link'
import MappingItem, { TMappingField } from './MappingItem'
import { PopConfirm } from '../PopConfirm'
/* @refresh reset */
const styles = {
  wrapper: tw`border flex-1 border-neut-13 text-center`,
  grid: tw`grid grid-cols-[1fr 2fr 100px] border-b border-neut-13 last:border-b-0 p-1.5 leading-5`,
  header: tw`bg-neut-16`,
  row: tw`hover:bg-[#1E2F41] cursor-move`,
  add: tw`bg-neut-16 text-white`,
}

const Root = styled.div`
  ${tw`text-white space-y-2`}
`
const EmptyFieldWrapper = styled(Center)(() => [
  styles.wrapper,
  tw`self-stretch text-neut-8`,
])

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
  const [extralFields, setExtralFields] = useState<TMappingField[]>([])
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
    if (jsPlumbInstRef.current) {
      jsPlumbInstRef.current.repaintEverything()
    }
  }, [rect.width])

  // console.log(mappings)

  useEffect(() => {
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
  }, [mappings])

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
          // console.log('in 3', leftUUID, rightUUID)
          jsPlumbInst.connect({
            uuids: [`Right-${leftField.name}`, `Left-${rightField.name}`],
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
          (field) => field.name === dragId
        )!
        const dragField = fields[dragFieldIndex]
        const newFields = [...fields]

        newFields.splice(dragFieldIndex, 1)
        const hoverFieldIndex = newFields.findIndex(
          (field) => field.name === hoverId
        )!
        newFields.splice(isTop ? 0 : hoverFieldIndex + 1, 0, dragField)
        return newFields
      })
    },
    []
  )

  const addField = () => {
    const hasUnFinish = extralFields.find((field) => !field.name)
    if (!hasUnFinish) {
      setExtralFields((fields) => {
        return [...fields, { name: '', type: '', id: nanoid() }]
      })
    }
  }

  // console.log('extralFields', extralFields)

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
          <PopConfirm
            type="warning"
            okType="danger"
            okText="确认"
            content="同名映射可能会覆盖之前自定义映射，确定同名映射么？"
            onOk={handleNameMapping}
          >
            <Button type="black">同名映射</Button>
          </PopConfirm>
          <PopConfirm
            type="warning"
            okText="确认"
            content="同行映射可能会覆盖之前自定义映射，确定同行映射么？"
            onOk={handleRowMapping}
          >
            <Button type="black">同行映射</Button>
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
              <div css={[styles.grid, styles.header]}>
                <div>类型</div>
                <div>来源表字段</div>
              </div>
              {leftFields.map((item, i) => (
                <MappingItem
                  jsplumb={jsPlumbInstRef.current}
                  item={item}
                  key={item.name}
                  index={i}
                  hasConnection={!!mappings.find(([l]) => l === item.name)}
                  css={[styles.grid, styles.row]}
                  anchor="Right"
                  moveItem={moveItem}
                >
                  <div>{item.type}</div>
                  <div>{item.name}</div>
                </MappingItem>
              ))}
              {extralFields.map((item) => (
                <div
                  css={[styles.grid, styles.row, tw`cursor-text`]}
                  key={item.id}
                >
                  <div>
                    <Select
                      css={css`
                        .select-control {
                          ${tw`h-7`}
                        }
                        .select-input {
                          ${tw`h-auto`}
                        }
                      `}
                      options={[
                        {
                          value: 'VARCHAR',
                          label: 'VARCHAR',
                        },
                        {
                          value: 'INT',
                          label: 'INT',
                        },
                        {
                          value: 'BIGINT',
                          label: 'BIGINT',
                        },
                      ]}
                    />
                  </div>
                  <div>
                    <Input type="text" placeholder="请输入用户名" />
                  </div>
                </div>
              ))}
              <Center tw="bg-neut-16 cursor-pointer h-8" onClick={addField}>
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
              <div css={[styles.grid, styles.header]}>
                <div>目标表字段</div>
                <div>类型</div>
              </div>
              {rightFields.map((item, i) => {
                return (
                  <MappingItem
                    jsplumb={jsPlumbInstRef.current}
                    key={item.name}
                    css={[styles.grid, styles.row]}
                    anchor="Left"
                    item={item}
                    index={i}
                  >
                    <div>{item.name}</div>
                    <div>{item.type}</div>
                  </MappingItem>
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
