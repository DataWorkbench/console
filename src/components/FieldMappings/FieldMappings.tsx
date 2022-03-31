import { ReactNode, useEffect, useRef, useState } from 'react'
import { jsPlumb, jsPlumbInstance } from 'jsplumb'
import { useMount, useUnmount } from 'react-use'
import tw, { styled } from 'twin.macro'
import { intersectionBy } from 'lodash-es'
import { Button, Icon } from '@QCFE/lego-ui'
import { Center } from 'components/Center'
import { FlexBox } from 'components/Box'
import MappingItem from './MappingItem'
import { PopConfirm } from '../PopConfirm'
/* @refresh reset */
const styles = {
  wrapper: tw`border flex-1 border-neut-13 text-center`,
  grid: tw`grid grid-cols-[1fr 2fr 100px] border-b border-neut-13 last:border-b-0 p-1.5 leading-5`,
  header: tw`bg-neut-16`,
  row: tw`hover:bg-[#1E2F41]`,
  add: tw`bg-neut-16 text-white`,
}

const Root = styled.div`
  ${tw`text-white space-y-2`}
`

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
          ${tw`opacity-100`}
        }
      }
      &.jtk-endpoint-drop-allowed {
        ${tw`opacity-100`}
      }
    }
  }
  .jtk-connector {
    ${tw`z-10`}
  }
  [anchor='Left'].jtk-managed {
    ${tw`select-none`}
  }
`

export type TField = {
  type: string
  name: string
  uuid: string
  is_primary_key?: boolean
}

export interface IFieldMappingsProps {
  onChange: (value: Record<string, any>) => void
  leftFields: TField[]
  rightFields: TField[]
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
  const [jsPlumbInst, setJsPlumbInst] = useState<jsPlumbInstance>()
  const [mappings, setMappings] = useState<[string, string][]>(mappingsProp)

  const containerRef = useRef(null)

  useEffect(() => {
    setLeftFields(leftFieldsProp)
  }, [leftFieldsProp])

  useEffect(() => {
    setRightFields(rightFieldsProp)
  }, [rightFieldsProp])

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
  }, [mappings, jsPlumbInst])

  useEffect(() => {
    if (jsPlumbInst) {
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
    }
  }, [leftFields, rightFields, mappings, jsPlumbInst])

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
    instance.bind('connection', (info, event) => {
      if (event) {
        const { connection } = info
        const { Left: leftAnchor, Right: rightAnchor } =
          connection.getParameters()
        const added = mappings.find(
          ([left, right]) =>
            left === rightAnchor.name || right === leftAnchor.name
        )
        if (!added) {
          setMappings((items) => [
            ...items,
            [rightAnchor.name, leftAnchor.name],
          ])
        }
      }
    })
    instance.bind('connectionDetached', ({ connection }, event) => {
      if (event) {
        const { Left: leftAnchor, Right: rightAnchor } =
          connection.getParameters()
        setMappings((items) =>
          items.filter(
            ([l, r]) => l !== rightAnchor.name || r !== leftAnchor.name
          )
        )
      }
    })
    setJsPlumbInst(instance)
  })
  useUnmount(() => {
    if (jsPlumbInst) {
      jsPlumbInst.cleanupListeners()
      setJsPlumbInst(undefined)
    }
    setMappings([])
  })

  const handleNameMapping = () => {
    jsPlumbInst?.deleteEveryConnection()
    const filterMapping = intersectionBy(leftFields, rightFields, 'name')
    if (filterMapping) {
      setMappings(filterMapping.map((v) => [v.name, v.name]))
    }
  }

  const handleRowMapping = () => {
    jsPlumbInst?.deleteEveryConnection()
    const len = Math.min(leftFields.length, rightFields.length)

    setMappings(
      leftFields
        .filter((_, i) => i < len)
        .map((v, i) => [v.name, rightFields[i].name])
    )
  }

  const handleClearMapping = () => {
    jsPlumbInst?.deleteEveryConnection()
    setMappings([])
  }

  const handleReset = () => {
    handleClearMapping()
    setLeftFields(leftFieldsProp)
    setRightFields(rightFieldsProp)
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
      <Container
        // tw="relative"
        ref={containerRef}
        // mappings={mappings}
        // onChange={changeMappings}
      >
        <FlexBox tw="flex gap-[10%] items-start">
          <div css={styles.wrapper}>
            <div css={[styles.grid, styles.header]}>
              <div>类型</div>
              <div>来源字段</div>
            </div>
            {leftFields.map((item) => {
              return (
                <MappingItem
                  jsplumb={jsPlumbInst}
                  data={item}
                  key={item.name}
                  css={[styles.grid, styles.row]}
                  anchor="Right"
                >
                  <div>{item.type}</div>
                  <div>{item.name}</div>
                </MappingItem>
              )
            })}
            <Center tw="bg-neut-16 cursor-pointer h-8">
              <Icon name="add" type="light" />
              添加字段
            </Center>
          </div>
          <div css={styles.wrapper}>
            <div css={[styles.grid, styles.header]}>
              <div>来源字段</div>
              <div>类型</div>
            </div>
            {rightFields.map((item) => {
              return (
                <MappingItem
                  jsplumb={jsPlumbInst}
                  key={item.name}
                  css={[styles.grid, styles.row]}
                  anchor="Left"
                  data={item}
                >
                  <div>{item.name}</div>
                  <div>{item.type}</div>
                </MappingItem>
              )
            })}
          </div>
        </FlexBox>
      </Container>
    </Root>
  )
}
