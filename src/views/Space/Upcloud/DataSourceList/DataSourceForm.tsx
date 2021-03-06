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
  networkLink,
  sftpFilters,
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

const parseRemoteData = (
  data: Record<'url' & string, any>
  // urlType: string
) => {
  // const { url } = data
  // if (urlType === 'hdfs') {
  //   const pushArr = ['name_node', 'port']
  //   return omit(
  //     merge(data, {
  //       url: {
  //         hdfs: pick(get(url, 'hdfs.nodes'), pushArr),
  //       },
  //     }),
  //     'url.hdfs.nodes'
  //   )
  // }
  return data
}

/**
 * ?????????????????????
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
    if (urlType !== 'ftp') {
      return undefined
    }
    if (get(sourceInfo, 'url.ftp.protocol') === 2) {
      return sftpFilters
    }
    return ftpFilters
  })

  const fields = getFieldsInfo(urlType, filters)

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
    return get(opSourceList, '[0].last_connection.result') === 1
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
                ????????????
              </div>
            }
          >
            <Field>
              <Label>
                <AffixLabel
                  help="????????????????????????????????????????????????????????????,????????????????????????????????????????????????, ???????????????????????????????????????"
                  required={false}
                >
                  ?????????????????????
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
                      ???????????????
                    </span>
                  </div>
                  <div tw="text-neut-8">
                    ????????????????????????IP?????????????????????????????????????????????
                  </div>
                </div>
              </Control>
            </Field>
            <TextField
              name="name"
              tw="w-80"
              autoComplete="off"
              defaultValue={get(sourceInfo, 'name', '')}
              label={<AffixLabel>???????????????</AffixLabel>}
              placeholder="???????????????????????????????????????"
              help={`?????????????????????????????????????????? ??? "_"????????? 2-64`}
              validateOnChange
              disabled={isViewMode}
              schemas={[
                {
                  rule: { matchRegex: nameMatchRegex },
                  help: '??????????????????????????? ??? "_"???????????????_???????????????????????? 2-64',
                  status: 'error',
                },
                {
                  rule: (value: string) => {
                    const l = strlen(value)
                    return l >= 2 && l <= 64
                  },
                  help: '????????????2,????????????64',
                  status: 'error',
                },
              ]}
            />
            <TextAreaField
              name="desc"
              tw="w-8/12"
              defaultValue={get(sourceInfo, 'desc', '')}
              rows={4}
              label="???????????????"
              disabled={isViewMode}
              resize
              placeholder="?????????????????????????????????"
              validateOnChange
              schemas={[
                {
                  rule: (value: string) => {
                    const l = strlen(value)
                    return l <= 256
                  },
                  help: '?????????????????????0-256????????????',
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
                ????????????
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
              //           help: '???????????????,????????? Name_node Port?????????????????????????????????',
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
                  <span tw="ml-2">???????????????????????????????????????</span>
                </Center>
              </Divider>
            </Field>
            <SelectWithRefresh
              name="network_id"
              css={showPing ? visibleStyle : hiddenStyle}
              value={network.id}
              placeholder="?????????????????????"
              validateOnChange
              disabled={isViewMode}
              label={
                <AffixLabel help="???????????????????????????????????????" required={false}>
                  ????????????
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
                    <span tw="mr-0.5">????????????</span>
                    <HelpCenterLink href={networkLink} isIframe={false}>
                      ??????????????????????????????
                    </HelpCenterLink>
                  </div>
                  <div>
                    <span tw="mr-0.5">
                      ??????????????????????????????????????????????????????????????????????????????????????????????????????
                    </span>
                    <span
                      tw="text-green-11 cursor-pointer"
                      onClick={() => dmStore.setNetWorkOp('create')}
                    >
                      ??????VPC
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
              {/*  <AffixLabel help="?????????????????????????????????" required={false}> */}
              {/*    ???????????????????????? */}
              {/*  </AffixLabel> */}
              {/* </Label> */}
              <DataSourcePingButton
                getValue={parseFormData}
                defaultStatus={defaultStatus}
                network={network}
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
