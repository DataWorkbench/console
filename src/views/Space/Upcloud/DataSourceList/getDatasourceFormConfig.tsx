import {
  compInfo,
  ftpConnectionMode,
  ftpProtocol,
  hadoopLink,
  hbaseLink,
} from 'views/Space/Upcloud/DataSourceList/constant'
import { set, trim } from 'lodash-es'
import { HelpCenterLink } from 'components/Link'
import tw, { css, styled } from 'twin.macro'
import { strlen } from 'utils/convert'
import { InputField } from 'components/Input'
import { Form } from '@QCFE/lego-ui'
import { getKvTextAreaFieldByMap } from 'components/KVTextArea'

const { TextAreaField, NumberField, RadioGroupField } = Form

const TextAreaWrapper = styled(TextAreaField)(() => [
  css`
    & textarea.textarea {
      ${tw`w-auto min-w-[550px]! min-h-[160px]`}
    }
  `,
])

const division = ':'
const mapProps = (props: Record<string, any>) => {
  const parseValue = (arr: { host: string; port: number }[]) => {
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
  return {
    ...props,
    theme: 'light',
    value: parseValue(props.value),
    onChange: (v: string) => {
      if (props.onChange) {
        props.onChange(
          trim(v)
            .split(/[\r\n]/)
            .filter((item) => item !== '')
            .map((item) => {
              const [host, p] = item.split(division)
              const port = trim(p)
              return {
                host: trim(host),
                port: /^\d+$/.test(port) ? parseInt(port, 10) : null,
              }
            })
        )
      }
    },
  }
}

const KVTextAreaFieldWrapper = styled(getKvTextAreaFieldByMap(mapProps))(() => [
  css`
    & textarea.textarea {
      ${tw`w-auto! min-w-[500px]! min-h-[100px]`}
    }
  `,
])

const getFieldsInfo = (type: string, filters?: Set<string>) => {
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
      set(pwd, 'schemas[0].help', '???????????????')
      fieldsInfo = [
        {
          name: 'protocol',
          label: '?????? ???Protocol???',
          component: RadioGroupField,
          options: Object.values(ftpProtocol),
          schemas: [
            {
              rule: {
                required: true,
              },
              help: '???????????????',
              status: 'error',
            },
          ],
        },
        {
          name: 'connection_mode',
          label: '???????????? ???Connection Mode???',
          component: RadioGroupField,
          options: Object.values(ftpConnectionMode),
          schemas: [
            {
              rule: {
                required: true,
              },
              help: '?????????????????????',
              status: 'error',
            },
          ],
        },
        {
          name: 'private_key',
          label: '?????????Private Key???',
          component: TextAreaWrapper,
          placeholder: '????????? SFTP ?????????Private Key???',
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
              help: '????????? SFTP ?????????Private Key???',
              status: 'error',
            },
            {
              rule: (value: string) => {
                const l = strlen(value)
                return l >= 1 && l <= 2048
              },
              help: '????????????: 2048, ????????????: 1',
              status: 'error',
            },
          ],
        },
        {
          fieldType: 'dbUrl',
          label: '????????????????????????Host : Port???',
          name: '__dbUrl',
          space: [':'],
          items: [
            {
              ...host,
              label: null,
              placeholder: '????????? FTP ??????????????????Host???',
            },
            {
              ...port,
              label: null,
            },
          ],
        },

        { ...user, placeholder: '??????????????????' },
        { ...pwd, placeholder: '???????????????' },
      ]
      break
    case 'hbase': {
      const help = (
        <div>
          <span tw="mr-0.5">
            HBase ???????????????????????????????????????????????????????????????
          </span>
          {/* <TextLink theme="blue">HBase ????????????????????????</TextLink> */}
          <HelpCenterLink href={hbaseLink} isIframe={false}>
            HBase ????????????????????????
          </HelpCenterLink>
        </div>
      )
      fieldsInfo = [
        {
          component: TextAreaWrapper,
          name: 'config',
          label: '????????????',
          placeholder: `{
   "hbase.zookeeper.property.clientPort": "2181",
   "hbase.rootdir": "hdfs://ns1/hbase",
   "hbase.cluster.distributed": "true",
   "hbase.zookeeper.quorum": "node01,node02,node03",
   "zookeeper.znode.parent": "/hbase"
} 
`,
          help,
          resize: true,
          css: tw`w-auto`,
          schemas: [
            {
              rule: {
                required: true,
                // matchRegex: hostReg,
              },
              help,
              status: 'error',
            },
            {
              rule: (value: string) => {
                const l = strlen(value)
                return l >= 1 && l <= 1048576
              },
              help: '????????????: 16KB, ????????????: 1',
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
              help: '??????????????? JSON ???????????? hbase.zookeeper.quorum ????????????',
            },
          ],
        },
      ]
      break
    }
    case 'hdfs':
      fieldsInfo = [
        {
          fieldType: 'dbUrl',
          label: '??????????????????NameNode Host : Port???',
          name: '__dbUrl',
          items: [
            {
              name: 'name_node',
              label: null,
              placeholder: '????????????????????????',
              css: tw`w-[330px]`,
              component: InputField,
              prefix: 'hdfs://',
              validateOnBlur: true,
              schemas: [
                {
                  rule: { required: true },
                  help: '????????????????????????',
                  status: 'error',
                },
              ],
            },
            {
              name: 'port',
              label: null,
              placeholder: '?????????',
              component: NumberField,
              css: tw`w-24`,
              min: 1,
              max: 65536,
              showButton: false,
              schemas: [
                {
                  rule: { required: true },
                  help: '????????? port',
                  status: 'error',
                },
              ],
            },
          ],
          space: [':'],
        },
        {
          name: 'config',
          label: 'Hadoop ????????????',
          component: TextAreaWrapper,
          required: false,
          placeholder: `Hadoop ?????????????????????????????? HA ??????

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
          help: (
            <div>
              <span tw="mr-0.5">?????????</span>
              {/* <TextLink color="blue">Hadoop ??????????????????</TextLink> */}
              <HelpCenterLink href={hadoopLink} isIframe={false}>
                Hadoop ??????????????????
              </HelpCenterLink>
            </div>
          ),
          schemas: [
            {
              rule: (value: string) => {
                const l = strlen(value)
                return l >= 0 && l <= 1048576
              },
              help: '????????????: 16KB, ????????????: 0',
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
              help: '??????????????? JSON ??????',
            },
          ],
        },
      ]
      break
    case 'kafka':
      fieldsInfo = [
        {
          component: KVTextAreaFieldWrapper,
          name: 'kafka_brokers',
          title: 'IP:Port',
          label: 'Kafka ????????????(Bootstrap Servers)',
          placeholder: `????????? IP:Port?????????????????????????????????????????????
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
              help: '????????? kafkabrokers',
              status: 'error',
            },
            {
              rule: (value: { host: string; port: number }[]) => {
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
              help: 'IP ???????????????????????? 1 ??? 64???Port ???????????????????????????kafka_brokers ????????? 1 ??? 128 ??????',
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
  return filters ? fieldsInfo.filter((i) => filters.has(i.name)) : fieldsInfo
}
export default getFieldsInfo
