import { observer } from 'mobx-react-lite'
// import tw, { css } from 'twin.macro'
import { useImmer } from 'use-immer'

import { Form, Icon } from '@QCFE/lego-ui'
import { AffixLabel, FlexBox, Center, ButtonWithClearField, PopConfirm } from 'components'
import { useState } from 'react'
import DataSourceSelectModal from 'views/Space/Upcloud/DataSourceList/DataSourceSelectModal'

const { SelectField } = Form

const SyncDataSource = observer(
  (props, ref) => {
    console.log(props)
    const [visible, setVisible] = useState<boolean | null>(null)

    const [sourceData, setSourceData] = useImmer<{
      sourceType: string
    }>({
      sourceType: ''
    })

    const handleClick = () => {
      setVisible(true)
    }

    return (
      <FlexBox tw="flex-col">
        <Form ref={ref} tw="px-0">
          <SelectField
            label={<AffixLabel>数据源类型</AffixLabel>}
            name="sourceType"
            placeHolder="请选择数据源类型"
            backspaceRemoves={false}
            value={sourceData.sourceType}
            options={[
              { value: 'mysql', label: 'MySQL' },
              { value: 'mysql2', label: 'MySQL2' }
            ]}
            schemas={[
              {
                help: '请选择数据源类型',
                status: 'error',
                rule: { required: true }
              }
            ]}
            validateOnChange
            onChange={(v: string) => {
              setSourceData((draft) => {
                draft.sourceType = v
              })
            }}
          />
          <ButtonWithClearField
            name="source"
            placeholder="选择数据来源"
            label={<AffixLabel>数据源</AffixLabel>}
            popConfirm={
              <PopConfirm
                type="warning"
                content="移除数据源会清空所数据源表、条件参数配置、字段映射等所有信息，请确认是否移除？"
              />
            }
            icon={
              <Icon name="blockchain" size={16} color={{ secondary: 'rgba(255,255,255,0.4)' }} />
            }
            onClick={() => handleClick()}
            onClear={() => handleClear()}
            schemas={[
              {
                help: '请选择数据来源',
                status: 'error',
                rule: (v?: string) => !!v
              }
            ]}
          >
            <Center tw="space-x-1">
              <span tw="ml-1">{2}</span>
              <span tw="text-neut-8">(ID:{3})</span>
            </Center>
          </ButtonWithClearField>
        </Form>
        <DataSourceSelectModal
          title="选择数据源"
          visible={visible}
          sourceType={1}
          onCancel={() => setVisible(false)}
          onOk={() => {
            setVisible(false)
          }}
        />
      </FlexBox>
    )
  },
  { forwardRef: true }
)

export default SyncDataSource
