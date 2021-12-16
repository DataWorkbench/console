import { useState, useRef, useMemo } from 'react'
import { FlexBox } from 'components'
import { Icon, Notification as Notify, Button } from '@QCFE/qingcloud-portal-ui'
import { get, trim } from 'lodash-es'
import { theme } from 'twin.macro'
import Editor from '@monaco-editor/react'
import {
  useMutationStreamJobCode,
  useMutationReleaseStreamJob,
  useQueryStreamJobCode,
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
  const [show, toggleShow] = useState(false)
  const [enableRelease, setEnableRelease] = useState(false)
  const editorRef = useRef(null)
  const mutation = useMutationStreamJobCode()
  const releaseMutation = useMutationReleaseStreamJob()
  const { data } = useQueryStreamJobCode()
  const codeName = CODETYPE[tp]
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
      content: '请选填写代码',
      placement: 'bottomRight',
    })
  }

  const save = () => {
    const code = editorRef.current?.getValue()
    if (trim(code) === '') {
      showWarn()
      return
    }

    mutation.mutate(
      {
        [codeName]: {
          code,
        },
        type: tp,
      },
      {
        onSuccess: () => {
          setEnableRelease(true)
          Notify.success({
            title: '操作提示',
            content: '代码保存成功',
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
    toggleShow(true)
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
    const codeStr = get(data, `${codeName}.code`)
    if (codeStr) {
      editor.setValue(codeStr)
      setEnableRelease(true)
    }
    // eslint-disable-next-line no-bitwise
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, save)
  }

  return (
    <FlexBox tw="h-full flex-1">
      <FlexBox tw="flex-col flex-1">
        <StreamToolBar>
          {/* <Button type="black">
            <Icon name="listview" type="light" />
            插入表
          </Button> */}
          <Button type="black">
            <Icon name="remark" type="light" />
            语法检查
          </Button>
          <Button type="black">
            <Icon name="triangle-right" type="light" />
            运行
          </Button>
          <Button onClick={save} loading={mutation.isLoading}>
            <Icon name="data" />
            保存
          </Button>
          <Button
            type="primary"
            onClick={onRelease}
            loading={releaseMutation.isLoading}
            disabled={!enableRelease}
          >
            <Icon name="export" />
            发布
          </Button>
        </StreamToolBar>
        <div tw="flex-1 pt-4 flex flex-col">
          <Editor
            defaultLanguage={codeName}
            defaultValue={defaultCode}
            theme="my-theme"
            tw="flex-1 h-full overflow-auto"
            options={{
              minimap: { enabled: false },
            }}
            beforeMount={handleEditorWillMount}
            onMount={handleEditorDidMount}
          />
        </div>
      </FlexBox>
      <StreamRightMenu />
      {show && <ReleaseModal onCancel={() => toggleShow(false)} />}
    </FlexBox>
  )
}

export default StreamCode
