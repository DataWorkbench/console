import { observer } from 'mobx-react-lite'
import { Modal } from 'components/Modal'
import tw, { css } from 'twin.macro'
import { Form, Icon, Table } from '@QCFE/qingcloud-portal-ui'

import { useRef } from 'react'
import { FlexBox } from 'components/Box'
import {
  columnsRender,
  notifyColumns,
} from 'views/Space/Setting/Notify/common/constants'
import { getName } from 'views/Space/Setting/Notify/common/mappings'
import { useColumns } from '../../../../hooks/useHooks/useColumns'

interface INotifyStore {
  op: 'list' | 'update' | 'delete' | 'create'
  selected: Record<string, any>[]
  set: (params: Record<string, any>) => void
}

const { TextField, TextAreaField } = Form

const formModalStyle = css`
  &.form.is-horizon-layout {
    ${tw`pl-5`}
  }
  &.form.is-horizon-layout > .field .label {
    ${tw`w-[96px]`}
  }
  &.form.is-horizon-layout > .field .help {
    ${tw`ml-[98px]`}
  }
`

const ActionModals = observer(({ store }: { store: INotifyStore }) => {
  const { op, selected = [] } = store
  const form = useRef<Form>(null)

  const handleClose = () => {
    store.set({
      op: 'list',
      selected: [],
    })
  }
  const handleSubmit = () => {
    if (form.current?.validateFields()) {
      console.log(form.current?.getFieldsValue())
    }
  }

  const handleDelete = () => {}

  const { columns } = useColumns(
    'NOTIFY_MODAL_TABLE',
    notifyColumns.filter(({ dataIndex }) =>
      [getName('id'), getName('email')].includes(dataIndex!)
    ),
    columnsRender as any
  )

  if (op === 'list') {
    return null
  }
  if (op === 'update' || op === 'create') {
    return (
      <Modal
        visible
        title={`${op === 'update' ? '修改' : '创建'}接收人`}
        onCancel={handleClose}
        onOk={handleSubmit}
        okText={op === 'update' ? '确认' : '创建'}
      >
        <Form css={formModalStyle} ref={form}>
          <TextField
            label="接收人"
            name="receiver"
            placeholder="请输入接收人姓名"
            defaultValue={selected[0]?.receiver}
            validataOnChange
            schemas={[
              {
                rule: ['required'],
                help: '请输入接收人姓名',
                status: 'error',
              },
              {
                rule: (s: String) => {
                  return s.length <= 64
                },
                help: '接收人姓名不能超过 64 个字符',
                status: 'error',
              },
            ]}
          />
          <TextField
            label="邮箱"
            name="email"
            defaultValue={selected[0]?.email}
            placeholder="请输入接收人邮箱"
            validataOnChange
            schemas={[
              {
                rule: ['required'],
                help: '请输入接收人邮箱',
                status: 'error',
              },
            ]}
          />
          <TextAreaField
            label="备注"
            name="remark"
            defaultValue={selected[0]?.remark}
            validataOnChange
            placeholder="请输入消息接收人的备注内容"
          />
        </Form>
      </Modal>
    )
  }

  if (op === 'delete' && selected.length) {
    return (
      <Modal
        visible
        noBorder
        onCancel={handleClose}
        okText="删除"
        okType="danger"
        onOk={handleDelete}
      >
        <FlexBox>
          <Icon name="if-error-info" />
          {selected.length > 1 && (
            <div>
              <div>确定要将以下消息接收人删除吗？</div>
              <div>消息接收人删除后将无法收到告警通知消息，请谨慎操作。</div>
              <Table columns={columns} dataSource={selected} />
            </div>
          )}
          {selected.length === 1 && (
            <div>
              <div>{`确定要将消息接收人 ${selected[0]?.receiver} 移除吗？`}</div>
              <div>消息接收人删除后将无法收到告警通知消息，请谨慎操作。</div>
            </div>
          )}
        </FlexBox>
      </Modal>
    )
  }
  return null
})
export default ActionModals
