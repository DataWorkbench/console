import { Rnd } from 'react-rnd'
import { FlexBox } from 'components'
import { Icon, Loading } from '@QCFE/qingcloud-portal-ui'
import { useRef, useState, useEffect, useMemo, memo } from 'react'
import { connect as connectSocket } from 'utils/socket'
import dayjs from 'dayjs'
// import { error } from './config'
import Table from './Table'

interface ResultProps {
  loading: boolean
  height: number
  socketId: string | null
  onClose: () => {}
}

const enableResizing = {
  top: true,
  right: false,
  bottom: false,
  left: false,
  topRight: false,
  bottomRight: false,
  bottomLeft: false,
  topLeft: false
}

function Result({ loading, height, socketId, onClose }: ResultProps) {
  const [result, setResult] = useState()
  const [fullHeight, setFullHeight] = useState(false)
  const [currDate, setCurrDate] = useState()
  const [type, setType] = useState()
  const rndRef = useRef(null)
  const socketRef = useRef(null)
  const columns = useRef([])

  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const socket = connectSocket()
    setType(0)

    if (socket.alive) {
      socket.on('message', ({ type: t, dataset, error_message }) => {
        if (t) setType(t)
        if (t === 1) {
          columns.current = (dataset?.[0]?.message || []).map((r) => ({
            title: r,
            dataIndex: r
          }))
        } else if (t === 2) {
          const header = columns.current
          const res = dataset.map(
            (item) =>
              item.message.reduce(
                (prev, curr, index) => ({
                  ...prev,
                  [header[index].dataIndex]: curr
                }),
                {}
              ),
            {}
          )
          setResult(res)
          setCurrDate(dayjs().format('HH:mm:ss.SSS'))
        } else if (t === 4) {
          setErrorMsg(error_message)
          socket.close()
        }
      })
    }

    socketRef.current = socket
    setResult((r) => r)
    return () => {
      if (socket.close) {
        socket.close()
      }
    }
  }, [socketId])

  const key = useMemo(() => {
    if (columns.current.length) {
      return columns.current.find((r) => r.dataIndex === 'id') ? 'id' : columns.current[0].dataIndex
    }
    return 'id'
  }, [])

  return (
    <Rnd
      tw="z-[119] bg-neut-17 text-white border border-neut-13 rounded-t-sm flex! flex-col"
      bounds="parent"
      minHeight={38}
      ref={rndRef}
      enableResizing={enableResizing}
      default={{
        width: '100%',
        height: 384,
        x: 0,
        y: height - 384
      }}
      dragHandleClassName="runlog-toolbar"
    >
      <FlexBox tw="justify-between h-[38px] leading-[38px] items-center border-b border-b-neut-13 px-3">
        <div className="runlog-toolbar" tw="flex-1 cursor-move">
          运行日志
        </div>
        <FlexBox tw="gap-2.5">
          <FlexBox
            tw="select-text cursor-pointer gap-0.5 items-center"
            onClick={() => socketRef.current?.close?.()}
          >
            <Icon name="stop" type="light" />
            结束运行
          </FlexBox>
          <FlexBox tw="select-text cursor-pointer gap-0.5 items-center" onClick={() => onClose(0)}>
            <Icon name="close" type="light" />
            关闭面板
          </FlexBox>
          <FlexBox
            tw="select-text cursor-pointer gap-0.5 items-center"
            onClick={() => {
              setFullHeight((isFull) => {
                rndRef.current.updateSize({
                  height: isFull ? 384 : height,
                  width: '100%'
                })
                rndRef.current.updatePosition({
                  y: isFull ? height - 384 : 0,
                  x: 0
                })
                return !isFull
              })
            }}
          >
            <Icon name={fullHeight ? 'minimize' : 'maximize'} type="light" />
            {`最${fullHeight ? '小' : '大'}化`}
          </FlexBox>
        </FlexBox>
      </FlexBox>
      <FlexBox className="sql-result-wrapper" tw="p-3 flex-1 flex-col overflow-hidden">
        {type <= 2 && (
          <FlexBox tw="font-bold">
            <span tw="flex-1">SQL Query Result</span>
            {currDate && <span style={{ color: '#939EA9' }}>{`Updated: ${currDate}`}</span>}
          </FlexBox>
        )}
        {loading && type <= 1 && (
          <FlexBox tw="gap-1 items-center content-center">
            <Loading size="small" noWrapper /> 正在执行 SQL， 请稍等。。。
          </FlexBox>
        )}
        {type === 2 && (
          <Table
            fixHeader
            dataSource={result}
            rowKey={key}
            columns={columns.current}
            tw="flex-1 overflow-auto"
          />
        )}
        {type === 4 && (
          <code tw="flex-1 overflow-auto break-words whitespace-pre-line bg-transparent text-white">
            {errorMsg}
          </code>
        )}
      </FlexBox>
    </Rnd>
  )
}

export default memo(Result)
