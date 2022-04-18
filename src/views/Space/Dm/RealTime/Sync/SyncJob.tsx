import { Collapse } from '@QCFE/lego-ui'
import { Button, Icon, Notification as Notify } from '@QCFE/qingcloud-portal-ui'
import { HelpCenterLink, FieldMappings, PopConfirm } from 'components'
import tw, { css, styled, theme } from 'twin.macro'
import { useImmer } from 'use-immer'
import { nanoid } from 'nanoid'
import { TMappingField } from 'components/FieldMappings/MappingItem'
import { useRef, useState } from 'react'
import Editor from 'react-monaco-editor'
import { get, isArray, isObject, isUndefined, set } from 'lodash-es'
import { useMutationSyncJobConf, useQueryJobSchedule, useStore } from 'hooks'
import { JobToolBar } from '../styled'
import SyncDataSource from './SyncDataSource'
import SyncCluster from './SyncCluster'
import SyncChannel from './SyncChannel'
import ReleaseModal from '../modal/ReleaseModal'

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
          href="/xxx"
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
    desc: <>数据来源、目的、计算集群不在同一 VPC？请前往</>,
  },
  {
    key: 'p3',
    title: '通道控制',
    desc: <>您可以配置作业的传输速率和错误记录来控制整个数据同步过程</>,
  },
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

const SyncJob = () => {
  const mutation = useMutationSyncJobConf()
  const { data: scheData } = useQueryJobSchedule()
  const { workFlowStore } = useStore()
  const [fields, setFields] = useImmer<{
    source: TMappingField[]
    target: TMappingField[]
  }>({
    source: [],
    target: [],
  })
  const [mode, setMode] = useState<1 | 2>(1)
  const [showRelaseModal, setShowRelaseModal] = useState(false)
  const dbRef =
    useRef<{
      getResource: () => Record<string, string>
      getTypeNames: () => string[]
    }>(null)
  const mappingRef =
    useRef<{
      rowMapping: () => [Record<string, string>, Record<string, string>]
    }>(null)
  const clusterRef = useRef<{ getCluster: () => Record<string, string> }>(null)
  const channelRef = useRef<{ getChannel: () => Record<string, string> }>(null)
  // console.log('fields', fields)
  const enableRelease = get(scheData, 'schedule_policy') !== 0

  const handleEditorWillMount = (monaco: any) => {
    monaco.editor.defineTheme('my-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': theme('colors.neut.18'),
      },
    })
  }

  const handleEditorDidMount = (editor) => {
    editor.focus()
  }

  const showConfWarn = (content: string) => {
    Notify.warning({
      title: '操作提示',
      content,
      placement: 'bottomRight',
    })
  }

  const save = () => {
    if (
      !dbRef.current ||
      !mappingRef.current ||
      !clusterRef.current ||
      !channelRef.current
    ) {
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
    const channel = channelRef.current.getChannel()
    if (!channel) {
      showConfWarn('未配置通道控制信息')
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
    set(resource, 'cluster_id', cluster.id)
    set(resource, 'job_mode', 0)
    set(resource, 'channel_control', channel)
    const filterResouce = removeUndefined(resource)
    // console.log('filterResouce', filterResouce)
    mutation.mutate(filterResouce, {
      onSuccess: () => {
        Notify.success({
          title: '操作提示',
          content: '配置保存成功',
          placement: 'bottomRight',
        })
      },
    })
  }
  const release = () => {
    if (!enableRelease) {
      workFlowStore.set({ showScheSetting: true })
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
              {index === 0 && (
                <SyncDataSource
                  ref={dbRef}
                  onSelectTable={(
                    tp: 'source' | 'target',
                    data: Record<string, any>[]
                  ) => {
                    const fieldData = (data || []).map((field) => ({
                      ...field,
                      uuid: nanoid(),
                    })) as TMappingField[]
                    setFields((draft) => {
                      if (tp === 'source') {
                        draft.source = fieldData
                      } else {
                        draft.target = fieldData
                      }
                    })
                  }}
                />
              )}
              {index === 1 && (
                <FieldMappings
                  ref={mappingRef}
                  leftFields={fields.source}
                  rightFields={fields.target}
                  topHelp={
                    <HelpCenterLink href="/xxx" isIframe={false}>
                      字段映射说明文档
                    </HelpCenterLink>
                  }
                />
              )}
              {index === 2 && <SyncCluster ref={clusterRef} />}
              {index === 3 && <SyncChannel ref={channelRef} />}
            </CollapseItem>
          ))}
        </Collapse>
      </CollapseWrapper>
    )
  }

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
              automaticLayout: true,
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
            <Button type="black" disabled>
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
        {/* loading={releaseMutation.isLoading} */}
        <Button type="primary" onClick={release} disabled={!enableRelease}>
          <Icon name="export" />
          发布
        </Button>
      </JobToolBar>
      {mode === 1 ? renderGuideMode() : renderScriptMode()}
      {showRelaseModal && (
        <ReleaseModal
          // onSuccess={handleReleaseSuccess}
          onCancel={() => setShowRelaseModal(false)}
        />
      )}
    </div>
  )
}

export default SyncJob
