import { Form, Icon } from '@QCFE/lego-ui'
import { FlexBox } from 'components'
import { DarkButton } from '../../styled'

const { TextField } = Form
const StreamJAR = () => {
  return (
    <div tw="pl-5">
      <FlexBox tw="pt-4 space-x-2">
        <DarkButton type="grey">
          <Icon name="data" type="dark" />
          保存
        </DarkButton>
        <DarkButton type="primary">
          <Icon name="export" />
          发布
        </DarkButton>
      </FlexBox>
      <Form tw="mt-5" layout="vertical">
        <TextField
          name="jar"
          label="引用Jar包"
          placeholder="请选择要引用的 Jar 包资源"
          help="如需选择新的资源，可以在资源管理中"
        />
        <TextField
          name="func"
          label="运行函数入口"
          placeholder="请输入运行函数入口"
        />
        <TextField name="args" label="运行参数" placeholder="请输入运行参数" />
        <TextField
          name="accessKey"
          label="AccessKey"
          placeholder="请输入 AccessKey，对象存储"
        />
        <TextField
          name="secretKey"
          label="SecretKey"
          placeholder="请输入 SecretKey"
        />
        <TextField
          name="endPoint"
          label="EndPoint"
          placeholder="请输入 EndPoint"
        />
      </Form>
    </div>
  )
}

export default StreamJAR
