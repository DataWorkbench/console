import { Alert } from '@QCFE/lego-ui'
import { HelpCenterLink, DargTable } from 'components'
import { observer } from 'mobx-react-lite'
import { useStore } from 'stores'

import { FlexBox } from 'components/Box'
import tw, { styled } from 'twin.macro'
import { MappingKey } from 'utils/types'

import { useColumns } from 'hooks/useHooks/useColumns'
import { cloneDeep } from 'lodash-es'
import {
  FieldSettingColumns,
  serviceDevVersionFieldSettingMapping,
  FieldSettingData
} from '../constants'

interface IFieldOrderProps {
  disabled?: boolean
}
const Root = styled.div`
  ${tw`text-white space-y-2`}
`

const getName = (name: MappingKey<typeof serviceDevVersionFieldSettingMapping>) =>
  serviceDevVersionFieldSettingMapping.get(name)!.apiField

const dataServiceDataSettingKey = 'DATA_SERVICE_DATA__SETTING'
const FieldOrder = observer((props: IFieldOrderProps) => {
  const {
    dtsDevStore: { fieldSettingData },
    dtsDevStore
  } = useStore()
  const { disabled = false } = props

  const setFieldSettingData = (fn: (fieldData: FieldSettingData[]) => void) => {
    const data = cloneDeep(fieldSettingData)
    fn(data)
    dtsDevStore.set({
      fieldSettingData: data
    })
  }

  const renderColumns = {
    [getName('field')]: {
      width: 100,
      render: (text: string) => <FlexBox tw="items-center gap-2">{text}</FlexBox>
    },
    [getName('isRequest')]: {
      checkbox: true,
      checkboxText: '请求',
      onSelect: (checked: boolean, record: any, index: number) => {
        setFieldSettingData((draft) => {
          draft[index].isRequest = checked
        })
      },
      onAllSelect: (checked: boolean) => {
        setFieldSettingData((draft) => {
          draft.forEach((item) => {
            item.isRequest = checked
          })
        })
      },
      render: (text: string) => <FlexBox tw="items-center gap-2">{text}</FlexBox>
    },
    [getName('isResponse')]: {
      checkbox: true,
      checkboxText: '响应',
      onSelect: (checked: boolean, record: any, index: number) => {
        setFieldSettingData((draft) => {
          draft[index].isResponse = checked
        })
      },
      onAllSelect: (checked: boolean) => {
        setFieldSettingData((draft) => {
          draft.forEach((item) => {
            item.isResponse = checked
          })
        })
      },
      render: (text: string) => <FlexBox tw="items-center gap-2">{text}</FlexBox>
    },
    [getName('type')]: {
      render: (text: string) => <FlexBox tw="items-center gap-2">{text}</FlexBox>
    }
  }

  const { columns } = useColumns(
    dataServiceDataSettingKey,
    FieldSettingColumns,
    renderColumns as any
  )

  if (fieldSettingData.length === 0) {
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
      disabled={disabled}
      dataSource={fieldSettingData}
      rowKey="field"
    />
  )
})

export default FieldOrder
