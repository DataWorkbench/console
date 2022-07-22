import { Select, Button, Alert } from '@QCFE/lego-ui'
import { DargTable, HelpCenterLink, Center, Tooltip } from 'components'

import React, { useCallback, useEffect, useImperativeHandle, useMemo } from 'react'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import { OrderText, TitleInformation } from 'views/Space/DataService/ServiceDev/styled'
import { useImmer } from 'use-immer'
import update from 'immutability-helper'
import { FlexBox } from 'components/Box'
import tw, { styled } from 'twin.macro'
import { useColumns } from 'hooks/useHooks/useColumns'
import { MappingKey } from 'utils/types'

import { observer } from 'mobx-react-lite'
import { useStore } from 'stores'
import { assign, cloneDeep, filter, get, includes, intersectionBy, map } from 'lodash-es'
import { FieldOrderColumns, serviceDevVersionFieldOrderMapping, OrderMode } from '../constants'

const Root = styled.div`
  ${tw`text-white space-y-2 mb-2`}
`

const getName = (name: MappingKey<typeof serviceDevVersionFieldOrderMapping>) =>
  serviceDevVersionFieldOrderMapping.get(name)!.apiField
interface IFieldOrderProps {
  disabled?: boolean
}
export interface IOrderDataSource {
  name: string
  order: string
  order_mode: number
}
const orderOption = [
  {
    label: '升序',
    value: 'ase'
  },
  {
    label: '降序',
    value: 'desc'
  }
]

const columnSettingsKey = 'DATA_SERVICE_FIELDORDER'

const FieldOrder = observer(
  (props: IFieldOrderProps, ref) => {
    const { disabled = false } = props
    const [dataSource, setDataSource] = useImmer<IOrderDataSource[]>([])
    const {
      dtsDevStore: { fieldSettingData, apiConfigData }
    } = useStore()

    const FieldOptions = useMemo(
      () =>
        map(
          filter(fieldSettingData, (column) => column.isResponse),
          (column) => ({ label: column.key, value: column.key })
        ),
      [fieldSettingData]
    )

    const FileOptionsDisable = useMemo(
      () =>
        map(FieldOptions, (option) =>
          assign(
            { ...option },
            includes(
              map(dataSource, (i) => i.name),
              option.value
            ) && { disabled: true }
          )
        ),
      [FieldOptions, dataSource]
    )

    useEffect(() => {
      const responseConfig = cloneDeep(
        get(apiConfigData, 'api_config.response_params.response_params', [])
      )
      if (responseConfig?.length) {
        const filedData = cloneDeep(fieldSettingData).map((item) => ({
          ...item,
          column_name: item.field
        }))

        const orderConfigData = responseConfig.filter(
          (item: { order_mode: number }) => item.order_mode !== 0
        )

        // orderConfigData 和 filedData 取交集
        const insectOrderConfig: any = intersectionBy(orderConfigData, filedData, 'column_name')
        if (insectOrderConfig?.length === 0) {
          setDataSource([])
          return
        }

        const sortOrder = insectOrderConfig?.sort(
          (a: { order_num: number }, b: { order_num: number }) => a.order_num - b.order_num
        )
        const orderData = sortOrder.map((item: { order_mode: number; column_name: string }) => {
          const order = OrderMode.getLabel(item.order_mode)?.toLocaleLowerCase()

          return {
            name: item.column_name,
            order,
            order_mode: item.order_mode
          }
        })

        setDataSource(orderData)
      } else {
        setDataSource([])
      }
    }, [apiConfigData, fieldSettingData, setDataSource])

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
              name: '',
              order: 'ase',
              order_mode: 1
            }
          ]
        })
      )
    }, [dataSource, setDataSource])

    const columnsRender = {
      [getName('index')]: {
        title: (
          <TitleInformation>
            <span>序号</span>
            <Tooltip
              theme="light"
              hasPadding
              content="您可以根据数据表中的指定字段对 API 的返回结果进行排序。当您的排序列表中有多个字段时，序号越小的字段，排序的优先级越高，您可直接拖拽整行来调整字段序号。"
            >
              <Center>
                <Icon name="information" size={16} />
              </Center>
            </Tooltip>
          </TitleInformation>
        ),
        width: 120,
        render: (_: any, record: any, index: number) => <OrderText>{index + 1}</OrderText>
      },
      [getName('name')]: {
        width: 400,
        render: (text: any, record: any, index: number) => (
          <Select
            placeholder="请选择需要添加的字段"
            options={FileOptionsDisable}
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
              options={orderOption}
              value={text}
              onChange={(v) => {
                setDataSource((draft) => {
                  draft[index].order = v
                  draft[index].order_mode = OrderMode.getEnum(v.toLocaleUpperCase())?.value
                })
              }}
            />
            <div
              css={[tw`px-2 hidden opacity-0  ml-24`, tw`block group-hover:opacity-100`]}
              onClick={() => delRow(index)}
            >
              <Icon name="trash" clickable />
            </div>
          </>
        )
      }
    }

    useImperativeHandle(ref, () => ({
      getDataSource: () => dataSource
    }))

    const { columns } = useColumns(columnSettingsKey, FieldOrderColumns, columnsRender as any)

    const Footer = React.memo(() => (
      <FlexBox tw="h-11 items-center justify-center border-t-[1px]! border-neut-13!">
        <Button type="text" onClick={addRow}>
          <Icon name="add" type="light" />
          添加字段
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
          disabled={disabled}
          runDarg
          dataSource={dataSource}
          columns={columns as any}
          renderFooter={() => <Footer />}
        />
      </>
    )
  },
  { forwardRef: true }
)

export default FieldOrder
