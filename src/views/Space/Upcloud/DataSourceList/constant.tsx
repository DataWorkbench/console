import { Form } from '@QCFE/lego-ui'
import { nameMatchRegex, strlen } from 'utils/convert'

const { NumberField, PasswordField, RadioGroupField } = Form

export const SOURCE_PING_START = 'sourcePingStart'

export const SOURCE_PING_RESULT = 'sourcePingResult'

export const CONNECTION_STATUS: Record<
  'LOADING' | 'FAIL' | 'SUCCESS' | 'UNDO',
  -1 | 0 | 1 | 2
> = {
  LOADING: -1,
  UNDO: 0,
  SUCCESS: 1,
  FAIL: 2,
}

export const DATASOURCE_STATUS = {
  DELETE: 1,
  ENABLED: 2,
  DISABLED: 3,
}

export const DATASOURCE_PING_STAGE: Record<'CREATE' | 'UPDATE', 1 | 2> = {
  CREATE: 1,
  UPDATE: 2,
}

export const ipReg =
  /(^(((2[0-4][0-9])|(25[0-5])|([01]?\d?\d))\.){3}((2[0-4][0-9])|(25[0-5])|([01]?\d?\d))$)|(^((([a-zA-Z0-9_-])+\.)+([a-zA-Z])+)$)/

export const hostReg =
  /^([0-9a-zA-Z_.-]+(:\d{1,5})?,)*([0-9a-zA-Z_.-]+(:\d{1,5})?)?$/

export const compInfo = {
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
  auth: {
    label: '安全验证',
    name: 'auth',
    component: RadioGroupField,
    options: [
      {
        label: '用户名密码登录',
        value: 1,
      },
      {
        label: '匿名登录',
        value: 2,
      },
    ],
    required: true,
    schemas: [
      {
        rule: {
          required: true,
        },
        message: '请选择安全验证方式',
        status: 'error',
      },
    ],
  },
}

export const hadoopLink = '/manual/data_up_cloud/add_data/#连接信息-hdfs'

export const networkLink = '/manual/data_development/network/create_network/'

export const hbaseLink = '/manual/data_up_cloud/add_data/#连接信息-hbase'

export const ftpProtocolValue = 1
export const sFtpProtocolValue = 2

export const ftpProtocol = {
  [ftpProtocolValue]: {
    label: 'FTP',
    value: ftpProtocolValue,
  },
  [sFtpProtocolValue]: {
    label: 'SFTP',
    value: sFtpProtocolValue,
  },
}

export const ftpConnectionMode = {
  FTP: {
    label: '被动模式',
    value: 2,
  },
  SFTP: {
    label: '主动模式',
    value: 1,
  },
}

export const ftpFilters = new Set([
  'connection_mode',
  'host',
  'password',
  'port',
  '__dbUrl',
  'protocol',
  'user',
])

export const sftpFilters = new Set([
  'private_key',
  'host',
  'password',
  '__dbUrl',
  'port',
  'protocol',
  'user',
])

export const hivePwdFilters = new Set([
  // TODO: 字段需要调整
  'nameNode',
  '__dbUrl',
  'auth',
  'user',
  'password',
])

export const HiveAnonymousFilters = new Set([
  'nameNode',
  '__dbUrl',
  'auth',
  'config',
])

export enum DbType {
  Sql,
  Nosql,
  Mq,
  Storage,
  DW,
}

export enum SourceType {
  Mysql = 1,
  PostgreSQL,
  Kafka,
  ClickHouse = 5,
  HBase,
  Ftp,
  HDFS,
  TiDB,
  Oracle,
  SqlServer,
  Hive,
  ElasticSearch,
  Redis,
  MongoDB,
  DB2,
  SapHana,
}

export const sourceKinds = [
  {
    name: 'MySQL',
    desc: '是一个完全托管的数据库服务，可使用世界上最受欢迎的开源数据库来部署云原生应用程序。',
    source_type: SourceType.Mysql,
    type: DbType.Sql,
  },
  {
    name: 'PostgreSQL',
    desc: '开源的对象-关系数据库管理系统，在类似 BSD 许可与 MIT 许可的 PostgreSQL 许可下发行。 ',
    source_type: SourceType.PostgreSQL,
    type: DbType.Sql,
  },
  {
    name: 'TiDB',
    desc: '',
    source_type: SourceType.TiDB,
    type: DbType.Sql,
  },
  {
    name: 'Oracle',
    desc: '',
    source_type: SourceType.Oracle,
    type: DbType.Sql,
  },
  {
    name: 'SqlServer',
    desc: '',
    source_type: SourceType.SqlServer,
    type: DbType.Sql,
  },
  {
    name: 'DB2',
    desc: '',
    source_type: SourceType.DB2,
    type: DbType.Sql,
  },
  {
    name: 'SAP HANA',
    desc: '',
    source_type: SourceType.SapHana,
    type: DbType.Sql,
  },
  {
    name: 'ClickHouse',
    desc: '用于联机分析处理的开源列式数据库。 ClickHouse允许分析实时更新的数据。该系统以高性能为目标。',
    source_type: SourceType.ClickHouse,
    type: DbType.DW,
  },
  {
    name: 'Hive',
    desc: '',
    source_type: SourceType.Hive,
    type: DbType.DW,
  },
  {
    name: 'Ftp',
    showname: 'FTP',
    desc: '用于在网络上进行文件传输的一套标准协议，它工作在 OSI 模型中的应用层。',
    source_type: SourceType.Ftp,
    type: DbType.Storage,
  },
  {
    name: 'HDFS',
    desc: '在通用硬件上的分布式文件系统，提供高吞吐量的数据访问，适合大规模数据集上的应用。',
    source_type: SourceType.HDFS,
    type: DbType.Storage,
  },
  {
    name: 'HBase',
    showname: 'HBase',
    desc: 'HBase 是一个开源的非关系型分布式数据库，实现的编程语言为 Java。它可以对稀疏文件提供极高的容错率。 ',
    source_type: SourceType.HBase,
    type: DbType.Nosql,
  },
  {
    name: 'ElasticSearch',
    desc: '',
    source_type: SourceType.ElasticSearch,
    type: DbType.Nosql,
  },
  {
    name: 'Redis',
    desc: '',
    source_type: SourceType.Redis,
    type: DbType.Nosql,
  },
  {
    name: 'MongoDB',
    desc: '',
    source_type: SourceType.MongoDB,
    type: DbType.Nosql,
  },
  {
    name: 'Kafka',
    desc: '由Scala和Java编写，目标是为处理实时数据提供一个统一、高吞吐、低延迟的平台。',
    source_type: SourceType.Kafka,
    type: DbType.Mq,
  },
]
