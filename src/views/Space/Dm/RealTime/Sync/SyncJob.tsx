import { Collapse } from '@QCFE/lego-ui'
import { Button, Icon, Notification as Notify } from '@QCFE/qingcloud-portal-ui'
import {
  FieldMappings,
  HelpCenterLink,
  Modal,
  RouterLink,
  PopConfirm,
  Center,
  ArrowLine
  // TextLink,
} from 'components'
import tw, { css, styled, theme } from 'twin.macro'
import { TMappingField } from 'components/FieldMappings/MappingItem'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Editor from 'react-monaco-editor'
import { get, isArray, isObject, isUndefined, set } from 'lodash-es'
import {
  useMutationSyncJobConf,
  useMutationSyncJobConvert,
  useQueryJobSchedule,
  useQuerySyncJobConf,
  useStore
} from 'hooks'
import SimpleBar from 'simplebar-react'
import { timeFormat } from 'utils/convert'

import {
  confColumns$,
  curJobDbConfSubject$,
  source$,
  sourceColumns$,
  target$,
  targetColumns$
} from 'views/Space/Dm/RealTime/Sync/common/subjects'
import DatasourceConfig from 'views/Space/Dm/RealTime/Sync/DatasourceConfig'
import { useImmer } from 'use-immer'
import { map, filter, pairwise } from 'rxjs'
import { SourceType } from 'views/Space/Upcloud/DataSourceList/constant'
import { useParams } from 'react-router-dom'
import { JobToolBar } from '../styled'
import SyncCluster from './SyncCluster'
import SyncChannel from './SyncChannel'
import ReleaseModal from '../Modal/ReleaseModal'
import { getDataSourceTypes } from '../Job/JobUtils'

const { CollapseItem } = Collapse
const CollapseWrapper = styled('div')(() => [
  tw`flex-1 px-2 py-2 bg-neut-18`,
  css`
    li.collapse-item {
      ${tw`mb-2 rounded-[3px] overflow-hidden`}
      .collapse-item-label {
        ${tw`h-11 border-none hover:bg-neut-16`}
      }

      .collapse-item-content {
        ${tw`bg-neut-17 p-3!`}
      }
    }

    li:last-child {
      ${tw`mb-1`}
    }
  `
])

const Label = styled('div')(() => [tw`border border-white px-2 py-1 leading-none rounded-[3px]`])
const getJobTypeName = (type: 1 | 2 | 3) => {
  const typeNameMap = new Map([
    [1, '离线 - 全量'],
    [2, '离线 - 增量'],
    [3, '实时同步']
  ])
  return typeNameMap.get(type)
}

const styles = {
  arrowBox: tw`space-x-2 bg-transparent w-[70%] z-10 text-white`,
  stepTag: tw`flex items-center text-left border border-green-11 rounded-r-2xl pr-4 mr-3 h-7 leading-5`,
  stepNum: tw`inline-block text-white bg-green-11 w-5 h-5 text-center rounded-full -ml-2.5`,
  stepText: tw`ml-2 inline-block border-green-11 text-green-11!`
}

const getStepsData = (regionId: string, spaceId: string) => [
  {
    key: 'p0',
    title: '选择数据源',
    desc: (
      <>
        在这里配置数据的来源端和目的端；仅支持在
        <RouterLink
          to={`/${regionId}/workspace/${spaceId}/upcloud/dsl`}
          target="_blank"
          color="blue"
        >
          数据源管理
        </RouterLink>
        创建的数据源。
      </>
    )
  },
  {
    key: 'p1',
    title: '字段映射',
    desc: null
  },
  {
    key: 'p2',
    title: '计算集群',
    desc: null
  },
  {
    key: 'p3',
    title: '通道控制',
    desc: (
      <>
        您可以配置作业的传输速率和错误记录来控制整个数据同步过程
        <HelpCenterLink
          hasIcon
          tw="ml-1.5"
          isIframe={false}
          href="/manual/integration_job/create_job_offline_1/#通道控制"
          onClick={(e) => e.stopPropagation()}
        >
          数据同步文档
        </HelpCenterLink>
      </>
    )
  }
]

const removeUndefined = (obj: any) => {
  const newObj: any = isArray(obj) ? [] : {}
  Object.entries(obj ?? {}).forEach(([key, value]) => {
    if (isObject(value)) {
      newObj[key] = removeUndefined(value)
    } else if (!isUndefined(value)) {
      newObj[key] = value
    }
  })
  return newObj
}

export interface DbInfo {
  id?: string
  tableName?: string
  fields?: TMappingField[]
}

export const intTypes = new Set([
  'TINYINT',
  'SMALLINT',
  'INT',
  'BIGINT',
  'INTEGER',
  'INT2',
  'INT4',
  'INT8',
  'INT IDENTITY'
])

function setRowExp(rowkeyExpress: string) {
  if (!rowkeyExpress) {
    return rowkeyExpress
  }
  return rowkeyExpress
    .split('_')
    .map((i) => `$(${i})`)
    .join('_')
}

const SyncJob = () => {
  const mutation = useMutationSyncJobConf()
  const { data: scheData } = useQueryJobSchedule()
  const { workFlowStore } = useStore()
  const { data: confData, isFetching, refetch: confRefetch } = useQuerySyncJobConf()

  const { regionId, spaceId } = useParams<{ regionId: string; spaceId: string }>()

  const {
    workFlowStore: { curJob }
  } = useStore()

  useLayoutEffect(() => {
    if (!isFetching) {
      curJobDbConfSubject$.next({
        ...confData,
        sourceType: curJob?.source_type,
        targetType: curJob?.target_type,
        jobType: curJob?.type
      })
    }
  }, [confData, curJob, isFetching])

  const stepsData = useMemo(() => getStepsData(regionId, spaceId), [regionId, spaceId])

  const getInitMode = () => {
    if (confData?.job_mode) {
      return confData.job_mode
    }
    if (curJob?.source_type === SourceType.Oracle || curJob?.target_type === SourceType.Oracle) {
      return 2
    }
    return 1
  }

  const [mode, setMode] = useState<1 | 2>(getInitMode())
  const [showRelaseModal, setShowRelaseModal] = useState(false)

  const [showScheModal, toggleScheModal] = useState(false)
  const [sourceColumns, setSourceColumns] = useState<Record<string, any>[]>([])
  const [targetColumns, setTargetColumns] = useState<Record<string, any>[]>([])
  const [columns, setColumns] = useState([[], []])

  const dbRef = useRef<{
    getResource: () => Record<string, string>
    getTypeNames: () => string[]
    refetchColumns: () => void
    validate: () => boolean
  }>(null)
  const mappingRef = useRef<{
    rowMapping: () => [Record<string, string>, Record<string, string>]
    getOther: () => Record<string, string>
  }>(null)
  const clusterRef = useRef<{
    getCluster: () => Record<string, string>
    checkPingSuccess: () => boolean
  }>(null)
  const channelRef = useRef<{
    getChannel: () => Record<string, string>
  }>(null)
  const enableRelease = get(scheData, 'schedule_policy') !== 0

  const [sourceTypeName, targetTypeName] = useMemo(() => {
    const sourceType = curJob?.source_type
    const targetType = curJob?.target_type
    return [getDataSourceTypes(sourceType, curJob?.type === 3), getDataSourceTypes(targetType)]
  }, [curJob])

  const editorRef = useRef<any>(null)

  const [defaultJobContent, setDefaultJobContent] = useState(get(confData, 'job_content'))

  useLayoutEffect(
    () => () => {
      curJobDbConfSubject$.next(null)
    },
    []
  )

  useEffect(() => {
    if (confData?.job_mode && confData?.job_mode !== mode) {
      setMode(confData?.job_mode)
      setDefaultJobContent(get(confData, 'job_content'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confData])

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current?.setValue(
        defaultJobContent ? JSON.stringify(JSON.parse(defaultJobContent || '{}'), null, 4) : ''
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultJobContent, editorRef.current])
  // console.log(db)

  // console.log('sourceColumn', sourceColumn, 'targetColumn', targetColumn)

  const handleEditorWillMount = (monaco: any) => {
    // editorRef.current = null
    monaco.editor.defineTheme('my-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': theme('colors.neut.18')
      }
    })
  }

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
    // editor.setValue(defaultJobContent?.sync_job_script ||'{}')
    editor.focus()
  }

  const showConfWarn = (content: string) => {
    Notify.warning({
      title: '操作提示',
      content,
      placement: 'bottomRight'
    })
  }

  const save = (isSubmit?: boolean, cb?: Function, isValidateSource?: boolean) => {
    if (
      mode === 1 &&
      isSubmit &&
      (!dbRef.current || !mappingRef.current || !clusterRef.current || !channelRef.current)
    ) {
      return
    }

    const resource = dbRef.current?.getResource() ?? {}
    const mapping = mappingRef.current?.rowMapping() ?? []
    const sourceTypeNames = dbRef.current?.getTypeNames() ?? []
    const cluster = clusterRef.current?.getCluster()
    const channel = channelRef.current?.getChannel() ?? {}
    const syncJobScript = editorRef.current?.getValue() ?? ''
    try {
      if (mode === 2) {
        if (typeof JSON.parse(syncJobScript) !== 'object') {
          showConfWarn('脚本格式不正确')
          return
        }
        set(resource, 'job_content', JSON.stringify(JSON.parse(syncJobScript)))
      }
    } catch (e) {
      showConfWarn('脚本格式不正确')
      return
    }
    try {
      if (mode === 1) {
        set(resource, 'job_content', '')
        if (!resource && isValidateSource) {
          showConfWarn('未配置数据源信息')
          return
        }
        set(
          resource,
          `sync_resource.${sourceTypeNames[0].toLowerCase()}_source.column`,
          mapping?.[0]
        )
        if (curJob?.target_type === SourceType.HBase) {
          const { rowkeyExpress, versionColumnIndex, versionColumnValue } =
            mappingRef.current!.getOther()
          set(
            resource,
            `sync_resource.${sourceTypeNames[1].toLowerCase()}_target.rowkey_express`,
            setRowExp(rowkeyExpress)
          )
          set(
            resource,
            `sync_resource.${sourceTypeNames[1].toLowerCase()}_target.version_column_index`,
            versionColumnIndex
          )
          set(
            resource,
            `sync_resource.${sourceTypeNames[1].toLowerCase()}_target.version_column_value`,
            versionColumnValue
          )
        }
        if (curJob?.target_type !== SourceType.Kafka) {
          set(
            resource,
            `sync_resource.${sourceTypeNames[1].toLowerCase()}_target.column`,
            mapping?.[1]
          )
        } else {
          set(
            resource,
            `sync_resource.${sourceTypeNames[1].toLowerCase()}_target.tableFields`,
            mapping?.[1]
          )
        }

        set(resource, 'channel_control', channel)
      }
    } catch (e) {
      // console.log(e.message)
      // showConfWarn(e.message)
      // return
    }
    const filterResouce = removeUndefined(resource)

    set(filterResouce, 'job_mode', mode)
    set(filterResouce, 'cluster_id', cluster?.id)
    mutation.mutate(filterResouce, {
      onSuccess: () => {
        if (isSubmit) {
          if (!cluster) {
            showConfWarn('未配置计算集群信息')
            return
          }
          if (mode === 1) {
            if (!dbRef.current?.validate()) {
              showConfWarn('未正确配置数据源信息')
              return
            }
            if (!resource) {
              showConfWarn('未配置数据源信息')
              return
            }
            if (!mapping) {
              showConfWarn('未配置字段映射信息')
              return
            }

            // if (isSubmit && !clusterRef.current.checkPingSuccess()) {
            //   showConfWarn('计算集群连通性未测试或者未通过测试')
            //   return
            // }
            if (!channel) {
              showConfWarn('未配置通道控制信息')
              return
            }

            if (parseInt(channel?.rate, 10) === 1 && !channel.bytes) {
              showConfWarn('通道控制未配置同步速率限流字节数')
              return
            }

            const splitKey = get(
              Object.entries(resource.sync_resource ?? ({} as any)).find(([k]) =>
                k.endsWith('_source')
              )?.[1] ?? {},
              'split_pk'
            )
            if (
              splitKey &&
              !sourceColumns?.some(
                (f) => f.name === splitKey && intTypes.has(f.type) && f.is_primary_key
              )
            ) {
              showConfWarn('切分键必须为主键且为整型')
              return
            }

            // 如果并发数大于1  则切分键不能为空
            const parallelism = get(resource, 'channel_control.parallelism', 0)
            if (parallelism > 1 && !splitKey) {
              showConfWarn('并发数大于1时，切分键不能为空')
              return
            }
          }
        }
        if (cb) {
          cb()
        } else {
          confRefetch()
          Notify.success({
            title: '操作提示',
            content: '配置保存成功',
            placement: 'bottomRight'
          })
        }
      }
    })
  }

  useLayoutEffect(() => {
    const sourceColumnsSub = sourceColumns$.subscribe((e) => {
      setSourceColumns(e)
    })
    const targetColumnsSub = targetColumns$.subscribe((e) => {
      setTargetColumns(e)
    })
    const confSub = confColumns$.subscribe((e) => {
      setColumns(e)
    })
    return () => {
      sourceColumnsSub.unsubscribe()
      targetColumnsSub.unsubscribe()
      confSub.unsubscribe()
    }
  }, [])

  const release = () => {
    if (!enableRelease) {
      toggleScheModal(true)
      // workFlowStore.set({showScheSetting: true})
    } else {
      setShowRelaseModal(true)
    }
  }

  const [{ sourceId, targetId }, setSourceId] = useImmer({
    sourceId: confData?.source_id,
    targetId: confData?.target_id
  })

  useLayoutEffect(() => {
    const sub = source$
      .pipe(
        pairwise(),
        filter(([e1, e2]) => e1?.data?.id !== e2?.data?.id),
        map(([, e]) => e?.data?.id)
      )
      .subscribe((e) =>
        setSourceId((draft) => {
          draft.sourceId = e
        })
      )
    const sub1 = target$
      .pipe(
        pairwise(),
        filter(([e1, e2]) => e1?.data?.id !== e2?.data?.id),
        map(([, e]) => e?.data?.id)
      )
      .subscribe((e) =>
        setSourceId((draft) => {
          draft.targetId = e
        })
      )
    return () => {
      sub.unsubscribe()
      sub1.unsubscribe()
    }
  }, [setSourceId])

  const renderGuideMode = () => (
    <CollapseWrapper>
      <Collapse defaultActiveKey={stepsData.map((step) => step.key)}>
        {stepsData.map(({ key, title, desc }, index) => (
          <CollapseItem
            key={key}
            label={
              <>
                <div css={styles.stepTag}>
                  <span css={styles.stepNum}>{index + 1}</span>
                  <span css={styles.stepText}>{title}</span>
                </div>
                <div tw="text-neut-13">{desc}</div>
              </>
            }
          >
            {index === 0 && <DatasourceConfig ref={dbRef} curJob={curJob!} />}

            {index === 1 && (
              <FieldMappings
                onReInit={() => {
                  if (dbRef.current && dbRef.current?.refetchColumns) {
                    dbRef.current?.refetchColumns()
                  }
                }}
                ref={mappingRef}
                // mappings={[]}
                leftFields={sourceColumns as any}
                rightFields={targetColumns as any}
                sourceId={sourceId}
                targetId={targetId}
                leftTypeName={sourceTypeName}
                rightTypeName={targetTypeName}
                jobType={curJob?.type}
                columns={columns}
                topHelp={
                  <HelpCenterLink
                    href="/manual/integration_job/create_job_offline_1/#配置字段映射"
                    isIframe={false}
                  >
                    字段映射说明文档
                  </HelpCenterLink>
                }
              />
            )}
            {index === 2 && (
              <SyncCluster
                flinkType={2}
                ref={clusterRef}
                clusterId={get(confData, 'cluster_id')}
                defaultClusterName={get(confData, 'cluster_info.name')}
              />
            )}
            {index === 3 && (
              <SyncChannel ref={channelRef} channelControl={get(confData, 'channel_control')} />
            )}
          </CollapseItem>
        ))}
      </Collapse>
    </CollapseWrapper>
  )

  const renderScriptMode = () => {
    const step = stepsData[2]
    return (
      <div tw="h-full">
        <Center>
          <Center css={styles.arrowBox}>
            <Label>来源: {sourceTypeName}</Label>
            <ArrowLine />
            <Label>{curJob && getJobTypeName(curJob.type)}</Label>
            <ArrowLine />
            <Label>目的: {targetTypeName}</Label>
          </Center>
        </Center>
        <div tw="pt-2 flex-1 pb-2 h-[calc(100% - 156px)] overflow-y-auto ">
          <Editor
            language="json"
            defaultValue={JSON.stringify(JSON.parse(defaultJobContent || '{}'), null, 4)}
            theme="my-theme"
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true
              // readOnly: false,
            }}
            editorWillMount={handleEditorWillMount}
            editorDidMount={handleEditorDidMount}
            // onChange={handleEditorChange}
          />
        </div>
        <CollapseWrapper tw="flex-none absolute bottom-0 left-0 w-full">
          <Collapse defaultActiveKey={['p2']}>
            <CollapseItem
              key={step.key}
              label={
                <>
                  <div css={styles.stepTag}>
                    <span css={styles.stepText}>{step.title}</span>
                  </div>
                  <div tw="text-neut-13">{step.desc}</div>
                </>
              }
            >
              <SyncCluster ref={clusterRef} clusterId={get(confData, 'cluster_id')} />
            </CollapseItem>
          </Collapse>
        </CollapseWrapper>
      </div>
    )
  }
  const mutationConvert = useMutationSyncJobConvert()

  // eslint-disable-next-line
  const handleConvert = () => {
    if (!dbRef.current || !mappingRef.current || !clusterRef.current || !channelRef.current) {
      return
    }

    const resource = dbRef.current.getResource()
    const mapping = mappingRef.current!.rowMapping()
    const sourceTypeNames = dbRef.current!.getTypeNames()
    const cluster = clusterRef.current?.getCluster()
    const channel = channelRef.current!.getChannel()

    try {
      set(resource, `sync_resource.${sourceTypeNames[0].toLowerCase()}_source.column`, mapping?.[0])

      const targetKey = sourceTypeNames[1].toLowerCase()
      if (curJob?.target_type === SourceType.HBase) {
        const { rowkeyExpress, versionColumnIndex, versionColumnValue } =
          mappingRef.current!.getOther()

        set(resource, `sync_resource.${targetKey}_target.rowkey_express`, setRowExp(rowkeyExpress))
        set(resource, `sync_resource.${targetKey}_target.version_column_index`, versionColumnIndex)
        set(resource, `sync_resource.${targetKey}_target.version_column_value`, versionColumnValue)
      }
      if (curJob?.target_type !== SourceType.Kafka) {
        set(resource, `sync_resource.${targetKey}_target.column`, mapping?.[1])
      } else {
        set(resource, `sync_resource.${targetKey}_target.tableFields`, mapping?.[1])
      }

      set(resource, 'cluster_id', cluster?.id)

      set(resource, 'channel_control', channel)
    } catch (e) {
      // showConfWarn(e.message)
      // return
      console.error(e)
    }

    set(resource, 'job_mode', 1)
    set(resource, 'job_content', '')
    const filterResouce = removeUndefined(resource)
    mutationConvert.mutate({ data: { conf: filterResouce }, uri: { job_id: curJob?.id! } } as any, {
      onSuccess: (resp) => {
        setDefaultJobContent(resp.job)
        setMode(2)
      }
    })
  }

  return (
    <div tw="flex flex-col flex-1 relative">
      <JobToolBar>
        {mode === 1 ? (
          <PopConfirm
            type="warning"
            content={
              <>
                <div tw="text-base font-medium">确认转变为脚本模式？</div>
                <div tw="text-neut-8 mt-2">
                  一旦数据集成过程由向导转变为脚本模式，不可逆转，且来源、目的数据源需要和向导模式保持一致，确认转变为脚本模式么？
                </div>
              </>
            }
            okText="转变"
            onOk={handleConvert}
            // onOk={() => {
            //   save(false, () => setMode(2), false)
            // }}
          >
            <Button type="black">
              <Icon name="coding" type="light" />
              脚本模式
            </Button>
          </PopConfirm>
        ) : (
          <Button
            onClick={() => {
              const syncJobScript = editorRef.current?.getValue() ?? ''
              try {
                if (typeof JSON.parse(syncJobScript) !== 'object') {
                  showConfWarn('脚本格式不正确')
                }
              } catch (e) {
                showConfWarn('脚本格式不正确')
              }
              // TODO: 调接口
            }}
          >
            语法检查
          </Button>
        )}
        <Button onClick={() => save()} loading={mutation.isLoading}>
          <Icon name="data" type="dark" />
          保存
        </Button>
        {/* loading={releaseMutation.isLoading} disabled={!enableRelease} */}
        <Button
          type="primary"
          onClick={() => save(true, release)}
          // disabled={!enableRelease}
          // disabled={get(confData, 'source_id') === '' && enableRelease}
        >
          <Icon name="export" />
          发布
        </Button>
        {/* <Button */}
        {/*   onClick={() => { */}
        {/*     dbRef.current?.validate() */}
        {/*   }} */}
        {/* > */}
        {/*   validate */}
        {/* </Button> */}
        {/* <Button */}
        {/*   onClick={() => { */}
        {/*     console.log(dbRef.current?.getResource()) */}
        {/*   }} */}
        {/* > */}
        {/*   getValue */}
        {/* </Button> */}
        {!!confData?.updated && (
          <span tw="flex-auto text-right text-font">
            最后更新时间：{timeFormat(confData.updated * 1000)}
          </span>
        )}
      </JobToolBar>
      <div tw="flex-1 overflow-hidden">
        <SimpleBar
          tw="h-full"
          css={
            mode !== 1 &&
            css`
              .simplebar-content {
                ${tw`h-full`}
              }
            `
          }
        >
          {mode === 1 ? renderGuideMode() : renderScriptMode()}
        </SimpleBar>
      </div>
      {showRelaseModal && (
        <ReleaseModal
          // onOk={() => {}}
          onSuccess={() => {
            setShowRelaseModal(false)
            workFlowStore.set({
              showNotify: true
            })
          }}
          onCancel={() => setShowRelaseModal(false)}
        />
      )}
      {showScheModal && (
        <Modal
          visible
          noBorder
          width={400}
          onCancel={() => toggleScheModal(false)}
          okText="调度配置"
          onOk={() => {
            workFlowStore.set({
              showScheSetting: true
            })
            // setShowScheSettingModal(true)
            toggleScheModal(false)
          }}
        >
          <div tw="flex">
            <Icon name="exclamation" color={{ secondary: '#F5C414' }} size={20} />
            <div tw="ml-3">
              <div tw="text-base">尚未配置调度任务</div>
              <div tw="mt-2 text-neut-8">发布调度任务前，请先完成调度配置，否则无法发布</div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default SyncJob
