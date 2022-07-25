import {
  ForwardedRef,
  forwardRef,
  memo,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState
} from 'react'
import tw, { css } from 'twin.macro'
import { Form } from '@QCFE/qingcloud-portal-ui'
import { Icon, Label } from '@QCFE/lego-ui'
import BaseConfigCommon from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/BaseConfigCommon'
import { useImmer } from 'use-immer'
import { source$ } from 'views/Space/Dm/RealTime/Sync/common/subjects'
import { get, isEmpty } from 'lodash-es'
import { map } from 'rxjs'

import { AffixLabel, FlexBox, Center, SelectWithRefresh } from 'components'
import { useQuerySourceTables } from 'hooks'
import {
  IDataSourceConfigProps,
  ISourceRef
} from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/interfaces'
import useTableColumns from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/hooks/useTableColumns'

const { CheckboxGroupField, SelectField, TextField, RadioGroupField, NumberField, ToggleField } =
  Form

const styles = {
  arrowBox: tw`space-x-2 bg-neut-17 w-[70%] z-10`,
  dashedBox: tw`border border-dashed rounded-md border-neut-13 py-0`,
  dashedSplit: tw`border-neut-13 border-l border-dashed my-1`,
  form: css`
    &.form.is-horizon-layout {
      ${tw`px-3 flex-1 mt-6 mb-3 space-y-2 min-w-[445px]`}
      > .field {
        ${tw`mb-0`}
        > .label {
          ${tw`w-28 pr-0`}
        }

        .select,
        .input {
          ${tw`w-full`}
        }

        .select-with-refresh {
          ${tw`w-2/3 flex max-w-[376px]`}
          .select {
            ${tw`flex-1`}
          }
        }
      }

      label.checkbox input[type='checkbox'] {
        height: 12px !important;
      }

      .help {
        ${tw`ml-28 w-full`}
      }
    }
  `,
  tableSelect: [
    tw`w-full flex-1`,
    css`
      .help {
        ${tw`w-full`}
      }
    `
  ],
  line: [tw`flex-1 border-t border-neut-13 translate-y-1/2`]
}

const updateTypes = [
  {
    label: 'insert',
    value: 'insert'
  },
  {
    label: 'update',
    value: 'update'
  },
  {
    label: 'delete',
    value: 'delete'
  }
]

const startTypes = [
  {
    label: '从指定时间戳开始消费',
    value: 1
  },
  {
    label: '从指定文件的指定位置处消费',
    value: 2
  },
  {
    label: '从作业运行时开始采集',
    value: 3
  }
]

type FieldKeys =
  | 'id'
  | 'filterType'
  | 'filter'
  | 'tableName'
  | 'updateType'
  | 'charset'
  | 'bufNumber'
  | 'threads'
  | 'isGtidMode'
  | 'startType'
  | 'startTime'
  | 'startFile'
  | 'startPosition'

const MysqlBinlogSourceConfig = forwardRef(
  (props: IDataSourceConfigProps, ref: ForwardedRef<ISourceRef>) => {
    const sourceForm = useRef<Form>()

    const [dbInfo, setDbInfo] = useImmer<Partial<Record<FieldKeys, any>>>({})
    const [showAdvanced, setShowAdvanced] = useState(false)
    // const { refetch: refetchColumns } = useSetRealtimeColumns(dbInfo?.id)
    const { refetch: refetchColumns } = useTableColumns(dbInfo?.id, dbInfo?.tableName, 'source')
    useLayoutEffect(() => {
      const sub = source$
        .pipe(
          map((e) => {
            if (!e) {
              return {}
            }
            return {
              id: e?.data?.id,
              filter: get(e, 'data.filter', ''),
              filterType: e?.data?.filter ? 2 : 1,
              tableName: get(e, 'data.table[0]', ''),
              updateType: get(e, 'data.cat', '').split(','),
              charset: get(e, 'data.connection-charset', 1),
              bufNumber: get(e, 'data.buffer-size', 1024),
              threads: get(e, 'data.parallel-thread-size', 2),
              isGtidMode: get(e, 'data.is_gtid_mode', false),
              // eslint-disable-next-line no-nested-ternary
              startType: e?.data?.start?.journal_name ? 2 : e?.data?.start?.timestamp ? 1 : 3,
              startTime: get(e, 'data.start.timestamp'),
              startFile: get(e, 'data.start.journal_name'),
              startPosition: get(e, 'data.start.position')
            }
          })
        )
        .subscribe((e) => {
          setDbInfo(e)
        })
      return () => {
        sub.unsubscribe()
      }
    }, [setDbInfo])

    const { data: tableList, refetch } = useQuerySourceTables(
      {
        sourceId: dbInfo?.id
      },
      { enabled: !!dbInfo?.id }
    )

    useImperativeHandle(ref, () => ({
      validate: () => {
        if (!sourceForm.current) {
          return false
        }
        return sourceForm.current?.validateForm()
      },
      getData: () => {
        if (!dbInfo?.id) {
          return undefined
        }
        return {
          source_id: dbInfo?.id,
          table: [dbInfo?.tableName],
          filter: dbInfo?.filter,
          cat: dbInfo?.updateType.filter(Boolean)?.join(','),
          start: {
            journal_name: dbInfo?.startFile,
            position: dbInfo?.startPosition,
            timestamp: parseInt(dbInfo?.startTime, 10)
          },
          connection_charset: dbInfo?.charset,
          parallel_thread_size: dbInfo?.threads,
          is_gtid_mode: dbInfo?.isGtidMode
        }
      },
      refetchColumn: () => {
        refetchColumns()
      }
    }))

    const renderCommon = () => <BaseConfigCommon from="source" />

    const renderAdvanced = () => {
      if (!showAdvanced) {
        return null
      }
      return (
        <>
          <RadioGroupField
            name="charset"
            label="字符编码"
            options={[
              {
                label: 'UTF-8',
                value: 1
              },
              {
                label: 'GBK',
                value: 2
              }
            ]}
            value={dbInfo?.charset}
            onChange={(e) => {
              setDbInfo((draft) => {
                draft.charset = e
              })
            }}
          />
          <NumberField
            label="并发缓存大小"
            name="bufNumber"
            min={1}
            step={1}
            validateOnChange
            showButton={false}
            value={dbInfo?.bufNumber}
            onChange={(e) => {
              setDbInfo((draft) => {
                draft.bufNumber = e
              })
            }}
            help="必须为 2 的幂"
          />

          <NumberField
            label="并发线程数"
            name="threads"
            min={1}
            max={100}
            step={1}
            validateOnChange
            showButton={false}
            value={dbInfo?.threads}
            onChange={(e) => {
              setDbInfo((draft) => {
                draft.threads = e
              })
            }}
            help="并行解析 binlog 日志线程数，范围：1-100"
          />
          <ToggleField
            name="isGtidMode"
            label="GTID 模式"
            value={dbInfo?.isGtidMode}
            onChange={(e) => {
              setDbInfo((draft) => {
                draft.isGtidMode = e
              })
            }}
          />
        </>
      )
    }

    const showTable = !isEmpty(dbInfo?.tableName) || !isEmpty(dbInfo?.filter)
    return (
      <Form css={styles.form} ref={sourceForm}>
        {renderCommon()}
        {!!dbInfo?.id && (
          <>
            {true && (
              <SelectWithRefresh
                name="tableName"
                label={
                  <Label>
                    <AffixLabel required>数据源表</AffixLabel>
                  </Label>
                }
                onRefresh={refetch}
                // multi
                options={tableList?.items?.map((i) => ({ label: i, value: i })) ?? []}
                value={dbInfo?.tableName ?? []}
                onChange={(e) => {
                  setDbInfo((draft) => {
                    draft.tableName = e
                  })
                }}
                placeholder="请选择数据源表"
                validateOnChange
                schemas={[
                  {
                    rule: { required: true },
                    help: '请选择数据源表',
                    status: 'error'
                  }
                ]}
              />
            )}
            {dbInfo?.filterType === 2 && (
              <TextField
                name="filter"
                value={dbInfo.filter}
                onChange={(e) => {
                  setDbInfo((draft) => {
                    draft.filter = e
                  })
                }}
                validateOnChange
                schemas={[
                  {
                    rule: { required: true },
                    help: '请输入过滤规则',
                    status: 'error'
                  }
                ]}
              />
            )}
          </>
        )}
        {showTable && (
          <>
            <CheckboxGroupField
              name="updateType"
              label={<AffixLabel required>更新类型</AffixLabel>}
              options={updateTypes}
              value={dbInfo?.updateType}
              onChange={(v) => {
                setDbInfo((draft) => {
                  draft.updateType = v
                })
              }}
            />

            <SelectField
              label={<AffixLabel required={false}>起始位置</AffixLabel>}
              name="startType"
              value={dbInfo?.startType}
              onChange={(e) => {
                setDbInfo((draft) => {
                  draft.startType = e
                })
              }}
              options={startTypes}
              validateOnChange
              schemas={[
                {
                  rule: { required: true },
                  help: '请选择起始位置',
                  status: 'error'
                }
              ]}
            />
            {dbInfo?.startType === 1 && (
              <TextField
                label={<AffixLabel required={false}>指定时间戳</AffixLabel>}
                name="startTime"
                value={dbInfo?.startTime}
                onChange={(e: string) => {
                  setDbInfo((draft) => {
                    draft.startTime = e
                  })
                }}
                placeholder="时间戳（timestamp），采集起点从指定的时间戳处消费"
                validateOnChange
                // schemas={[
                //   {
                //     rule: { required: true },
                //     help: '请输入时间戳',
                //     status: 'error'
                //   }
                // ]}
              />
            )}
            {dbInfo?.startType === 2 && (
              <>
                <TextField
                  label={<AffixLabel required>指定文件</AffixLabel>}
                  name="startFile"
                  value={dbInfo?.startFile}
                  onChange={(e: string) => {
                    setDbInfo((draft) => {
                      draft.startFile = e
                    })
                  }}
                  placeholder="文件名（journalName），采集起点从指定文件的起始处消费"
                  validateOnChange
                  schemas={[
                    {
                      rule: { required: true },
                      help: '请输入文件名',
                      status: 'error'
                    }
                  ]}
                />

                <TextField
                  label={<AffixLabel required>指定位置</AffixLabel>}
                  name="startPosition"
                  value={dbInfo?.startPosition}
                  onChange={(e: string) => {
                    setDbInfo((draft) => {
                      draft.startPosition = e
                    })
                  }}
                  placeholder="指定位置（position），采集起点从指定文件的指定位置处消费"
                  validateOnChange
                  schemas={[
                    {
                      rule: { required: true },
                      help: '请输入指定位置',
                      status: 'error'
                    }
                  ]}
                />
              </>
            )}
            <FlexBox>
              <div css={styles.line} />
              <Center tw="px-1 cursor-pointer" onClick={() => setShowAdvanced((prev) => !prev)}>
                <Icon name={`chevron-${showAdvanced ? 'up' : 'down'}`} type="light" />
                高级配置
              </Center>
              <div css={styles.line} />
            </FlexBox>
            {renderAdvanced()}
          </>
        )}
      </Form>
    )
  }
)

export default memo(MysqlBinlogSourceConfig)

/**
 *
 * table
 * 描述：需要解析的数据表。
 * 注意：指定此参数后filter参数将无效，SQL任务只支持监听单张表
 * 必选：否
 * 字段类型：string
 * 默认值：无
 *
 * filter
 * 描述：过滤表名的Perl正则表达式
 * 注意：SQL任务只支持监听单张表
 * 必选：否
 * 字段类型：string
 * 默认值：无
 * 例子：canal schema下的一张表：canal.test1
 *
 * cat
 * 描述：需要解析的数据更新类型，包括insert、update、delete三种
 * 注意：以英文逗号分割的格式填写。如果为空，解析所有数据更新类型
 * 必选：否
 * 字段类型：string
 * 默认值：无
 *
 * timestamp
 * 描述：要读取的binlog文件的开始位置，时间戳，采集起点从指定的时间戳处消费；
 * 必选：否
 * 字段类型：string
 * 默认值：无
 *
 * journal-name
 * 描述：要读取的binlog文件的开始位置，文件名，采集起点从指定文件的起始处消费；
 * 必选：否
 * 字段类型：string
 * 默认值：无
 *
 * position
 * 描述：要读取的binlog文件的开始位置，文件的指定位置，采集起点从指定文件的指定位置处消费
 * 必选：否
 * 字段类型：string
 * 默认值：无
 *
 * connection-charset
 * 描述：编码信息
 * 必选：否
 * 字段类型：string
 * 默认值：UTF-8
 *
 * detecting-enable
 * 描述：是否开启心跳
 * 必选：否
 * 字段类型：boolean
 * 默认值：true
 *
 * detecting-sql
 * 描述：心跳SQL
 * 必选：否
 * 字段类型：string
 * 默认值：SELECT CURRENT_DATE
 *
 * enable-tsdb
 * 描述：是否开启时序表结构能力
 * 必选：否
 * 字段类型：boolean
 * 默认值：true
 *
 * buffer-size
 * 描述：并发缓存大小
 * 注意：必须为2的幂
 * 必选：否
 * 默认值：1024
 *
 * parallel
 * 描述：是否开启并行解析binlog日志
 * 必选：否
 * 字段类型：boolean
 * 默认值：true
 *
 * parallel-thread-size
 * 描述：并行解析binlog日志线程数
 * 注意：只有 paraller 设置为true才生效
 * 必选：否
 * 字段类型：int
 * 默认值：2
 *
 * is-gtid-mode
 * 描述：是否开启gtid模式
 * 必选：否
 * 字段类型：boolean
 * 默认值：false
 *
 * query-time-out
 * 描述：通过TCP连接发送数据(在这里就是要执行的sql)后，等待响应的超时时间，单位毫秒
 * 必选：否
 * 字段类型：int
 * 默认值：300000
 *
 * connect-time-out
 * 描述：数据库驱动(mysql-connector-java)与mysql服务器建立TCP连接的超时时间，单位毫秒
 * 必选：否
 * 字段类型：int
 * 默认值：60000
 *
 * timestamp-format.standard
 *
 *
 */
