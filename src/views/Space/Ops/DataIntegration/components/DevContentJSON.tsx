import tw, { css, styled, theme } from 'twin.macro'
import Editor from 'react-monaco-editor'
import { isUndefined } from 'lodash-es'
import { useRef, useState } from 'react'
import { Center, FlexBox } from 'components'

const defaultCode = `
{
  "job": {
    "content": [
      {
        "reader": {
          "name": "mysqlreader",
          "parameter": {
            "column": [
              {
                "name": "id",
                "type": "int"
              },
              {
                "name": "raw_date",
                "type": "string",
                "value": "2014-12-12 14:24:16"
              }
            ],
            "username": "root",
            "password": "root",
            "connection": [
              {
                "jdbcUrl": [
                  "jdbc:mysql://localhost:3306/test?useSSL=false"
                ],
                "table": [
                  "sync_ods"
                ]
              }
            ]
          }
        },
        "writer": {
          "name": "kafkasink",
          "parameter": {
            "tableFields": [
              "id",
              "raw_date"
            ],
            "topic": "cx",
            "producerSettings": {
              "auto.commit.enable": "false",
              "bootstrap.servers": "localhost:9092"
            }
          }
        }
      }
    ],
    "setting": {
      "restore": {
        "isRestore": true,
        "isStream": true
      },
      "speed": {
        "readerChannel": 1,
        "writerChannel": 1
      }
    }
  }
}
`
const codeName = 'json'

const Item = styled.div`
  ${tw`rounded-[3px] border border-white py-1 px-2 text-white`}
`

const Line = () => {
  return (
    <FlexBox tw="w-[20%]">
      <div
        tw="h-[1px] flex-auto border-none border-t border-dashed"
        css={css`
          transform: translateY(50%);
        `}
      />
      <div tw="w-0 h-0 border-4 border-transparent border-l-white " />
    </FlexBox>
  )
}

const DevContentJSON = (props: { data?: { code?: string } }) => {
  const { data: { code: codeStr = defaultCode } = {} } = props
  const editorRef = useRef(null)
  const [showPlaceholder, setShowPlaceholder] = useState(true)

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

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
    if (!isUndefined(codeStr)) {
      editor.setValue(codeStr || defaultCode)
      if (codeStr) {
        setShowPlaceholder(false)
      }
    }
  }

  return (
    <div tw="flex-1 relative overflow-hidden h-auto ">
      <div
        css={[!showPlaceholder && tw`hidden`]}
        tw="absolute inset-0 z-50 bg-neut-18 bg-opacity-40 cursor-text"
      />
      <Center tw="bg-neut-18 h-10">
        <Item>来源: mysql</Item>
        <Line />
        <Item>离线-增量</Item>
        <Line />
        <Item>目的: kafka</Item>
      </Center>
      <Editor
        language={codeName}
        defaultValue={codeStr}
        theme="my-theme"
        tw="overflow-hidden"
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          readOnly: true,
        }}
        editorWillMount={handleEditorWillMount}
        editorDidMount={handleEditorDidMount}
      />
    </div>
  )
}

export default DevContentJSON
