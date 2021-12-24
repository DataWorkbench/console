import React, { useRef, useCallback, useEffect, MutableRefObject } from 'react'
import { Field, Label, Control, Collapse, RadioButton } from '@QCFE/lego-ui'
import { observer } from 'mobx-react-lite'
import tw, { css, styled } from 'twin.macro'
import { get, set, trim, flatten, omit, pick, merge } from 'lodash-es'
import { useImmer } from 'use-immer'
import { useMount } from 'react-use'
import { Form, Button, Icon, Loading } from '@QCFE/qingcloud-portal-ui'
import { useQueryClient } from 'react-query'
import {
  useStore,
  useMutationSource,
  useInfiniteQueryNetworks,
  getNetworkKey,
} from 'hooks'
import { AffixLabel, HelpCenterLink, SelectWithRefresh } from 'components'
import { nameMatchRegex, strlen } from 'utils'
import { NetworkModal } from 'views/Space/Dm/Network'
import HdfsNodeField from './HdfsNodeField'

const ipReg =
  /(^(((2[0-4][0-9])|(25[0-5])|([01]?\d?\d))\.){3}((2[0-4][0-9])|(25[0-5])|([01]?\d?\d))$)|(^((([a-zA-Z0-9_-])+\.)+([a-zA-Z])+)$)/

const hostReg = /^([0-9a-zA-Z_.-]+(:\d{1,5})?,)*([0-9a-zA-Z_.-]+(:\d{1,5})?)?$/

const { CollapseItem } = Collapse
const {
  TextField,
  TextAreaField,
  NumberField,
  PasswordField,
  RadioGroupField,
} = Form

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
    source_type: number
  }
  getFormData?: MutableRefObject<() => any>
  onFieldValueChange?: (fieldValue: string, formModel: any) => void
}
const DataSourceForm = ({
  resInfo,
  getFormData,
  onFieldValueChange,
}: IFormProps) => {
  const queryClient = useQueryClient()
  const [network, setNetWork] = useImmer<{ type: 'vpc' | 'eip'; id: string }>({
    type: 'vpc',
    id: '',
  })
  const ref = useRef<Form>(null)
  const mutation = useMutationSource()
  const networksRet = useInfiniteQueryNetworks({
    offset: 0,
    limit: 100,
  })
  const networks = flatten(
    networksRet.data?.pages.map((page) => page.infos || [])
  )
  const {
    dataSourceStore: { op, opSourceList },
    dmStore,
  } = useStore()

  const urlType = resInfo.name.toLowerCase()
  const sourceInfo =
    ['update', 'view'].includes(op) &&
    opSourceList.length > 0 &&
    parseRemoteData(opSourceList[0], urlType)
  const fields = getFieldsInfo(urlType)

  const isViewMode = op === 'view'

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
    },
    [ref, urlType]
  )

  useEffect(() => {
    if (getFormData) {
      getFormData.current = parseFormData
    }
  }, [getFormData, parseFormData])

  const hasPingRef = useRef(false)
  const handlePing = () => {
    hasPingRef.current = true
    const formData = parseFormData()
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
              name="comment"
              tw="w-8/12"
              defaultValue={get(sourceInfo, 'comment', '')}
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
            <RadioGroupField
              name="utype"
              value={network.type}
              disabled={isViewMode}
              label={<AffixLabel>网络连接方式</AffixLabel>}
              onChange={(v) =>
                setNetWork((draft) => {
                  draft.type = v
                })
              }
              help={
                <>
                  详情请见
                  <HelpCenterLink
                    href="/manual/data_up_cloud/connect/"
                    isIframe={false}
                  >
                    网络联通文档
                  </HelpCenterLink>
                </>
              }
            >
              <RadioButton value="vpc">内网（推荐）</RadioButton>
              <RadioButton value="eip">公网</RadioButton>
            </RadioGroupField>
            {network.type === 'vpc' && (
              <>
                <SelectWithRefresh
                  name="network_id"
                  value={network.id}
                  placeholder="请选择网络配置"
                  validateOnChange
                  disabled={isViewMode}
                  label={<AffixLabel>网络配置</AffixLabel>}
                  onChange={(v: string) => {
                    setNetWork((draft) => {
                      draft.id = v
                    })
                  }}
                  onRefresh={() => {
                    queryClient.invalidateQueries(getNetworkKey())
                  }}
                  help={
                    <>
                      如需选择新的网络配置，您可以
                      <span
                        tw="text-green-11 cursor-pointer"
                        onClick={() => dmStore.setNetWorkOp('create')}
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
                            onClick={() => dmStore.setNetWorkOp('create')}
                          >
                            绑定 VPC
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
                {/* <SelectField
                  name="network_id"
                  value={network.id}
                  placeholder="请选择网络配置"
                  validateOnChange
                  disabled={isViewMode}
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
                        onClick={() => dmStore.setNetWorkOp('create')}
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
                            onClick={() => dmStore.setNetWorkOp('create')}
                          >
                            绑定 VPC
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
                <Button
                  disabled={isViewMode}
                  onClick={() => {
                    queryClient.invalidateQueries(getNetworkKey())
                  }}
                >
                  <Icon name="refresh" size={20} />
                </Button> */}
              </>
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
              <Label>
                <AffixLabel help="检查数据源参数是否正确" required={false}>
                  数据源可用性测试
                </AffixLabel>
              </Label>
              <Control>
                {mutation.isLoading ? (
                  <Button
                    // loading={mutation.isLoading}
                    type="outlined"
                  >
                    <Loading size="small" tw="w-[30px]" /> 测试中
                  </Button>
                ) : (
                  <Button
                    // loading={mutation.isLoading}
                    type="outlined"
                    onClick={handlePing}
                  >
                    {hasPingRef.current ? '重新测试' : '开始测试'}
                  </Button>
                )}
              </Control>
              {mutation.isError && (
                <div
                  tw="text-red-10 flex items-center mt-2"
                  css={css`
                    svg {
                      ${tw`fill-[#CA2621] text-white`}
                    }
                  `}
                >
                  <Icon name="error" />
                  不可用，${get(mutation, 'error.message', '')}
                </div>
              )}
            </Field>
          </CollapseItem>
        </CollapseWrapper>
      </Form>
      {dmStore.networkOp === 'create' && <NetworkModal appendToBody />}
    </Root>
  )
}

export default observer(DataSourceForm)
