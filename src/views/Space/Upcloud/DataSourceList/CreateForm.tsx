import { useRef } from 'react'
import { Field, Label, Control } from '@QCFE/lego-ui'
import { useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import tw, { css, styled } from 'twin.macro'
import { get, omit } from 'lodash-es'
import { useImmer } from 'use-immer'
import dayjs from 'dayjs'
import { Alert, Form, Button, Icon, Loading } from '@QCFE/qingcloud-portal-ui'
import { useStore, useMutationSource } from 'hooks'
import { FlexBox } from 'components'
import MutilInputField from './MutilInputField'

const { TextField, TextAreaField, NumberField, PasswordField } = Form

const PingTable = styled('table')(() => [
  tw`w-full border-l border-t border-neut-2 mb-2`,
  css`
    th,
    td {
      ${tw`border-r border-b border-neut-2 px-4 py-3 `}
    }
    thead {
      ${tw`bg-neut-1 `}
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
    component: PasswordField,
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
          name: 'zookeeper',
          label: 'Zookeeper',
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
        {
          name: 'znode',
          label: 'Znode',
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
      ]
      break
    case 'hdfs':
      fieldsInfo = [
        {
          name: 'nodes',
          label: 'Nodes',
        },
      ]
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
      break
    default:
      break
  }
  return fieldsInfo
}

interface CreateFormProps {
  resInfo: {
    name: string
    desc?: string
  }
}
const CreateForm = observer(
  ({ resInfo }: CreateFormProps, ref) => {
    const { regionId, spaceId } =
      useParams<{ regionId: string; spaceId: string }>()
    const [pingState, setPingState] = useImmer({
      state: '',
      time: '',
      msg: '',
    })
    const mutation = useMutationSource()
    const {
      dataSourceStore: { op, opSourceList },
    } = useStore()
    const sourceInfo =
      op === 'update' && opSourceList.length > 0 && opSourceList[0]
    const urlType = resInfo.name.toLowerCase()
    const fields = getFieldsInfo(urlType)
    const multiFiledRef = useRef()

    const handlePing = () => {
      const formElem = ref?.current
      if (formElem?.validateForm()) {
        const fieldsValue: { [k: string]: any } = formElem.getFieldsValue()
        let url = {}
        if (urlType === 'hdfs') {
          const nodes = multiFiledRef?.current.getValue()
          url = {
            [urlType]: {
              nodes: nodes.map((n) => ({ namenode: n[0], port: +n[1] })),
            },
          }
        } else {
          url = {
            [urlType]: omit(fieldsValue, ['name', 'comment']),
          }
        }
        const params = {
          op: 'ping',
          regionId,
          spaceId,
          sourcetype: resInfo.name,
          url,
        }
        setPingState((draft) => {
          draft.time = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
          draft.state = 'loading'
          draft.msg = ''
        })
        mutation.mutate(params, {
          onSuccess: () => {
            setPingState((draft) => {
              draft.state = 'passed'
            })
          },
          onError: (err) => {
            setPingState((draft) => {
              draft.state = 'failed'
              draft.msg = err.message
            })
          },
        })
      }
    }

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
        <Form tw="max-w-lg!" layout="vertical" ref={ref}>
          <Field>
            <Label>数据源连接方式</Label>
            <Control tw="w-60">
              <div tw="rounded-sm border border-green-11 p-2">
                <div tw="font-medium flex items-center">
                  <Icon name="container" tw="mr-1" />
                  <span tw="text-green-11">连接串模式</span>
                </div>
                <div tw="text-neut-8">
                  这是一个很长很长很长很长的关于模式的描述信息。
                </div>
              </div>
            </Control>
          </Field>
          <TextField
            name="name"
            tw="w-80"
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
          {fields.map((field) => {
            const {
              name,
              label,
              placeholder,
              component,
              schemas = [],
              ...rest
            } = field
            const FieldComponent = component || TextField
            if (name === 'nodes') {
              return (
                <MutilInputField ref={multiFiledRef} key={name} field={field} />
              )
            }
            return (
              <FieldComponent
                key={name}
                name={name}
                defaultValue={get(sourceInfo, `url.${urlType}.${name}`, '')}
                validateOnChange
                schemas={schemas}
                css={['port'].includes(name) ? tw`w-28` : tw`w-80`}
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
          })}
          <Field>
            <Label>连通性测试</Label>
            <Control>
              <Button
                disabled={mutation.isLoading}
                type="outlined"
                onClick={handlePing}
              >
                <Icon name="changing-over" />
                开始测试
              </Button>
            </Control>
          </Field>
        </Form>
        {pingState.state !== '' && (
          <PingTable>
            <thead>
              <tr>
                <th tw="w-1/3">连通性状态</th>
                <th tw="w-1/3">测试时间</th>
                <th tw="w-1/3">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {(() => {
                    if (pingState.state === 'loading') {
                      return (
                        <FlexBox tw="space-x-1 items-center text-green-13">
                          <Loading size="small" noWrapper />
                          <span>测试中</span>
                        </FlexBox>
                      )
                    }
                    if (pingState.state === 'passed') {
                      return (
                        <FlexBox tw="space-x-1 items-center text-green-13">
                          <Icon name="success" type="coloured" />
                          <span>通过</span>
                        </FlexBox>
                      )
                    }
                    if (pingState.state === 'failed') {
                      return (
                        <FlexBox tw="space-x-1 items-center text-red-10">
                          <Icon
                            name="failure"
                            color={{ primary: '#fff', secondary: '#CA2621' }}
                          />
                          <span>不通</span>
                        </FlexBox>
                      )
                    }
                    return null
                  })()}
                </td>
                <td>{pingState.time}</td>
                <td>{pingState.msg}</td>
              </tr>
            </tbody>
          </PingTable>
        )}
      </div>
    )
  },
  {
    forwardRef: true,
  }
)

export default CreateForm
