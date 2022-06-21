import { Select, Button, Alert } from '@QCFE/lego-ui'
import { DargTable, HelpCenterLink } from 'components'
import React, { useCallback } from 'react'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import { OrderText } from 'views/Space/DataService/ServiceDev/styled'
import { useImmer } from 'use-immer'
import update from 'immutability-helper'
import { FlexBox } from 'components/Box'
import tw, { styled } from 'twin.macro'
import { useColumns } from 'hooks/useHooks/useColumns'
import { MappingKey } from 'utils/types'
import { FieldOrderColumns, serviceDevVersionFieldOrderMapping } from '../constants'

const Root = styled.div`
  ${tw`text-white space-y-2 mb-2`}
`

const getName = (name: MappingKey<typeof serviceDevVersionFieldOrderMapping>) =>
  serviceDevVersionFieldOrderMapping.get(name)!.apiField

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

const columnSettingsKey = 'DATA_SERVICE_FIELDORDER'

const FieldOrder = () => {
  const [dataSource, setDataSource] = useImmer([])

  const delRow = useCallback(
    (index: number) => {
      setDataSource(update(dataSource, { $splice: [[index, 1]] }))
    },
    [setDataSource, dataSource]
  )

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

  const columnsRender = {
    [getName('index')]: {
      title: <span>序号</span>,
      width: 100,
      render: (_: any, record: any, index: number) => <OrderText>{index}</OrderText>
    },
    [getName('name')]: {
      width: 400,
      render: (text: any, record: any, index: number) => (
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
    [getName('order')]: {
      width: 300,
      render: (text: any, record: any, index: number) => (
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
          <div css={[tw`px-2 hidden opacity-0  ml-24`, tw`block group-hover:opacity-100`]}>
            <Button type="text" onClick={() => delRow(index)}>
              <Icon name="trash" clickable type="dark" />
            </Button>
          </div>
        </>
      )
    }
  }

  const { columns } = useColumns(columnSettingsKey, FieldOrderColumns, columnsRender as any)

  const Footer = React.memo(() => (
    <FlexBox tw="h-11 items-center justify-center border-t-[1px]! border-neut-13!">
      <Button type="text" onClick={addRow}>
        <Icon name="add" type="light" />
        添加
      </Button>
    </FlexBox>
  ))

  return (
    <>
      {dataSource.length === 0 && (
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
      )}
      <DargTable
        rowKey="key"
        moveRow={moveRow}
        runDarg
        dataSource={dataSource}
        columns={columns as any}
        renderFooter={() => <Footer />}
      />
    </>
  )
}

export default FieldOrder
