/* eslint-disable no-underscore-dangle */
import { Icon, PageTab } from '@QCFE/qingcloud-portal-ui'
import React, { useMemo } from 'react'
import { useColumns } from 'hooks/useHooks/useColumns'
import { get } from 'lodash-es'
import tw, { css, styled } from 'twin.macro'
import useFilter from 'hooks/useHooks/useFilter'
import { observer } from 'mobx-react-lite'
import {
  Center,
  FlexBox,
  InstanceName,
  Modal,
  SelectTreeTable,
  TextEllipsis,
  Tooltip,
} from 'components'
import { Checkbox } from '@QCFE/lego-ui'
import { useQuerySyncJobRelease } from 'hooks/useJobRelease'
import {
  DataReleaseActionType,
  dataReleaseColumns,
  DataReleaseDevMode,
  dataReleaseDevModeType,
  dataReleaseTabs,
} from '../constants'
import { getColumnsRender, getOperations } from './utils'
import { useDataReleaseStore } from './store'
import VersionsModal from './VersionsModal'
import TableHeader from './TableHeader'

import DataSourceModal from './DataSourceModal'
// import { IColumn } from 'hooks/utils'

// interface IDataReleaseProps {}

const TabsWrapper = styled.div`
  & .panel-right .icon svg.qicon {
    fill: hsla(0, 0%, 100%, 0.9);
    color: hsla(0, 0%, 100%, 0.4);
  }
`

const jobNameStyle = css`
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
  `,
])

const dataReleaseSettingKey = 'DATA_RELEASE_SETTING'

// const columns: IColumn[] = []
const DataRelease = observer(() => {
  const { showDataSource, showVersion, showOffline, selectedData, set } =
    useDataReleaseStore()
  const { filter, setFilter, pagination, sort } = useFilter<
    {
      source?: string
      target?: string
      reverse?: 'asc' | 'desc'
      sort_by?: string
      job_type?: any
      alarm_status?: string
      status?: number
      offset: number
      limit: number
    },
    { pagination: true; sort: true }
  >({}, { pagination: true, sort: true }, dataReleaseSettingKey)

  const jumpDetail = (tab?: string) => (record: Record<string, any>) => {
    window.open(
      `./data-release/${record.id}${tab ? `?tab=${tab}` : ''}`,
      '_blank'
    )
  }

  const handleDatasource = (record: Record<string, any>) => {
    if (
      dataReleaseDevModeType[record.dev_mode as 1]?.type ===
      DataReleaseDevMode.UI
    ) {
      set({
        showDataSource: true,
        selectedData: record,
      })
    }
  }

  const columnsRender = getColumnsRender(filter, setFilter, undefined, {
    alarm_status: jumpDetail('alarm'),
    source: handleDatasource,
    target: handleDatasource,
  })

  const handleMenuClick = (
    record: Record<string, any>,
    key: DataReleaseActionType
  ) => {
    console.log(record)
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
          selectedData: record,
        })
        break
      case 're-publish':
        break
      default:
        break
    }
  }

  const operations = getOperations(handleMenuClick)

  const jobNameColumn = {
    ...dataReleaseColumns[0],
    width: 250,
    render: (text: string, record: Record<string, any>) => {
      if (record.hasMore) {
        return (
          <span
            tw="text-green-11 cursor-pointer"
            onClick={() => {
              set({
                showVersion: true,
                selectedData: record,
              })
            }}
          >
            查看全部 →
          </span>
        )
      }

      if (record.hasNone) {
        return <span tw="text-neut-8">暂无历史版本</span>
      }

      if (record.__level > 1) {
        return <TextEllipsis>{text}</TextEllipsis>
      }
      const child = (
        <Center tw="truncate" css={jobNameStyle}>
          <InstanceName
            theme="dark"
            icon="q-downloadBoxFill"
            name={record.name}
            desc={record.id}
            onClick={() => jumpDetail()(record)}
          />
        </Center>
      )
      if (record.desc) {
        return (
          <Tooltip theme="light" hasPadding content={record.desc}>
            {child}
          </Tooltip>
        )
      }
      return child
    },
  }

  const { columns, setColumnSettings } = useColumns(
    dataReleaseSettingKey,
    [jobNameColumn, ...dataReleaseColumns.slice(1)],
    columnsRender,
    operations
  )

  const columnsSetting = useMemo(
    () => ({
      columns: dataReleaseColumns,
      onSave: setColumnSettings as any,
      storageKey: dataReleaseSettingKey,
    }),
    [setColumnSettings]
  )

  const { data, isFetching } = useQuerySyncJobRelease(filter)

  // const infos =  [
  //   {
  //     id: 'fadsf-asdf-asdf-asdf',
  //     name: 'work-adf',
  //     created_by: new Date().getTime(),
  //     status: 2,
  //     type: 1,
  //     updated: new Date().getTime(),
  //     version: 'asdfasfd',
  //   },
  // ]
  const infos =
    get(data, 'infos', [
      {
        id: 'fadsf-asdf-asdf-asdf',
        name: 'work-adf',
        created_by: new Date().getTime(),
        status: 2,
        type: 1,
        updated: new Date().getTime() / 1000,
        version: 'asdfasfd',
      },
    ]) || []
  console.log(infos)

  return (
    <>
      <FlexBox orient="column" tw="p-5 h-full">
        <TabsWrapper>
          <PageTab tabs={dataReleaseTabs} />
        </TabsWrapper>
        <FlexBox orient="column" tw="gap-3">
          <TableHeader columnsSetting={columnsSetting} />
          <SelectTreeTable
            openLevel={1}
            indentSpace={44}
            selectedLevel={-1}
            getChildren={async (key) => [
              {
                id: `${key}as`,
                job_name: `${key}asdf`,
                // hasNone: true,
                hasMore: true,
              },
            ]}
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
      {showVersion && (
        <VersionsModal
          onCancel={() => {
            set({
              showVersion: false,
            })
          }}
        />
      )}
      {showDataSource && (
        <DataSourceModal
          onCancel={() => {
            set({
              showDataSource: false,
            })
          }}
        />
      )}
      {showOffline && (
        <ModalWrapper
          visible
          width={400}
          appendToBody
          onCancel={() => {
            set({
              showOffline: false,
            })
          }}
          okText="下线"
          okType="danger"
          onOk={() => {
            set({
              showOffline: false,
            })
          }}
        >
          <div>
            <FlexBox tw="gap-3">
              <Icon
                name="if-exclamation"
                size={24}
                tw="text-[24px] text-[#FFD127] leading-6"
              />
              <div tw="grid gap-2">
                <div tw="text-white text-[16px] leading-6">
                  下线作业 {selectedData?.name}
                </div>
                <div tw="text-neut-8 leading-5">
                  作业下线后，相关实例需要手动恢复执行，确认从调度系统移除作业么?
                </div>
                <div tw="leading-5">
                  <Checkbox>
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
})

export default DataRelease
