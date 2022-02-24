import React, {
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Collapse, Control, Field, Label } from '@QCFE/lego-ui'
import { observer } from 'mobx-react-lite'
import tw, { css, styled } from 'twin.macro'
import { get, omit, toLower } from 'lodash-es'
import { useImmer } from 'use-immer'
import { useMount } from 'react-use'
import { Form, Icon } from '@QCFE/qingcloud-portal-ui'
import { useStore } from 'hooks'
import {
  AffixLabel,
  Center,
  Divider,
  HelpCenterLink,
  SelectWithRefresh,
} from 'components'
import { nameMatchRegex, strlen } from 'utils'
// import HdfsNodeField from './HdfsNodeField'
import { toJS } from 'mobx'
import { DataSourcePingButton } from './DataSourcePing'
import { NetworkContext } from './NetworkProvider'
import {
  ftpFilters,
  ftpProtocol,
  ftpProtocolValue,
  HiveAnonymousFilters,
  hivePwdFilters,
  networkLink,
  sftpFilters,
  sFtpProtocolValue,
  SourceType,
} from './constant'
import getFieldsInfo from './getDatasourceFormConfig'

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
      },
      ftp: {
        port: 21,
      },
      sftp: {
        port: 22,
      },
      hive: {
        auth: 1,
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
    source_type?: SourceType
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
    network_info: Record<string, any>
  }>({
    type: 'vpc',
    id: '',
    name: '',
    network_info: {},
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
    parseRemoteData(opSourceList[0])

  const [filters, setFilters] = useState<Set<string> | undefined>(() => {
    if (urlType === 'ftp') {
      if (get(sourceInfo, 'url.ftp.protocol') === sFtpProtocolValue) {
        return sftpFilters
      }
      return ftpFilters
    }
    if (urlType === 'hive') {
      // TODO: 后续支持hive, auth 待确定
      if (get(sourceInfo, 'url.hive.auth') === 2) {
        return HiveAnonymousFilters
      }
      return hivePwdFilters
    }
    return undefined
  })

  const fields = getFieldsInfo(resInfo.source_type!, filters)

  const isViewMode = op === 'view'

  const [defaultStatus, setDefaultStatus] = useState<
    { status: boolean; message?: string } | undefined
  >(() => {
    if (
      op === 'create' ||
      !get(opSourceList, '[0].last_connection.network_id')
    ) {
      return undefined
    }
    return get(opSourceList, '[0].connection') === 1
      ? {
          status: true,
        }
      : {
          status: false,
          message: toJS(get(opSourceList, '[0].last_connection.message')),
        }
  })

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
    hive_auth: (onChange?: Function) => (v: number) => {
      if (v === 2) {
        setFilters(HiveAnonymousFilters)
      } else {
        setFilters(hivePwdFilters)
      }
      onChange?.(v)
    },
  }

  useMount(() => {
    if (sourceInfo) {
      setNetWork((draft) => {
        draft.id = get(sourceInfo, `last_connection.network_id`)
        draft.name = get(sourceInfo, 'last_connection.network_info.name')
        draft.type = 'vpc'
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
        const rest = omit(others, 'utype')

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
              // if (name === 'nodes') {
              //   return (
              //     <HdfsNodeField
              //       key={name}
              //       name={name}
              //       validateOnBlur
              //       label={<AffixLabel required>{label}</AffixLabel>}
              //       defaultValue={get(sourceInfo, `url.${urlType}.${name}`)}
              //       schemas={[
              //         {
              //           rule: (o: Record<string, any>) => {
              //             if (trim(o.name_node) === '') {
              //               return false
              //             }
              //             return /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/.test(
              //               o.port
              //             )
              //           },
              //           help: '格式不正确,请输入 Name_node Port，多条配置之间换行输入',
              //           status: 'error',
              //         },
              //       ]}
              //     />
              //   )
              // }
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
                    defaultValue={get(
                      sourceInfo,
                      `url.${urlType}.${name}`,
                      getInitValue(
                        urlType === 'ftp' && name === 'port'
                          ? `url.${toLower(
                              get(ftpProtocol, `${ftpProtocolType}.label`)
                            )}.${name}`
                          : `url.${urlType}.${name}`
                      )
                    )}
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
              label={
                <AffixLabel help="测试连通性时使用的网络配置" required={false}>
                  网络配置
                </AffixLabel>
              }
              onChange={(v: string, option: Record<string, any>) => {
                setNetWork((draft) => {
                  draft.id = v
                  draft.name = option.label
                  draft.network_info = option
                })
                setDefaultStatus(undefined)
              }}
              onRefresh={refreshNetworks}
              help={
                <>
                  <div>
                    <span tw="mr-0.5">详情请见</span>
                    <HelpCenterLink href={networkLink} isIframe={false}>
                      网络配置选择说明文档
                    </HelpCenterLink>
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
              {/* <Label> */}
              {/*  <AffixLabel help="检查数据源参数是否正确" required={false}> */}
              {/*    数据源可用性测试 */}
              {/*  </AffixLabel> */}
              {/* </Label> */}
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
