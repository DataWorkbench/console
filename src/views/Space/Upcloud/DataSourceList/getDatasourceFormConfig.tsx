import { get, set, trim } from 'lodash-es'
import { HelpCenterLink } from 'components/Link'
import tw, { css, styled } from 'twin.macro'
import { strlen } from 'utils/convert'
import { InputField } from 'components/Input'
import { Form } from '@QCFE/lego-ui'
import { getKvTextAreaFieldByMap } from 'components/KVTextArea'
import { ReactElement } from 'react'
import {
  compInfo,
  ftpConnectionMode,
  ftpProtocol,
  hadoopLink,
  hbaseLink,
  ipReg,
  SourceType,
} from './constant'

const { TextAreaField, TextField, SelectField, NumberField, RadioGroupField } =
  Form

const TextAreaWrapper = styled(TextAreaField)(() => [
  css`
    & textarea.textarea {
      ${tw`w-auto min-w-[550px]! min-h-[160px]`}
    }
  `,
])

const division = ':'
const mapProps = (props: Record<string, any>) => {
  return {
    ...props,
    theme: 'light',
    addText: '添加地址',
  }
}

const KVTextAreaFieldWrapper = styled(getKvTextAreaFieldByMap(mapProps))(() => [
  css`
    & textarea.textarea {
      ${tw`w-auto! min-w-[500px]! min-h-[100px]`}
    }
  `,
])

const getFieldsInfo = (type: SourceType, filters?: Set<string>) => {
  const { database, host, password, port, user, auth } = compInfo
  let fieldsInfo: any[] = []
  let pwd = { name: '' }
  switch (type) {
    case SourceType.Mysql:
      fieldsInfo = [
        {
          fieldType: 'dbUrl',
          label: 'JDBC 连接 URL（IP 地址 : 端口 / Database）',
          labelClassName: 'label-required',
          name: '__dbUrl',
          space: [':', '/'],
          items: [
            {
              ...host,
              label: null,
              help: '例：jdbc:mysql://127.0.0.1:3306/testdb',
              component: InputField,
              prefix: 'jdbc:mysql://',
              css: tw`w-[328px]`,
            },
            {
              ...port,
              label: null,
              placeholder: '端口号',
            },
            {
              ...database,
              label: null,
              help: '允许包含字母、数字 及 “_”',
              css: tw`w-60`,
            },
          ],
        },
        user,
        password,
      ]
      break
    case SourceType.PostgreSQL:
      fieldsInfo = [
        {
          fieldType: 'dbUrl',
          label: 'JDBC 连接 URL（IP 地址 : 端口 / Database）',
          labelClassName: 'label-required',
          name: '__dbUrl',
          space: [':', '/'],
          items: [
            {
              ...host,
              label: null,
              help: '例：jdbc:postgresql://127.0.0.1:5432/testdb',
              component: InputField,
              prefix: 'jdbc:postgresql://',
              css: tw`w-[328px]`,
            },
            {
              ...port,
              label: null,
              placeholder: '端口号',
            },
            {
              ...database,
              label: null,
              help: '允许包含字母、数字 及 “_”',
              css: tw`w-60`,
            },
          ],
        },
        user,
        password,
      ]
      break
    case SourceType.TiDB:
      fieldsInfo = [
        {
          fieldType: 'dbUrl',
          label: 'JDBC 连接 URL（IP 地址 : 端口 / Database）',
          labelClassName: 'label-required',
          name: '__dbUrl',
          space: [':', '/'],
          items: [
            {
              ...host,
              label: null,
              help: '例：jdbc:tidb://1.1.1.1',
              component: InputField,
              placeholder: '请输入 IP 地址',
              prefix: 'jdbc:tidb://',
            },
            {
              ...port,
              label: null,
              placeholder: '端口号',
            },
            {
              ...database,
              label: null,
              help: '允许包含字母、数字 及 “_”',
              css: tw`w-60`,
            },
          ],
        },
        user,
        password,
      ]
      break
    case SourceType.Oracle:
      fieldsInfo = [
        {
          fieldType: 'dbUrl',
          label: 'JDBC 连接 URL（IP 地址 : 端口 / Database）',
          labelClassName: 'label-required',
          name: '__dbUrl',
          space: [':', ':'],
          items: [
            {
              ...host,
              label: null,
              help: '例：jdbc:oracle:thin:@127.0.0.1:1521:testdb',
              component: InputField,
              prefix: 'jdbc:oracle:thin:@',
              css: tw`w-[328px]`,
            },
            {
              ...port,
              label: null,
              placeholder: '端口号',
            },
            {
              ...database,
              label: null,
              help: '允许包含字母、数字 及 “_”',
              css: tw`w-60`,
            },
          ],
        },
        user,
        password,
      ]
      break
    case SourceType.SqlServer:
      fieldsInfo = [
        {
          fieldType: 'dbUrl',
          label: ' JDBC 连接 URL（IP 地址 : 端口 ； DatabaseName）',
          labelClassName: 'label-required',
          name: '__dbUrl',
          space: [':', ';'],
          items: [
            {
              ...host,
              label: null,
              help: '例：jdbc:jtds:sqlserver://0.0.0.1:1433;DatabaseName=testdb',
              component: InputField,
              placeholder: '请输入 IP 地址',
              prefix: 'jdbc:jtds:sqlserver://',
              css: tw`w-[328px]`,
            },
            {
              ...port,
              label: null,
              placeholder: '端口号',
            },
            {
              ...database,
              label: null,
              component: InputField,
              prefix: 'DatabaseName=',
              placeholder: 'Database',
              help: '允许包含字母、数字 及 “_”',
              css: tw`w-60`,
            },
          ],
        },
        user,
        password,
      ]
      break
    case SourceType.DB2:
      fieldsInfo = [
        {
          fieldType: 'dbUrl',
          label: 'JDBC 连接 URL（IP 地址 : 端口 / DatabaseName）',
          labelClassName: 'label-required',
          name: '__dbUrl',
          space: [':', '/'],
          items: [
            {
              ...host,
              label: null,
              help: '例：jdbc:db2://127.0.0.1:50000/testdb',
              component: InputField,
              placeholder: '请输入 IP 地址',
              prefix: 'jdbc:db2://',
              css: tw`w-[328px]`,
            },
            {
              ...port,
              label: null,
              placeholder: '端口号',
            },
            {
              ...database,
              label: null,
              help: '允许包含字母、数字 及 “_”',
              css: tw`w-60`,
            },
          ],
        },
        user,
        password,
      ]
      break
    case SourceType.SapHana:
      fieldsInfo = [
        {
          fieldType: 'dbUrl',
          label: 'JDBC 连接 URL（IP 地址 : 端口？SCHEMA）',
          labelClassName: 'label-required',
          name: '__dbUrl',
          space: [':', '?'],
          items: [
            {
              ...host,
              label: null,
              help: '例：jdbc:sap://127.0.0.1:30015?currentschema=test',
              component: InputField,
              placeholder: '请输入 IP 地址',
              prefix: 'jdbc:sap://',
              css: tw`w-[328px]`,
            },
            {
              ...port,
              label: null,
              placeholder: '端口号',
            },
            {
              ...database,
              name: 'database',
              label: null,
              component: InputField,
              prefix: 'currentschema=',
              placeholder: '（选填）SCHEMA',
              help: '允许包含字母、数字 及 “_”',
              css: tw`w-60`,
            },
          ],
        },
        user,
        password,
      ]
      break
    case SourceType.ClickHouse:
      fieldsInfo = [
        {
          fieldType: 'dbUrl',
          label: 'JDBC 连接 URL（IP 地址 : 端口 / Database）',
          labelClassName: 'label-required',
          name: '__dbUrl',
          space: [':', '/'],
          items: [
            {
              ...host,
              label: null,
              help: '例：jdbc:clickhouse://127.0.0.1:8123/testdb',
              component: InputField,
              placeholder: '请输入 IP 地址',
              prefix: 'jdbc:clickhouse://',
              css: tw`w-[328px]`,
            },
            {
              ...port,
              label: null,
              placeholder: '端口号',
            },
            {
              ...database,
              label: null,
              help: '允许包含字母、数字 及 “_”',
              css: tw`w-60`,
            },
          ],
        },
        user,
        password,
      ]
      break
    case SourceType.Hive:
      fieldsInfo = [
        {
          name: 'defaultFS',
          component: TextField,
          label: '主节点地址（NameNode 节点地址）',
          required: false,
          placeholder: 'hdfs://127.0.0.1:9000',
          help: 'hdfs://ServerIP:Port',
          schemas: [
            {
              rule: (v: string) => {
                if (!v) {
                  return true
                }
                return /^hdfs:\/\/[\w.]+:[\d]+$/.test(v)
              },
              message: 'NameNode 节点地址格式不正确',
              status: 'error',
            },
          ],
        },
        {
          fieldType: 'dbUrl',
          label: 'Hive 元数据库的 JDBC URL（IP 地址 : 端口 / Database）',
          labelClassName: 'label-required',
          name: '__dbUrl',
          space: [':', '/'],
          items: [
            {
              ...host,
              label: null,
              help: '例：jdbc:hive2://127.0.0.1:10000/testdb',
              component: InputField,
              placeholder: '请输入 IP 地址',
              prefix: 'jdbc:hive2://',
              css: tw`w-[328px]`,
            },
            {
              ...port,
              label: null,
              placeholder: '端口号',
            },
            {
              ...database,
              label: null,
              help: '允许包含字母、数字 及 “_”',
              css: tw`w-60`,
            },
          ],
        },
        { ...auth, name: 'hiveAuth' },
        user,
        password,
        {
          name: 'hadoop_config',
          label: 'Hadoop 高级配置',
          component: TextAreaWrapper,
          placeholder:
            'Hadoop 相关的高级参数，比如 HA 配置（集群 HA 模式时需要填写的 core-site.xml 及 hdfs-site.xml 中的配置，开启 kerberos 时包含 kerberos 相关配置）',
          required: false,
          help: (
            <div>
              <span tw="mr-0.5">可参考</span>
              <HelpCenterLink hasIcon>网络配置选择说明文档</HelpCenterLink>
            </div>
          ),
          css: css`
            & textarea.textarea {
              ${tw`min-h-[84px]! min-w-[552px]!`}
            }
          `,
        },
      ]
      break
    case SourceType.Ftp:
      pwd = { ...password }
      set(pwd, 'schemas[0].help', '请输入密码')
      fieldsInfo = [
        {
          name: 'protocol',
          label: '协议 （Protocol）',
          component: RadioGroupField,
          options: Object.values(ftpProtocol),
          schemas: [
            {
              rule: {
                required: true,
              },
              help: '请选择协议',
              status: 'error',
            },
          ],
        },
        {
          name: 'connection_mode',
          label: '连接模式 （Connection Mode）',
          component: RadioGroupField,
          options: Object.values(ftpConnectionMode),
          schemas: [
            {
              rule: {
                required: true,
              },
              help: '请选择连接模式',
              status: 'error',
            },
          ],
        },
        {
          name: 'private_key',
          label: '私钥（Private Key）',
          component: TextAreaWrapper,
          placeholder: '请输入 SFTP 私钥（Private Key）',
          resize: true,
          // maxlength: 2048,
          css: css`
            & textarea.textarea {
              ${tw`min-h-[240px]!`}
            }
          `,
          schemas: [
            {
              rule: { required: true },
              help: '请输入 SFTP 私钥（Private Key）',
              status: 'error',
            },
            {
              rule: (value: string) => {
                const l = strlen(value)
                return l >= 1 && l <= 2048
              },
              help: '最大长度: 2048, 最小长度: 1',
              status: 'error',
            },
          ],
        },
        {
          fieldType: 'dbUrl',
          label: '主机别名和端口（Host : Port）',
          name: '__dbUrl',
          space: [':'],
          items: [
            {
              ...host,
              label: null,
              help: '例：ftp://127.0.0.1:21',
              placeholder: '请输入 FTP 的主机别名（Host）',
            },
            {
              ...port,
              label: null,
            },
          ],
        },

        { ...user, placeholder: '请输入用户名' },
        { ...pwd, placeholder: '请输入密码' },
      ]
      break
    case SourceType.HDFS: {
      const help = (error?: ReactElement | string) => {
        return (
          <div>
            {error && <span tw="mr-0.5">{error}</span>}
            <span tw="mr-0.5 text-neut-8">可参考</span>
            {/* <TextLink color="blue">Hadoop 参数说明文档</TextLink> */}
            <HelpCenterLink href={hadoopLink} isIframe={false}>
              Hadoop 参数说明文档
            </HelpCenterLink>
          </div>
        )
      }
      fieldsInfo = [
        {
          fieldType: 'dbUrl',
          label: '主节点地址（NameNode Host : Port）',
          name: '__dbUrl',
          items: [
            {
              ...host,
              name: 'name_node',
              label: null,
              placeholder: '请输入主节点地址',
              css: tw`w-[330px]`,
              component: InputField,
              prefix: 'hdfs://',
            },
            {
              ...port,
              name: 'port',
              label: null,
              placeholder: '请输入',
              component: NumberField,
              css: tw`w-24`,
              min: 1,
              max: 65536,
              showButton: false,
              // schemas: [
              //   {
              //     rule: { required: true },
              //     help: '请输入 port',
              //     status: 'error',
              //   },
              // ],
            },
          ],
          space: [':'],
        },
        {
          name: 'config',
          label: 'Hadoop 高级配置',
          component: TextAreaWrapper,
          required: false,
          placeholder: `Hadoop 相关的高级参数，比如 HA 配置

{
  "dfs.nameservices": "ns",
  "dfs.ha.namenodes.ns": "nn1,nn2",
  "fs.defaultFS": "hdfs://ns",
  "dfs.namenode.rpc-address.ns.nn1": "ip1:9000",
  "dfs.namenode.http-address.ns.nn1": "ip1:50070",
  "dfs.namenode.rpc-address.ns.nn2": "ip2:9000",
  "dfs.namenode.http-address.ns.nn2": "ip2:50070"
}`,
          css: css`
            & textarea.textarea {
              ${tw`w-auto min-w-[550px]! min-h-[240px]`}
            }
          `,
          resize: true,
          help: help(),
          schemas: [
            {
              rule: (value: string) => {
                const l = strlen(value)
                return l >= 0 && l <= 1048576
              },
              help: help('最大长度: 16KB, 最小长度: 0。'),
              status: 'error',
            },
            {
              rule: (value: string) => {
                try {
                  if (value && value.length) {
                    JSON.parse(value)
                  }
                  return true
                } catch (e) {
                  return false
                }
              },
              help: help('配置必须为 JSON 格式。'),
            },
          ],
        },
      ]
      break
    }
    case SourceType.HBase: {
      // eslint-disable-next-line @typescript-eslint/no-redeclare
      const help = (error?: ReactElement | string) => (
        <div>
          {error && <span tw="text-red-10">{error}</span>}
          <span tw="mr-0.5 text-neut-8">
            HBase 集群提供给客户端连接的配置信息。详情可参考
          </span>
          {/* <TextLink theme="blue">HBase 配置信息说明文档</TextLink> */}
          <HelpCenterLink href={hbaseLink} isIframe={false}>
            HBase 配置信息说明文档
          </HelpCenterLink>
        </div>
      )
      fieldsInfo = [
        {
          component: TextAreaWrapper,
          name: 'config',
          label: '配置信息',
          placeholder: `{
   "hbase.zookeeper.property.clientPort": "2181",
   "hbase.rootdir": "hdfs://ns1/hbase",
   "hbase.cluster.distributed": "true",
   "hbase.zookeeper.quorum": "node01,node02,node03",
   "zookeeper.znode.parent": "/hbase"
} 
`,
          help: help(),
          resize: true,
          css: tw`w-auto`,
          schemas: [
            {
              rule: {
                required: true,
                // matchRegex: hostReg,
              },
              help: help('配置信息不能为空。'),
              status: 'error',
            },
            {
              rule: (value: string) => {
                const l = strlen(value)
                return l >= 1 && l <= 1048576
              },
              help: help('最大长度: 16KB, 最小长度: 1。'),
              status: 'error',
            },
            {
              rule: (value: string) => {
                try {
                  return !!JSON.parse(value)['hbase.zookeeper.quorum']
                } catch (e) {
                  return false
                }
              },
              help: help(
                '配置必须为 JSON 格式，且 hbase.zookeeper.quorum 不能为空。'
              ),
            },
          ],
        },
      ]
      break
    }
    case SourceType.ElasticSearch:
      fieldsInfo = [
        {
          fieldType: 'dbUrl',
          name: '__dbUrl',
          label: '连接地址（Host：Port）',
          space: [':'],
          items: [
            {
              name: 'host',
              label: null,
              component: TextField,
              css: tw`w-[328px]`,
              placeholder: 'localhost',
              schemas: [
                {
                  rule: {
                    required: true,
                    matchRegex: ipReg,
                  },
                  help: '请输入 ElasticSearch 地址',
                  status: 'error',
                },
              ],
            },
            {
              name: 'port',
              component: NumberField,
              css: tw`w-24`,
              min: 1,
              max: 65536,
              placeholder: '9200',
              showButton: false,
              schemas: [
                {
                  rule: {
                    required: true,
                  },
                  help: '请输入 ElasticSearch 端口',
                  status: 'error',
                },
              ],
            },
          ],
        },
        {
          name: 'version',
          label: '版本',
          component: SelectField,
          options: [
            {
              label: '6.x',
              value: '6',
            },
            {
              label: '7.x',
              value: '7',
            },
          ],
          schemas: [
            {
              rule: {
                required: true,
              },
              help: '请选择 ElasticSearch 版本',
              status: 'error',
            },
          ],
        },
        { ...auth, name: 'esAuth' },
        user,
        password,
      ]
      break
    case SourceType.MongoDB:
      fieldsInfo = [
        {
          component: KVTextAreaFieldWrapper,
          name: 'hosts',
          title: 'IP:Port',
          label: '访问地址（Host：Port）',
          placeholder: `请输入 IP:Port，多条配置之间换行输入。例如：
localhost:6379
1.1.1.1:6379
          `,
          css: tw`w-full`,
          validateOnBlur: true,
          division: ':',
          kvs: ['IP', 'Port'],
          schemas: [
            {
              rule: { required: true },
              help: '请输入访问地址（Host：Port）',
              status: 'error',
            },
          ],
        },
        { ...database, required: false, schemas: [] },
        user,
        { ...password, placeholder: '请输入访问密码（Password）' },
      ]
      break
    case SourceType.Redis:
      fieldsInfo = [
        {
          component: KVTextAreaFieldWrapper,
          name: 'hosts',
          title: 'IP:Port',
          label: '访问地址（Host：Port）',
          placeholder: `请输入 IP:Port，多条配置之间换行输入。例如：
localhost:6379
1.1.1.1:6379
          `,
          css: tw`w-full`,
          validateOnBlur: true,
          division: ':',
          kvs: ['IP', 'Port'],
          schemas: [
            {
              rule: { required: true },
              help: '请输入访问地址（Host：Port）',
              status: 'error',
            },
          ],
        },
        { ...password, placeholder: '请输入访问密码（Password）' },
      ]
      break
    case SourceType.Kafka:
      fieldsInfo = [
        {
          component: KVTextAreaFieldWrapper,
          name: 'kafka_brokers',
          title: 'IP:Port',
          label: 'Kafka 集群地址(Bootstrap Servers)',
          placeholder: `请输入 IP:Port，多条配置之间换行输入。例如：
10.0.0.1:9092
10.0.0.2:9092
          `,
          css: tw`w-full`,
          validateOnBlur: true,
          division: ':',
          kvs: ['IP', 'Port'],
          schemas: [
            {
              rule: { required: true },
              help: '请输入 kafkabrokers',
              status: 'error',
            },
            {
              rule: (value: { host: string; port: number }[]) => {
                return true
                // const l = strlen(value)
                // return l >= 1 && l <= 1024
                if (!Array.isArray(value) || !value.length) {
                  return false
                }
                return !value.find(({ host: h, port: p }) => {
                  const l = strlen(h)
                  return l < 1 || l > 64 || !h || !p
                })
              },
              help: 'IP 不能为空且长度为 1 ～ 64，Port 不能为空且为整数，kafka_brokers 个数在 1 ～ 128 之内',
              status: 'error',
            },
          ],
        },
      ]
      break
    default:
      break
  }
  return filters ? fieldsInfo.filter((i) => filters.has(i.name)) : fieldsInfo
}

const arr2str = (arr: { host: string; port: number }[]) => {
  if (!Array.isArray(arr)) {
    return undefined
  }
  if (arr.length > 0) {
    return arr
      .map(({ host: k, port: v }) => {
        if (!k || !v) {
          return ''
        }
        return `${k}${division}${v}`
      })
      .filter((s) => s !== '')
      .join('\r\n')
  }
  return ''
}

export const str2Arr = (v: string) => {
  return trim(v)
    .split(/[\r\n]/)
    .filter((item) => item !== '')
    .map((item) => {
      const [host, p] = item.split(division)
      const port = trim(p)
      try {
        return {
          host: trim(host),
          port: /^\d+$/.test(port) ? parseInt(port, 10) : undefined,
        }
      } catch (e) {
        return {
          host: trim(host),
          port: undefined,
        }
      }
    })
}

export const source2DBStrategy = [
  {
    key: 'redis&mongo',
    check: (source: SourceType) =>
      new Set([SourceType.Redis, SourceType.MongoDB]).has(source),
    value: (v: Record<string, any>) => {
      return { ...v, hosts: str2Arr(v.hosts) }
    },
  },
  {
    key: 'hdfs',
    check: (source: SourceType) => source === SourceType.HDFS,
    value: (v: Record<string, any>) => {
      return { ...v, default_fs: `hdfs://${v.name_node}:${v.port}` }
    },
  },
  {
    key: 'kafka',
    check: (source: SourceType) => source === SourceType.Kafka,
    value: (v: Record<string, any>) => {
      return { ...v, kafka_brokers: str2Arr(v.kafka_brokers) }
    },
  },
]

export const sourceStrategy = [
  {
    key: 'hive.hiveAuth',
    check: (type: SourceType, name: string) => {
      return type === SourceType.Hive && name === 'hiveAuth'
    },
    value: (sourceInfo: Record<string, any>) => {
      if (get(sourceInfo, 'url.hive.hadoop_config')) {
        return 2
      }
      return 1
    },
  },
  {
    key: 'elastic_search.esAuth',
    check: (type: SourceType, name: string) => {
      return type === SourceType.ElasticSearch && name === 'esAuth'
    },
    value: (sourceInfo: Record<string, any>) => {
      if (
        get(sourceInfo, 'url.elastic_search.host') &&
        !get(sourceInfo, 'url.elastic_search.user')
      ) {
        return 2
      }
      return 1
    },
  },
  {
    key: 'redis.hosts',
    check: (type: SourceType, name: string) => {
      return type === SourceType.Redis && name === 'hosts'
    },
    value: (sourceInfo: Record<string, any>) => {
      if (get(sourceInfo, 'url.redis.hosts')) {
        return arr2str(get(sourceInfo, 'url.redis.hosts'))
      }
      return ''
    },
  },
  {
    key: 'kafka.kafka_brokers',
    check: (type: SourceType, name: string) => {
      return type === SourceType.Kafka && name === 'kafka_brokers'
    },
    value: (sourceInfo: Record<string, any>) => {
      if (get(sourceInfo, 'url.kafka.kafka_brokers')) {
        return arr2str(get(sourceInfo, 'url.kafka.kafka_brokers'))
      }
      return ''
    },
  },
  {
    key: 'mongo_db.hosts',
    check: (type: SourceType, name: string) => {
      return type === SourceType.MongoDB && name === 'hosts'
    },
    value: (sourceInfo: Record<string, any>) => {
      if (get(sourceInfo, 'url.mongo_db.hosts')) {
        return arr2str(get(sourceInfo, 'url.mongo_db.hosts'))
      }
      return ''
    },
  },
]

export default getFieldsInfo
