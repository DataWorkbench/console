import { Form } from '@QCFE/lego-ui'
import { nameMatchRegex, strlen } from 'utils/convert'

const { NumberField, PasswordField } = Form

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
