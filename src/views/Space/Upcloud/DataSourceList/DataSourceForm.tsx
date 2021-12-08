import React, { useRef, useCallback, useEffect, MutableRefObject } from 'react'
import { Field, Label, Control, Collapse, RadioButton } from '@QCFE/lego-ui'
import { observer } from 'mobx-react-lite'
import tw, { css, styled } from 'twin.macro'
import { get, set, trim, flatten, omit, pick } from 'lodash-es'
import { useImmer } from 'use-immer'
import { useMount } from 'react-use'
import { Form, Button, Icon } from '@QCFE/qingcloud-portal-ui'
import { useStore, useMutationSource, useInfiniteQueryNetworks } from 'hooks'
import { AffixLabel, Icons } from 'components'
import { nameMatchRegex, strlen, getHelpCenterLink } from 'utils'
import { NetworkModal } from 'views/Space/Dm/Network'
import HdfsNodeField from './HdfsNodeField'

const { CollapseItem } = Collapse
const {
  TextField,
  TextAreaField,
  NumberField,
  PasswordField,
  RadioGroupField,
  SelectField,
} = Form

const Root = styled('div')(() => [
  css`
    .collapse-item-content > .field {
      ${tw`block pl-6`}
    }
    .collapse-item-content {
      ${tw`pl-0`}
    }
  `,
])

const CollapseWrapper = styled(Collapse)(() => [
  tw`w-full border-0`,
  css`
    .collapse-item > .collapse-item-label {
      box-shadow: inset 0px -1px 0px #e4ebf1;
      ${tw`border-0 h-[52px] flex items-center justify-between`}
      .icon {
        ${tw`relative top-0 right-0`}
      }
    }
  `,
])

const compInfo = {
  database: {
    name: 'database',
    label: '数据库名称（Database Name）',
    placeholder: '请输入数据库名称（Database Name）',
    schemas: [
      {
        rule: { required: true },
        help: '请输入数据库名称（Database Name）',
        status: 'error',
      },
      {
        rule: (value: string) => strlen(value) >= 1 && strlen(value) <= 64,
        help: '最大长度: 64, 最小长度: 1',
        status: 'error',
      },
    ],
  },
  host: {
    name: 'host',
    label: '数据库 IP 地址',
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
    label: '密码（Password）',
    placeholder: '请输入数据库密码（Password）',
    component: PasswordField,
    schemas: [
      {
        rule: { required: true },
        help: '请输入数据库密码（Password）',
        status: 'error',
      },
      {
        rule: (value: string) => strlen(value) >= 1 && strlen(value) <= 64,
        help: '最大长度: 64, 最小长度: 1',
        status: 'error',
      },
    ],
  },
  port: {
    name: 'port',
    label: '数据库端口号',
    // placeholder: '请输入端口信息',
    schemas: [
      {
        rule: {
          required: true,
          matchRegex:
            /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/,
        },
        help: '请输入端口信息',
        status: 'error',
      },
    ],
    validateOnChange: true,
    component: NumberField,
    min: 1,
    max: 65536,
    showButton: false,
  },
  user: {
    name: 'user',
    label: '用户名（User Name）',
    placeholder: '请输入数据库用户名（User Name）',
    schemas: [
      {
        rule: { required: true },
        help: '请输入数据库用户名（User Name）',
        status: 'error',
      },
      {
        rule: (value: string) => strlen(value) >= 1 && strlen(value) <= 64,
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
    label?: string | React.ReactNode
    placeholder?: string
    schemas?: any
    component?: any
    defaultValue?: string | number
    validateOnBlur?: boolean
  }[] = []
  let pwd = { name: '' }
  switch (type) {
    case 'clickhouse':
    case 'mysql':
    case 'postgresql':
      fieldsInfo = [host, port, database, user, password]
      break
    case 'ftp':
      pwd = { ...password }
      set(pwd, 'schemas[0].help', '请输入密码')
      fieldsInfo = [
        {
          ...host,
          label: '主机别名（Host）',
          placeholder: '请输入 FTP 的主机别名(（Host）',
        },
        {
          ...port,
          label: '端口（Port）',
        },
        { ...user, placeholder: '请输入用户名' },
        { ...pwd, placeholder: '请输入密码' },
      ]
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
              rule: (value: string) => {
                const l = strlen(value)
                return l >= 1 && l <= 1024
              },
              help: '最大长度: 1024, 最小长度: 1',
              status: 'error',
            },
          ],
        },
        {
          name: 'z_node',
          label: 'Znode',
          placeholder: 'The hbase Zookeeper Node',
          schemas: [
            { rule: { required: true }, help: '请输入znode', status: 'error' },
            {
              rule: (value: string) => {
                const l = strlen(value)
                return l >= 1 && l <= 1024
              },
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
          name: 'name_node',
          label: '主节点主机名（NameNode Host）',
          placeholder: '请输入主节点主机名（NameNode Host）',
        },
        {
          ...port,
          label: '端口（Port）',
          defaultValue: '9000',
        },
      ]
      break
    case 'kafka':
      fieldsInfo = [
        {
          name: 'kafka_brokers',
          label: 'Broker 连接列表（Broker List）',
          placeholder: 'The kafak brokers.',
          schemas: [
            {
              rule: { required: true },
              help: '请输入kafkabrokers',
              status: 'error',
            },
            {
              rule: (value: string) => {
                const l = strlen(value)
                return l >= 1 && l <= 1024
              },
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

interface IFormProps {
  resInfo: {
    name: string
    desc?: string
    img?: React.ReactNode
    source_type: number
  }
  getFormData: MutableRefObject<() => any>
}
const DataSourceForm = ({ resInfo, getFormData }: IFormProps) => {
  const [network, setNetWork] = useImmer<{ type: 'vpc' | 'eip'; id: string }>({
    type: 'vpc',
    id: '',
  })
  const ref = useRef<Form>(null)
  const mutation = useMutationSource()
  const networksRet = useInfiniteQueryNetworks({
    offset: 0,
    limit: 10,
  })
  const networks = flatten(
    networksRet.data?.pages.map((page) => page.infos || [])
  )
  const {
    dataSourceStore: { op, opSourceList },
    dmStore,
  } = useStore()
  const sourceInfo =
    op === 'update' && opSourceList.length > 0 && opSourceList[0]
  const urlType = resInfo.name.toLowerCase()
  const fields = getFieldsInfo(urlType)

  useMount(() => {
    if (op === 'update') {
      setNetWork((draft) => {
        draft.id = get(
          sourceInfo,
          `url.${urlType}.network.vpc_network.network_id`
        )
      })
    }
  })

  const getValidFormData = useCallback(() => {
    const formElem = ref?.current
    if (formElem?.validateForm()) {
      const {
        name,
        comment,
        network_id: networkId,
        ...others
      } = formElem.getFieldsValue()
      let rest = omit(others, 'utype')
      if (networkId) {
        rest.network = {
          type: 2,
          vpc_network: {
            network_id: networkId,
          },
        }
      } else {
        rest.network = {
          type: 1,
        }
      }
      if (urlType === 'hdfs') {
        const shiftArr = ['name_node', 'port']
        rest.nodes = pick(rest, shiftArr)
        rest = omit(rest, shiftArr)
      }
      const data = {
        name,
        comment,
        url: {
          [urlType]: rest,
        },
      }
      return data
    }
    return null
  }, [ref, urlType])

  useEffect(() => {
    if (getFormData) {
      getFormData.current = getValidFormData
    }
  }, [getFormData, getValidFormData])

  const handlePing = () => {
    const formData = getValidFormData()
    if (formData) {
      mutation.mutate(
        {
          op: 'ping',
          source_type: resInfo.source_type,
          url: formData.url,
        },
        {
          onSuccess: () => {},
          onError: () => {},
        }
      )
    }
  }

  return (
    <Root>
      <Form tw="max-w-full!" layout="vertical" ref={ref}>
        <CollapseWrapper defaultActiveKey={['p0', 'p1']}>
          <CollapseItem
            key="p0"
            label={
              <div
                tw="flex items-center"
                css={css`
                  & > span.icon {
                    ${tw`relative top-0 right-0 mr-2`}
                  }
                `}
              >
                <Icon name="file" />
                基本信息
              </div>
            }
          >
            <Field>
              <Label>
                <AffixLabel
                  help="数据源是大数据工作台用于数据处理的出入口,数据源采用连接串和云实例两种模式, 目前暂时只支持连接串模式。"
                  required={false}
                >
                  数据源连接方式
                </AffixLabel>
              </Label>
              <Control tw="w-60">
                <div
                  tw="rounded-sm border border-green-11 p-2 bg-no-repeat bg-right-bottom"
                  className="source-item-bg"
                >
                  <div tw="font-medium flex items-center">
                    <Icon name="container" tw="mr-1" />
                    <span tw="text-green-11">连接串模式</span>
                  </div>
                  <div tw="text-neut-8">
                    连接串模式是通过IP端口用户名密码进行连接的方式。
                  </div>
                </div>
              </Control>
            </Field>
            <TextField
              name="name"
              tw="w-80"
              defaultValue={get(sourceInfo, 'name', '')}
              label={<AffixLabel>数据源名称</AffixLabel>}
              placeholder="请输入数据源名称（自定义）"
              help={`输入名称，允许包含字母、数字 及 "_"，长度 2-64`}
              validateOnChange
              schemas={[
                {
                  rule: { matchRegex: nameMatchRegex },
                  help: '允许包含字母、数字 及 "_"，长度 2-64',
                  status: 'error',
                },
                {
                  rule: (value: string) => {
                    const l = strlen(value)
                    return l >= 2 && l <= 64
                  },
                  help: '最小长度2,最大长度64',
                  status: 'error',
                },
              ]}
            />
            <TextAreaField
              name="comment"
              tw="w-8/12"
              defaultValue={get(sourceInfo, 'comment', '')}
              rows={4}
              label="数据源描述"
              resize
              placeholder="请填写数据库的描述信息"
              validateOnChange
              schemas={[
                {
                  rule: (value: string) => {
                    const l = strlen(value)
                    return l <= 256
                  },
                  help: '请填写数据库的描述信息',
                  status: 'error',
                },
              ]}
            />
          </CollapseItem>
          <CollapseItem
            key="p1"
            label={
              <div
                tw="flex items-center"
                css={css`
                  & > span.icon {
                    ${tw`relative top-0 right-0 mr-2`}
                  }
                `}
              >
                <Icon name="changing-over" />
                连接信息
              </div>
            }
          >
            <RadioGroupField
              name="utype"
              value={network.type}
              label={<AffixLabel>网络连接方式</AffixLabel>}
              onChange={(v) =>
                setNetWork((draft) => {
                  draft.type = v
                })
              }
              help={
                <>
                  详情请见
                  <a
                    href={getHelpCenterLink(
                      '/bigdata/dataplat/manual/data_up_cloud/connect/'
                    )}
                    tw="text-green-11 hover:text-green-11"
                    target="_blank"
                    rel="noreferrer"
                  >
                    网络联通文档
                    <Icons
                      name="direct"
                      tw="text-green-11 fill-current"
                      size={14}
                    />
                  </a>
                </>
              }
            >
              <RadioButton value="vpc">内网（推荐）</RadioButton>
              <RadioButton value="eip">公网</RadioButton>
            </RadioGroupField>
            {network.type === 'vpc' && (
              <SelectField
                name="network_id"
                value={network.id}
                placeholder="请选择网络配置"
                validateOnChange
                label={<AffixLabel>网络配置</AffixLabel>}
                onChange={(v: string) => {
                  setNetWork((draft) => {
                    draft.id = v
                  })
                }}
                help={
                  <>
                    如需选择新的网络配置，您可以
                    <span
                      tw="text-green-11 cursor-pointer"
                      onClick={() => dmStore.setOp('create')}
                    >
                      绑定VPC
                    </span>
                  </>
                }
                schemas={[
                  {
                    rule: {
                      required: true,
                      isExisty: false,
                    },
                    status: 'error',
                    help: (
                      <>
                        请选择网络, 如没有可选择的网络配置，您可以
                        <span
                          tw="text-green-11 cursor-pointer"
                          onClick={() => dmStore.setOp('create')}
                        >
                          绑定VPC
                        </span>
                      </>
                    ),
                  },
                ]}
                options={networks.map(({ name, id }) => ({
                  label: name,
                  value: id,
                }))}
                isLoading={networksRet.isFetching}
                isLoadingAtBottom
                searchable={false}
                onMenuScrollToBottom={() => {
                  if (networksRet.hasNextPage) {
                    networksRet.fetchNextPage()
                  }
                }}
                bottomTextVisible
              />
            )}
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
                  <HdfsNodeField
                    key={name}
                    name={name}
                    validateOnBlur
                    label={<AffixLabel required>{label}</AffixLabel>}
                    defaultValue={get(sourceInfo, `url.${urlType}.${name}`)}
                    schemas={[
                      {
                        rule: (o) => {
                          if (trim(o.name_node) === '') {
                            return false
                          }
                          if (
                            !/^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/.test(
                              o.port
                            )
                          ) {
                            return false
                          }
                          return true
                        },
                        help: '格式不正确,请输入 Name_node Port，多条配置之间换行输入',
                        status: 'error',
                      },
                    ]}
                  />
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
                  label={<AffixLabel required>{label}</AffixLabel>}
                  placeholder={placeholder}
                />
              )
            })}
            <Field>
              <Label>
                <AffixLabel help="检查数据源参数是否正确" required={false}>
                  数据源可用性测试
                </AffixLabel>
              </Label>
              <Control>
                <Button
                  disabled={mutation.isLoading}
                  type="outlined"
                  onClick={handlePing}
                >
                  开始测试
                </Button>
              </Control>
            </Field>
          </CollapseItem>
        </CollapseWrapper>
      </Form>
      {dmStore.op === 'create' && <NetworkModal appendToBody />}
    </Root>
  )
}

export default observer(DataSourceForm)
