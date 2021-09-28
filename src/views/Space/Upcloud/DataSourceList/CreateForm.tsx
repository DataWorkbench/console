import React from 'react'
import { Field, Label, Control } from '@QCFE/lego-ui'
import { observer } from 'mobx-react-lite'
import tw, { css, styled } from 'twin.macro'
import { get } from 'lodash-es'
import { Alert, Form, Button, Icon } from '@QCFE/qingcloud-portal-ui'
import { useStore } from 'hooks'

const { TextField, TextAreaField, NumberField } = Form

const PasswordFieldWrapper = styled(TextField)(() => [
  css`
    input {
      -webkit-text-security: disc;
    }
  `,
])

const compInfo = {
  database: {
    name: 'database',
    label: 'Database',
    placeholder: '请输入database信息',
    schemas: [
      { rule: { required: true }, help: '请输入database信息', status: 'error' },
      {
        rule: (value: string) => value.length >= 1 && value.length <= 64,
        help: '最大长度: 64, 最小长度: 1',
        status: 'error',
      },
    ],
  },
  host: {
    name: 'host',
    label: 'IP 地址',
    placeholder: '请输入 ip，如 1.1.1.1',
    schemas: [
      {
        rule: {
          required: true,
          // matchRegex:
          //   /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
        },
        help: '请输入 ip，如 1.1.1.1',
        status: 'error',
      },
    ],
  },
  password: {
    name: 'password',
    label: '密码',
    placeholder: '请输入密码',
    component: PasswordFieldWrapper,
    schemas: [
      { rule: { required: true }, help: '请输入密码', status: 'error' },
      {
        rule: (value: string) => value.length >= 1 && value.length <= 64,
        help: '最大长度: 64, 最小长度: 1',
        status: 'error',
      },
    ],
  },
  port: {
    name: 'port',
    label: '端口号',
    placeholder: '请输入端口信息',
    schemas: [
      { rule: { required: true }, help: '请输入端口信息', status: 'error' },
    ],
    component: NumberField,
    min: 1,
    max: 65536,
    showButton: false,
  },
  user: {
    name: 'user',
    label: '用户名',
    placeholder: '请输入用户名',
    schemas: [
      { rule: { required: true }, help: '请输入用户名', status: 'error' },
      {
        rule: (value: string) => value.length >= 1 && value.length <= 64,
        help: '最大长度: 64, 最小长度: 1',
        status: 'error',
      },
    ],
  },
}

const getFieldsInfo = (type: string) => {
  const { database, host, password, port, user } = compInfo
  let fieldsInfo: {
    name: string
    label?: string
    placeholder?: string
    schemas?: any
    component?: any
  }[] = []
  switch (type) {
    case 'clickhouse':
    case 'mysql':
    case 'postgresql':
      fieldsInfo = [database, host, password, port, user]
      break
    case 'ftp':
      fieldsInfo = [host, port]
      break
    case 'hbase':
      fieldsInfo = [
        {
          name: 'hosts',
          label: 'hosts',
          placeholder: 'The host lists of HBase',
          schemas: [
            { rule: { required: true }, help: '请输入hosts', status: 'error' },
            {
              rule: (value: string) =>
                value.length >= 1 && value.length <= 1024,
              help: '最大长度: 1024, 最小长度: 1',
              status: 'error',
            },
          ],
        },
        {
          name: 'znode',
          label: 'znode',
          placeholder: 'The hbase Zookeeper Node',
          schemas: [
            { rule: { required: true }, help: '请输入znode', status: 'error' },
            {
              rule: (value: string) =>
                value.length >= 1 && value.length <= 1024,
              help: '最大长度: 1024, 最小长度: 1',
              status: 'error',
            },
          ],
        },
        {
          name: 'zookeeper',
          label: 'zookeeper',
          placeholder: 'The hbase Zookeeper',
          schemas: [
            {
              rule: { required: true },
              help: '请输入zookeeper',
              status: 'error',
            },
            {
              rule: (value: string) =>
                value.length >= 1 && value.length <= 1024,
              help: '最大长度: 1024, 最小长度: 1',
              status: 'error',
            },
          ],
        },
      ]
      break
    case 'hdfs':
      fieldsInfo = [host, port]
      break
    case 'kafka':
      fieldsInfo = [
        {
          name: 'kafkabrokers',
          label: 'kafkabrokers',
          placeholder: 'The kafak brokers.',
          schemas: [
            {
              rule: { required: true },
              help: '请输入kafkabrokers',
              status: 'error',
            },
            {
              rule: (value: string) =>
                value.length >= 1 && value.length <= 1024,
              help: '最大长度: 1024, 最小长度: 1',
              status: 'error',
            },
          ],
        },
      ]
      break
    case 's3':
      fieldsInfo = [
        {
          name: 'accesskey',
          label: 'accesskey',
          placeholder: 'The s3 AccessKey',
          schemas: [
            {
              rule: { required: true },
              help: '请输入accesskey',
              status: 'error',
            },
            {
              rule: (value: string) =>
                value.length >= 1 && value.length <= 1024,
              help: '最大长度: 1024, 最小长度: 1',
              status: 'error',
            },
          ],
        },
        {
          name: 'endpoint',
          label: 'endpoint',
          placeholder: 'The s3 EndPoint',
          schemas: [
            {
              rule: { required: true },
              help: '请输入endpoint',
              status: 'error',
            },
            {
              rule: (value: string) =>
                value.length >= 1 && value.length <= 1024,
              help: '最大长度: 1024, 最小长度: 1',
              status: 'error',
            },
          ],
        },
        {
          name: 'secretkey',
          label: 'secretkey',
          placeholder: 'The s3 SecretKey',
          schemas: [
            {
              rule: { required: true },
              help: '请输入secretkey',
              status: 'error',
            },
            {
              rule: (value: string) =>
                value.length >= 1 && value.length <= 1024,
              help: '最大长度: 1024, 最小长度: 1',
              status: 'error',
            },
          ],
        },
      ]
      break
    default:
      break
  }
  return fieldsInfo
}

interface CreateFormProps {
  kind: {
    name: string
    desc?: string
  }
}
const CreateForm = observer(
  ({ resInfo }: CreateFormProps, ref) => {
    const {
      dataSourceStore: { op, opSourceList },
    } = useStore()
    const sourceInfo =
      op === 'update' && opSourceList.length > 0 && opSourceList[0]
    const urlType = resInfo.name.toLowerCase()
    const fields = getFieldsInfo(urlType)

    return (
      <div>
        <Alert
          message={
            <div>
              数据源使用需要保证对应的资源组和数据源之间是可以联通的。请参考
              <a href="###" tw="text-link">
                网络解决方案。
              </a>
            </div>
          }
          type="warning"
          closable
          tw="mb-3"
        />
        <Form layout="vertical" ref={ref}>
          <Field>
            <Label>数据源类型</Label>
            <Control tw="w-60">
              <div tw="rounded-sm border border-green-11 p-2">
                <div tw="font-medium flex items-center">
                  <Icon name="container" tw="mr-1" />
                  <span tw="text-green-11">{resInfo.name}</span>
                </div>
                <div tw="text-neut-8">{resInfo.desc}</div>
              </div>
            </Control>
          </Field>
          <TextField
            name="name"
            defaultValue={get(sourceInfo, 'name', '')}
            label={
              <>
                <span tw="text-red-10 mr-1">*</span>数据源名称
              </>
            }
            placeholder={`输入名称，允许包含字母、数字 及 "_"，长度 2-128`}
            validateOnChange
            schemas={[
              {
                rule: (v) => /^(?!_)(?!.*?_$)[a-zA-Z0-9_]{2,128}$/.test(v),
                help: '允许包含字母、数字 及 "_"，长度 2-128',
                status: 'error',
              },
            ]}
          />
          <TextAreaField
            name="comment"
            defaultValue={get(sourceInfo, 'comment', '')}
            rows={3}
            label={
              <>
                <span css={[{ color: '#CF3B37' }, tw`mr-1`]} />
                数据源描述
              </>
            }
            placeholder="请填写数据库的描述信息"
            validateOnChange
            schemas={[
              {
                rule: { maxLength: 256 },
                help: '请填写数据库的描述信息',
                status: 'error',
              },
            ]}
          />
          {fields.map(
            ({
              name,
              label,
              placeholder,
              component,
              schemas = [],
              ...rest
            }) => {
              const FieldComponent = component || TextField
              return (
                <FieldComponent
                  key={name}
                  name={name}
                  defaultValue={get(sourceInfo, `url.${urlType}.${name}`, '')}
                  validateOnChange
                  schemas={schemas}
                  {...rest}
                  label={
                    <>
                      <span css={[{ color: '#CF3B37' }, tw`mr-1`]}>*</span>
                      {label}
                    </>
                  }
                  placeholder={placeholder}
                />
              )
            }
          )}
          <Field>
            <Label>连通性测试</Label>
            <Control>
              <Button type="outlined">
                <Icon name="changing-over" />
                开始测试
              </Button>
            </Control>
          </Field>
        </Form>
      </div>
    )
  },
  {
    forwardRef: true,
  }
)

export default CreateForm
