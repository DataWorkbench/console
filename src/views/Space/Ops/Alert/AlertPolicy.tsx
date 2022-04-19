import { FilterInput, FlexBox } from 'components'
import { PageTab, ToolBar, Button, Icon } from '@QCFE/qingcloud-portal-ui'
import {
  alertPolicyColumns,
  alertPolicyTabs,
} from 'views/Space/Ops/Alert/common/constants'
import React from 'react'
import { dataReleaseSuggestions } from 'views/Space/Ops/DataIntegration/constants'
import { useColumns } from 'hooks/useHooks/useColumns'
import { Table } from 'views/Space/styled'
import { get } from 'lodash-es'
import useFilter from 'hooks/useHooks/useFilter'
import useIcon from 'hooks/useHooks/useIcon'
import icons from './common/icons'

interface IAlertPolicy {}

const { ColumnsSetting } = ToolBar as any

const alertPolicySettingKey = 'ALERT_POLICY_SETTING_KEY'
const AlertPolicy = (props: IAlertPolicy) => {
  useIcon(icons)
  const { filter, setFilter, pagination, sort } = useFilter<
    {
      search?: string
      alert_obj?: string
    },
    { pagination: true; sort: true }
  >({}, { pagination: true, sort: true }, alertPolicySettingKey)

  console.log(props, filter, setFilter)
  const { columns, setColumnSettings } = useColumns(
    alertPolicySettingKey,
    alertPolicyColumns,
    {}
  )

  const { data, isFetching } = { data: {}, isFetching: true }

  const infos = get(data, 'infos', [])

  return (
    <FlexBox orient="column" tw="p-5 h-full">
      <PageTab tabs={alertPolicyTabs} />
      <FlexBox orient="column" tw="gap-3 p-5 bg-neut-16">
        <FlexBox tw=" gap-2">
          <Button type="primary">
            <Icon name="add" size={16} />
            创建策略
          </Button>

          <FilterInput
            filterLinkKey={alertPolicySettingKey}
            suggestions={dataReleaseSuggestions}
            tw="border-line-dark!"
            searchKey="name"
            placeholder="搜索关键字或输入过滤条件"
            // isMultiKeyword
            defaultKeywordLabel="名称"
          />

          <Button type="black" loading={false} tw="px-[5px] border-line-dark!">
            <Icon name="if-refresh" tw="text-xl text-white" type="light" />
          </Button>
          <ColumnsSetting
            defaultColumns={alertPolicyColumns}
            storageKey={alertPolicySettingKey}
            onSave={setColumnSettings}
          />
        </FlexBox>
        <Table
          columns={columns}
          dataSource={infos}
          loading={!!isFetching}
          sort={sort}
          pagination={{
            total: get(data, 'total', 0),
            ...pagination,
          }}
        />
      </FlexBox>
    </FlexBox>
  )
}

export default AlertPolicy
