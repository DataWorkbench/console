import { FilterInput, FlexBox, InstanceName, PopConfirm } from 'components'
import { PageTab, ToolBar, Button, Icon } from '@QCFE/qingcloud-portal-ui'
import {
  alertPolicyColumns,
  alertPolicySuggestions,
  alertPolicyTabs,
  monitorObjectTypes,
} from 'views/Space/Ops/Alert/common/constants'
import React, { useState } from 'react'
import { useColumns } from 'hooks/useHooks/useColumns'
import { Table } from 'views/Space/styled'
import { get } from 'lodash-es'
import useFilter from 'hooks/useHooks/useFilter'
import useIcon from 'hooks/useHooks/useIcon'
import AlertModal from 'views/Space/Ops/Alert/Modal'
import { useHistory, useParams } from 'react-router-dom'
import { MappingKey } from 'utils/types'
import { policyFieldMapping } from 'views/Space/Ops/Alert/common/mapping'
import { PbmodelAlertPolicy } from 'types/types'
import dayjs from 'dayjs'
import tw, { css } from 'twin.macro'
import { apiHooks, queryKeyObj } from 'hooks/apiHooks'
import { AlertManageListAlertPoliciesType } from 'types/response'
import { ListAlertPoliciesRequestType } from 'types/request'
import { AlertContext, AlertStore } from './AlertStore'
import icons from './common/icons'
import { useMutationAlert } from '../../../../hooks/useAlert'

const useQueryListAlertPolicies = apiHooks<
  'alertManage',
  ListAlertPoliciesRequestType,
  AlertManageListAlertPoliciesType
>('alertManage', 'listAlertPolicies')

const getQueryKeyListAlertPolicies = () => queryKeyObj.listAlertPolicies

const instanceNameStyle = css`
  &:hover {
    .instance-name-title {
      ${tw`text-green-11`}
    }

    .instance-name-icon {
      ${tw`bg-[#13966a80] border-[#9ddfc966]`}
      .icon svg.qicon {
        ${tw`text-green-11`}
      }
    }
  }
`

const { ColumnsSetting } = ToolBar as any

const getName = (name: MappingKey<typeof policyFieldMapping>) =>
  policyFieldMapping.get(name)!.apiField

const alertPolicySettingKey = 'ALERT_POLICY_SETTING_KEY'

const AlertPolicy = () => {
  useIcon(icons)
  const { filter, pagination, sort, getColumnFilter, getColumnSort } =
    useFilter<
      {
        search?: string
        monitor_object?: number
      },
      { pagination: true; sort: true }
    >({}, { pagination: true, sort: true }, alertPolicySettingKey)

  const history = useHistory()
  const [store] = useState(new AlertStore())
  const { isLoading, mutateAsync } = useMutationAlert(
    {},
    getQueryKeyListAlertPolicies
  )

  const { columns, setColumnSettings } = useColumns(
    alertPolicySettingKey,
    alertPolicyColumns,
    {
      [getName('id')]: {
        render: (id: string, record: PbmodelAlertPolicy) => (
          <InstanceName
            theme="dark"
            onClick={() => {
              history.push(`.alert-policy/${id}`)
            }}
            name={record.name}
            desc={id}
            icon="q-bellGearDuotone"
            css={instanceNameStyle}
          />
        ),
      },
      [getName('monitor_object')]: {
        ...getColumnFilter(getName('monitor_object'), monitorObjectTypes),
        render: (type: keyof typeof monitorObjectTypes) => {
          return monitorObjectTypes[type]?.label
        },
      },
      [getName('desc')]: {
        render: (desc: string) => {
          return <span tw="text-font-placeholder">{desc} </span>
        },
      },
      [getName('updated')]: {
        ...getColumnSort(getName('updated')),
        render: (time: number) => {
          if (time) {
            return (
              <span tw="text-font-placeholder">
                {dayjs(time * 1000).format('YYYY-MM-DD HH:mm:ss')}
              </span>
            )
          }
          return null
        },
      },
    } as any,
    {
      title: '操作',
      dataIndex: 'id',
      render: (v: any, record: any) => (
        <FlexBox tw="items-center">
          <Button
            type="text"
            onClick={() => {
              store.set({
                showAddMonitorForm: true,
                selectedMonitor: record,
              })
            }}
          >
            修改
          </Button>
          <PopConfirm
            type="warning"
            content={`确定删除 ${record.name} ?`}
            onOk={() => {
              mutateAsync({
                op: 'delete',
                data: {
                  alert_ids: [record.id],
                },
              })
            }}
          >
            <Button type="text">删除</Button>
          </PopConfirm>
        </FlexBox>
      ),
    }
  )

  const { spaceId } = useParams<{ spaceId: string }>()
  const { data, isFetching, refetch } = useQueryListAlertPolicies({
    uri: { space_id: spaceId },
    params: filter as any,
  })

  const infos = get(data, 'infos', []) ?? []

  return (
    <AlertContext.Provider value={store}>
      <FlexBox orient="column" tw="p-5 h-full">
        <PageTab tabs={alertPolicyTabs} />
        <FlexBox orient="column" tw="gap-3 p-5 bg-neut-16">
          <FlexBox tw=" gap-2">
            <Button
              type="primary"
              onClick={() => {
                store.set({
                  showAddMonitorForm: true,
                  selectedMonitor: {},
                })
              }}
            >
              <Icon name="add" size={16} />
              创建策略
            </Button>

            <FilterInput
              filterLinkKey={alertPolicySettingKey}
              suggestions={alertPolicySuggestions}
              tw="border-line-dark!"
              searchKey="search"
              placeholder="搜索关键字或输入过滤条件"
              // isMultiKeyword
              defaultKeywordLabel="策略名称"
            />

            <Button
              type="black"
              loading={false}
              tw="px-[5px] border-line-dark!"
              onClick={() => refetch()}
            >
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
            loading={!!isFetching || !!isLoading}
            onSort={sort}
            pagination={{
              total: get(data, 'total', 0),
              ...pagination,
            }}
          />
        </FlexBox>
      </FlexBox>
      <AlertModal getQueryListKey={getQueryKeyListAlertPolicies} />
    </AlertContext.Provider>
  )
}

export default AlertPolicy
