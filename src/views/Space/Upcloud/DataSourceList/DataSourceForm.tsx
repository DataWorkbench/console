import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Collapse, Control, Field, Label } from '@QCFE/lego-ui'
import { observer } from 'mobx-react-lite'
import tw, { css, styled } from 'twin.macro'
import { get, omit, toLower } from 'lodash-es'
import { useImmer } from 'use-immer'
import { Form, Icon } from '@QCFE/qingcloud-portal-ui'
import { AffixLabel, Center, Divider } from 'components'
import { nameMatchRegex, strlen } from 'utils'
// import HdfsNodeField from './HdfsNodeField'
import { toJS } from 'mobx'
import { compose } from 'utils/functions'
import { DataSourcePingButton } from './DataSourcePing'
import {
  esAnonymousFilters,
  esPwdFilters,
  ftpFilters,
  ftpProtocol,
  ftpProtocolValue,
  hiveAnonymousFilters,
  hivePwdFilters,
  sftpFilters,
  sFtpProtocolValue,
  SourceType,
} from './constant'
import getFieldsInfo, {
  source2DBStrategy,
  sourceStrategy,
} from './getDatasourceFormConfig'

const { CollapseItem } = Collapse
const { TextField, TextAreaField } = Form

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

const MultiFieldWrapper = styled.div(() => [
  tw`flex gap-2`,
  css`
    & {
      .field {
        ${tw`block`}
      }

      .control {
        ${tw`w-full`}
      }
    }
  `,
])

const parseRemoteData = (data: Record<'url' & string, any>) => {
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
        config: `{
  "dfs.nameservices": "ns",
  "dfs.ha.namenodes.ns": "nn1,nn2",
  "fs.defaultFS": "hdfs://ns",
  "dfs.namenode.rpc-address.ns.nn1": "ip1:9000",
  "dfs.namenode.http-address.ns.nn1": "ip1:50070",
  "dfs.namenode.rpc-address.ns.nn2": "ip2:9000",
  "dfs.namenode.http-address.ns.nn2": "ip2:50070"
}`,
      },
      ftp: {
        port: 21,
      },
      sftp: {
        port: 22,
      },
      hbase: {
        config: `{
   "hbase.zookeeper.property.clientPort": "2181",
   "hbase.rootdir": "hdfs://ns1/hbase",
   "hbase.cluster.distributed": "true",
   "hbase.zookeeper.quorum": "node01,node02,node03",
   "zookeeper.znode.parent": "/hbase"
}`,
      },
      hive: {
        auth01: 1,
        auth02: 2,
      },
      elastic_search: {
        version: '7',
      },
    },
  }
  return get(initValues, path, '')
}

interface IFormProps {
  resInfo: {
    name: string
    urlType?: string
    desc?: string
    img?: React.ReactNode
    source_type?: SourceType
  }
  getFormData?: MutableRefObject<() => any>
  onFieldValueChange?: (fieldValue: string, formModel: any) => void
  op: string
  opSourceList: Record<string, any>[]
  theme: 'dark' | 'light'
  className?: string
}

const DataSourceForm = ({
  resInfo,
  getFormData,
  onFieldValueChange,
  op,
  opSourceList,
  theme = 'light',
  className,
}: IFormProps) => {
  const ref = useRef<Form>(null)

  // const {
  //   dataSourceStore: { op, opSourceList },
  // } = useStore()

  const urlType = resInfo?.urlType ?? resInfo.name.toLowerCase()
  const { source_type: sourceType } = resInfo
  const sourceInfo =
    ['update', 'view'].includes(op) && opSourceList.length > 0
      ? parseRemoteData(opSourceList[0])
      : {}

  const [filters, setFilters] = useState<Set<string> | undefined>(() => {
    if (urlType === 'ftp') {
      if (get(sourceInfo, 'url.ftp.protocol') === sFtpProtocolValue) {
        return sftpFilters
      }
      return ftpFilters
    }
    if (urlType === 'hive') {
      if (get(sourceInfo, 'url.hive.hadoop_config')) {
        return hiveAnonymousFilters
      }
      return hivePwdFilters
    }
    if (urlType === 'elastic_search') {
      if (
        get(sourceInfo, 'url.elastic_search.host') &&
        !get(sourceInfo, 'url.elastic_search.user')
      ) {
        return esAnonymousFilters
      }
      return esPwdFilters
    }
    return undefined
  })

  const fields = getFieldsInfo(resInfo.source_type!, filters)

  const isViewMode = op === 'view'

  const defaultStatus = useMemo<
    { status: boolean; message?: string } | undefined
  >(() => {
    if (
      op === 'create' ||
      !get(opSourceList, '[0].last_connection.network_id')
    ) {
      return undefined
    }
    return get(opSourceList, '[0].last_connection.result') === 1
      ? {
          status: true,
        }
      : {
          status: false,
          message: toJS(get(opSourceList, '[0].last_connection.message')),
        }
  }, [op, opSourceList])

  const [showPing, setShowPing] = useState(false)
  const [ftpProtocolType, setFtpProtocol] = useState(() => {
    return get(opSourceList, 'url.ftp.protocol', ftpProtocolValue)
  })
  const [ftpPortConfig, setFtpPortConfig] = useImmer({
    key: ftpProtocolType,
    changed: false,
  })

  const handleChange = {
    ftp_protocol: (onChange?: Function) => (type: number) => {
      setFilters(type === ftpProtocolValue ? ftpFilters : sftpFilters)
      setFtpProtocol(type)
      if (!ftpPortConfig.changed) {
        setFtpPortConfig((_) => {
          _.key = type
        })
      }
      onChange?.(type)
    },
    ftp_port: (onChange?: Function) => (v: number) => {
      setFtpPortConfig((_) => {
        _.changed = true
      })
      onChange?.(v)
    },
    hive_hiveAuth: (onChange?: Function) => (v: number) => {
      if (v === 2) {
        setFilters(hiveAnonymousFilters)
      } else {
        setFilters(hivePwdFilters)
      }
      onChange?.(v)
    },
    elastic_search_esAuth: (onChange?: Function) => (v: number) => {
      if (v === 2) {
        setFilters(esAnonymousFilters)
      } else {
        setFilters(esPwdFilters)
      }
      onChange?.(v)
    },
  }

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
          Object.assign(rest, {
            default_fs: `hdfs://${rest.name_node}:${rest.port}`,
          })
        }
        const strategy = source2DBStrategy
          .filter((i) => i.check(sourceType!))
          .map((i) => i.value)
        if (strategy.length) {
          rest = compose(...strategy)(rest)
        }
        // if (urlType === 'hdfs') {
        //   const shiftArr = ['name_node', 'port']
        //   rest.nodes = pick(rest, shiftArr)
        //   rest = omit(rest, shiftArr)
        // }
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
    [urlType, resInfo.source_type, sourceType]
  )

  useEffect(() => {
    if (getFormData) {
      getFormData.current = parseFormData
    }
  }, [getFormData, parseFormData])

  function getDefaultValue(name: string) {
    const strategy = sourceStrategy.find((i) => i.check(sourceType!, name))
    if (strategy) {
      return strategy.value(sourceInfo as Record<string, any>)
    }

    const defaultPath =
      urlType === 'ftp' && name === 'port'
        ? `url.${toLower(get(ftpProtocol, `${ftpProtocolType}.label`))}.${name}`
        : `url.${urlType}.${name}`
    return get(sourceInfo, `url.${urlType}.${name}`, getInitValue(defaultPath))
  }

  return (
    <Root className={className}>
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
                  theme={theme === 'light' ? 'darker' : 'light'}
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
                  help: '允许包含字母、数字 及 "_"，不能以（_）开始结尾，长度 2-64',
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
              const getField = (fieldData: Record<string, any>) => {
                const {
                  name,
                  label,
                  placeholder,
                  component,
                  onChange,
                  schemas = [],
                  ...rest
                } = fieldData
                const FieldComponent = component || TextField
                return (
                  <FieldComponent
                    key={
                      // eslint-disable-next-line no-nested-ternary
                      urlType === 'ftp' && name === 'port'
                        ? ftpPortConfig.changed
                          ? ftpPortConfig.key
                          : ftpProtocolType
                        : name
                    }
                    name={name}
                    disabled={isViewMode}
                    defaultValue={getDefaultValue(name)}
                    validateOnChange
                    schemas={schemas}
                    css={['port'].includes(name) ? tw`w-28` : tw`w-96`}
                    {...rest}
                    onChange={
                      get(handleChange, `${urlType}_${name}`)
                        ? get(handleChange, `${urlType}_${name}`)(onChange)
                        : onChange
                    }
                    label={
                      label ? (
                        <AffixLabel required={rest.required !== false}>
                          {label}
                        </AffixLabel>
                      ) : undefined
                    }
                    placeholder={placeholder}
                  />
                )
              }
              if (field.fieldType === 'dbUrl') {
                return (
                  <Field key={field.name} tw="mb-0!">
                    <label htmlFor="__" className="label">
                      <AffixLabel required>{field.label}</AffixLabel>
                    </label>
                    <MultiFieldWrapper>
                      {field.items.reduce(
                        (
                          acc: Record<string, any>[],
                          cur: Record<string, any>,
                          curIndex: number
                        ) => {
                          acc.push(getField(cur))
                          if (field.space && field.space[curIndex]) {
                            acc.push(
                              <span
                                key={
                                  // eslint-disable-next-line react/no-array-index-key
                                  field.space[curIndex] + curIndex
                                }
                                tw="leading-10"
                              >
                                {field.space[curIndex]}
                              </span>
                            )
                          }
                          return acc
                        },
                        []
                      )}
                    </MultiFieldWrapper>
                  </Field>
                )
              }
              return getField(field)
            })}
            <Field>
              <Divider>
                <Center
                  tw="cursor-pointer"
                  onClick={() => setShowPing((_) => !_)}
                >
                  <Icon
                    name={showPing ? 'chevron-up' : 'chevron-down'}
                    type={theme === 'light' ? 'dark' : 'light'}
                  />
                  <span tw="ml-2">网络连通及数据源可用性测试</span>
                </Center>
              </Divider>
            </Field>
            <Field css={showPing ? visibleStyle : hiddenStyle}>
              {/* <AffixLabel */}
              {/*   help={ */}
              {/*     <div> */}
              {/*       <span tw="mr-1">详情请查看</span> */}
              {/*       <HelpCenterLink href="##" hasIcon> */}
              {/*         网络连通方案 */}
              {/*       </HelpCenterLink> */}
              {/*     </div> */}
              {/*   } */}
              {/*   theme="darker" */}
              {/* > */}
              {/*   数据源可用性测试 */}
              {/* </AffixLabel> */}
              <DataSourcePingButton
                sourceId={get(sourceInfo, 'id')}
                getValue={parseFormData}
                defaultStatus={defaultStatus}
                hasPing={!!get(sourceInfo, 'last_connection')}
              />
            </Field>
          </CollapseItem>
        </CollapseWrapper>
      </Form>
    </Root>
  )
}

export default observer(DataSourceForm)
