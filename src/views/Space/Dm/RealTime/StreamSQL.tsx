import { useState, useEffect } from 'react'
import { FlexBox } from 'components'
import { Icon, Notification as Notify, Button } from '@QCFE/qingcloud-portal-ui'
import AceEditor from 'react-ace'
import { get } from 'lodash-es'
import tw, { css, styled } from 'twin.macro'
import 'ace-builds/src-noconflict/mode-sql'
import 'ace-builds/src-noconflict/theme-solarized_dark'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/ext-spellcheck'
import 'ace-builds/src-noconflict/snippets/sql'
import {
  useMutationStreamJobCode,
  useMutationReleaseStreamJob,
  useQueryStreamJobCode,
} from 'hooks'
import { StreamToolBar } from './styled'
import StreamRightMenu from './StreamRightMenu'

const AceEditorWrapper = styled('div')(() => [
  css`
    ${tw`ml-2`}
    .ace-solarized-dark {
      ${tw`bg-neut-18`}
      .ace_gutter {
        background-color: #1e2a39;
      }
      .ace_marker-layer {
        .ace_selection,
        .ace_active-line {
          background: #162937;
        }
      }
    }
  `,
])

const StreamSQL = () => {
  const mutation = useMutationStreamJobCode()
  const releaseMutation = useMutationReleaseStreamJob()
  const [code, setCode] = useState()
  const { data } = useQueryStreamJobCode()

  useEffect(() => {
    const sqlCode = get(data, 'sql.code')
    if (sqlCode) {
      setCode(sqlCode)
    }
  }, [data])
  const complete = (editor: any) => {
    const completers = [
      {
        name: 'word',
        value: 'word',
        score: 100,
        meta: 'keyword',
      },
    ]
    editor.completers.push({
      getCompletions(editors, session, pos, prefix, callback: any) {
        callback(null, completers)
      },
    })
  }

  const save = () => {
    mutation.mutate(
      {
        sql: {
          code,
        },
        type: 2,
      },
      {
        onSuccess: () => {
          Notify.success({
            title: '操作提示',
            content: '代码保存成功',
            placement: 'bottomRight',
          })
        },
      }
    )
  }

  const release = () => {
    releaseMutation.mutate(null, {
      onSuccess: () => {
        Notify.success({
          title: '操作提示',
          content: '代码保存成功',
          placement: 'bottomRight',
        })
      },
    })
  }
  return (
    <FlexBox tw="h-full flex-1">
      <FlexBox tw="flex-col flex-1">
        <StreamToolBar>
          <Button type="black">
            <Icon name="listview" type="light" />
            插入表
          </Button>
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
            onClick={release}
            loading={releaseMutation.isLoading}
          >
            <Icon name="export" />
            发布
          </Button>
        </StreamToolBar>
        <AceEditorWrapper tw="flex-1 pt-4 flex">
          <AceEditor
            tw="h-full"
            mode="sql"
            theme="solarized_dark"
            width="100%"
            height="100%"
            fontSize={12}
            placeholder="在这里输入SQL..."
            enableSnippets
            enableBasicAutocompletion
            enableLiveAutocompletion
            onLoad={complete}
            setOptions={{
              useWorker: false,
              tabSize: 2,
            }}
            onChange={(v) => setCode(v)}
            defaultValue={`-drop table if exists pd;
create table pd
(id bigint primary key NOT ENFORCED,id1 bigint) WITH (
'connector' = 'jdbc',
'url' = 'jdbc:mysql://127.0.0.1:3306/data_workbench',
'table-name' = 'pd',
'username' = 'root',
'password' = '123456'
);`}
            value={code}
          />
        </AceEditorWrapper>
      </FlexBox>
      <StreamRightMenu />
    </FlexBox>
  )
}

export default StreamSQL
