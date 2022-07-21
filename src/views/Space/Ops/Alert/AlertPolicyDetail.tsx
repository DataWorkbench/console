import { useHistory, useParams } from 'react-router-dom'
import { FlexBox } from 'components/Box'
import { Tooltip } from 'components/Tooltip'
import tw, { css, styled } from 'twin.macro'
import { Card } from 'components/Card'
import { Tabs, Collapse } from '@QCFE/lego-ui'
import { Center } from 'components/Center'
import { Circle } from 'views/Space/Ops/styledComponents'
import AlertModal from 'views/Space/Ops/Alert/Modal'
import React, { useState } from 'react'
import {
  Button,
  // @ts-ignore
  CopyText,
  Icon,
  Loading,
  InputSearch,
  Modal
} from '@QCFE/qingcloud-portal-ui'
import { HorizonTabs } from 'views/Space/Dm/styled'
import emitter from 'utils/emitter'
import { AlertStoreProvider, useAlertStore } from 'views/Space/Ops/Alert/AlertStore'
import { monitorObjectTypes } from 'views/Space/Ops/Alert/common/constants'
import dayjs from 'dayjs'
import { Table } from 'views/Space/styled'
import { get } from 'lodash-es'
import {
  AlertManageDescribeAlertPolicyType,
  AlertManageListJobsByAlertPolicyType
} from 'types/response'
import { DescribeAlertPolicyRequestType, ListJobsByAlertPolicyRequestType } from 'types/request'
import { apiHooks, queryKeyObj } from 'hooks/apiHooks'
import useFilter from 'hooks/useHooks/useFilter'
import { MoreAction } from 'components'
import { observer } from 'mobx-react-lite'
import { useMutationAlert } from 'hooks/useAlert'

const { TabPanel } = Tabs as any

const { CollapsePanel } = Collapse

const useQueryDescribeAlertPolicy = apiHooks<
  'alertManage',
  DescribeAlertPolicyRequestType,
  AlertManageDescribeAlertPolicyType
>('alertManage', 'describeAlertPolicy')

const getQueryKeyDescribeAlertPolicy = () => queryKeyObj.describeAlertPolicy

const useQueryListJobsByAlertPolicy = apiHooks<
  'alertManage',
  ListJobsByAlertPolicyRequestType,
  AlertManageListJobsByAlertPolicyType
>('alertManage', 'listJobsByAlertPolicy')

// const getQueryKeyListJobsByAlertPolicy = queryKeyObj.listJobsByAlertPolicy

const GridItem = styled.div(({ labelWidth = 60 }: { labelWidth?: number }) => [
  css`
    & {
      ${tw`grid place-content-start gap-y-1`}
      grid-template-columns: ${labelWidth}px 1fr;

      & > span:nth-of-type(2n + 1) {
        ${tw`text-neut-8!`}
      }

      & > span:nth-of-type(2n) {
        ${tw`text-white!`}
      }
    }
  `
])

const CopyTextWrapper = styled(CopyText)`
  & {
    & .text-field {
      ${tw`text-neut-8!`}
    }

    .popper.tooltip {
      ${tw`bg-white`}
      .tooltip-content {
        ${tw`text-neut-15`}
      }

      .tooltip-arrow {
        ${tw`border-b-white`}
      }
    }
  }

  &:hover {
    & .text-field {
      ${tw`text-white!`}
    }
  }
`

const Root = styled.div`
  ${tw`grid gap-3 h-full px-4 py-3 leading-[20px]`}
  grid-template-rows: auto auto 1fr;

  & {
    & .tabs {
      ${tw`flex-none`}
    }

    & .tab-content {
      ${tw`overflow-y-auto px-0 py-4 flex-auto`}
    }

    & .tab-panel.is-active {
      ${tw`h-full`}
    }
  }
`

const alertJobSettingKey = 'alert_job_setting_key'
const AlertPolicyDetail = observer(
  ({ id, spaceId, regionId }: { id: string; spaceId: string; regionId: string }) => {
    const history = useHistory()

    const store = useAlertStore()

    const toList = () => {
      history.push(`../alert-policy`)
    }

    const { data, isFetching } = useQueryDescribeAlertPolicy({
      uri: {
        space_id: spaceId,
        alert_id: id
      },
      regionId
    } as any)

    const { filter, pagination } = useFilter<{}, { pagination: true }>(
      {},
      { pagination: true },
      alertJobSettingKey
    )
    const {
      data: jobList,
      isFetching: jobLoading,
      refetch
    } = useQueryListJobsByAlertPolicy({
      uri: {
        space_id: spaceId,
        alert_id: id
      },
      regionId,
      params: filter
    } as any)

    const infos = data?.monitor_object === 1 ? jobList?.stream_jobs ?? [] : jobList?.sync_jobs ?? []

    const [isOpen, setOpen] = useState(true)
    const [activeName, setActiveName] = useState('items')

    const [search, setSearch] = useState('')

    if (!id) {
      history.goBack()
      return null
    }

    function renderItems() {
      const type = data?.monitor_object
      const items = type === 1 ? data?.monitor_item?.stream_job : data?.monitor_item?.sync_job
      return (
        <div tw="w-full mt-5">
          {items?.instance_run_failed && (
            <div tw="px-5 w-full py-[14px] bg-neut-16 text-white mb-2">实例运行失败时告警</div>
          )}
          {items?.instance_run_timeout && (
            <FlexBox tw="px-5 w-full py-[14px] bg-neut-16 text-white gap-2">
              <span>作业实例运行时超时时间</span>
              <span tw="inline-flex items-center rounded-[8px] bg-neut-13 px-3">{`${items?.instance_timeout} 秒`}</span>
            </FlexBox>
          )}
        </div>
      )
    }

    function renderUsers() {
      return (
        <div
          tw="mt-5 w-full"
          css={css`
            .grid-table-header {
              ${tw`bg-[#1E2F41]!`}
            }
          `}
        >
          <FlexBox tw="justify-end gap-2 mb-3">
            <InputSearch
              tw="w-64"
              placeholder="请输入关键词进行搜索"
              onPressEnter={(e: React.SyntheticEvent) => {
                setSearch((e.target as HTMLInputElement).value)
              }}
              onClear={() => {
                setSearch('')
              }}
            />

            <Button type="black" loading={false} tw="px-[5px] border-line-dark!">
              <Icon name="if-refresh" tw="text-xl text-white" type="light" />
            </Button>
          </FlexBox>
          <Table
            columns={[
              {
                title: '消息接收人',
                dataIndex: 'name',
                key: 'name'
              },
              {
                title: '邮箱',
                dataIndex: 'email',
                key: 'email'
              }
            ]}
            rowKey="id"
            dataSource={data?.notifications?.filter((i) => !search || i.name.includes(search))}
          />
        </div>
      )
    }

    function renderJobs() {
      return (
        <div
          tw="mt-5 w-full"
          css={css`
            .grid-table-header {
              ${tw`bg-[#1E2F41]!`}
            }
          `}
        >
          <FlexBox tw="justify-end gap-2 mb-3">
            <Button
              type="black"
              loading={false}
              tw="px-[5px] border-line-dark!"
              onClick={() => {
                refetch()
              }}
            >
              <Icon name="if-refresh" tw="text-xl text-white" type="light" />
            </Button>
          </FlexBox>
          <Table
            columns={[
              {
                title: '作业/文件夹名称',
                dataIndex: 'name',
                key: 'name',
                render: (name: string) => (
                  <FlexBox tw="items-center">
                    <Icon
                      name="q-downloadBoxFill"
                      type="light"
                      css={css`
                        & .qicon {
                          ${tw`text-white! fill-[#fff]!`}
                        }
                      `}
                    />
                    <span tw="text-white">{name}</span>
                  </FlexBox>
                )
              },
              {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
                render: (text: string) => <span tw="text-font-secondary">{text}</span>
              },
              {
                title: '描述',
                dataIndex: 'desc',
                key: 'desc',
                render: (text: string) => <span tw="text-font-secondary">{text}</span>
              },
              {
                title: '更新时间',
                dataIndex: 'updated',
                key: 'updated',
                render: (updated: number) => {
                  if (!updated) {
                    return null
                  }
                  return (
                    <span tw="text-font-secondary">
                      {dayjs(updated * 1000).format('YYYY-MM-DD HH:mm:ss')}
                    </span>
                  )
                }
              }
            ]}
            rowKey="id"
            dataSource={infos ?? []}
            page={{ total: get(jobList, 'total', 0), ...pagination }}
            loading={jobLoading}
          />
        </div>
      )
    }

    const { isLoading, mutateAsync } = useMutationAlert({})

    const handleAction = (_: any, action: 'edit' | 'delete') => {
      if (action === 'edit') {
        store.set({
          showAddMonitorForm: true,
          selectedMonitor: data,
          getQueryListKey: getQueryKeyDescribeAlertPolicy,
          jobDetail: {}
        })
      } else {
        Modal.warning({
          title: `确认删除告警策略: ${data?.name}?`,
          content: <div tw="text-neut-8">删除后，此操作无法撤回，您确定删除该告警策略吗？</div>,
          width: 600,
          okType: 'danger',
          okText: '删除',
          confirmLoading: isLoading,
          onOk: () => {
            mutateAsync({
              op: 'delete',
              data: {
                alert_ids: [data?.id]
              }
            }).then(() => toList())
          }
        })
      }
    }

    return (
      <Root tw="relative">
        <FlexBox tw="items-center gap-2">
          <Tooltip
            theme="light"
            content="返回"
            hasPadding
            placement="bottom"
            twChild={tw`inline-flex`}
          >
            <div
              tw="inline-flex items-center justify-center w-6 h-6 rounded-full"
              onClick={() => toList()}
              css={css`
              &:hover {
                ${tw`bg-white cursor-pointer`}
                .icon svg.qicon {
                  ${tw`text-neut-15!`}
                }
            `}
            >
              <Icon
                name="previous"
                size={20}
                // clickable
                type="light"
                css={css`
                  svg.qicon {
                    ${tw`text-[#939EA9]! fill-[#939EA9]!`}
                  }
                `}
              />
            </div>
          </Tooltip>
          <CopyTextWrapper text={`${data?.name ?? ''}(ID: ${id})`} theme="light" />
        </FlexBox>

        <Card hasBoxShadow tw="bg-neut-16 relative">
          {isFetching && (
            <div tw="absolute inset-0 z-50">
              <Loading size="large" />
            </div>
          )}
          <div tw="flex justify-between items-center px-4 h-[72px]">
            <Center tw="flex-auto">
              <Circle tw="w-10! h-10!">
                <Icon
                  name="q-bellGearDuotone"
                  type="light"
                  size={28}
                  css={css`
                    & .qicon {
                      ${tw`text-white! fill-[#fff]!`}
                    }
                  `}
                />
              </Circle>
              <div tw="flex-auto">
                <div tw="text-white">
                  <span tw="mr-3">{data?.name}</span>
                  {/* <StreamReleaseStatusCmp */}
                  {/*   type={data?.status as 1} */}
                  {/*   tw="inline-flex" */}
                  {/* /> */}
                </div>
                <div tw="text-neut-8">{data?.id}</div>
              </div>
            </Center>
            <FlexBox tw="gap-4">
              <MoreAction<'edit' | 'delete'>
                items={[
                  {
                    icon: 'if-pen',
                    text: '编辑',
                    key: 'edit'
                  },
                  {
                    key: 'delete',
                    icon: 'if-trash',
                    text: '删除'
                  }
                ]}
                type="button"
                buttonText="更多操作"
                placement="bottom-start"
                onMenuClick={handleAction}
              />
              <Button
                onClick={() => {
                  setOpen(!isOpen)
                }}
                type="icon"
                tw="bg-transparent border dark:border-line-dark! focus:bg-line-dark! active:bg-line-dark! hover:bg-line-dark!"
              >
                <Icon
                  name={!isOpen ? 'chevron-down' : 'chevron-up'}
                  type="light"
                  tw="bg-transparent! hover:bg-transparent!"
                  size={16}
                />
              </Button>
            </FlexBox>
          </div>

          <CollapsePanel visible={isOpen} tw="bg-transparent">
            <div tw="flex-auto grid grid-cols-3 border-t border-neut-15 py-3">
              <GridItem>
                <span>监控对象:</span>
                <span>{monitorObjectTypes[data?.monitor_object as 1]?.label}</span>
                <span>触发规则：</span>
                <span>触发任意一项监控项</span>
              </GridItem>
              <GridItem labelWidth={84}>
                <span>告警行为：</span>
                <span>发送通知</span>
                <span>最近更新时间：</span>
                <span>
                  {!!data?.updated && dayjs(data?.updated * 1000).format('YYYY-MM-DD HH:mm:ss')}
                </span>
              </GridItem>

              <GridItem labelWidth={84}>
                <span>策略描述：</span>
                <span>{data?.desc}</span>
              </GridItem>
            </div>
          </CollapsePanel>
        </Card>

        <HorizonTabs
          defaultActiveName=""
          tw="bg-transparent"
          // @ts-ignore
          activeName={activeName}
          css={css`
            .tab-content {
              ${tw`p-0`}
            }
          `}
          onChange={(activeName1: string) => {
            setActiveName(activeName1)
          }}
        >
          <TabPanel label="监控项" name="items">
            {renderItems()}
          </TabPanel>
          <TabPanel label="通知列表" name="users">
            {renderUsers()}
          </TabPanel>
          <TabPanel label="绑定作业" name="jobs">
            {renderJobs()}
          </TabPanel>
        </HorizonTabs>
        <AlertModal />
      </Root>
    )
  }
)

const AlertPolicyDetailPage = () => {
  const {
    detail: id,
    spaceId,
    regionId
  } = useParams<{ detail: string; spaceId: string; regionId: string }>()

  const history = useHistory()

  if (!id) {
    emitter.emit('error', {
      title: `请先选择具体告警规则`
    })
    setTimeout(() => {
      history.goBack()
    }, 1500)
    return null
  }
  return (
    <AlertStoreProvider>
      <>
        <AlertPolicyDetail id={id} spaceId={spaceId} regionId={regionId} />
        <AlertModal />
      </>
    </AlertStoreProvider>
  )
}

export default AlertPolicyDetailPage
