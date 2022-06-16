import { Alert } from '@QCFE/lego-ui'
import { HelpCenterLink, DargTable } from 'components'

import { useImmer } from 'use-immer'
import { FlexBox } from 'components/Box'
import tw, { styled } from 'twin.macro'

import { IColumn, useColumns } from 'hooks/useHooks/useColumns'

const Root = styled.div`
  ${tw`text-white space-y-2`}
`

const dataServciecDataSettingKey = 'DATA_SERVICE_DATA__SETTING'

const FieldOrder = () => {
  const [dataSource, setDataSource] = useImmer([
    {
      id: 1,
      key: '1',
      field: 'sql',
      isRequest: true,
      isResponse: true,
      type: 'VARCHAR',
      des: ''
    },
    {
      id: 2,
      key: '2',
      field: 'sql',
      isRequest: false,
      isResponse: true,
      type: 'VARCHAR',
      des: ''
    }
  ])

  const defaultColumns: IColumn[] = [
    {
      title: '字段名',
      width: 100,
      key: 'field',
      dataIndex: 'field'
    },
    {
      title: '设为请求参数',
      key: 'isRequest',
      dataIndex: 'isRequest',
      checkbox: true,
      checkboxText: '请求',
      selectedKeys: [1, 2, 4],
      onSelect: (checked: boolean, record: any, index: number) => {
        setDataSource((draft) => {
          draft[index].isRequest = checked
        })
      },
      onAllSelect: (checked: boolean) => {
        setDataSource((draft) => {
          draft.forEach((item) => {
            item.isRequest = checked
          })
        })
      }
    },
    {
      title: '设为返回参数',
      key: 'isResponse',
      dataIndex: 'isResponse',
      checkbox: true,
      checkboxText: '响应',
      onSelect: (checked: boolean, record: any, index: number) => {
        setDataSource((draft) => {
          draft[index].isResponse = checked
        })
      },
      onAllSelect: (checked: boolean) => {
        setDataSource((draft) => {
          draft.forEach((item) => {
            item.isResponse = checked
          })
        })
      }
    },
    {
      title: '字段类型',
      key: 'type',
      dataIndex: 'type'
    },
    {
      title: '描述',
      key: 'des',
      dataIndex: 'des'
    }
  ]

  const renderColumns = {
    field: {
      render: (text: string) => <FlexBox tw="items-center gap-2">{text}</FlexBox>
    },
    type: {
      render: (text: string) => <FlexBox tw="items-center gap-2">{text}</FlexBox>
    },
    des: {
      render: (text: string) => <FlexBox tw="items-center gap-2">{text}</FlexBox>
    }
  }

  const { columns } = useColumns(dataServciecDataSettingKey, defaultColumns, renderColumns as any)

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
      columns={columns as unknown as any}
      runDarg={false}
      dataSource={dataSource}
      rowKey="key"
    />
  )
}

export default FieldOrder
