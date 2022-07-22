import { useState, useRef, useMemo, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Center, FlexBox, Modal } from 'components'
import { Icon, Notification as Notify, Button, Loading } from '@QCFE/qingcloud-portal-ui'
import { get, trim, isUndefined } from 'lodash-es'
import { Prompt, useHistory, useParams } from 'react-router-dom'
import tw, { styled, theme, css } from 'twin.macro'
import { useImmer } from 'use-immer'
import { useUnmount, useBeforeUnload, useMeasure } from 'react-use'
import Editor from 'react-monaco-editor'
import { useQueryClient } from 'react-query'
import { loadSignature } from 'stores/api'

import SimpleBar from 'simplebar-react'
import {
  useMutationStreamJobCode,
  useMutationReleaseStreamJob,
  useQueryStreamJobSchedule,
  useQueryStreamJobCode,
  useMutationStreamJobCodeSyntax,
  getFlowKey,
  useStore
} from 'hooks'
import * as flinksqlMod from 'utils/languages/flinksql'
import * as pythonMod from 'utils/languages/python'
import * as scalaMod from 'utils/languages/scala'
import { timeFormat } from 'utils/convert'
import { connect as connectSocket } from 'utils/socket'
import codePlaceholder from './Code/config'
import { JobToolBar } from '../styled'
import ReleaseModal from '../Modal/ReleaseModal'
import VersionHeader from '../Version/VersionHeader'
import Result from './Code/Result'

const CODETYPE = {
  2: 'sql',
  4: 'python',
  5: 'scala'
}

const SyntaxBox = styled(Center)(({ isBigger = false }: { isBigger?: boolean }) => [
  tw`fixed-center backdrop-blur-sm text-center bg-neut-20 bg-opacity-60  rounded-md text-neut-8 transition-all`,
  isBigger ? tw`w-[600px] h-[386px]` : tw`w-96 h-60`,
  css`
    .simplebar-scrollbar:before {
      ${tw`bg-neut-8`}
    }
    .portal-loading .circle span {
      ${tw`bg-white`}
    }
  `
])

interface IProp {
  /** 2: SQL 4: Python 5: Scala */
  tp: 2 | 4 | 5
}

const StreamCode = observer(({ tp }: IProp) => {
  const [runLoading, setRunLoading] = useState(false)
  const {
    workFlowStore,
    workFlowStore: { curJob, curVersion, showSaveJobConfirm }
  } = useStore()
  const readOnly = !!curVersion
  const [nextLocation, setNextLocation] = useState(null)
  const [shouldNav, setShouldNav] = useState(false)
  const [showPlaceholder, setShowPlaceholder] = useState(true)
  const [syntaxState, setSyntaxState] = useImmer({ showBox: false, errMsg: '' })
  const [boxRef, boxDimensions] = useMeasure()
  const history = useHistory()
  const [show, toggleShow] = useState(false)
  const [, setEnableRelease] = useState(false)
  const [showScheModal, toggleScheModal] = useState(false)
  const editorRef = useRef<any>(null)
  const mutation = useMutationStreamJobCode()
  const syntaxMutation = useMutationStreamJobCodeSyntax()
  const releaseMutation = useMutationReleaseStreamJob()
  const { data, isFetching } = useQueryStreamJobCode()
  const { data: scheData } = useQueryStreamJobSchedule()
  const codeName = CODETYPE[tp]
  const codeStr = get(data, `${{ 2: 'sql', 4: 'python_code' }[tp as 2]}.code`)
  const loadingWord = '代码加载中......'
  const queryClient = useQueryClient()
  const defaultCode = useMemo(() => codePlaceholder[codeName as 'sql'] || '', [codeName])
  const { spaceId, regionId } = useParams<{ spaceId: string; regionId: string }>()
  const jobId = curJob?.id
  const socketRef = useRef(null)
  const [resultType, setResultType] = useState(0)
  const [socketId, setSocketId] = useState()
  const [socketUrl, setSocketUrl] = useState()
  const [btnDisabled, setDisabled] = useState(false)

  useEffect(() => {
    setDisabled(true)
    const getEndpoint = async () => {
      const signature = await loadSignature({
        region: regionId,
        uri: `/v1/workspace/${spaceId}/stream/job/${jobId}/ws`,
        method: 'GET'
      })
      const endpoint = signature.endpoint.replace('http:', 'ws:').replace('https:', 'wss:')
      const url = `${endpoint}/v1/workspace/${spaceId}/stream/job/${jobId}/ws` // 'ws://localhost:3030'
      setSocketUrl(url)
      setDisabled(false)
      return endpoint
    }
    getEndpoint()
  }, [regionId, spaceId, jobId])

  const onListening = async (func) => {
    let socket = socketRef.current

    if (socket?.close) {
      socket.close()
    }

    socket = await connectSocket(socketUrl, '', true)

    socket.onOpen((currSocket) => {
      setSocketId(currSocket.socketId)
      socketRef.current = currSocket
      currSocket.on('message', ({ type }) => {
        if (type) {
          setResultType(type)
          setRunLoading(type < 2)
        }
      })
      currSocket.on('close', () => {
        setRunLoading(false)
        socketRef.current = null
      })

      currSocket.on('error', () => {
        setRunLoading(false)
        socketRef.current = null
      })
      if (func) {
        setTimeout(() => func(currSocket), 100)
      }
    })
  }

  useEffect(
    () => () => {
      if (socketRef.current?.close) {
        socketRef.current.close()
      }
    },
    []
  )

  const showWarn = () => {
    Notify.warning({
      title: '操作提示',
      content: '请先填写代码',
      placement: 'bottomRight'
    })
  }

  const run = () => {
    const send = (socket) => {
      const code = trim(editorRef.current?.getValue())
      socket.send({ code })
      setResultType(999)
    }

    onListening(send)
  }

  const handleRun = () => {
    setRunLoading(true)
    run()
  }

  const mutateCodeData = (op: 'codeSave' | 'codeSyntax', cb?: () => void, hideNotify = false) => {
    const code = trim(editorRef.current?.getValue())
    if (code === '') {
      showWarn()
      return
    }
    const isSaveOp = op === 'codeSave'
    const opMutation = isSaveOp ? mutation : syntaxMutation
    if (code === loadingWord || opMutation.isLoading) {
      return
    }
    if (!isSaveOp) {
      setSyntaxState((draft) => {
        draft.showBox = true
        draft.errMsg = ''
      })
    }
    opMutation.mutate(
      {
        [{ sql: 'sql', python: 'python_code' }[codeName as 'sql']]: {
          code
        },
        type: tp
      },
      {
        onSuccess: (ret: any) => {
          if (!isSaveOp) {
            if (get(ret, 'result') === 2) {
              setSyntaxState((draft) => {
                draft.errMsg = get(ret, 'message', '')
              })
              if (cb) {
                cb()
              }
              return
            }
          }
          setSyntaxState((draft) => {
            draft.errMsg = ''
          })
          if (isSaveOp) {
            queryClient.invalidateQueries(getFlowKey('streamJobCode'))
          }
          setEnableRelease(true)
          setShowPlaceholder(false)
          if (!hideNotify) {
            Notify.success({
              title: '操作提示',
              content: isSaveOp ? '代码保存成功' : '语法检查成功',
              placement: 'bottomRight'
            })
          }
          if (cb) {
            cb()
          }
        },
        onError: () => {
          setShowPlaceholder(false)
          setSyntaxState((draft) => {
            draft.showBox = false
            draft.errMsg = ''
          })
        }
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

  const handleEditorWillMount = (monaco: any) => {
    monaco.editor.defineTheme('my-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': theme('colors.neut.17')
      }
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
          suggestions: keywords.map((value: string) => ({
            label: value,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: value,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          }))
        })
      })
    }
  }

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor
    if (!isUndefined(codeStr)) {
      editor.setValue(codeStr || defaultCode)
      if (codeStr) {
        setShowPlaceholder(false)
        setEnableRelease(true)
      }
    }
    editor.onDidBlurEditorWidget(() => {
      if (editor.getValue() === '') {
        editor.setValue(defaultCode)
        setShowPlaceholder(true)
      }
    })
    // eslint-disable-next-line no-bitwise
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => mutateCodeData('codeSave'))
  }

  const handleEditorChange = (v: string) => {
    let isDirty = v !== codeStr
    if (!codeStr && v === defaultCode) {
      isDirty = false
    }
    workFlowStore.set({
      isDirty
    })
  }

  const handleFocusClick = () => {
    setShowPlaceholder(false)
    const editorObj = editorRef.current
    if (editorObj.getValue() === defaultCode) {
      editorObj.setValue('')
      editorObj.focus()
    }
  }

  const handlePrompt = (location: any) => {
    workFlowStore.showSaveConfirm(curJob?.id, 'leave')
    setNextLocation(location)
    return false
  }

  useEffect(() => {
    if (shouldNav && nextLocation) {
      history.push(nextLocation.pathname)
    }
  }, [shouldNav, history, nextLocation])

  useEffect(() => {
    if (!isUndefined(codeStr)) {
      editorRef.current?.setValue(codeStr || defaultCode)
      if (codeStr) {
        setShowPlaceholder(false)
        setEnableRelease(true)
      }
    }
    if (curVersion?.version) {
      editorRef.current?.setValue(isFetching ? loadingWord : codeStr)
    }
  }, [codeStr, defaultCode, curVersion?.version, isFetching])

  useUnmount(() => {
    workFlowStore.set({
      showNotify: false
    })
    workFlowStore.resetNeedSave()
  })

  useBeforeUnload(workFlowStore.isDirty, '未保存')

  const handleReleaseSuccess = () => {
    toggleShow(false)
    workFlowStore.set({
      showNotify: true
    })
  }

  return (
    <FlexBox tw="relative h-full w-full flex-1" ref={boxRef}>
      <FlexBox tw="flex flex-col flex-1 overflow-hidden">
        {readOnly ? (
          <VersionHeader />
        ) : (
          <JobToolBar tw="pb-4">
            {/* <Button type="black">
                <Icon name="listview" type="light" />
                插入表
              </Button> */}
            <Button
              type="black"
              disabled={tp !== 2 || btnDisabled}
              onClick={() => mutateCodeData('codeSyntax')}
              loading={syntaxMutation.isLoading}
            >
              <Icon name="remark" type="light" />
              语法检查
            </Button>
            <Button disabled={btnDisabled} type="black" onClick={handleRun} loading={runLoading}>
              <Icon name="triangle-right" type="light" />
              运行
            </Button>
            <Button
              disabled={btnDisabled}
              onClick={() => mutateCodeData('codeSave')}
              loading={mutation.isLoading}
            >
              <Icon name="data" />
              保存
            </Button>
            <Button
              type="primary"
              onClick={() => mutateCodeData('codeSave', onRelease, true)}
              loading={releaseMutation.isLoading}
              // disabled={!enableRelease}
            >
              <Icon name="export" />
              发布
            </Button>
            {!!get(data, 'updated') && (
              <span tw="flex-auto text-right text-font">
                最后更新时间：{timeFormat(get(data, 'updated') * 1000)}
              </span>
            )}
          </JobToolBar>
        )}
        <div tw="flex-1 relative overflow-hidden flex flex-col">
          <div
            css={[!showPlaceholder && tw`hidden`]}
            tw="absolute inset-0 z-50 bg-neut-18 bg-opacity-40 cursor-text"
            onClick={handleFocusClick}
          />
          <Editor
            language={codeName}
            defaultValue={isFetching ? loadingWord : codeStr}
            theme="my-theme"
            tw="overflow-hidden"
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              readOnly
            }}
            editorWillMount={handleEditorWillMount}
            editorDidMount={handleEditorDidMount}
            onChange={handleEditorChange}
          />
        </div>
      </FlexBox>
      {/* <StreamRightMenu
        showScheSetting={showScheSettingModal}
        onScheSettingClose={() => {
          setShowScheSettingModal(false)
        }}
      /> */}
      {showScheModal && (
        <Modal
          visible
          noBorder
          width={400}
          onCancel={() => toggleScheModal(false)}
          okText="调度配置"
          onOk={() => {
            workFlowStore.set({
              showScheSetting: true
            })
            // setShowScheSettingModal(true)
            toggleScheModal(false)
          }}
        >
          <div tw="flex">
            <Icon name="exclamation" color={{ secondary: '#F5C414' }} size={20} />
            <div tw="ml-3">
              <div tw="text-base">尚未配置调度任务</div>
              <div tw="mt-2 text-neut-8">发布调度任务前，请先完成调度配置，否则无法发布</div>
            </div>
          </div>
        </Modal>
      )}
      {show && <ReleaseModal onSuccess={handleReleaseSuccess} onCancel={() => toggleShow(false)} />}
      {resultType > 0 && (
        <Result
          width={boxDimensions.width}
          height={boxDimensions.height}
          socketId={socketId}
          loading={runLoading}
          onClose={setResultType}
        />
      )}

      {showSaveJobConfirm && (
        <Modal
          visible
          noBorder
          draggable
          escClosable={false}
          maskClosable={false}
          width={400}
          onCancel={() => workFlowStore.hideSaveConfirm()}
          footer={
            <div tw="flex justify-between w-full pl-9">
              <Button
                type="danger"
                onClick={() => {
                  if (workFlowStore.tabOp === 'leave') {
                    workFlowStore.resetNeedSave()
                    setShouldNav(true)
                  } else {
                    workFlowStore.switchPanel()
                  }
                }}
              >
                不保存
              </Button>
              <div>
                <Button onClick={() => workFlowStore.hideSaveConfirm()}>取消</Button>
                <Button
                  type="primary"
                  loading={mutation.isLoading}
                  onClick={() => {
                    mutateCodeData('codeSave', () => {
                      if (workFlowStore.tabOp === 'leave') {
                        workFlowStore.resetNeedSave()
                        setShouldNav(true)
                      } else {
                        workFlowStore.switchPanel()
                      }
                    })
                  }}
                >
                  保存
                </Button>
              </div>
            </div>
          }
        >
          <div tw="flex">
            <Icon name="exclamation" color={{ secondary: '#F5C414' }} size={20} />
            <div tw="ml-3">
              <div tw="text-base">尚未保存</div>
              <div tw="mt-2 text-neut-8">未保存时刷新、离开，将丢失已输入内容</div>
            </div>
          </div>
        </Modal>
      )}
      <Prompt when={workFlowStore.isDirty} message={handlePrompt} />
      {syntaxState.showBox && (
        <SyntaxBox isBigger={syntaxMutation.isSuccess && syntaxState.errMsg !== ''}>
          <div tw="absolute right-2 top-2">
            <Icon
              name="close"
              type="dark"
              color={{
                primary: theme('colors.white')
              }}
              tw="cursor-pointer"
              onClick={() => {
                setSyntaxState((draft) => {
                  draft.showBox = false
                  draft.errMsg = ''
                })
              }}
            />
          </div>
          {syntaxMutation.isLoading && (
            <div>
              <Loading />
              <div tw="mt-10">正在进行语法检查，请稍候...</div>
            </div>
          )}
          {syntaxMutation.isSuccess && (
            <>
              {syntaxState.errMsg === '' ? (
                <div tw="text-center">
                  <Icon
                    name="success"
                    size={40}
                    color={{
                      primary: theme('colors.green.11'),
                      secondary: '#9DDFC9'
                    }}
                  />
                  <div>检查完毕，未发现语法错误</div>
                </div>
              ) : (
                <div tw="w-full">
                  <Icon
                    name="information"
                    size={30}
                    color={{
                      primary: theme('colors.white'),
                      secondary: theme('colors.blue.10')
                    }}
                  />
                  <SimpleBar
                    style={{ maxHeight: 160 }}
                    tw="text-left px-6 break-all overflow-y-auto"
                  >
                    <div tw="text-center">发现语法检查错误，具体内容如下：</div>
                    {syntaxState.errMsg.split(/\n\t/).map((line, i) => {
                      if (line) {
                        return (
                          <div key={`${i.toString()}key`} tw="whitespace-pre-line">
                            {line}
                          </div>
                        )
                      }
                      return null
                    })}
                  </SimpleBar>
                </div>
              )}
            </>
          )}
        </SyntaxBox>
      )}
    </FlexBox>
  )
})

export default StreamCode
