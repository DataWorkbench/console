import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Control, Icon, Loading } from '@QCFE/lego-ui'
import tw, { css } from 'twin.macro'
import { merge, now, pick } from 'lodash-es'

import emitter from 'utils/emitter'
import { useMutationSource, useStore } from 'hooks'
import { TextLink, Tooltip } from 'components'
import {
  DATASOURCE_PING_STAGE,
  SOURCE_PING_RESULT,
  SOURCE_PING_START,
} from '../constant'

interface IDataSourcePingButtonProps {
  getValue: () => Record<string, any> | undefined
  defaultStatus?: {
    status: boolean
    message?: string
  }
  sourceId?: string
  network?: {
    id: string
    name: string
    network_info: Record<string, any>
  }
}

export const DataSourcePingButton = (props: IDataSourcePingButtonProps) => {
  const { getValue, defaultStatus, sourceId, network } = props
  const mutation = useMutationSource()
  const {
    dataSourceStore: { setShowPingHistories },
  } = useStore()

  const onOpen = useCallback(() => {
    setShowPingHistories(true)
  }, [setShowPingHistories])

  const hasPingRef = useRef(false)
  const [status, setStatus] = useState(defaultStatus)

  useEffect(() => {
    setStatus(defaultStatus)
  }, [defaultStatus, network])

  const handlePing = useCallback(async () => {
    hasPingRef.current = true
    const formData = getValue()
    if (formData) {
      let pingStatus = false
      let msg = ''
      const item = {
        uuid: Math.random().toString(32).substring(2),
        name: network?.name,
        network_id: network?.id,
        network_info: network?.network_info,
        created: now() / 1000,
        sourceId,
        stage: sourceId
          ? DATASOURCE_PING_STAGE.UPDATE
          : DATASOURCE_PING_STAGE.CREATE,
        result: -1, // 测试中
      }
      try {
        emitter.emit(SOURCE_PING_START, item)
        const ret = await mutation.mutateAsync({
          op: 'ping',
          ...pick(formData, 'type', 'url'),
          network_id: network?.id,
          source_id: sourceId,
          stage: sourceId
            ? DATASOURCE_PING_STAGE.UPDATE
            : DATASOURCE_PING_STAGE.CREATE,
        })
        if (ret.ret_code === 0) {
          pingStatus = ret.result === 1
          msg = ret.message
          emitter.emit(
            SOURCE_PING_RESULT,
            merge(item, pick(ret, ['created', 'elapse', 'message', 'result']), {
              last_connection: ret,
            })
          )
        }
      } catch (e: any) {
        pingStatus = false
        msg = e.message
        emitter.emit(
          SOURCE_PING_RESULT,
          merge(item, { message: msg, result: pingStatus ? 1 : 2 })
        )
      }

      setStatus({
        status: pingStatus,
        message: msg,
      })
    }
  }, [
    getValue,
    mutation,
    network?.id,
    network?.network_info,
    network?.name,
    sourceId,
  ])

  const pingHistory = useMemo(() => {
    return (
      <TextLink color="green" hasIcon={false} onClick={onOpen} tw="ml-1">
        测试记录
      </TextLink>
    )
  }, [onOpen])

  const actionButton = useMemo(() => {
    const tempButton = (
      <Button type="outlined" onClick={handlePing} disabled={!network?.id}>
        {status ? '重新测试' : '开始测试'}
      </Button>
    )
    if (!network?.id) {
      return (
        <Tooltip
          theme="darker"
          content="完成数据源连接信息且选择网络配置后，可以点击“开始测试”测试数据源可用性"
          hasPadding
        >
          {tempButton}
        </Tooltip>
      )
    }
    return tempButton
  }, [network, handlePing, status])

  return (
    <>
      <Control>
        {mutation.isLoading ? (
          <Button type="outlined">
            <Loading size="small" tw="w-[30px]" /> 测试中
          </Button>
        ) : (
          actionButton
        )}
      </Control>
      {mutation.isLoading && (
        <div className="help">
          <span tw="text-neut-15">
            正在测试数据源在当前网络配置下的可用性，如需查看更多可点击
          </span>
          {pingHistory}
        </div>
      )}
      {!mutation.isLoading && status && !status.status && (
        <div
          className="help"
          tw="text-red-10 flex items-center"
          css={css`
            svg {
              ${tw`fill-[#CA2621] text-white`}
            }
          `}
        >
          <Icon name="error" />
          <span tw="text-neut-15">
            不可用，{status.message ? `${status.message}，` : ''}
            如需查看更多可点击
            {pingHistory}
          </span>
        </div>
      )}
      {!mutation.isLoading && status && status.status && (
        <div
          className="help"
          tw="flex items-center"
          css={css`
            svg {
              ${tw`fill-[#059669] text-white`}
            }
          `}
        >
          <Icon name="success" size={16} />
          <span tw="ml-1 text-neut-15">测试通过，如需查看更多可点击</span>
          {pingHistory}
        </div>
      )}
      {!mutation.isLoading && !status && defaultStatus && (
        <div className="help">
          <span tw="ml-1 text-neut-15">已有测试记录，如需查看可点击</span>
          {pingHistory}
        </div>
      )}
    </>
  )
}

export default DataSourcePingButton
