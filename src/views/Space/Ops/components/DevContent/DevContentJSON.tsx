import tw, { css, styled, theme } from 'twin.macro'
import Editor from 'react-monaco-editor'
import { isUndefined } from 'lodash-es'
import { useRef, useState } from 'react'
import { ArrowLine, Center, FlexBox } from 'components/index'

const defaultCode = `
`
const codeName = 'json'

const Item = styled.div`
  ${tw`rounded-[3px] border border-white py-1 px-2 text-white`}
`

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Line = () => {
  return (
    <FlexBox tw="w-[20%]">
      <div tw="h-[1px] flex-auto border-none mt-[3px] border-white border-t border-dashed" />
      <div
        tw="w-0 h-0 border-4 border-transparent border-l-white "
        css={css`
          transform: translateX(2px);
        `}
      />
    </FlexBox>
  )
}

const DevContentJSON = (props: {
  data?: { job_content?: string }
  showStep?: boolean
}) => {
  const { data: { job_content: codeStr = defaultCode } = {}, showStep = true } =
    props
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

  // TODO: 脚本模式判断
  return (
    <div tw="h-full w-full grid py-5 bg-neut-18">
      {showStep !== false && (
        <Center tw="bg-neut-18 h-14">
          <Item>来源: mysql</Item>
          <ArrowLine tw="w-[20%] flex-none" />
          <Item>离线-增量</Item>
          <ArrowLine tw="w-[20%] flex-none" />
          <Item>目的: kafka</Item>
        </Center>
      )}
      <div tw="flex-1 relative overflow-hidden h-auto ">
        <div
          css={[!showPlaceholder && tw`hidden`]}
          tw="absolute inset-0 z-50 bg-neut-18 bg-opacity-40 cursor-text"
        />
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
    </div>
  )
}

export default DevContentJSON
