import { Collapse } from '@QCFE/lego-ui'
import { Button, Icon, Notification as Notify } from '@QCFE/qingcloud-portal-ui'
import { FieldMappings, HelpCenterLink, Modal, PopConfirm } from 'components'
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
  useStore,
} from 'hooks'
import SimpleBar from 'simplebar-react'
import { timeFormat } from 'utils/convert'
import { curJobDbConfSubject$ } from 'views/Space/Dm/RealTime/Sync/common/subjects'
import DatasourceConfig from 'views/Space/Dm/RealTime/Sync/DatasourceConfig'
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
  `,
])

const styles = {
  stepTag: tw`flex items-center text-left border border-green-11 rounded-r-2xl pr-4 mr-3 h-7 leading-5`,
  stepNum: tw`inline-block text-white bg-green-11 w-5 h-5 text-center rounded-full -ml-2.5`,
  stepText: tw`ml-2 inline-block border-green-11 text-green-11`,
}

const stepsData = [
  {
    key: 'p0',
    title: '选择数据源',
    desc: (
      <>
        在这里配置数据的来源端和目的端；仅支持在
        <HelpCenterLink
          hasIcon
          isIframe={false}
          href="/manual/source_data/add_data/"
          onClick={(e) => e.stopPropagation()}
        >
          数据源管理
        </HelpCenterLink>
        创建的数据源。
      </>
    ),
  },
  {
    key: 'p1',
    title: '字段映射',
    desc: null,
  },
  {
    key: 'p2',
    title: '计算集群',
    desc: null,
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
    ),
  },
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
  'INT IDENTITY',
])

const SyncJob = () => {
  const mutation = useMutationSyncJobConf()
  const { data: scheData } = useQueryJobSchedule()
  const { workFlowStore } = useStore()
  const {
    data: confData,
    isFetching,
    refetch: confRefetch,
  } = useQuerySyncJobConf()

  const {
    workFlowStore: { curJob },
  } = useStore()

  useLayoutEffect(() => {
    if (!isFetching) {
      curJobDbConfSubject$.next({
        ...confData,
        sourceType: curJob?.source_type,
        targetType: curJob?.target_type,
      })
    }
  }, [confData, curJob, isFetching])

  const [mode, setMode] = useState<1 | 2>(get(confData, 'job_mode', 1) || 1)
  const [showRelaseModal, setShowRelaseModal] = useState(false)

  const dbRef =
    useRef<{
      getResource: () => Record<string, string>
      getTypeNames: () => string[]
      refetchColumns: () => void
      validate: () => boolean
    }>(null)
  const mappingRef =
    useRef<{
      rowMapping: () => [Record<string, string>, Record<string, string>]
    }>(null)
  const clusterRef =
    useRef<{
      getCluster: () => Record<string, string>
      checkPingSuccess: () => boolean
    }>(null)
  const channelRef =
    useRef<{
      getChannel: () => Record<string, string>
    }>(null)
  const enableRelease = get(scheData, 'schedule_policy') !== 0

  const [sourceTypeName] = useMemo(() => {
    const sourceType = curJob?.source_type
    const targetType = curJob?.target_type
    return [getDataSourceTypes(sourceType), getDataSourceTypes(targetType)]
  }, [curJob])

  const editorRef = useRef<any>(null)

  const [defaultJobContent, setDefaultJobContent] = useState(
    get(confData, 'job_content')
  )

  useLayoutEffect(() => {
    return () => {
      curJobDbConfSubject$.next(null)
    }
  }, [])

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
        JSON.stringify(JSON.parse(defaultJobContent || '{}'), null, 4)
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
        'editor.background': theme('colors.neut.18'),
      },
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
      placement: 'bottomRight',
    })
  }

  const save = (
    isSubmit?: boolean,
    cb?: Function,
    isValidateSource?: boolean
  ) => {
    if (
      mode === 1 &&
      isSubmit &&
      (!dbRef.current ||
        !mappingRef.current ||
        !clusterRef.current ||
        !channelRef.current)
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
          mapping[0]
        )
        set(
          resource,
          `sync_resource.${sourceTypeNames[1].toLowerCase()}_target.column`,
          mapping[1]
        )

        set(resource, 'channel_control', channel)
      }
    } catch (e) {
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
              Object.entries(resource.sync_resource ?? ({} as any)).find(
                ([k]) => k.endsWith('_source')
              )?.[1] ?? {},
              'split_pk'
            )
            // TODO
            // if (
            //   splitKey &&
            //   !db?.source?.fields?.some(
            //     (f) =>
            //       f.name === splitKey &&
            //       intTypes.has(f.type) &&
            //       f.is_primary_key
            //   )
            // ) {
            //   showConfWarn('切分键必须为主键且为整型')
            //   return
            // }

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
            placement: 'bottomRight',
          })
        }
      },
    })
  }

  const [showScheModal, toggleScheModal] = useState(false)

  const release = () => {
    if (!enableRelease) {
      toggleScheModal(true)
      // workFlowStore.set({showScheSetting: true})
    } else {
      setShowRelaseModal(true)
    }
  }

  const renderGuideMode = () => {
    return (
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
              {index === 0 && <DatasourceConfig ref={dbRef} curJob={curJob} />}
              {index === 1 && (
                <FieldMappings
                  // key={
                  // NOTE: 无法解决拖拽 bug, 只能这样了
                  // `${db?.source?.tableName}_${db?.target?.tableName}`
                  // }
                  onReInit={() => {
                    if (dbRef.current && dbRef.current?.refetchColumns) {
                      dbRef.current?.refetchColumns()
                    }
                  }}
                  ref={mappingRef}
                  mappings={[]}
                  leftFields={[]}
                  rightFields={[]}
                  leftTypeName={sourceTypeName}
                  // rightTypeName={targetTypeName}
                  // columns={columns}
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
                  ref={clusterRef}
                  clusterId={get(confData, 'cluster_id')}
                  defaultClusterName={get(confData, 'cluster_info.name')}
                />
              )}
              {index === 3 && (
                <SyncChannel
                  ref={channelRef}
                  channelControl={get(confData, 'channel_control')}
                />
              )}
            </CollapseItem>
          ))}
        </Collapse>
      </CollapseWrapper>
    )
  }

  const renderScriptMode = () => {
    const step = stepsData[2]
    return (
      <div tw="h-full">
        <div tw="pt-2 flex-1 pb-2 h-[calc(100% - 156px)] overflow-y-auto ">
          <Editor
            language="json"
            defaultValue={JSON.stringify(
              JSON.parse(defaultJobContent || '{}'),
              null,
              4
            )}
            theme="my-theme"
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
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
              <SyncCluster
                ref={clusterRef}
                clusterId={get(confData, 'cluster_id')}
              />
            </CollapseItem>
          </Collapse>
        </CollapseWrapper>
      </div>
    )
  }
  const mutationConvert = useMutationSyncJobConvert()
  const handleConvert = () => {
    if (
      !dbRef.current ||
      !mappingRef.current ||
      !clusterRef.current ||
      !channelRef.current
    ) {
      return
    }

    const resource = dbRef.current.getResource()
    const mapping = mappingRef.current!.rowMapping()
    const sourceTypeNames = dbRef.current!.getTypeNames()
    const cluster = clusterRef.current?.getCluster()
    const channel = channelRef.current!.getChannel()

    try {
      set(
        resource,
        `sync_resource.${sourceTypeNames[0].toLowerCase()}_source.column`,
        mapping?.[0]
      )
      set(
        resource,
        `sync_resource.${sourceTypeNames[1].toLowerCase()}_target.column`,
        mapping?.[1]
      )

      set(resource, 'cluster_id', cluster?.id)
      set(resource, 'job_mode', 1)
      set(resource, 'job_content', '')
      set(resource, 'channel_control', channel)
    } catch (e) {
      // showConfWarn(e.message)
      // return
    }
    const filterResouce = removeUndefined(resource)
    mutationConvert.mutate(
      { data: { conf: filterResouce }, uri: { job_id: curJob?.id! } },
      {
        onSuccess: (resp) => {
          setDefaultJobContent(resp.job)
          setMode(2)
        },
      }
    )
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
        ) : null}
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
              showNotify: true,
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
              showScheSetting: true,
            })
            // setShowScheSettingModal(true)
            toggleScheModal(false)
          }}
        >
          <div tw="flex">
            <Icon
              name="exclamation"
              color={{ secondary: '#F5C414' }}
              size={20}
            />
            <div tw="ml-3">
              <div tw="text-base">尚未配置调度任务</div>
              <div tw="mt-2 text-neut-8">
                发布调度任务前，请先完成调度配置，否则无法发布
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default SyncJob
