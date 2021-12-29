import { useState, useRef, useMemo, useEffect } from 'react'
import { FlexBox, Modal } from 'components'
import { Icon, Notification as Notify, Button } from '@QCFE/qingcloud-portal-ui'
import { get, trim, isUndefined } from 'lodash-es'
import { theme } from 'twin.macro'
import { useUnmount } from 'react-use'
import Editor from 'react-monaco-editor'
import { useQueryClient } from 'react-query'
import {
  useMutationStreamJobCode,
  useMutationReleaseStreamJob,
  useQueryStreamJobSchedule,
  useQueryStreamJobCode,
  useMutationStreamJobCodeSyntax,
  // getStreamJobCodeKey,
  getFlowKey,
  useStore,
} from 'hooks'
import * as flinksqlMod from 'utils/languages/flinksql'
import * as pythonMod from 'utils/languages/python'
import * as scalaMod from 'utils/languages/scala'
import { StreamToolBar } from './styled'
import StreamRightMenu from './StreamRightMenu'
import ReleaseModal from './ReleaseModal'

const CODETYPE = {
  2: 'sql',
  4: 'python',
  5: 'scala',
}

interface IProp {
  /** 2: SQL 4: Python 5: Scala */
  tp: 2 | 4 | 5
}

const StreamCode = ({ tp }: IProp) => {
  const { workFlowStore } = useStore()
  const [show, toggleShow] = useState(false)
  const [enableRelease, setEnableRelease] = useState(false)
  const [showScheModal, toggleScheModal] = useState(false)
  const [showScheSettingModal, setShowScheSettingModal] = useState(false)
  const editorRef = useRef(null)
  const mutation = useMutationStreamJobCode()
  const syntaxMutation = useMutationStreamJobCodeSyntax()
  const releaseMutation = useMutationReleaseStreamJob()
  const { data, isLoading } = useQueryStreamJobCode()
  const { data: scheData } = useQueryStreamJobSchedule()
  const codeName = CODETYPE[tp]
  const codeStr = get(data, `${codeName}.code`)
  const loadingWord = '代码加载中......'
  const queryClient = useQueryClient()
  const defaultCode = useMemo(() => {
    let v = ''
    if (codeName === 'sql') {
      v = `-drop table if exists pd;
create table pd
(id bigint primary key NOT ENFORCED,id1 bigint) WITH (
'connector' = 'jdbc',
'url' = 'jdbc:mysql://127.0.0.1:3306/data_workbench',
'table-name' = 'pd',
'username' = 'root',
'password' = '123456'
);`
    } else if (codeName === 'python') {
      v = `import os

from pyflink.datastream import StreamExecutionEnvironment
from pyflink.table import StreamTableEnvironment, EnvironmentSettings
from enjoyment.cdn.cdn_udf import ip_to_province
from enjoyment.cdn.cdn_connector_ddl import kafka_source_ddl, mysql_sink_ddl

# 创建Table Environment， 并选择使用的Planner
env = StreamExecutionEnvironment.get_execution_environment()
t_env = StreamTableEnvironment.create(
    env,
    environment_settings=EnvironmentSettings.new_instance().use_blink_planner().build())

# 创建Kafka数据源表
t_env.sql_update(kafka_source_ddl)
# 创建MySql结果表
t_env.sql_update(mysql_sink_ddl)`
    } else if (codeName === 'scala') {
      v = `object HelloWorld {
def main(args: Array[String]): Unit = {
    println("Hello, world!")
  }
}`
    }
    return v
  }, [codeName])

  const showWarn = () => {
    Notify.warning({
      title: '操作提示',
      content: '请先填写代码',
      placement: 'bottomRight',
    })
  }

  const mutateCodeData = (op: 'codeSave' | 'codeSyntax') => {
    const code = editorRef.current?.getValue()
    if (trim(code) === '') {
      showWarn()
      return
    }
    const isSaveOp = op === 'codeSave'
    const opMutation = isSaveOp ? mutation : syntaxMutation
    opMutation.mutate(
      {
        [codeName]: {
          code,
        },
        type: tp,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(getFlowKey('streamJobCode'))
          setEnableRelease(true)
          Notify.success({
            title: '操作提示',
            content: isSaveOp ? '代码保存成功' : '语法检查成功',
            placement: 'bottomRight',
          })
        },
      }
    )
  }

  const onRelease = () => {
    const code = editorRef.current?.getValue()
    if (trim(code) === '') {
      showWarn()
      return
    }

    if (get(scheData, 'schedule_policy') === 0) {
      toggleScheModal(true)
    } else {
      toggleShow(true)
    }
  }

  const handleEditorWillMount = (monaco) => {
    monaco.editor.defineTheme('my-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': theme('colors.neut.18'),
      },
    })
    let mod: any = null
    if (tp === 2) {
      mod = flinksqlMod
    } else if (tp === 4) {
      mod = pythonMod
    } else {
      mod = scalaMod
    }
    if (mod) {
      const { language, conf, keywords } = mod
      monaco.languages.setMonarchTokensProvider(codeName, language)
      monaco.languages.setLanguageConfiguration(codeName, conf)
      monaco.languages.registerCompletionItemProvider(codeName, {
        provideCompletionItems: () => ({
          suggestions: keywords.map((value: string) => {
            return {
              label: value,
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: value,
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            }
          }),
        }),
      })
    }
  }

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor
    if (!isUndefined(codeStr)) {
      editor.setValue(codeStr || defaultCode)
      if (codeStr) {
        setEnableRelease(true)
      }
    }
    // eslint-disable-next-line no-bitwise
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () =>
      mutateCodeData('codeSave')
    )
  }

  useEffect(() => {
    if (!isUndefined(codeStr)) {
      editorRef.current?.setValue(codeStr || defaultCode)
      if (codeStr) {
        setEnableRelease(true)
      }
    }
  }, [codeStr, defaultCode])

  useUnmount(() => {
    workFlowStore.set({
      showNotify: false,
    })
  })

  const handleReleaseSuccess = () => {
    toggleShow(false)
    workFlowStore.set({
      showNotify: true,
    })
  }

  return (
    <FlexBox tw="h-full w-full flex-1">
      <FlexBox tw="flex flex-col flex-1 w-full">
        <StreamToolBar tw="pb-4">
          {/* <Button type="black">
            <Icon name="listview" type="light" />
            插入表
          </Button> */}
          <Button
            type="black"
            tw="w-[84px] px-0"
            onClick={() => mutateCodeData('codeSyntax')}
            loading={syntaxMutation.isLoading}
          >
            <Icon name="remark" type="light" />
            语法检查
          </Button>
          <Button type="black">
            <Icon name="triangle-right" type="light" />
            运行
          </Button>
          <Button
            tw="w-[68px] px-0"
            onClick={() => mutateCodeData('codeSave')}
            loading={mutation.isLoading}
          >
            <Icon name="data" />
            保存
          </Button>
          <Button
            type="primary"
            tw="w-[68px] px-0"
            onClick={onRelease}
            loading={releaseMutation.isLoading}
            disabled={!enableRelease}
          >
            <Icon name="export" />
            发布
          </Button>
        </StreamToolBar>
        <div tw="flex-1 overflow-hidden flex flex-col">
          <Editor
            language={codeName}
            defaultValue={isLoading ? loadingWord : codeStr || defaultCode}
            theme="my-theme"
            tw="overflow-hidden"
            options={{
              minimap: { enabled: false },
            }}
            editorWillMount={handleEditorWillMount}
            editorDidMount={handleEditorDidMount}
          />
        </div>
      </FlexBox>
      <StreamRightMenu
        showScheSetting={showScheSettingModal}
        onScheSettingClose={() => {
          setShowScheSettingModal(false)
        }}
      />
      {showScheModal && (
        <Modal
          visible
          noBorder
          width={400}
          onCancel={() => toggleScheModal(false)}
          okText="调度配置"
          onOk={() => {
            setShowScheSettingModal(true)
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
      {show && (
        <ReleaseModal
          onSuccess={handleReleaseSuccess}
          onCancel={() => toggleShow(false)}
        />
      )}
    </FlexBox>
  )
}

export default StreamCode
