/* eslint-disable no-bitwise */
// @ts-ignore
import { Button, CopyText, Icon } from '@QCFE/qingcloud-portal-ui'
import {
  Card,
  Center,
  FlexBox,
  IMoreActionItem,
  MoreAction,
  TextLink,
  Tooltip,
} from 'components'
import { useHistory } from 'react-router-dom'
import tw, { css, styled } from 'twin.macro'
import React, { useState } from 'react'
import icons from 'views/Space/Ops/icons'
import { Collapse, Loading, Tabs } from '@QCFE/lego-ui'
import dayjs from 'dayjs'
import { HorizonTabs } from 'views/Space/Dm/styled'
import useIcon from 'hooks/useHooks/useIcon'
import DataSourceModal from 'views/Space/Ops/DataIntegration/DataRelease/DataSourceModal'
import { useImmer } from 'use-immer'
import { get } from 'lodash-es'
import {
  DataReleaseDevMode,
  dataReleaseDevModeType,
  jobInstanceStatus,
  JobInstanceStatusType,
} from 'views/Space/Ops/DataIntegration/constants'
import { useQueryClient } from 'react-query'
import {
  getSyncJobInstanceKey,
  useDescribeInstanceWithFlinkUIByInstanceId,
  useMutationJobInstance,
} from 'hooks'
import DevContent from 'views/Space/Ops/components/DevContent'
import {
  AlarmStatusCmp,
  Circle,
  DbTypeCmp,
  JobInstanceStatusCmp,
  JobTypeCmp,
} from '../../styledComponents'
import AlertModal from '../../Alert/Modal'
import Schedule from '../../components/Schedule'
import Cluster from '../../components/Cluster'

interface IDataJobInstanceDetailProps {
  id: string
}

const { TabPanel } = Tabs as any
const { CollapsePanel } = Collapse

// const { BreadcrumbItem } = Breadcrumb as any

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
  `,
])

const Root = styled.div`
  ${tw`grid gap-3 h-full px-4 py-3 leading-[20px]`}
  grid-template-rows: auto auto 1fr;

  & {
    & .tabs {
      ${tw`flex-none`}
    }

    & .tab-content {
      ${tw`overflow-y-auto px-0 py-4`}
    }
  }
`

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

const DataJobInstanceDetail = (props: IDataJobInstanceDetailProps) => {
  useIcon(icons)
  const { id } = props

  const history = useHistory()

  const [{ showDataSource, datasourceId, datasourceType }, setDataSource] =
    useImmer({
      showDataSource: false,
      datasourceId: undefined as string | undefined,
      datasourceType: undefined as number | undefined,
    })
  const [isOpen, setOpen] = useState(true)
  const [activeName, setActiveName] = useState('Message')
  const toList = () => {
    history.push('../data-job')
  }

  const { data, isFetching } = useDescribeInstanceWithFlinkUIByInstanceId(id)

  const stopAble =
    JobInstanceStatusType.RUNNING |
    JobInstanceStatusType.FAILED_AND_RETRY |
    JobInstanceStatusType.PREPARING

  const getActions = (
    status: JobInstanceStatusType,
    record: Record<string, any>
  ): IMoreActionItem[] => {
    const result = []
    if (status & stopAble) {
      result.push({
        text: '中止',
        icon: 'q-closeCircleFill',
        key: 'stop',
        value: record,
      })
    }
    return result
  }

  const queryClient = useQueryClient()
  const refetchData = () => {
    queryClient.invalidateQueries(getSyncJobInstanceKey('list'))
  }

  const mutation = useMutationJobInstance()

  const jumpDataReleaseDetail = ({
    jobId,
    version,
  }: {
    jobId: string
    version: string
  }) => {
    window.open(`../data-release/${jobId}?version=${version}`, '_blank')
  }

  const handleMenuClick = (record: Record<string, any>, key: any) => {
    switch (key) {
      case 'stop':
        mutation
          .mutateAsync({
            op: 'terminate',
            ids: [record.id],
          })
          .then(() => {
            refetchData()
          })
        break
      default:
        break
    }
  }

  return (
    <Root tw="">
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
        <CopyTextWrapper
          text={`${get(data, 'sync_job.name', '')}(ID: ${id})`}
          theme="light"
        />
      </FlexBox>
      <Card hasBoxShadow tw="bg-neut-16">
        {isFetching && (
          <div tw="absolute inset-0 z-50">
            <Loading size="large" />
          </div>
        )}
        <div tw="flex justify-between items-center px-4 h-[72px]">
          <Center tw="flex-auto">
            <Circle>
              <Icon
                name="q-mergeFillDuotone"
                type="light"
                css={css`
                  & .qicon {
                    ${tw`text-white! fill-[#fff]!`}
                  }
                `}
              />
            </Circle>
            <div tw="flex-1">
              <div tw="text-white">
                <span tw="mr-3">{data?.id}</span>
                <JobInstanceStatusCmp
                  type={data?.state as 1}
                  tw="inline-flex"
                />
              </div>
            </div>
          </Center>
          <FlexBox tw="gap-4">
            {data?.state & stopAble &&
              !!getActions(jobInstanceStatus[data?.state as 1]?.type, data)
                .length && (
                <MoreAction
                  items={getActions(
                    jobInstanceStatus[data?.state as 1]?.type,
                    data
                  )}
                  onMenuClick={handleMenuClick as any}
                  type="button"
                  placement="bottom-start"
                  buttonText="更多操作"
                />
              )}
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
              <span>告警状态:</span>
              <span>
                <AlarmStatusCmp type={data?.alarm_status} />
              </span>
              <span>所属作业:</span>
              <span tw="inline-block">
                <Tooltip
                  theme="light"
                  hasPadding
                  content={`发布描述：${get(data, 'sync_job.desc', '')}`}
                >
                  <div>
                    <div>
                      <span
                        tw="text-white font-semibold mr-1 cursor-pointer"
                        onClick={() =>
                          jumpDataReleaseDetail({
                            jobId: data?.job_id,
                            version: data?.version,
                          })
                        }
                      >
                        {get(data, 'sync_job.name')}
                      </span>
                      <span tw="text-neut-8">({data?.job_id})</span>
                    </div>
                    <div tw="text-neut-8">版本 ID: {data?.version}</div>
                  </div>
                </Tooltip>
              </span>
              <span>作业模式:</span>
              <span>
                {
                  dataReleaseDevModeType[
                    get(data, 'sync_job_property.conf.job_mode') as 1
                  ]?.label
                }
              </span>
            </GridItem>

            <GridItem>
              <span>作业类型:</span>
              <span>
                <JobTypeCmp type={get(data, 'sync_job.type') as 2} />
              </span>
              <span>数据来源:</span>
              <span tw="inline-block">
                {dataReleaseDevModeType[
                  get(data, 'sync_job_property.conf.job_mode') as 1
                ]?.type === DataReleaseDevMode.UI &&
                  get(data, 'sync_job_property.conf.source_id') && (
                    <div
                      tw="align-middle"
                      css={[tw`cursor-pointer  hover:text-green-11`]}
                      onClick={() =>
                        setDataSource({
                          showDataSource: true,
                          datasourceType: get(data, 'sync_job.source_type'),
                          datasourceId: get(
                            data,
                            'sync_job_property.conf.source_id'
                          ),
                        })
                      }
                    >
                      <DbTypeCmp
                        devMode={
                          get(data, 'sync_job_property.conf.job_mode') as 1
                        }
                        type={get(data, 'sync_job.source_type') as 1}
                        onClick={() => {}}
                      />
                      <span tw="ml-1">
                        {get(data, 'sync_job_property.conf.source_name')}
                      </span>
                    </div>
                  )}
                {dataReleaseDevModeType[
                  get(data, 'sync_job_property.conf.job_mode') as 1
                ]?.type === DataReleaseDevMode.SCRIPT && (
                  <DbTypeCmp
                    devMode={get(data, 'sync_job_property.conf.job_mode')}
                    type={get(data, 'sync_job.source_type') as 1}
                  />
                )}
                <div tw="text-neut-8">
                  {get(data, 'sync_job_property.conf.source_id')}
                </div>
              </span>
              <span>数据目的:</span>

              <span tw="inline-block">
                {dataReleaseDevModeType[
                  get(data, 'sync_job_property.conf.job_mode') as 1
                ]?.type === DataReleaseDevMode.UI &&
                  get(data, 'sync_job_property.conf.target_id') && (
                    <div
                      tw="align-middle"
                      css={[tw`cursor-pointer  hover:text-green-11`]}
                      onClick={() =>
                        setDataSource({
                          showDataSource: true,
                          datasourceType: get(
                            data,
                            'sync_job.target_type'
                          ) as number,
                          datasourceId: get(
                            data,
                            'sync_job_property.conf.target_id'
                          ) as string,
                        })
                      }
                    >
                      <DbTypeCmp
                        devMode={get(data, 'sync_job_property.conf.job_mode')}
                        type={get(data, 'sync_job.target_type') as 1}
                        onClick={() => {}}
                      />
                      <span tw="ml-1">
                        {get(data, 'sync_job_property.conf.target_name')}
                      </span>
                    </div>
                  )}
                {dataReleaseDevModeType[
                  get(data, 'sync_job_property.conf.job_mode') as 1
                ]?.type === DataReleaseDevMode.SCRIPT && (
                  <DbTypeCmp
                    devMode={get(data, 'sync_job_property.conf.job_mode')}
                    type={get(data, 'sync_job.target_type') as 1}
                  />
                )}
                <div tw="text-neut-8">
                  {get(data, 'sync_job_property.conf.target_id')}
                </div>
              </span>
            </GridItem>

            <GridItem>
              <span>其他信息:</span>
              <span>
                <TextLink
                  disabled={
                    jobInstanceStatus[data?.state as 1]?.type ===
                    JobInstanceStatusType.PREPARING
                  }
                  onClick={() => {
                    // describeFlinkUiByInstanceId({
                    //   regionId,
                    //   spaceId,
                    //   instanceId: id,
                    // }).then((web_ui: string) => {
                    if (data?.flink_ui) {
                      window.open(`//${data?.flink_ui}`, '_blank')
                    }
                    // })
                  }}
                >
                  Flink UI
                </TextLink>
              </span>
              <span>开始时间:</span>
              <span>
                {dayjs(get(data, 'created') * 1000).format(
                  'YYYY-MM-DD HH:mm:ss'
                )}
              </span>
              <span>更新时间:</span>
              <span>
                {dayjs(get(data, 'updated') * 1000).format(
                  'YYYY-MM-DD HH:mm:ss'
                )}
              </span>
            </GridItem>
          </div>
        </CollapsePanel>
      </Card>
      <HorizonTabs
        defaultActiveName=""
        tw="overflow-hidden bg-transparent"
        activeName={activeName}
        onChange={(activeName1: string) => {
          setActiveName(activeName1)
        }}
      >
        <TabPanel label="Message" name="Message">
          <div
            css={css`
              overflow-wrap: anywhere;
            `}
            tw="whitespace-pre-wrap bg-transparent"
          >
            {data?.message}
          </div>
        </TabPanel>
        <TabPanel label="监控告警" name="Monitor">
          {/* <Monitor /> */}
        </TabPanel>
        <TabPanel label="开发内容" name="Develop">
          {/* <div>3</div> */}

          <DevContent
            data={get(data, 'sync_job_property.conf')}
            curJob={get(data, 'sync_job')}
          />
        </TabPanel>
        <TabPanel label="计算集群" name="Cluster">
          <Cluster clusterId={get(data, 'sync_job_property.conf.cluster_id')} />
        </TabPanel>
        <TabPanel label="调度信息" name="Schedule">
          <Schedule data={get(data, 'sync_job_property.schedule')} />
        </TabPanel>
      </HorizonTabs>
      {showDataSource && (
        <DataSourceModal
          onCancel={() => {
            setDataSource((draft) => {
              draft.showDataSource = false
            })
          }}
          datasourceType={datasourceType}
          datasourceId={datasourceId}
        />
      )}
      <AlertModal />
    </Root>
  )
}

export default DataJobInstanceDetail
