import { useState, useEffect } from 'react'
import { FlexBox } from 'components'
import { Icon, Notification as Notify, Button } from '@QCFE/qingcloud-portal-ui'
import AceEditor from 'react-ace'
import { get, trim } from 'lodash-es'
import tw, { css, styled } from 'twin.macro'
import 'ace-builds/src-noconflict/mode-sql'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/src-noconflict/mode-scala'
import 'ace-builds/src-noconflict/theme-solarized_dark'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/ext-spellcheck'
import 'ace-builds/src-noconflict/snippets/sql'
import 'ace-builds/src-noconflict/snippets/python'
import 'ace-builds/src-noconflict/snippets/scala'
import {
  useMutationStreamJobCode,
  useMutationReleaseStreamJob,
  useQueryStreamJobCode,
} from 'hooks'
import { StreamToolBar } from './styled'
import StreamRightMenu from './StreamRightMenu'
import ReleaseModal from './ReleaseModal'

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
  const mutation = useMutationStreamJobCode()
  const releaseMutation = useMutationReleaseStreamJob()
  const [code, setCode] = useState()
  const { data } = useQueryStreamJobCode()
  const codeName = CODETYPE[tp]

  useEffect(() => {
    const codeStr = get(data, `${codeName}.code`)
    if (codeStr) {
      setCode(codeStr)
      setEnableRelease(true)
    }
  }, [data, codeName])

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

  const showWarn = () => {
    Notify.warning({
      title: '操作提示',
      content: '请选填写代码',
      placement: 'bottomRight',
    })
  }

  const save = () => {
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
    if (trim(code) === '') {
      showWarn()
      return
    }
    toggleShow(true)
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
        <AceEditorWrapper tw="flex-1 pt-4 flex">
          <AceEditor
            tw="h-full"
            mode={CODETYPE[tp]}
            showPrintMargin={false}
            theme="solarized_dark"
            width="100%"
            height="100%"
            fontSize={12}
            placeholder="在这里输入代码..."
            enableSnippets
            enableBasicAutocompletion
            enableLiveAutocompletion
            onLoad={complete}
            setOptions={{
              useWorker: false,
              tabSize: 2,
            }}
            onChange={(v) => setCode(v)}
            //             defaultValue={`-drop table if exists pd;
            // create table pd
            // (id bigint primary key NOT ENFORCED,id1 bigint) WITH (
            // 'connector' = 'jdbc',
            // 'url' = 'jdbc:mysql://127.0.0.1:3306/data_workbench',
            // 'table-name' = 'pd',
            // 'username' = 'root',
            // 'password' = '123456'
            // );`}
            value={code}
          />
        </AceEditorWrapper>
      </FlexBox>
      <StreamRightMenu />
      {show && <ReleaseModal onCancel={() => toggleShow(false)} />}
    </FlexBox>
  )
}

export default StreamCode
