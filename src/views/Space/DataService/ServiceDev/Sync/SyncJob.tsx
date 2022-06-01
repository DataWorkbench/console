import { Collapse } from '@QCFE/lego-ui'
import { Button, Icon, Notification as Notify } from '@QCFE/qingcloud-portal-ui'
import { HelpCenterLink, FieldMappings, PopConfirm } from 'components'
import tw, { css, styled, theme } from 'twin.macro'
import { useImmer } from 'use-immer'
import { nanoid } from 'nanoid'
import { TMappingField } from 'components/FieldMappings/MappingItem'
import { useEffect, useMemo, useRef, useState } from 'react'
import Editor from 'react-monaco-editor'
import { findKey, get, isArray, isObject, isUndefined, set } from 'lodash-es'
import { useMutationSyncJobConf, useQueryJobSchedule, useQuerySyncJobConf, useStore } from 'hooks'
import SimpleBar from 'simplebar-react'
import { JobToolBar } from '../styled'
import SyncDataSource from './SyncDataSource'
import SyncCluster from './SyncCluster'
import SyncChannel from './SyncChannel'
import ReleaseModal from '../Modal/ReleaseModal'
import { dataSourceTypes } from '../Job/JobUtils'

const { CollapseItem } = Collapse
const CollapseWrapper = styled('div')(() => [
  tw`flex-1 px-2 py-2 bg-neut-18`,
  css`
    li.collapse-item {
      ${tw`mt-2 rounded-[3px] overflow-hidden`}
      .collapse-item-label {
        ${tw`h-11 border-none hover:bg-neut-16`}
      }
      .collapse-item-content {
        ${tw`bg-neut-17`}
      }
    }
    li:last-child {
      ${tw`mb-1`}
    }
  `
])

const styles = {
  stepTag: tw`flex items-center text-left border border-green-11 rounded-r-2xl pr-4 mr-3 h-7 leading-5`,
  stepNum: tw`inline-block text-white bg-green-11 w-5 h-5 text-center rounded-full -ml-2.5`,
  stepText: tw`ml-2 inline-block border-green-11 text-green-11`
}

const stepsData = [
  {
    key: 'p0',
    title: '选择数据源',
    desc: (
      <>
        在这里配置数据的来源端和目的端；仅支持在
        <HelpCenterLink hasIcon isIframe={false} href="/xxx" onClick={(e) => e.stopPropagation()}>
          数据源管理
        </HelpCenterLink>
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
    desc: <>您可以配置作业的传输速率和错误记录来控制整个数据同步过程</>
  }
]

const removeUndefined = (obj: any) => {
  const newObj: any = isArray(obj) ? [] : {}
  Object.entries(obj).forEach(([key, value]) => {
    if (isObject(value)) {
      newObj[key] = removeUndefined(value)
    } else if (!isUndefined(value)) {
      newObj[key] = value
    }
  })
  return newObj
}

interface DbInfo {
  id?: string
  tableName?: string
  fields?: TMappingField[]
}

const SyncJob = () => {
  const mutation = useMutationSyncJobConf()
  const { data: scheData } = useQueryJobSchedule()
  const { dtsDevStore } = useStore()
  const { data: confData, refetch: confRefetch } = useQuerySyncJobConf()

  const {
    dtsDevStore: { curJob }
  } = useStore()

  const [db, setDb] = useImmer<{
    source: DbInfo
    target: DbInfo
  }>({
    source: { id: get(confData, 'source_id') },
    target: { id: get(confData, 'target_id') }
  })

  const [mode, setMode] = useState<1 | 2>(1)
  const [showRelaseModal, setShowRelaseModal] = useState(false)
  // const [mappings, setMappings] = useState([])

  const dbRef =
    useRef<{
      getResource: () => Record<string, string>
      getTypeNames: () => string[]
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

  const [sourceTypeName, targetTypeName] = useMemo(() => {
    const sourceType = curJob?.source_type
    const targetType = curJob?.target_type
    return [
      findKey(dataSourceTypes, (v) => v === sourceType),
      findKey(dataSourceTypes, (v) => v === targetType)
    ]
  }, [curJob])

  const sourceColumn = useMemo(() => {
    if (confData && db.source.tableName && sourceTypeName) {
      const source = get(confData, `sync_resource.${sourceTypeName?.toLowerCase()}_source`)
      const table = get(source, 'table[0]')
      if (source && table === db.source.tableName) {
        return get(source, 'column')
      }
    }
    return []
  }, [confData, sourceTypeName, db.source.tableName])

  const targetColumn = useMemo(() => {
    if (confData && db.target.tableName && targetTypeName) {
      const source = get(confData, `sync_resource.${targetTypeName?.toLowerCase()}_target`)
      const table = get(source, 'table[0]')
      if (source && table === db.target.tableName) {
        return get(source, 'column')
      }
    }
    return []
  }, [confData, targetTypeName, db.target.tableName])

  // console.log(db)

  // console.log('sourceColumn', sourceColumn, 'targetColumn', targetColumn)
  useEffect(() => {
    setDb((draft) => {
      draft.source.id = get(confData, 'source_id')
      draft.target.id = get(confData, 'target_id')
    })
  }, [confData, setDb])
  // useEffect(() => {
  //   if (confData && sourceTypeName && targetTypeName) {
  //     // const sourceColumn =
  //     //   get(
  //     //     confData,
  //     //     `sync_resource.${sourceTypeName.toLowerCase()}_source.column`
  //     //   ) || []
  //     // const targetColumn =
  //     //   get(
  //     //     confData,
  //     //     `sync_resource.${targetTypeName.toLowerCase()}_target.column`
  //     //   ) || []
  //     // setMappings(sourceColumn.map((v, i) => [v.name, targetColumn[i].name]))
  //     setDb({
  //       source: {
  //         id: get(confData, 'source_id'),
  //         tableName: get(
  //           confData,
  //           `sync_resource.${sourceTypeName.toLowerCase()}_source.table[0]`
  //         ),
  //       },
  //       target: {
  //         id: get(confData, 'target_id'),
  //         tableName: get(
  //           confData,
  //           `sync_resource.${targetTypeName.toLowerCase()}_target.table[0]`
  //         ),
  //       },
  //     })
  //   }
  // }, [confData, sourceTypeName, targetTypeName, setDb])

  // console.log(db, fields)
  const handleEditorWillMount = (monaco: any) => {
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
    editor.focus()
  }

  const showConfWarn = (content: string) => {
    Notify.warning({
      title: '操作提示',
      content,
      placement: 'bottomRight'
    })
  }

  const save = () => {
    if (!dbRef.current || !mappingRef.current || !clusterRef.current || !channelRef.current) {
      return
    }

    const resource = dbRef.current.getResource()
    if (!resource) {
      showConfWarn('未配置数据源信息')
      return
    }

    const sourceTypeNames = dbRef.current.getTypeNames()

    const mapping = mappingRef.current.rowMapping()
    if (!mapping) {
      showConfWarn('未配置字段映射信息')
      return
    }

    const cluster = clusterRef.current.getCluster()
    if (!cluster) {
      showConfWarn('未配置计算集群信息')
      return
    }
    if (!clusterRef.current.checkPingSuccess()) {
      showConfWarn('计算集群连通性未测试或者未通过测试')
      return
    }
    const channel = channelRef.current.getChannel()
    if (!channel) {
      showConfWarn('未配置通道控制信息')
      return
    }

    set(resource, `sync_resource.${sourceTypeNames[0].toLowerCase()}_source.column`, mapping[0])
    set(resource, `sync_resource.${sourceTypeNames[1].toLowerCase()}_target.column`, mapping[1])
    set(resource, 'cluster_id', cluster.id)
    set(resource, 'job_mode', 1)
    set(resource, 'job_content', '')
    set(resource, 'channel_control', channel)
    const filterResouce = removeUndefined(resource)
    // console.log('filterResouce', filterResouce)
    mutation.mutate(filterResouce, {
      onSuccess: () => {
        confRefetch()
        Notify.success({
          title: '操作提示',
          content: '配置保存成功',
          placement: 'bottomRight'
        })
      }
    })
  }
  const release = () => {
    if (!enableRelease) {
      dtsDevStore.set({ showScheSetting: true })
    } else {
      setShowRelaseModal(true)
    }
  }

  const columns = useMemo<[any, any]>(
    () => [sourceColumn, targetColumn],
    [sourceColumn, targetColumn]
  )

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
            {index === 0 && (
              <SyncDataSource
                ref={dbRef}
                onSelectTable={(tp, tableName, data) => {
                  const fieldData = data.map((field) => ({
                    ...field,
                    uuid: nanoid()
                  })) as TMappingField[]
                  setDb((draft) => {
                    const soruceInfo = draft[tp]
                    soruceInfo.tableName = tableName
                    soruceInfo.fields = fieldData
                  })
                }}
                onDbChange={(tp: 'source' | 'target', data) => {
                  setDb((draft) => {
                    draft[tp] = data
                  })
                }}
                conf={confData}
              />
            )}
            {index === 1 && (
              <FieldMappings
                ref={mappingRef}
                // mappings={mappings}
                leftFields={db.source.fields || []}
                rightFields={db.target.fields || []}
                leftTypeName={sourceTypeName}
                // rightTypeName={targetTypeName}
                columns={columns}
                topHelp={
                  <HelpCenterLink href="/xxx" isIframe={false}>
                    字段映射说明文档
                  </HelpCenterLink>
                }
              />
            )}
            {index === 2 && (
              <SyncCluster
                sourceId={db.source?.id}
                targetId={db.target?.id}
                ref={clusterRef}
                clusterId={get(confData, 'cluster_id')}
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
      <>
        <div tw="pt-2 flex-1 pb-[68px] h-[calc(100%-64px)] overflow-y-auto">
          <Editor
            language="json"
            defaultValue=""
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
          <Collapse>
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
              <SyncCluster />
            </CollapseItem>
          </Collapse>
        </CollapseWrapper>
      </>
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
            onOk={() => {
              setMode(2)
            }}
          >
            <Button type="black">
              <Icon name="coding" type="light" />
              脚本模式
            </Button>
          </PopConfirm>
        ) : (
          <Button>
            <Icon name="remark" type="dark" />
            语法检查
          </Button>
        )}
        <Button onClick={save} loading={mutation.isLoading}>
          <Icon name="data" type="dark" />
          保存
        </Button>
        {/* loading={releaseMutation.isLoading} disabled={!enableRelease} */}
        <Button
          type="primary"
          onClick={release}
          disabled={!enableRelease}
          // disabled={get(confData, 'source_id') === '' && enableRelease}
        >
          <Icon name="export" />
          发布
        </Button>
      </JobToolBar>
      <div tw="flex-1 overflow-hidden">
        <SimpleBar tw="h-full">{mode === 1 ? renderGuideMode() : renderScriptMode()}</SimpleBar>
      </div>
      {showRelaseModal && (
        <ReleaseModal
          onSuccess={() => {
            setShowRelaseModal(false)
            dtsDevStore.set({
              showNotify: true
            })
          }}
          onCancel={() => setShowRelaseModal(false)}
        />
      )}
    </div>
  )
}

export default SyncJob
