import { FlexBox, Modal, ModalContent, TableHeader, TextEllipsis, Tooltip } from 'components'
import { observer } from 'mobx-react-lite'
import useFilter from 'hooks/useHooks/useFilter'
import {
  DataReleaseActionType,
  dataReleaseColumns,
  versionColumns
} from 'views/Space/Ops/DataIntegration/constants'
import React, { useMemo, useRef } from 'react'
import { IColumn, useColumns } from 'hooks/useHooks/useColumns'
import { Table } from 'views/Space/styled'
import { useDataReleaseStore } from 'views/Space/Ops/DataIntegration/DataRelease/store'
import compilePath from 'utils/compilePath'

import { useParams } from 'react-router-dom'
import { Checkbox, Icon } from '@QCFE/lego-ui'
import tw, { css, styled } from 'twin.macro'
import {
  getJobReleaseKey,
  getJobVersionKey,
  useMutationJobRelease,
  useQuerySyncJobVersions
} from 'hooks'
import { useQueryClient } from 'react-query'
import { JobMode } from 'views/Space/Dm/RealTime/Job/JobUtils'
import { streamReleaseScheduleTypes } from 'views/Space/Ops/Stream1/common/constants'
import { getColumnsRender, getOperations } from './utils'

interface IProps {
  onCancel: () => void
  type: JobMode
  jumpDetail: (tab?: string) => (record: Record<string, any>) => void
  jobId: string
  operations?: IColumn
}

export const getPathConfig = (type: JobMode) => {
  switch (type) {
    case JobMode.RT:
      return {
        type: 'release'
      }
    case JobMode.OLE:
      return {
        type: 'ole-release'
      }
    case JobMode.DI:
      return {
        type: 'data-release'
      }
    default:
      return {}
  }
}

const ModalWrapper = styled(Modal)(() => [
  css`
    .modal-card-head {
      border-bottom: 0;
    }

    .modal-card-body {
      padding-top: 0;
    }

    .modal-card-foot {
      border-top: 0;
      ${tw`pb-4!`}
    }
  `
])

export const getJumpDetail = (config: Record<string, any>, tab?: string) => {
  window.open(
    compilePath(
      `/dataomnis/{regionId}/workspace/{spaceId}/ops/{type}/{id}?version={version}${
        tab ? `&tab=${tab}` : ''
      }`,
      config
    )[0],
    '_blank'
  )
}

const VersionsModal = (props: IProps) => {
  const { onCancel, type, jobId, jumpDetail, operations } = props

  const dataReleaseVersionSettingKey = `DATA_RELEASE_VERSION_SETTING_${type}`
  const { filter, setFilter, pagination, sort } = useFilter<
    {
      reverse?: boolean
      sort_by?: string
      alert_status?: string
      status?: number
      offset: number
      limit: number
      job_id: string
      search?: string
    },
    { pagination: true; sort: true }
  >(
    { limit: 10, job_id: jobId, reverse: true, sort_by: 'updated' },
    { pagination: true, sort: true },
    dataReleaseVersionSettingKey
  )

  const columnsRender = getColumnsRender(filter, setFilter, [
    'alert_status',
    // 'status',
    'version',
    'updated'
  ])

  const jobNameColumn = {
    ...dataReleaseColumns[0],
    dataIndex: 'name',
    title: '作业名称',
    // width: 250,
    render: (text: string, record: Record<string, any>) => {
      const child = (
        <TextEllipsis>
          <span tw="hover:text-green-11 hover:cursor-pointer" onClick={() => jumpDetail()(record)}>
            {text}
          </span>
        </TextEllipsis>
      )
      if (record.desc) {
        return (
          <Tooltip theme="light" hasPadding content={record.desc}>
            {child}
          </Tooltip>
        )
      }
      return child
    }
  }
  const { columns, setColumnSettings } = useColumns(
    dataReleaseVersionSettingKey,
    [jobNameColumn, ...versionColumns.slice(1)],
    {
      ...columnsRender,
      // TODO: fix it 根据type判断
      // eslint-disable-next-line no-nested-ternary
      status: (type === JobMode.DI
        ? columnsRender.status
        : type === JobMode.RT
        ? {
            filter: filter.status,
            onFilter: (v: number) => {
              setFilter((draft) => {
                draft.status = v
                draft.offset = 0
              })
            },
            filterAble: true,
            filtersNew: Object.values(streamReleaseScheduleTypes) as any,
            render: () => null
            // render: (status: keyof typeof streamReleaseScheduleTypes) => {
            //   return <StreamReleaseStatusCmp type={status} />
            // },
          }
        : undefined) as any
    },
    operations
  )
  const columnsSetting = useMemo(
    () => ({
      columns: versionColumns,
      onSave: setColumnSettings as any,
      storageKey: dataReleaseVersionSettingKey
    }),
    [dataReleaseVersionSettingKey, setColumnSettings]
  )
  const { data } = useQuerySyncJobVersions(filter, { enabled: true }, type)
  return (
    <Modal
      width={800}
      onCancel={onCancel}
      appendToBody
      footer={null}
      orient="fullright"
      visible
      title="历史版本"
    >
      <ModalContent>
        <FlexBox orient="column" tw="gap-3">
          <TableHeader
            columnsSetting={columnsSetting}
            queryKey={() => getJobVersionKey('list')}
            suggestions={[
              {
                label: '版本 ID',
                key: 'version'
              }
            ]}
            filterInputConfig={{
              defaultKeywordLabel: '版本 ID',
              searchKey: 'version'
            }}
          />
          <Table
            columns={columns}
            dataSource={data?.infos || []}
            onSort={sort}
            rowKey="version"
            pagination={{
              total: data?.total ?? 0,
              ...pagination
            }}
          />
        </FlexBox>
      </ModalContent>
    </Modal>
  )
}

const getHelp = (title: string, type: false | 'offline' | 'resume' | 'suspend') => {
  switch (type) {
    case 'offline':
      return {
        icon: 'if-exclamation',
        title: `下线作业 ${title}?`,
        desc: '作业下线后，相关实例需要手动恢复执行，确认从调度系统移除作业么?',
        button: '下线',
        showKey: 'showOffline',
        buttonType: 'danger'
      }
    case 'resume':
      return {
        icon: 'if-information',
        title: `重新发布调度作业 ${title}?`,
        desc: `确认重新发布调度作业 ${title}`,
        button: '重新发布',
        showKey: 'showResume',
        buttonType: 'primary'
      }
    case 'suspend':
      return {
        icon: 'if-information',
        title: `暂停调度作业 ${title}?`,
        desc: '暂停后，相关实例需要手动恢复执行，确认暂停么?',
        button: '暂停',
        showKey: 'showSuspend',
        buttonType: 'danger'
      }
    default:
      return undefined
  }
}

export const VersionsModalContainer = observer(
  ({
    type = JobMode.DI,
    refetchDataKey: refetchDataProp,
    jobId
  }: {
    type: JobMode
    refetchDataKey?: string
    jobId: string
  }) => {
    const { set, selectedData, showVersion, showOffline, showResume, showSuspend } =
      useDataReleaseStore()
    const onCancel = () => {
      set({
        showVersion: false
      })
    }

    const { regionId, spaceId } = useParams<{ regionId: string; spaceId: string }>()

    const detail = { ...getPathConfig(type), regionId, spaceId }

    const jumpDetail = (tab?: string) => (record: Record<string, any>) => {
      getJumpDetail({ ...record, ...detail }, tab)
    }
    const handleMenuClick = (record: Record<string, any>, key: DataReleaseActionType) => {
      switch (key) {
        case 'link':
        case 'dev':
        case 'cluster':
        case 'alarm':
        case 'schedule':
          jumpDetail(key)(record)
          break
        case 'offline':
          set({
            showOffline: true,
            selectedData: record
          })
          break
        case 'resume':
          set({
            showResume: true,
            selectedData: record
          })
          break
        case 'suspend':
          set({
            showSuspend: true,
            selectedData: record
          })
          break
        default:
          break
      }
    }

    const operations = getOperations(handleMenuClick, type, true)
    const queryClient = useQueryClient()
    const checkRef = useRef(false)

    const mutation = useMutationJobRelease(undefined, type)
    const op = (showOffline && 'offline') || (showResume && 'resume') || (showSuspend && 'suspend')
    const help = getHelp(selectedData?.name, op)
    const refetchData = () => {
      queryClient.invalidateQueries(refetchDataProp ?? getJobReleaseKey())
    }
    return (
      <>
        {showVersion && (
          <VersionsModal
            onCancel={onCancel}
            type={type}
            jumpDetail={jumpDetail}
            jobId={jobId}
            operations={operations}
          />
        )}
        {op && (
          <ModalWrapper
            visible
            width={400}
            appendToBody
            onCancel={() => {
              set({
                [help!.showKey]: false
              })
              checkRef.current = false
            }}
            okText={help!.button}
            okType={help!.buttonType}
            onOk={() => {
              mutation
                .mutateAsync({
                  op,
                  job_id: selectedData?.id,
                  stop_running: checkRef.current
                })
                .then(() => {
                  set({
                    [help!.showKey]: false
                  })
                  checkRef.current = false
                  refetchData()
                })
            }}
          >
            <div>
              <FlexBox tw="gap-3">
                <Icon name={help!.icon} size={24} tw="text-[24px] text-[#FFD127] leading-6" />
                <div tw="grid gap-2">
                  <div tw="text-white text-[16px] leading-6">{help!.title}</div>
                  <div tw="text-neut-8 leading-5">{help!.desc}</div>
                  <div tw="leading-5">
                    <Checkbox
                      onChange={(e, checked) => {
                        checkRef.current = checked
                      }}
                    >
                      <span tw="text-white ml-1">同时停止运行中的实例</span>
                    </Checkbox>
                  </div>
                </div>
              </FlexBox>
            </div>
          </ModalWrapper>
        )}
      </>
    )
  }
)

export default VersionsModalContainer
