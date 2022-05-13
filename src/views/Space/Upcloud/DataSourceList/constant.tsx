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
  'defaultFS',
  '__dbUrl',
  'hiveAuth',
  'user',
  'password',
])

export const hiveAnonymousFilters = new Set([
  'defaultFS',
  '__dbUrl',
  'hiveAuth',
  'hadoop_config',
])

export const esPwdFilters = new Set([
  '__dbUrl',
  'esAuth',
  'version',
  'user',
  'password',
])

export const esAnonymousFilters = new Set(['version', '__dbUrl', 'esAuth'])

export enum DbType {
  Sql = '关系型数据库',
  Nosql = 'NoSQL 数据库',
  Mq = '消息队列',
  Storage = '存储',
  DW = '数据仓库',
}

export enum SourceType {
  Mysql = 1,
  PostgreSQL = 2,
  Kafka = 3,
  ClickHouse = 5,
  HBase = 6,
  Ftp = 7,
  HDFS = 8,
  SqlServer = 9,
  Oracle = 10,
  DB2 = 11,
  SapHana = 12,
  Hive = 13,
  ElasticSearch = 14,
  MongoDB = 15,
  Redis = 16,
  TiDB = 1000000000000,
}

// WRANNING: sourceKinds 里 name 和 后端接口 kinds name 统一，无法和 列表 urlType 和创建接口统一
export const sourceKinds = [
  {
    name: 'MySQL',
    urlType: 'mysql',
    desc: 'MySQL 是一个关系型数据库管理系统，由瑞典MySQL AB 公司开发，目前属于 Oracle 公司。MySQL 使用的 SQL 语言是用于访问数据库的最常用的标准化语言',
    source_type: SourceType.Mysql,
    type: DbType.Sql,
  },
  {
    name: 'PostgreSQL',
    urlType: 'postgresql',
    desc: 'PostgreSQL 是一种非常先进的对象-关系型数据库管理系统（ORDBMS），目前功能最强大，特性最丰富和最先进的自由软件数据库系统。有些特性甚至连商业数据库都不具备。这个起源于伯克利（BSD）的数据库研究计划目前已经衍生成一项国际开发项目，并且有非常广泛的用户。',
    source_type: SourceType.PostgreSQL,
    type: DbType.Sql,
  },
  {
    name: 'TiDB',
    urlType: 'tidb',
    desc: 'TiDB 是 PingCAP 公司自主设计、研发的开源分布式关系型数据库，是一款同时支持在线事务处理与在线分析处理 (Hybrid Transactional and Analytical Processing, HTAP) 的融合型分布式数据库产品，具备水平扩容或者缩容、金融级高可用、实时 HTAP、云原生的分布式数据库、兼容 MySQL 5.7 协议和 MySQL 生态等重要特性。目标是为用户提供一站式 OLTP (Online Transactional Processing)、OLAP (Online Analytical Processing)、HTAP 解决方案。TiDB 适合高可用、强一致要求较高、数据规模较大等各种应用场景。',
    source_type: SourceType.TiDB,
    type: DbType.Sql,
  },
  {
    name: 'Oracle',
    desc: 'Oracle 是甲骨文公司的一款关系数据库管理系统。它是在数据库领域一直处于领先地位的产品。可以说 Oracle 数据库系统是目前世界上流行的关系数据库管理系统，系统可移植性好、使用方便、功能强，适用于各类大、中、小、微机环境。',
    urlType: 'oracle',
    source_type: SourceType.Oracle,
    type: DbType.Sql,
  },
  {
    name: 'SqlServer',
    urlType: 'sqlserver',
    desc: 'SQL Server 数据库是 Microsoft 开发设计的一个关系数据库智能管理系统(RDBMS)，现在是全世界主流数据库之一； SQL Server 数据库具备方便使用、可伸缩性好、相关软件集成程度高等优势。',
    source_type: SourceType.SqlServer,
    type: DbType.Sql,
  },
  {
    name: 'DB2',
    urlType: 'db2',
    desc: 'DB2 是美国IBM公司开发的一套关系型数据库管理系统，主要的运行环境为 UNIX、Linux 以及 Windows 服务器版本。DB2主要应用于大型应用系统，具有较好的可伸缩性，可支持从大型机到单用户环境，应用于所有常见的服务器操作系统平台下。',
    source_type: SourceType.DB2,
    type: DbType.Sql,
  },
  {
    name: 'SapHana',
    showname: 'SAP HANA',
    urlType: 'sap_hana',
    desc: 'SAP HANA 是 SAP 公司于2011年6月推出的基于内存计算技术的高性能实时数据计算平台，用户可以基于 SAP HANA 提供的内存计算技术，直接对大量实时业务数据进行查询和分析。SAP HANA 的数据存储在内存数据库中，访问速度极快。',
    source_type: SourceType.SapHana,
    type: DbType.Sql,
  },
  {
    name: 'ClickHouse',
    urlType: 'clickhouse',
    desc: 'ClickHouse 是俄罗斯的 Yandex 于 2016 年开源的用于在线分析处理查询（OLAP :Online Analytical Processing）MPP架构的列式存储数据库（DBMS：Database Management System），能够使用 SQL 查询实时生成分析数据报告。',
    source_type: SourceType.ClickHouse,
    type: DbType.DW,
  },
  {
    name: 'Hive',
    urlType: 'hive',
    desc: 'Apache Hive 是一个构建于 Hadoop 顶层的数据仓库，可以将结构化的数据文件映射为一张数据库表，并提供简单的SQL查询功能，可以将SQL语句转换为 MapReduce 任务进行运行。',
    source_type: SourceType.Hive,
    type: DbType.DW,
  },
  {
    name: 'Ftp',
    urlType: 'ftp',
    showname: 'FTP',
    desc: 'FTP 是 File Transfer Protocol（文件传输协议）的英文简称，而中文简称为“文传协议”。用于 Internet 上的控制文件的双向传输。',
    source_type: SourceType.Ftp,
    type: DbType.Storage,
  },
  {
    name: 'HDFS',
    urlType: 'hdfs',
    desc: 'HDFS（Hadoop Distributed File System）被设计成适合运行在通用硬件(commodity hardware)上的分布式文件系统。它和现有的分布式文件系统有很多共同点。但同时，它和其他的分布式文件系统的区别也是很明显的。HDFS 是一个高度容错性的系统，适合部署在廉价的机器上。',
    source_type: SourceType.HDFS,
    type: DbType.Storage,
  },
  {
    name: 'HBase',
    showname: 'HBase',
    urlType: 'hbase',
    desc: 'HBase 是一种构建在HDFS 之上的分布式、面向列（但不是列存储）的存储系统。在需要实时读写、随机访问超大规模数据集时，可以使用HBase。HBase 可以通过线性方式增加节点来进行扩展。HBase 不是关系型数据库，自身不支持 SQL 查询引擎，HBase 适合将大而稀疏的表放在分布式集群上。',
    source_type: SourceType.HBase,
    type: DbType.Nosql,
  },
  {
    name: 'ElasticSearch',
    urlType: 'elastic_search',
    desc: 'Elasticsearch 是一个分布式的免费开源搜索和分析引擎，适用于包括文本、数字、地理空间、结构化和非结构化数据等在内的所有类型的数据。',
    source_type: SourceType.ElasticSearch,
    type: DbType.Nosql,
  },
  {
    name: 'Redis',
    urlType: 'redis',
    desc: 'Redis 是现在最受欢迎的 NoSQL 数据库之一，Redis 是一个使用 ANSI C 编写的开源、包含多种数据结构、支持网络、基于内存、可选持久性的键值对存储数据库，其具备如下特性: 基于内存运行，性能高效 支持分布式，理论上可以无限扩展 key/value 存储系统。',
    source_type: SourceType.Redis,
    type: DbType.Nosql,
  },
  {
    name: 'MongoDb',
    urlType: 'mongo_db',
    showname: 'MongoDB',
    desc: 'MongoDB 是由C++语言编写的，是一个基于分布式文件存储的开源数据库系统。在高负载的情况下，添加更多的节点，可以保证服务器性能。MongoDB 旨在为WEB应用提供可扩展的高性能数据存储解决方案。MongoDB 将数据存储为一个文档，数据结构由键值(key=>value)对组成。',
    source_type: SourceType.MongoDB,
    type: DbType.Nosql,
  },
  {
    name: 'Kafka',
    urlType: 'kafka',
    desc: 'Kafka 是由 Apache 软件基金会开发的一个开源流处理平台，由 Scala 和 Java 编写。该项目的目标是为处理实时数据提供一个统一、高吞吐、低延迟的平台。其持久化层本质上是一个“按照分布式事务日志架构的大规模发布/订阅消息队列。',
    source_type: SourceType.Kafka,
    type: DbType.Mq,
  },
]

//
// // 处理后端 url type 字段
// export const urlType2Api = {
//   saphana: 'sap_hana',
//   elasticsearch: 'elastic_search',
// }
//
// export const api2UrlType = {
//   sap_hana: 'saphana',
//   elastic_search: 'elasticsearch',
// }
