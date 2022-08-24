import { Form } from '@QCFE/lego-ui'
import { compose, connect } from 'utils/functions'
import KVTextArea from './KVTextArea'
import KVTextArea1 from './KVTextArea1'

const KVTextAreaField = (Form as any).getFormField(KVTextArea)
const KVTextAreaField1 = (Form as any).getFormField(KVTextArea1)

// TODO: 做到 KVTextArea 组件里，动态判断 props.value  isString || isArray
const getKvTextAreaFieldByMap = (mapProps: (p: Record<string, any>) => Record<string, any>) =>
  compose((Form as any).getFormField, connect(mapProps))(KVTextArea)

export default KVTextArea
export { KVTextArea, KVTextAreaField, getKvTextAreaFieldByMap, KVTextAreaField1 }
