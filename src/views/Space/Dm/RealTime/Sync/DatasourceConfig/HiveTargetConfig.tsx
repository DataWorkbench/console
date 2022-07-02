import {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react'
import {
  IDataSourceConfigProps,
  ISourceRef,
} from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/interfaces'
import { useImmer } from 'use-immer'
import { Form } from '@QCFE/qingcloud-portal-ui'
import BaseConfigCommon from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/BaseConfigCommon'
import { AffixLabel, HelpCenterLink, SelectWithRefresh } from 'components'
import { useQuerySourceTables } from 'hooks'
import { get } from 'lodash-es'
import { map } from 'rxjs'
import styles from './styles'
import { target$ } from '../common/subjects'

const { TextField, SelectField, ToggleField } = Form
type FieldKeys =
  | 'id'
  | 'tableName'
  | 'partition'
  | 'usePartition'
  | 'type'
  | 'fileType'
  | 'writeMode'
  | 'compress'
const HiveTargetConfig = forwardRef(
  (props: IDataSourceConfigProps, ref: ForwardedRef<ISourceRef>) => {
    const [dbInfo, setDbInfo] = useImmer<Partial<Record<FieldKeys, any>>>({})
    const targetForm = useRef<Form>()

    useLayoutEffect(() => {
      target$.pipe(
        map((e) => {
          if (!e) {
            return {}
          }
          return {
            id: get(e, 'data.id'),
            tableName: get(e, 'data.table'),
            partition: get(e, 'data.partition'),
            usePartition: get(e, 'data.use_partition'),
            type: get(e, 'data.partition_type'),
            fileType: get(e, 'data.file_type'),
            writeMode: get(e, 'data.write_mode'),
            compress: get(e, 'data.compress'),
          }
        })
      )
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
          if (!targetForm.current) {
            return false
          }
          return targetForm.current?.validateForm()
        },
        getData: () => {
          return {
            source_id: dbInfo?.id,
            compress: dbInfo?.compress,
            file_type: dbInfo?.fileType,
            partition: dbInfo?.partition,
            partition_type: dbInfo?.type,
            table: dbInfo?.tableName,
            use_partition: dbInfo?.usePartition,
            write_mode: dbInfo?.writeMode,
          }
        },
        refetchColumn: () => {
          // TODO: 从 columns 中获取 targetColumns
        },
      }
    })

    return (
      <Form css={styles.form} ref={targetForm}>
        <BaseConfigCommon from="target" />
        {dbInfo?.id && (
          <>
            <SelectWithRefresh
              name="tableName"
              onRefresh={refetch}
              multi
              options={
                tableList?.items?.map((i) => ({ label: i, value: i })) ?? []
              }
              value={dbInfo?.tableName ?? []}
              onChange={(e) => {
                setDbInfo((draft) => {
                  draft.tableName = e
                })
              }}
              placeholder="请选择数据源表"
              validateOnChange
            />

            <ToggleField
              label={<AffixLabel required>使用分区</AffixLabel>}
              name="usePartition"
              value={dbInfo?.usePartition}
              onChange={(e) => {
                setDbInfo((draft) => {
                  draft.usePartition = e
                })
              }}
            />
            <TextField
              label={
                <AffixLabel
                  required
                  help={
                    <div>
                      <div>Hive 表的分区信息：</div>
                      <div>
                        如果您写出的 Hive 表是分区表，您需要配置 partition
                        信息。同步任务会写出 partition 对应的分区数据。
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
              help={
                <HelpCenterLink hasIcon isIframe={false} href="###">
                  Hive Sink 配置文档
                </HelpCenterLink>
              }
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
                  value: 'DAY',
                },
                {
                  label: 'HOUR：小时分区，分区示例：pt=2020010110',
                  value: 'HOUR',
                },
                {
                  label: 'MINUTE：分钟分区，分区示例：pt=202001011027',
                  value: 'MINUTE',
                },
              ]}
              placeholder="请选择分区类型"
              validateOnChange
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
                  value: 'append',
                },
                {
                  label: 'overwrite：覆盖',
                  value: 'overwrite',
                },
              ]}
              placeholder="请选择写入模型"
              validateOnChange
            />
            <SelectField
              label={<AffixLabel required>文件类型</AffixLabel>}
              value={dbInfo?.fileType}
              onChange={(e) => {
                /**
                 * text 默认不进行压缩
                 * orc 默认为ZLIB格式
                 * parquet 默认为SNAPPY格式
                 */
                const map1 = {
                  text: undefined,
                  orc: 'ZLIB',
                  parquet: 'SNAPPY',
                }
                setDbInfo((draft) => {
                  draft.fileType = e
                  draft.compress = map1[e as 'text']
                })
              }}
              options={['text', 'orc', 'parquet'].map((i) => ({
                label: i,
                value: i,
              }))}
              placeholder="请选择文件类型"
              validateOnChange
            />
            {dbInfo?.fileType && (
              <SelectField
                label={<AffixLabel required>压缩类型</AffixLabel>}
                value={dbInfo?.compress}
                onChnage={(e) => {
                  setDbInfo((draft) => {
                    draft.compress = e
                  })
                }}
                options={
                  /**
                   * text：支持GZIP、BZIP2格式
                   * orc：支持SNAPPY、GZIP、BZIP、LZ4格式
                   * parquet：支持SNAPPY、GZIP、LZO格式
                   */
                  {
                    text: ['GZIP', 'BZIP2'],
                    orc: ['SNAPPY', 'GZIP', 'BZIP', 'LZ4'],
                    parquet: ['SNAPPY', 'GZIP', 'LZO'],
                  }[dbInfo?.fileType as 'text']?.map((i) => ({
                    label: i,
                    value: i,
                  })) ?? []
                }
                placeholder="请选择压缩类型"
                validateOnChange
              />
            )}
          </>
        )}
      </Form>
    )
  }
)

export default HiveTargetConfig
