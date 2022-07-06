import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import styles from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/styles'
import BaseConfigCommon from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/BaseConfigCommon'
import { useImmer } from 'use-immer'
import { Form } from '@QCFE/qingcloud-portal-ui'
import { map } from 'rxjs'
import { get } from 'lodash-es'
import { useQuerySourceTables } from 'hooks'
import {
  AffixLabel,
  Center,
  FlexBox,
  HelpCenterLink,
  SelectWithRefresh,
} from 'components'
import { Control, Field, Icon, InputNumber, Label } from '@QCFE/lego-ui'
import { IDataSourceConfigProps, ISourceRef } from './interfaces'
import { source$ } from '../common/subjects'

type FieldKeys =
  | 'id'
  | 'table'
  | 'customRange'
  | 'startRowKey'
  | 'endRowKey'
  | 'isBinaryRowKey'
  | 'encoding'
  | 'scanCacheSize'
  | 'scanBatchSize'
  | 'readMode'

const { TextField, ToggleField, RadioGroupField } = Form
const HbaseSource = forwardRef<ISourceRef, IDataSourceConfigProps>(
  (props, ref) => {
    const [dbInfo, setDbInfo] = useImmer<Partial<Record<FieldKeys, any>>>({})
    const [showAdvanced, setShowAdvanced] = useState(false)
    const sourceForm = useRef<Form>()

    useLayoutEffect(() => {
      const sub = source$
        .pipe(
          map((e) => {
            if (!e) {
              return {}
            }
            return {
              id: get(e, 'data.id'),
              table: get(e, 'data.table'),
              customRange:
                !!get(e, 'data.start_row_key') || !!get(e, 'data.end_row_key'),
              startRowKey: get(e, 'data.start_row_key'),
              endRowKey: get(e, 'data.end_row_key'),
              isBinaryRowKey: get(e, 'data.is_binary_rowkey', true),
              encoding: get(e, 'data.encoding', 'UTF-8'),
              scanCacheSize: get(e, 'data.scan_cache_size', 256),
              scanBatchSize: get(e, 'data.scan_batch_size', 100),
              readMode: get(e, 'data.read_mode', 'NORMAL'),
            }
          })
        )
        .subscribe((e) => setDbInfo(e))
      return () => {
        sub.unsubscribe()
      }
    }, [setDbInfo])

    const { data: tableList, refetch } = useQuerySourceTables(
      {
        sourceId: dbInfo?.id,
      },
      { enabled: !!dbInfo?.id }
    )

    useImperativeHandle(ref, () => {
      return {
        validate: () => {
          if (!sourceForm.current) {
            return false
          }
          return sourceForm.current?.validateForm()
        },
        getData: () => {
          return {
            id: dbInfo?.id,
            table: dbInfo?.table,
            custom_range: dbInfo?.customRange,
            start_row_key: dbInfo?.startRowKey,
            end_row_key: dbInfo?.endRowKey,
            is_binary_rowkey: dbInfo?.isBinaryRowKey,
            encoding: dbInfo?.encoding,
            scan_cache_size: dbInfo?.scanCacheSize,
            scan_batch_size: dbInfo?.scanBatchSize,
            read_mode: dbInfo?.readMode,
          }
        },
        refetchColumn: () => {},
      }
    })

    return (
      <Form css={styles.form} ref={sourceForm}>
        <BaseConfigCommon from="source" />
        {dbInfo?.id && (
          <>
            <SelectWithRefresh
              name="table"
              onRefresh={refetch}
              multi
              options={
                tableList?.items?.map((i) => ({ label: i, value: i })) ?? []
              }
              value={dbInfo?.table}
              onChange={(e) => {
                setDbInfo((draft) => {
                  draft.table = e
                })
              }}
              placeholder="请选择数据源表"
              validateOnChange
              schemas={[
                {
                  rule: { required: true },
                  help: (
                    <div>
                      <span>不能为空, </span>
                      <span tw="text-font-placeholder mr-1">详见</span>
                      <HelpCenterLink hasIcon isIframe={false} href="###">
                        HBase Source 配置文档
                      </HelpCenterLink>
                    </div>
                  ),
                  status: 'error',
                },
              ]}
              help={
                <HelpCenterLink isIframe={false} hasIcon href="###">
                  HBase Source 配置文档
                </HelpCenterLink>
              }
            />
            <ToggleField
              label={<AffixLabel required>自定义主键范围</AffixLabel>}
              name="customRange"
              value={dbInfo?.customRange}
              onChange={(e) => {
                setDbInfo((draft) => {
                  draft.customRange = e
                })
              }}
              validateOnChange
            />
            {dbInfo?.customRange && (
              <>
                <TextField
                  label={<AffixLabel required>开始主键</AffixLabel>}
                  name="startRowKey"
                  value={dbInfo?.startRowKey}
                  onChange={(e) => {
                    setDbInfo((draft) => {
                      draft.startRowKey = e
                    })
                  }}
                  placeholder="请指定开始主键"
                  validateOnChange
                  schemas={[
                    {
                      rule: { required: true },
                      help: '请输入开始主键',
                      status: 'error',
                    },
                  ]}
                />
                <TextField
                  label={<AffixLabel required>结束主键</AffixLabel>}
                  name="endRowKey"
                  value={dbInfo?.endRowKey}
                  onChange={(e) => {
                    setDbInfo((draft) => {
                      draft.endRowKey = e
                    })
                  }}
                  placeholder="请指定结束主键"
                  validateOnChange
                  schemas={[
                    {
                      rule: { required: true },
                      help: '请输入结束主键',
                      status: 'error',
                    },
                  ]}
                />
              </>
            )}
            <RadioGroupField
              label={<AffixLabel required>起始主键类型</AffixLabel>}
              name="isBinaryRowKey"
              value={dbInfo?.isBinaryRowKey}
              onChange={(e) => {
                setDbInfo((draft) => {
                  draft.isBinaryRowKey = e
                })
              }}
              options={
                /**
                 * false: 字符串类型
                 * true: 二进制类型
                 */
                [
                  { label: '字符串', value: false },
                  {
                    label: (
                      <AffixLabel
                        required
                        theme="green"
                        help="在读取时，将 starkRowkey 、endRowkey 填写的字符串转为二进制格式进行比对"
                      >
                        二进制
                      </AffixLabel>
                      // <div tw="inline-flex">
                      //   <span tw="mr-1.5">二进制</span>
                      //   <HelpIcon
                      //     help="在读取时，将 starkRowkey 、endRowkey 填写的字符串转为二进制格式进行比对"
                      //     theme="green"
                      //   />
                      // </div>
                    ),
                    value: true,
                  },
                ]
              }
              validateOnChange
              schemas={[
                {
                  rule: { required: true },
                  help: '请选择起始主键类型',
                  status: 'error',
                },
              ]}
            />
            <RadioGroupField
              name="encoding"
              label={
                <AffixLabel
                  required
                  theme="green"
                  help="编码方式：UTF-8 或 GBK，用于对二进制存储的HBase byte[]转为String时的编码。"
                >
                  编码方式
                </AffixLabel>
              }
              value={dbInfo?.encoding}
              onChange={(e) => {
                setDbInfo((draft) => {
                  draft.encoding = e
                })
              }}
              options={
                /**
                 * UTF-8 = 1;
                 * GBK = 2;
                 */
                [
                  { label: 'UTF-8', value: 'UTF-8' },
                  { label: 'GBK', value: 'GBK' },
                ]
              }
              validateOnChange
              schemas={[
                {
                  rule: { required: true },
                  help: '请选择编码方式',
                  status: 'error',
                },
              ]}
            />
            <FlexBox>
              <div css={styles.line} />
              <Center
                tw="px-1 cursor-pointer"
                onClick={() => setShowAdvanced((prev) => !prev)}
              >
                <Icon
                  name={`chevron-${showAdvanced ? 'up' : 'down'}`}
                  type="light"
                />
                高级配置
              </Center>
              <div css={styles.line} />
            </FlexBox>
            {showAdvanced && (
              <>
                <Field>
                  <Label
                    className="label"
                    help="HBase client 每次 RPC 从服务器端读取的行数。"
                    theme="green"
                  >
                    <AffixLabel>批量读取行数</AffixLabel>
                  </Label>
                  <Control>
                    <InputNumber
                      label={null}
                      name="scanCacheSize"
                      showButton={false}
                      min={1}
                      step={1}
                      value={dbInfo?.scanCacheSize}
                      onChange={(e) => {
                        setDbInfo((draft) => {
                          draft.scanCacheSize = e
                        })
                      }}
                    />
                    <span tw="leading-7 ml-1.5"> 行 </span>
                  </Control>
                </Field>
                <Field>
                  <Label
                    className="label"
                    help="HBase client 每次 RPC 从服务器端读取的列数。"
                    theme="green"
                  >
                    <AffixLabel>批量读取列数</AffixLabel>
                  </Label>
                  <Control>
                    <InputNumber
                      label={null}
                      name="scanColumnsSize"
                      showButton={false}
                      min={1}
                      step={1}
                      value={dbInfo?.scanBatchSize}
                      onChange={(e) => {
                        setDbInfo((draft) => {
                          draft.scanBatchSize = e
                        })
                      }}
                    />
                    <span tw="leading-7 ml-1.5"> 行 </span>
                  </Control>
                </Field>
                <RadioGroupField
                  label={<AffixLabel required>读取模式</AffixLabel>}
                  name="readMode"
                  value={dbInfo?.readMode}
                  onChange={(e) => {
                    setDbInfo((draft) => {
                      draft.readMode = e
                    })
                  }}
                  options={[
                    {
                      label: (
                        <AffixLabel
                          required={false}
                          help="横表模式：把 HBase 中的表当成普通二维表（横表）进行读取，获取最新版本数据。"
                          theme="green"
                        >
                          横表
                        </AffixLabel>
                      ),
                      value: 1,
                    },
                    {
                      label: (
                        <AffixLabel
                          required={false}
                          theme="green"
                          help="竖表模式：把 HBase 中的表当成竖表进行读取。读出的每条记录是四列形式，依次为 rowKey、family:qualifier、timestamp和value。读取时需要明确指定要读取的列，把每一个 cell 中的值，作为一条记录（record），若有多个版本则存在多条记录。"
                        >
                          竖表
                        </AffixLabel>
                      ),
                      value: 2,
                    },
                  ]}
                  validateOnChange
                  schemas={[
                    {
                      rule: { required: true },
                      help: '请选择读取模式',
                      status: 'error',
                    },
                  ]}
                />
              </>
            )}
          </>
        )}
      </Form>
    )
  }
)

export default HbaseSource
