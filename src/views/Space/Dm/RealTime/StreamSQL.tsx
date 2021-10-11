import { FlexBox } from 'components'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-sql'
import 'ace-builds/src-noconflict/theme-terminal'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/ext-spellcheck'
import 'ace-builds/src-noconflict/snippets/sql'
import { DarkButton, StreamToolBar } from 'views/Space/styled'

// interface Iflow {
//   id: string
//   name: string
//   type: number
//   [k: string]: string | number
// }

// const StreamSQL = ({ flow }: { flow: Iflow }) => {
const StreamSQL = () => {
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

  const save = () => {}

  return (
    <FlexBox tw="flex-col flex-1">
      <StreamToolBar>
        <DarkButton type="dark">
          <Icon name="listview" />
          插入表
        </DarkButton>
        <DarkButton type="dark">
          <Icon name="remark" />
          语法检查
        </DarkButton>
        <DarkButton type="dark">
          <Icon name="triangle-right" />
          运行
        </DarkButton>
        <DarkButton type="grey" onClick={save}>
          <Icon name="data" />
          保存
        </DarkButton>
        <DarkButton type="primary">
          <Icon name="export" />
          发布
        </DarkButton>
      </StreamToolBar>
      <div tw="flex-1 pt-4 flex">
        <AceEditor
          tw="h-full"
          mode="sql"
          theme="terminal"
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
          defaultValue={`-drop table if exists pd;
create table pd
(id bigint primary key NOT ENFORCED,id1 bigint) WITH (
'connector' = 'jdbc',
'url' = 'jdbc:mysql://127.0.0.1:3306/data_workbench',
'table-name' = 'pd',
'username' = 'root',
'password' = '123456'
);`}
        />
      </div>
    </FlexBox>
  )
}

export default StreamSQL
