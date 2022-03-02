import { Form } from '@QCFE/lego-ui'
import { compose, connect } from 'utils/functions'
import KVTextArea from './KVTextArea'

const KVTextAreaField = (Form as any).getFormField(KVTextArea)

// TODO: 做到 KVTextArea 组件里，动态判断 props.value  isString || isArray
const getKvTextAreaFieldByMap = (
  mapProps: (p: Record<string, any>) => Record<string, any>
) => compose((Form as any).getFormField, connect(mapProps))(KVTextArea)

export default KVTextArea
export { KVTextArea, KVTextAreaField, getKvTextAreaFieldByMap }
