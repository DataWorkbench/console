import { Select, Button, Alert } from '@QCFE/lego-ui'
import { DargTable, HelpCenterLink } from 'components'
import React, { useCallback } from 'react'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import { OrderText } from 'views/Space/DataService/ServiceDev/styled'
import { useImmer } from 'use-immer'
import update from 'immutability-helper'
import { FlexBox } from 'components/Box'
import tw, { styled } from 'twin.macro'

const Root = styled.div`
  ${tw`text-white space-y-2`}
`

const options = [
  {
    label: 'sql',
    value: 'sql'
  },
  {
    label: 'javaScript',
    value: 'javaScript'
  },
  {
    label: 'python',
    value: 'python'
  },
  {
    label: 'golang',
    value: 'golang'
  }
]

const options2 = [
  {
    label: '升序',
    value: 'ascOrder'
  },
  {
    label: '降序',
    value: 'descOrder'
  }
]

const FieldOrder = () => {
  const [dataSource, setDataSource] = useImmer([
    {
      key: '1',
      name: 'sql',
      order: ''
    },
    {
      key: '2',
      name: '2',
      order: ''
    },
    {
      key: '3',
      name: '3',
      order: 'descOrder'
    }
  ])

  const delRow = useCallback(
    (index: number) => {
      setDataSource(update(dataSource, { $splice: [[index, 1]] }))
    },
    [setDataSource, dataSource]
  )

  const columns = [
    {
      title: 'index',
      dataIndex: 'index',
      key: 'index',
      width: 100,
      headRender: () => <span>序号</span>,
      render: (_: string, record: any, index: number) => <OrderText>{index}</OrderText>
    },
    {
      title: '字段名',
      dataIndex: 'name',
      width: 400,
      key: 'name',
      render: (text: string, record: any, index: number) => (
        <Select
          placeholder="请选择需要添加的字段"
          options={options}
          value={text}
          onChange={(v) => {
            setDataSource((draft) => {
              draft[index].name = v
            })
          }}
        />
      )
    },
    {
      title: '排序方式',
      dataIndex: 'order',
      key: 'order',
      width: 300,
      render: (text: string, record: any, index: number) => (
        <>
          <Select
            tw="w-24"
            options={options2}
            value={text}
            onChange={(v) => {
              setDataSource((draft) => {
                draft[index].order = v
              })
            }}
          />
          <div
            css={[
              tw`px-2 hidden opacity-0  ml-24`,
              index >= 2 && tw`block group-hover:opacity-100`
            ]}
          >
            {/* <Tooltip content="删除" theme="dark"> */}
            <Button type="text" onClick={() => delRow(index)}>
              <Icon name="trash" clickable type="dark" />
            </Button>
            {/* </Tooltip> */}
          </div>
        </>
      )
    }
  ]

  const moveRow = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragRow = dataSource[dragIndex]
      const newData = update(dataSource, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRow]
        ]
      })
      setDataSource(newData)
    },
    [dataSource, setDataSource]
  )

  const addRow = useCallback(() => {
    if (dataSource.length >= 10) {
      return
    }
    setDataSource(
      update(dataSource, {
        $push: [
          {
            key: '1',
            name: '',
            order: ''
          }
        ]
      })
    )
  }, [dataSource, setDataSource])

  const Footer = React.memo(() => (
    <FlexBox tw="h-11 items-center justify-center">
      <Button type="text" onClick={addRow}>
        <Icon name="add" type="light" />
        添加
      </Button>
    </FlexBox>
  ))

  if (dataSource.length === 0) {
    return (
      <Root>
        <Alert
          message="提示：排序字段非必须，如你需要排序字段，请在下方添加并选择需要排序的字段。"
          type="info"
          linkBtn={
            <HelpCenterLink href="###" isIframe={false} hasIcon={false}>
              查看详情 →
            </HelpCenterLink>
          }
        />
      </Root>
    )
  }

  return (
    <DargTable
      moveRow={moveRow}
      dataSource={dataSource}
      columns={columns}
      renderFooter={() => <Footer />}
    />
  )
}

export default FieldOrder
