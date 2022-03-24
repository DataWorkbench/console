import {
  forwardRef,
  ReactElement,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import tw, { styled } from 'twin.macro'
import { Button as Button1 } from '@QCFE/lego-ui'
import { Center } from '../Center'
import { FlexBox } from '../Box'
import MappingContainer, { IMappingsRef } from './MappingContainer'
import MappingItem from './MappingItem'
import { PopConfirm } from '../PopConfirm'

export interface IFieldMappingsProps {
  // value: Record<string, any>
  onChange: (value: Record<string, any>) => void
  rightFields: Record<string, any>[]
  leftFields: Record<string, any>[]
  topHelp?: ReactElement
  mappings?: [string, string][]
}

export interface IFieldMappingsRecord {
  rowMapping: () => void
  nameMapping: () => void
  clear: () => void
}

const mapItemStyle = {
  wrapper: tw`border border-neut-13 text-white text-center`,
  grid: tw`grid grid-cols-[1fr 2fr 100px] border-b border-neut-13 last:border-b-0 p-1.5 leading-5`,
  header: tw`bg-neut-16`,
  row: tw`hover:bg-[#1E2F41]`,
  add: tw`bg-neut-16 text-white`,
}

const Button = styled(Button1)(() => [tw`border-neut-13!`])

const Root = styled.div``

export const FieldMappings = forwardRef<
  IFieldMappingsRecord,
  IFieldMappingsProps
>((props, ref) => {
  const {
    rightFields: rightFieldsProp,
    leftFields: leftFieldsProp,
    topHelp,
    mappings: mappingsProp = [],
  } = props

  const [rightFields, setRightFields] = useState(rightFieldsProp)
  const [leftFields, setLeftFields] = useState(leftFieldsProp)
  const [mappings, setMappings] = useState(mappingsProp)

  const mappingRef = useRef<IMappingsRef>(null)

  const handleNameMapping = () => {
    const leftMap = new Map(leftFields.map((item) => [item.name, item]))
    const connects: [string, string][] = []
    const rights0: Record<string, any>[] = []
    const rights1: Record<string, any>[] = []
    const lefts0: Record<string, any>[] = []
    const lefts1: Record<string, any>[] = []

    const names = new Set<string>()
    rightFields.forEach((item) => {
      if (leftMap.has(item.name)) {
        names.add(item.name)
        rights0.push(item)
        lefts0.push(leftMap.get(item.name)!)
        connects.push([leftMap.get(item.name)!.uuid, item.uuid])
      } else {
        rights1.push(item)
      }
    })

    leftFields.forEach((item) => {
      if (!names.has(item.name)) {
        lefts1.push(item)
      }
    })
    setLeftFields([...lefts0, ...lefts1])
    setRightFields([...rights0, ...rights1])
    mappingRef.current?.clear?.()

    setMappings(connects)
  }

  const handleRowMapping = () => {
    const length = Math.min(leftFields.length, rightFields.length)
    mappingRef.current?.clear?.()
    setMappings(
      Array.from({ length }, (_, i) => [
        leftFields[i].uuid,
        rightFields[i].uuid,
      ])
    )
  }

  const handleClear = () => {
    mappingRef.current?.clear()
    setMappings([])
  }
  useImperativeHandle(ref, () => ({
    rowMapping: handleRowMapping,
    nameMapping: handleNameMapping,
    clear: handleClear,
  }))

  const changeMappings = (mappings1: [string, string][]) => {
    if (!mappings1.length) {
      setMappings([])
      return
    }
    const leftMap = new Map<string, number>()
    const rightMap = new Map<string, number>()

    mappings1.forEach(([left, right], index) => {
      leftMap.set(left, index)
      rightMap.set(right, index)
    })

    const lefts = [...leftFields]
    const rights = [...rightFields]

    lefts.sort((x, y) => {
      const x1 = leftMap.get(x.uuid) ?? Number.MAX_SAFE_INTEGER
      const y1 = leftMap.get(y.uuid) ?? Number.MAX_SAFE_INTEGER
      return x1 - y1
    })

    rights.sort((x, y) => {
      const x1 = rightMap.get(x.uuid) ?? Number.MAX_SAFE_INTEGER
      const y1 = rightMap.get(y.uuid) ?? Number.MAX_SAFE_INTEGER
      return x1 - y1
    })
    setLeftFields(lefts)
    setRightFields(rights)
    // mappingRef.current?.clear?.()
    setMappings(mappings1)
  }

  return (
    <Root>
      <div tw="relative mb-2">
        {topHelp && <Center tw="absolute left-0 bottom-0">{topHelp}</Center>}
        <Center tw="gap-4">
          <PopConfirm
            type="warning"
            // okType="danger"
            okText="确认"
            content="同名映射可能会覆盖之前自定义映射，确定同名映射么？"
            onOk={handleNameMapping}
          >
            <Button type="outlined">同名映射</Button>
          </PopConfirm>
          <PopConfirm
            type="warning"
            okText="确认"
            content="同行映射可能会覆盖之前自定义映射，确定同行映射么？"
            onOk={handleRowMapping}
          >
            <Button type="outlined">同行映射</Button>
          </PopConfirm>
          <PopConfirm
            content="取消映射会去除所有现有映射，确定取消映射么？"
            type="warning"
            okText="解除全部映射"
            okType="danger"
            onOk={handleClear}
          >
            <Button type="outlined">解除全部映射</Button>
          </PopConfirm>
        </Center>
      </div>
      <MappingContainer
        tw="relative"
        ref={mappingRef}
        mappings={mappings}
        onChange={changeMappings}
      >
        <FlexBox tw="gap-[200px]">
          <div tw="flex-auto">
            <div css={mapItemStyle.wrapper}>
              <div css={[mapItemStyle.grid, mapItemStyle.header]}>
                <div>类型</div>
                <div>来源字段</div>
              </div>
              {leftFields.map((item) => {
                return (
                  <MappingItem
                    data={item}
                    key={item.uuid}
                    css={[mapItemStyle.grid, mapItemStyle.row]}
                    type="right"
                  >
                    <div>{item.type}</div>
                    <div>{item.name}</div>
                  </MappingItem>
                )
              })}
              <div>11</div>
            </div>
          </div>
          <div tw="flex-auto">
            <div css={mapItemStyle.wrapper}>
              <div css={[mapItemStyle.grid, mapItemStyle.header]}>
                <div>类型</div>
                <div>来源字段</div>
              </div>
              {rightFields.map((item) => {
                return (
                  <MappingItem
                    key={item.uuid}
                    css={[mapItemStyle.grid, mapItemStyle.row]}
                    type="left"
                    data={item}
                  >
                    <div>{item.type}</div>
                    <div>{item.name}</div>
                  </MappingItem>
                )
              })}
            </div>
          </div>
        </FlexBox>
      </MappingContainer>
    </Root>
  )
})

// export default FieldMappings
