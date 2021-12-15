import { forwardRef, useState } from 'react'
import { Input, Form } from '@QCFE/lego-ui'

interface IHdfsNodeField {
  value?: { name_node: string; port: number }
  onChange?: (o: any) => void
  onBlur?: (o: any) => void
}

const HdfsNodeField = forwardRef((props: IHdfsNodeField, ref) => {
  const { value, onChange, onBlur } = props
  const [nameNode, setNameNode] = useState(value?.name_node || '')
  const [port, setPort] = useState(value?.port || '')

  const handleOnBlur = () => {
    if (onBlur) {
      onBlur({
        name_node: nameNode,
        port,
      })
    }
  }

  return (
    <div tw="flex space-x-2">
      <Input
        autocomplete="off"
        type="text"
        ref={ref}
        tw="w-full max-w-[328px]"
        onBlur={handleOnBlur}
        defaultValue={nameNode}
        onChange={(e, v: any) => {
          setNameNode(v)
          if (onChange) {
            onChange({
              name_node: v,
              port,
            })
          }
        }}
      />
      <Input
        autocomplete="off"
        type="text"
        tw="w-24"
        onBlur={handleOnBlur}
        defaultValue={port}
        onChange={(e, v: any) => {
          setPort(v)
          if (onChange) {
            onChange({
              name_node: nameNode,
              port: +v,
            })
          }
        }}
      />
    </div>
  )
})

export default Form.getFormField(HdfsNodeField)
