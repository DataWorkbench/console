import { get, merge, pick } from 'lodash-es'
import { useImmer } from 'use-immer'
import React, { useCallback, useContext, useState } from 'react'
import { Modal } from '@QCFE/qingcloud-portal-ui'
import { Field, Form, Label } from '@QCFE/lego-ui'

import { AffixLabel, SelectWithRefresh, TextLink } from 'components'
import { useStore } from 'stores'

import { DataSourcePingButton } from './DataSourcePingButton'
import { NetworkContext } from '../NetworkProvider'

export const DataSourcePingModal = () => {
  const {
    dataSourceStore: { opSourceList, mutateOperation, sourceKinds },
    dmStore,
  } = useStore()

  const sourceType = get(opSourceList, `[0].source_type`)
  const urlType = (
    sourceKinds.find((i) => i.source_type === sourceType)?.name || 'mysql'
  ).toLowerCase()
  const networkId = get(
    opSourceList,
    `[0]url.${urlType}.network.vpc_network.network_id`
  )

  const networkName = get(opSourceList, `[0].network_name`)

  const [network, setNetwork] = useImmer({
    id: networkId,
    name: networkName,
  })

  const [validate, setValidate] = useState<'error'>()
  const { networks, refreshNetworks } = useContext(NetworkContext)

  const [defaultStatus, setDefaultStatus] = useState<
    { status: boolean; message?: string } | undefined
  >(
    get(opSourceList, '[0].connection') === 1
      ? {
          status: true,
        }
      : {
          status: false,
        }
  )

  const getValue = useCallback(() => {
    if (!network.id) {
      setValidate('error')
      return undefined
    }
    const res = pick(opSourceList[0], ['source_type', 'url'])
    return merge(res, {
      url: {
        [urlType]: {
          network: {
            type: 2,
            vpc_network: {
              network_id: network.id,
            },
          },
        },
      },
    })
  }, [opSourceList, network, urlType])
  return (
    <Modal
      visible
      width={800}
      title={`${get(opSourceList, `[0].name`)} 可用性测试记录`}
      onCancel={() => mutateOperation('', [])}
      okText="确认"
    >
      <Form>
        <SelectWithRefresh
          name="network_id"
          placeholder="请选择网络配置"
          validateOnChange
          label="网络配置"
          value={network.id}
          onChange={(id: string, option?: Record<string, any>) => {
            setDefaultStatus(undefined)
            setNetwork((_) => {
              _.id = id
              _.name = option?.label
            })
            setValidate(undefined)
          }}
          validateStatus={validate}
          help={
            <div>
              <div>
                {validate && <span tw="text-error">请先选择网络配置，</span>}
                <span tw="mr-0.5">详情请见</span>
                <TextLink color="blue" type="button" to="###">
                  网络配置选择说明文档
                </TextLink>
              </div>
              <div>
                <span tw="mr-0.5">
                  选择网络后可测试对应此网络的数据源可用性，如需选择新的网络配置，您可
                </span>
                <span
                  tw="text-green-11 cursor-pointer"
                  onClick={() => dmStore.setNetWorkOp('create')}
                >
                  绑定VPC
                </span>
              </div>
            </div>
          }
          onRefresh={refreshNetworks}
          options={networks.map(({ name, id }) => ({
            label: name,
            value: id,
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
            sourceType={sourceType}
            getValue={getValue}
            defaultStatus={defaultStatus}
            network={network}
            sourceId={get(opSourceList[0], 'source_id', '')}
          />
        </Field>
      </Form>
    </Modal>
  )
}

export default DataSourcePingModal
