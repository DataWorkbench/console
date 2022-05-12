import { get, merge, pick } from 'lodash-es'
import React, { useCallback, useState } from 'react'
import { Modal } from '@QCFE/qingcloud-portal-ui'
import { Field, Form, Label } from '@QCFE/lego-ui'

import { AffixLabel } from 'components'
import { useStore } from 'stores'

import { DataSourcePingButton } from './DataSourcePingButton'

export const DataSourcePingModal = () => {
  const {
    dataSourceStore: { opSourceList, mutateOperation },
  } = useStore()

  const [defaultStatus] = useState<
    { status: boolean; message?: string } | undefined
  >(
    // eslint-disable-next-line no-nested-ternary
    !get(opSourceList, '[0].last_connection')
      ? undefined
      : get(opSourceList, '[0].last_connection.result') === 1
      ? {
          status: true,
        }
      : {
          status: false,
          message: get(opSourceList, '[0].last_connection.message'),
        }
  )

  const getValue = useCallback(() => {
    const res = pick(opSourceList[0], ['type', 'url'])
    return merge(res, {
      source_id: get(opSourceList[0], 'id'),
      stage: 2,
    })
  }, [opSourceList])
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
        <Field>
          <Label>
            <AffixLabel help="检查数据源参数是否正确" required={false}>
              测试
            </AffixLabel>
          </Label>
          <DataSourcePingButton
            getValue={getValue}
            defaultStatus={defaultStatus}
            sourceId={get(opSourceList[0], 'id', '')}
            hasPing={!!get(opSourceList[0], 'last_connection')}
          />
        </Field>
      </Form>
    </Modal>
  )
}

export default DataSourcePingModal
