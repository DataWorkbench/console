import { ForwardedRef, forwardRef, useImperativeHandle, useLayoutEffect, useRef } from 'react'
import {
  IDataSourceConfigProps,
  ISourceRef
} from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/interfaces'
import { useImmer } from 'use-immer'
import { Form } from '@QCFE/qingcloud-portal-ui'
import BaseConfigCommon from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/BaseConfigCommon'
import { AffixLabel, HelpCenterLink, SelectWithRefresh } from 'components'
import { useQuerySourceTables } from 'hooks'
import { get } from 'lodash-es'
import { map } from 'rxjs'
import useTableColumns from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/hooks/useTableColumns'
import styles from './styles'
import { target$ } from '../common/subjects'

const { TextField, SelectField, RadioGroupField } = Form
type FieldKeys =
  | 'id'
  | 'tableName'
  | 'partition'
  | 'usePartition'
  | 'type'
  | 'fileType'
  | 'writeMode'
  | 'compress'
  | 'fieldDelimiter'
  | 'encoding'
const HiveTargetConfig = forwardRef(
  (props: IDataSourceConfigProps, ref: ForwardedRef<ISourceRef>) => {
    const [dbInfo, setDbInfo] = useImmer<Partial<Record<FieldKeys, any>>>({})
    const targetForm = useRef<Form>()

    useLayoutEffect(() => {
      target$
        .pipe(
          map((e) => {
            if (!e) {
              return {}
            }
            return {
              id: get(e, 'data.id'),
              tableName: get(e, 'data.table'),
              partition: get(e, 'data.partition', 'pt'),
              usePartition: get(e, 'data.use_partition', false),
              type: get(e, 'data.partition_type', 1),
              fileType: get(e, 'data.file_type'),
              writeMode: get(e, 'data.write_mode', 1),
              compress: get(e, 'data.compress'),
              fieldDelimiter: get(e, 'data.field_delimiter', '\\001'),
              encoding: get(e, 'data.encoding', 1)
            }
          })
        )
        .subscribe((e) => setDbInfo(e))
    }, [setDbInfo])

    const { data: tableList, refetch } = useQuerySourceTables(
      {
        sourceId: dbInfo?.id
      },
      { enabled: !!dbInfo?.id }
    )

    const { refetch: refetchColumns } = useTableColumns(dbInfo?.id, dbInfo?.tableName, 'target')

    useImperativeHandle(ref, () => ({
      validate: () => {
        if (!targetForm.current) {
          return false
        }
        return targetForm.current?.validateForm()
      },
      getData: () => ({
        source_id: dbInfo?.id,
        compress: dbInfo?.compress === 0 ? undefined : dbInfo?.compress,
        file_type: dbInfo?.fileType,
        partition: dbInfo?.partition,
        partition_type: dbInfo?.type,
        table: dbInfo?.tableName,
        use_partition: dbInfo?.usePartition,
        write_mode: dbInfo?.writeMode,
        field_delimiter: dbInfo?.fieldDelimiter,
        encoding: dbInfo?.encoding
      }),
      refetchColumn: () => {
        refetchColumns()
      }
    }))

    return (
      <Form css={styles.form} ref={targetForm}>
        <BaseConfigCommon from="target" />
        {dbInfo?.id && (
          <>
            <SelectWithRefresh
              name="tableName"
              onRefresh={refetch}
              options={tableList?.items?.map((i) => ({ label: i, value: i })) ?? []}
              value={dbInfo?.tableName ?? []}
              onChange={(e) => {
                setDbInfo((draft) => {
                  draft.tableName = e
                })
              }}
              placeholder="请选择数据源表"
              validateOnChange
              label={<AffixLabel required>数据源表</AffixLabel>}
              schemas={[
                {
                  rule: { required: true },
                  help: (
                    <div>
                      <span>不能为空, </span>
                      <span tw="text-font-placeholder mr-1">详见</span>
                      <HelpCenterLink
                        hasIcon
                        isIframe={false}
                        href="/manual/integration_job/cfg_sink/hive/"
                      >
                        Hive Sink 配置文档
                      </HelpCenterLink>
                    </div>
                  ),
                  status: 'error'
                }
              ]}
              help={
                <HelpCenterLink
                  hasIcon
                  isIframe={false}
                  href="/manual/integration_job/cfg_sink/hive/"
                >
                  Hive Sink 配置文档
                </HelpCenterLink>
              }
            />

            <TextField
              label={
                <AffixLabel
                  required
                  help={
                    <div>
                      <div>Hive 表的分区信息：</div>
                      <div>
                        如果您写出的 Hive 表是分区表，您需要配置 partition 信息。同步任务会写出
                        partition 对应的分区数据。
                      </div>
                    </div>
                  }
                  theme="green"
                >
                  分区字段
                </AffixLabel>
              }
              name="partition"
              value={dbInfo?.partition}
              onChange={(e) => {
                setDbInfo((draft) => {
                  draft.partition = e
                })
              }}
              placeholder="请输入分区字段"
              validateOnChange
              schemas={[
                {
                  rule: { required: true },
                  help: '请输入分区字段',
                  status: 'error'
                }
              ]}
            />

            <SelectField
              label={
                <AffixLabel
                  required
                  help="分区类型包括 DAY、HOUR、MINUTE 三种。若分区不存在则会自动创建，自动创建的分区时间以当前任务运行的服务器时间为准。"
                >
                  分区类型
                </AffixLabel>
              }
              name="type"
              value={dbInfo?.type}
              onChange={(e) => {
                setDbInfo((draft) => {
                  draft.type = e
                })
              }}
              options={[
                {
                  label: 'DAY：天分区，分区示例：pt=20200101',
                  value: 1
                },
                {
                  label: 'HOUR：小时分区，分区示例：pt=2020010110',
                  value: 2
                },
                {
                  label: 'MINUTE：分钟分区，分区示例：pt=202001011027',
                  value: 3
                }
              ]}
              placeholder="请选择分区类型"
              validateOnChange
              schemas={[
                {
                  rule: { required: true },
                  help: '请选择分区类型',
                  status: 'error'
                }
              ]}
            />

            <SelectField
              label={<AffixLabel required>写入模式</AffixLabel>}
              name="writeMode"
              value={dbInfo?.writeMode}
              onChange={(e) => {
                setDbInfo((draft) => {
                  draft.writeMode = e
                })
              }}
              options={[
                {
                  label: 'append：追加',
                  value: 1
                },
                {
                  label: 'overwrite：覆盖',
                  value: 2
                }
              ]}
              placeholder="请选择写入模型"
              validateOnChange
              schemas={[
                {
                  rule: { required: true },
                  help: '请选择写入模型',
                  status: 'error'
                }
              ]}
            />
            <SelectField
              label={<AffixLabel required>文件类型</AffixLabel>}
              value={dbInfo?.fileType}
              name="fileType"
              onChange={(e) => {
                /**
                 * text 默认不进行压缩
                 * orc 默认为ZLIB格式
                 * parquet 默认为SNAPPY格式
                 */
                const map1 = {
                  1: 0,
                  2: 0,
                  3: 3
                }
                setDbInfo((draft) => {
                  draft.fileType = e
                  draft.compress = map1[e as 1]
                })
              }}
              options={['text', 'orc', 'parquet'].map((i, index) => ({
                label: i,
                value: index + 1
              }))}
              placeholder="请选择文件类型"
              validateOnChange
              schemas={[
                {
                  rule: { required: true },
                  help: '请选择文件类型',
                  status: 'error'
                }
              ]}
            />
            {dbInfo?.fileType === 1 && (
              <>
                <TextField
                  label={<AffixLabel required={false}>分隔符</AffixLabel>}
                  value={dbInfo?.fieldDelimiter}
                  name="fieldDelimiter"
                  onChange={(e) => {
                    setDbInfo((draft) => {
                      draft.fieldDelimiter = e
                    })
                  }}
                />
                <RadioGroupField
                  name="encoding"
                  label={<AffixLabel required>字符编码</AffixLabel>}
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
                      { label: 'UTF-8', value: 1 },
                      { label: 'GBK', value: 2 }
                    ]
                  }
                  placeholder="请选择字符编码"
                  validateOnChange
                  schemas={[
                    {
                      rule: { required: true },
                      help: '请选择字符编码',
                      status: 'error'
                    }
                  ]}
                />
              </>
            )}
            {dbInfo?.fileType && (
              <SelectField
                label={<AffixLabel required>压缩类型</AffixLabel>}
                value={dbInfo?.compress}
                name="compress"
                onChange={(e) => {
                  setDbInfo((draft) => {
                    draft.compress = e
                  })
                }}
                options={
                  /**
                   * text：支持GZIP、BZIP2格式
                   * orc：支持SNAPPY、GZIP、BZIP、LZ4格式
                   * parquet：支持SNAPPY、GZIP、LZO格式
                   *
                   * CompressTypeUnset = 0;
                   *    GZIP = 1;
                   *    BZIP2 = 2;
                   *    SNAPPY = 3;
                   *    BZIP = 4;
                   *    LZ4 = 5;
                   *    LZO = 6;
                   */
                  {
                    1: [
                      ['不进行压缩', 0],
                      ['GZIP', 1],
                      ['BZIP2', 2]
                    ],
                    2: [
                      ['不进行压缩', 0],
                      ['SNAPPY', 3],
                      ['GZIP', 1],
                      ['BZIP', 4],
                      ['LZ4', 5]
                    ],
                    3: [
                      ['不进行压缩', 0],
                      ['SNAPPY', 3],
                      ['GZIP', 1],
                      ['LZO', 6]
                    ]
                  }[dbInfo?.fileType as 1]?.map(([label, value]) => ({
                    label,
                    value
                  })) ?? []
                }
                placeholder="请选择压缩类型"
                validateOnChange
                schemas={[
                  {
                    rule: { required: true },
                    help: '请选择压缩类型',
                    status: 'error'
                  }
                ]}
              />
            )}
          </>
        )}
      </Form>
    )
  }
)

export default HiveTargetConfig
