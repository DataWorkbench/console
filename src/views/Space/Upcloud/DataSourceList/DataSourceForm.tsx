import React, {
  useRef,
  useCallback,
  useEffect,
  MutableRefObject,
  useContext,
  useState,
} from 'react'
import { Field, Label, Control, Collapse } from '@QCFE/lego-ui'
import { observer } from 'mobx-react-lite'
import tw, { css, styled } from 'twin.macro'
import { get, set, trim, omit, pick, merge } from 'lodash-es'
import { useImmer } from 'use-immer'
import { useMount } from 'react-use'
import { Form, Icon } from '@QCFE/qingcloud-portal-ui'
import { useStore } from 'hooks'
import {
  AffixLabel,
  Center,
  Divider,
  SelectWithRefresh,
  TextLink,
} from 'components'
import { nameMatchRegex, strlen } from 'utils'
import HdfsNodeField from './HdfsNodeField'
import { DataSourcePingButton } from './DataSourcePing'
import { NetworkContext } from './NetworkProvider'

const ipReg =
  /(^(((2[0-4][0-9])|(25[0-5])|([01]?\d?\d))\.){3}((2[0-4][0-9])|(25[0-5])|([01]?\d?\d))$)|(^((([a-zA-Z0-9_-])+\.)+([a-zA-Z])+)$)/

const hostReg = /^([0-9a-zA-Z_.-]+(:\d{1,5})?,)*([0-9a-zA-Z_.-]+(:\d{1,5})?)?$/

const { CollapseItem } = Collapse
const { TextField, TextAreaField, NumberField, PasswordField } = Form

const hiddenStyle = css`
  ${tw`mb-0! h-0 opacity-0`}
  transition: opacity 0.5s linear, height 0.5s linear, marge 0.5s linear;
`
const visibleStyle = css`
  ${tw`mb-6 h-auto opacity-100`}
  transition: opacity 0.5s linear, height 0.5s linear, marge 0.5s linear;
`
const Root = styled('div')(() => [
  css`
    div[class='help'] {
      ${tw`text-neut-8`}
    }
    .collapse-item-content > .field {
      ${tw`block pl-6`}
    }
    .collapse-item-content {
      ${tw`pl-0`}
    }
  `,
])

// const SelectFieldRefresh = styled('div')(() => [
//   tw`relative`,
//   css`
//     .field {
//       ${tw`block pl-6 mb-6`}
//     }
//     button {
//       ${tw`mt-[26px] ml-2 absolute top-0 left-[284px]`}
//       svg {
//         ${tw`text-neut-15 fill-current`}
//       }
//     }
//   `,
// ])

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
    help: '字母、数字或下划线（_）',
    schemas: [
      {
        rule: { required: true, matchRegex: nameMatchRegex },
        help: '字母、数字或下划线（_）,不能以（_）开始结尾',
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
    placeholder: '请输入 ip 或者域名，如 1.1.1.1',
    schemas: [
      {
        rule: {
          required: true,
          matchRegex: ipReg,
          //   /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
        },
        help: '请输入 ip 或者域名，如 1.1.1.1',
        status: 'error',
      },
    ],
  },
  password: {
    name: 'password',
    autoComplete: 'off',
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
        rule: (value: string) => {
          const l = strlen(value)
          return l >= 1 && l <= 64
        },
        help: '最大长度: 64, 最小长度: 1',
        status: 'error',
      },
    ],
  },
  port: {
    name: 'port',
    label: '数据库端口号',
    schemas: [
      {
        rule: {
          required: true,
          matchRegex:
            /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/,
        },
        help: '请输入正确的端口',
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
    autoComplete: 'off',
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
  let fieldsInfo: any[] = []
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
          placeholder: '请输入 FTP 的主机别名（Host）',
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
          label: '使用 Zookeeper 的地址（ZooKeeper Quorum）',
          placeholder: '请输入',
          help: '例如：zk_host1:2181,zk_host2:2181,zk_host3:2181',
          schemas: [
            {
              rule: {
                required: true,
                matchRegex: hostReg,
              },
              help: '请输入zookeeper, 例如：zk_host1:2181,zk_host2:2181',
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
          label: '使用 ZooKeeper 的根目录（ZooKeeper Znode Parent）',
          placeholder: '请输入',
          help: '例如：/hbase',
          schemas: [
            {
              rule: { required: true, matchRegex: /^\// },
              help: '请输入znode, 例如：/hbase',
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
          // defaultValue: 9000,
        },
      ]
      break
    case 'kafka':
      fieldsInfo = [
        {
          name: 'kafka_brokers',
          label: 'Broker 连接列表（Broker List）',
          placeholder: '请输入',
          help: '例如：kafka1:9092,kafka2:9092,kafka3:9092',
          schemas: [
            {
              rule: { required: true, matchRegex: hostReg },
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

const parseRemoteData = (
  data: Record<'url' & string, any>,
  urlType: string
) => {
  const { url } = data
  if (urlType === 'hdfs') {
    const pushArr = ['name_node', 'port']
    return omit(
      merge(data, {
        url: {
          hdfs: pick(get(url, 'hdfs.nodes'), pushArr),
        },
      }),
      'url.hdfs.nodes'
    )
  }
  return data
}

/**
 * 新建场景默认值
 */
const getInitValue = (path: string) => {
  const initValues = {
    url: {
      hdfs: {
        port: 9000,
      },
    },
  }
  return get(initValues, path, '')
}
interface IFormProps {
  resInfo: {
    name: string
    desc?: string
    img?: React.ReactNode
    source_type?: number
  }
  getFormData?: MutableRefObject<() => any>
  onFieldValueChange?: (fieldValue: string, formModel: any) => void
}
const DataSourceForm = ({
  resInfo,
  getFormData,
  onFieldValueChange,
}: IFormProps) => {
  const [network, setNetWork] = useImmer<{
    type: 'vpc' | 'eip'
    id: string
    name: string
  }>({
    type: 'vpc',
    id: '',
    name: '',
  })
  const ref = useRef<Form>(null)

  const {
    dataSourceStore: { op, opSourceList },
    dmStore,
  } = useStore()

  const {
    networks,
    refreshNetworks,
    isFetching: networksIsFetching,
  } = useContext(NetworkContext)

  const urlType = resInfo.name.toLowerCase()
  const sourceInfo =
    ['update', 'view'].includes(op) &&
    opSourceList.length > 0 &&
    parseRemoteData(opSourceList[0], urlType)
  const fields = getFieldsInfo(urlType)

  const isViewMode = op === 'view'

  const [defaultStatus, setDefaultStatus] = useState<
    { status: boolean; message?: string } | undefined
  >(() => {
    if (op === 'create') {
      return undefined
    }
    return get(opSourceList, '[0].connection') === 1
      ? {
          status: true,
        }
      : {
          status: false,
        }
  })

  const [showPing, setShowPing] = useState(false)

  useMount(() => {
    if (sourceInfo) {
      setNetWork((draft) => {
        const networkId = get(
          sourceInfo,
          `url.${urlType}.network.vpc_network.network_id`
        )
        draft.id = networkId
        draft.type = networkId ? 'vpc' : 'eip'
      })
    }
  })

  const parseFormData = useCallback(
    (needValid = true) => {
      const formElem = ref?.current
      if (!needValid) {
        return formElem?.getFieldsValue()
      }
      if (formElem?.validateForm()) {
        const {
          name,
          desc,
          network_id: netWorkId,
          ...others
        } = formElem.getFieldsValue()
        let rest = omit(others, 'utype')

        if (urlType === 'hdfs') {
          const shiftArr = ['name_node', 'port']
          rest.nodes = pick(rest, shiftArr)
          rest = omit(rest, shiftArr)
        }
        return {
          name,
          desc,
          type: resInfo.source_type,
          url: {
            [urlType]: rest,
          },
        }
      }
      return null
    },
    [ref, urlType, resInfo]
  )

  useEffect(() => {
    if (getFormData) {
      getFormData.current = parseFormData
    }
  }, [getFormData, parseFormData])

  return (
    <Root>
      <Form
        tw="max-w-full!"
        layout="vertical"
        ref={ref}
        onFieldValueChange={onFieldValueChange}
      >
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
                  tw="rounded-sm border border-green-11 p-3 pb-5 bg-no-repeat bg-right-bottom"
                  className="source-item-bg"
                >
                  <div tw="font-medium flex items-center">
                    <Icon name="container" tw="mr-2" size={20} />
                    <span tw="text-green-11 text-sm leading-[22px]">
                      连接串模式
                    </span>
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
              autoComplete="off"
              defaultValue={get(sourceInfo, 'name', '')}
              label={<AffixLabel>数据源名称</AffixLabel>}
              placeholder="请输入数据源名称（自定义）"
              help={`输入名称，允许包含字母、数字 及 "_"，长度 2-64`}
              validateOnChange
              disabled={isViewMode}
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
              name="desc"
              tw="w-8/12"
              defaultValue={get(sourceInfo, 'desc', '')}
              rows={4}
              label="数据源描述"
              disabled={isViewMode}
              resize
              placeholder="请填写数据库的描述信息"
              validateOnChange
              schemas={[
                {
                  rule: (value: string) => {
                    const l = strlen(value)
                    return l <= 256
                  },
                  help: '数据库的长度在0-256字节之间',
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
                  disabled={isViewMode}
                  defaultValue={get(
                    sourceInfo,
                    `url.${urlType}.${name}`,
                    getInitValue(`url.${urlType}.${name}`)
                  )}
                  validateOnChange
                  schemas={schemas}
                  css={['port'].includes(name) ? tw`w-28` : tw`w-96`}
                  {...rest}
                  label={<AffixLabel required>{label}</AffixLabel>}
                  placeholder={placeholder}
                />
              )
            })}
            <Field>
              <Divider>
                <Center
                  tw="cursor-pointer"
                  onClick={() => setShowPing((_) => !_)}
                >
                  <Icon name={showPing ? 'chevron-up' : 'chevron-down'} />
                  <span tw="ml-2">网络连通及数据源可用性测试</span>
                </Center>
              </Divider>
            </Field>
            <SelectWithRefresh
              name="network_id"
              css={showPing ? visibleStyle : hiddenStyle}
              value={network.id}
              placeholder="请选择网络配置"
              validateOnChange
              disabled={isViewMode}
              label="网络配置"
              onChange={(v: string, option: Record<string, any>) => {
                setNetWork((draft) => {
                  draft.id = v
                  draft.name = option.label
                })
                setDefaultStatus(undefined)
              }}
              onRefresh={refreshNetworks}
              help={
                <>
                  <div>
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
                </>
              }
              options={(networks || []).map(({ name, id }) => ({
                label: name,
                value: id,
              }))}
              isLoading={networksIsFetching}
              searchable={false}
            />
            <Field css={showPing ? visibleStyle : hiddenStyle}>
              <Label>
                <AffixLabel help="检查数据源参数是否正确" required={false}>
                  数据源可用性测试
                </AffixLabel>
              </Label>
              <DataSourcePingButton
                getValue={parseFormData}
                defaultStatus={defaultStatus}
                network={network}
              />
            </Field>
          </CollapseItem>
        </CollapseWrapper>
      </Form>
    </Root>
  )
}

export default observer(DataSourceForm)
