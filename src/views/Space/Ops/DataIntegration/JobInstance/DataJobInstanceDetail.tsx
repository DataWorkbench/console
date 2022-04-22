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
import { useHistory, useParams } from 'react-router-dom'
import tw, { css, styled } from 'twin.macro'
import React, { useState } from 'react'
import icons from 'views/Space/Ops/DataIntegration/icons'
import { Collapse, Loading, Tabs } from '@QCFE/lego-ui'
import dayjs from 'dayjs'
import { HorizonTabs } from 'views/Space/Dm/styled'
import useIcon from 'hooks/useHooks/useIcon'
import DataSourceModal from 'views/Space/Ops/DataIntegration/DataRelease/DataSourceModal'
import { useImmer } from 'use-immer'
import { get } from 'lodash-es'
import {
  jobInstanceStatus,
  JobInstanceStatusType,
} from 'views/Space/Ops/DataIntegration/constants'
import { describeFlinkUiByInstanceId } from 'stores/api'
import { useQueryClient } from 'react-query'
import {
  AlarmStatusCmp,
  Circle,
  DbTypeCmp,
  JobInstanceStatusCmp,
  JobTypeCmp,
} from '../styledComponents'
import AlertModal from '../../Alert/Modal'
import {
  getSyncJobInstanceKey,
  useMutationJobInstance,
  useQuerySyncJobInstances,
} from '../../../../../hooks/useJobInstance'

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

interface IRouteParams {
  regionId: string
  spaceId: string
}

const DataJobInstanceDetail = (props: IDataJobInstanceDetailProps) => {
  useIcon(icons)
  const { id } = props

  const history = useHistory()

  const { regionId, spaceId } = useParams<IRouteParams>()

  const [{ showDataSource }, setDataSource] = useImmer({
    showDataSource: false,
    dataSourceData: undefined,
  })
  const [isOpen, setOpen] = useState(true)
  const [activeName, setActiveName] = useState('Message')
  const toList = () => {
    history.push('../data-job')
  }

  const { data: list, isFetching } = useQuerySyncJobInstances({
    instance_id: id,
  })
  const data = get(list, 'infos[0]', {})

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
        <Tooltip theme="light" content="返回" hasPadding placement="bottom">
          <Icon
            name="previous"
            size={20}
            clickable
            type="light"
            onClick={() => toList()}
            css={css`
              svg.qicon {
                ${tw`text-[#939EA9]! fill-[#939EA9]!`}
              }
            `}
          />
        </Tooltip>
        <CopyTextWrapper
          text={`${data?.name ?? ''}(ID: ${id})`}
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
            {data.state & stopAble && (
              <MoreAction
                items={getActions(
                  jobInstanceStatus[data.state as 1]?.type,
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
                  content={`发布描述：${data?.desc}`}
                >
                  <div>
                    <div>
                      <span tw="text-white font-semibold mr-1">
                        {data?.job_name}
                      </span>
                      <span tw="text-neut-8">({data?.job_id})</span>
                    </div>
                    <div tw="text-neut-8">版本 ID: {data?.version}</div>
                  </div>
                </Tooltip>
              </span>
              <span>作业模式:</span>
              <span />
            </GridItem>

            <GridItem>
              <span>作业类型:</span>
              <span>
                <JobTypeCmp type={data?.type as 2} />
              </span>
              <span>数据来源:</span>
              <span tw="inline-block">
                <div
                  tw="align-middle"
                  css={
                    [
                      // tw`cursor-pointer  hover:text-green-11`
                    ]
                  }

                  // onClick={() => set({ showDataSource: true })}
                >
                  <DbTypeCmp type={data?.source_type} onClick={() => {}} />
                  <span tw="ml-1">{data?.source_name}</span>
                </div>
                <div tw="text-neut-8">{data?.source_id}</div>
              </span>
              <span>数据目的:</span>
              <span tw="inline-block">
                <div tw="align-middle">
                  <DbTypeCmp type={data?.target_type} onClick={undefined} />
                </div>
              </span>
            </GridItem>

            <GridItem>
              <span>其他信息:</span>
              <span>
                <TextLink
                  disabled={
                    jobInstanceStatus[data.state as 1]?.type ===
                    JobInstanceStatusType.PREPARING
                  }
                  onClick={() => {
                    describeFlinkUiByInstanceId({
                      regionId,
                      spaceId,
                      instanceId: id,
                    }).then((web_ui: string) => {
                      if (web_ui) {
                        window.open(web_ui, '_blank')
                      }
                    })
                  }}
                >
                  Flink UI
                </TextLink>
              </span>
              <span>开始时间:</span>
              <span>{dayjs(data?.created).format('YYYY-MM-DD HH:mm:ss')}</span>
              <span>更新时间:</span>
              <span>{dayjs(data?.updated).format('YYYY-MM-DD HH:mm:ss')}</span>
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
        </TabPanel>
        <TabPanel label="计算集群" name="Cluster">
          {/* <Cluster /> */}
        </TabPanel>
        <TabPanel label="调度信息" name="Schedule">
          {/* <Schedule data={{}} /> */}
        </TabPanel>
      </HorizonTabs>
      {showDataSource && (
        <DataSourceModal
          onCancel={() => {
            setDataSource({
              showDataSource: false,
              dataSourceData: undefined,
            })
          }}
        />
      )}
      <AlertModal />
    </Root>
  )
}

export default DataJobInstanceDetail
