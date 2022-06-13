import { Alert, Checkbox, Label } from '@QCFE/lego-ui'
import { HelpCenterLink } from 'components'
import { Table } from 'views/Space/DataService/ServiceDev/styled'
import { useImmer } from 'use-immer'
import { FlexBox } from 'components/Box'
import tw, { styled } from 'twin.macro'

import { IColumn, useColumns } from 'hooks/useHooks/useColumns'
import { css } from '@emotion/react'

const Root = styled.div`
  ${tw`text-white space-y-2`}
`

const CheckBoxLabel = styled(Label)(() => [
  css`
    ${tw`flex items-start`}
  `
])

const HeaderCheckLabel = styled(CheckBoxLabel)(() => [
  css`
    ${tw`flex items-center`}
    .checkbox::before {
      top: 9px;
    }
    .checkbox.checked::after {
      top: 12px !important;
    }
    .checkbox.indeterminate::after {
      top: 12px !important;
    }
  `
])

const dataServciecDataSettingKey = 'DATA_SERVICE_DATA__SETTING'

const CheckboxSpan = styled.span`
  ${tw`ml-2 leading-4`}
`

const defaultColumns: IColumn[] = [
  {
    title: '字段名',
    key: 'field',
    dataIndex: 'field'
  },
  {
    title: (
      <HeaderCheckLabel>
        <Checkbox indeterminate />
        <CheckboxSpan>设为请求参数</CheckboxSpan>
      </HeaderCheckLabel>
    ),
    key: 'isRequest',
    dataIndex: 'isRequest'
  },
  {
    title: (
      <HeaderCheckLabel>
        <Checkbox indeterminate={false} />
        <CheckboxSpan>设为返回参数</CheckboxSpan>
      </HeaderCheckLabel>
    ),
    key: 'isResponse',
    dataIndex: 'isResponse'
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

const FieldOrder = () => {
  const [dataSource, setDataSource] = useImmer([
    {
      key: '1',
      field: 'sql',
      isRequest: true,
      isResponse: true,
      type: 'VARCHAR',
      des: ''
    },
    {
      key: '2',
      field: 'sql',
      isRequest: true,
      isResponse: true,
      type: 'VARCHAR',
      des: ''
    }
  ])

  const renderColumns = {
    field: {
      render: (text: string) => <FlexBox tw="items-center gap-2">{text}</FlexBox>
    },
    isRequest: {
      render: (text: boolean) => (
        <FlexBox>
          <CheckBoxLabel>
            <Checkbox
              checked={text}
              onChange={(_, value: boolean) => {
                setDataSource((draft) => {
                  draft[0].isRequest = value
                })
              }}
            />
            <CheckboxSpan>请求</CheckboxSpan>
          </CheckBoxLabel>
        </FlexBox>
      )
    },
    isResponse: {
      render: (text: boolean) => (
        <FlexBox>
          <CheckBoxLabel>
            <Checkbox
              checked={text}
              onChange={(_, value: boolean) => {
                setDataSource((draft) => {
                  draft[0].isResponse = value
                })
              }}
            />
            <CheckboxSpan>返回</CheckboxSpan>
          </CheckBoxLabel>
        </FlexBox>
      )
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

  return <Table columns={columns} dataSource={dataSource} rowKey="key" />
}

export default FieldOrder
