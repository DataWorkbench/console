import { get, merge, pick } from 'lodash-es'
import { useImmer } from 'use-immer'
import React, { useCallback, useContext, useState } from 'react'
import { Modal } from '@QCFE/qingcloud-portal-ui'
import { Field, Form, Label } from '@QCFE/lego-ui'

import { AffixLabel, HelpCenterLink, SelectWithRefresh } from 'components'
import { useStore } from 'stores'
import { toJS } from 'mobx'

import { networkLink } from 'views/Space/Upcloud/DataSourceList/constant'
import { DataSourcePingButton } from './DataSourcePingButton'
import { NetworkContext } from '../NetworkProvider'

export const DataSourcePingModal = () => {
  const {
    dataSourceStore: { opSourceList, mutateOperation },
    dmStore: { setNetWorkOp }
  } = useStore()

  // const sourceType = get(opSourceList, `[0].type`)
  const networkId = get(opSourceList, `[0].last_connection.network_id`)

  const networkName = get(opSourceList, `[0].last_connection.network_info.name`)

  const [network, setNetwork] = useImmer({
    id: networkId,
    name: networkName,
    network_info: toJS(get(opSourceList, `[0].last_connection.network_info`))
  })

  const [validate, setValidate] = useState<'error'>()
  const { networks, refreshNetworks } = useContext(NetworkContext)

  const [defaultStatus, setDefaultStatus] = useState<
    { status: boolean; message?: string } | undefined
  >(
    // eslint-disable-next-line no-nested-ternary
    !get(opSourceList, '[0].last_connection')
      ? undefined
      : get(opSourceList, '[0].last_connection.result') === 1
      ? {
          status: true
        }
      : {
          status: false,
          message: get(opSourceList, '[0].last_connection.message')
        }
  )

  const getValue = useCallback(() => {
    if (!network.id) {
      setValidate('error')
      return undefined
    }
    const res = pick(opSourceList[0], ['type', 'url'])
    return merge(res, {
      source_id: get(opSourceList[0], 'id'),
      network_id: network.id,
      stage: 2
    })
  }, [opSourceList, network])
  return (
    <Modal
      visible
      width={800}
      title={`${get(opSourceList, `[0].name`)} 可用性测试记录`}
      onCancel={() => mutateOperation('', [])}
      okText="确认"
      onOk={() => mutateOperation('', [])}
    >
      <Form>
        <SelectWithRefresh
          name="network_id"
          placeholder="请选择网络配置"
          validateOnChange
          label={
            <AffixLabel help="测试连通性时使用的网络配置" required={false}>
              网络配置
            </AffixLabel>
          }
          value={network.id}
          onChange={(id: string, option?: Record<string, any>) => {
            setDefaultStatus(undefined)
            setNetwork((_) => {
              _.id = id
              _.name = option?.label
              _.network_info = option
            })
            setValidate(undefined)
          }}
          validateStatus={validate}
          help={
            <div>
              <div>
                {validate && <span tw="text-error">请先选择网络配置，</span>}
                <span tw="mr-0.5">详情请见</span>
                <HelpCenterLink href={networkLink} isIframe={false}>
                  网络配置选择说明文档
                </HelpCenterLink>
              </div>
              <div>
                <span tw="mr-0.5">
                  选择网络后可测试对应此网络的数据源可用性，如需选择新的网络配置，您可
                </span>
                <span tw="text-green-11 cursor-pointer" onClick={() => setNetWorkOp('create')}>
                  绑定VPC
                </span>
              </div>
            </div>
          }
          onRefresh={refreshNetworks}
          options={networks.map(({ name, id }) => ({
            label: name,
            value: id
          }))}
          searchable={false}
        />
        <Field>
          <Label>
            <AffixLabel help="检查数据源参数是否正确" required={false}>
              测试
            </AffixLabel>
          </Label>
          <DataSourcePingButton
            getValue={getValue}
            defaultStatus={defaultStatus}
            network={network}
            sourceId={get(opSourceList[0], 'id', '')}
            hasPing={!!get(opSourceList[0], 'last_connection')}
          />
        </Field>
      </Form>
    </Modal>
  )
}

export default DataSourcePingModal
