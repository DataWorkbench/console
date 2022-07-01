import { Form } from '@QCFE/qingcloud-portal-ui'
import {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react'
import { useImmer } from 'use-immer'
import {
  IDataSourceConfigProps,
  ISourceRef,
} from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/interfaces'
import styles from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/styles'
import BaseConfigCommon from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/BaseConfigCommon'
import { AffixLabel, HelpCenterLink } from 'components'
import { target$ } from 'views/Space/Dm/RealTime/Sync/common/subjects'
import { get } from 'lodash-es'
import { map } from 'rxjs'

type FieldKeys =
  | 'id'
  | 'path'
  | 'fileName'
  | 'writeMode'
  | 'fileType'
  | 'fieldDelimiter'
  | 'encoding'
  | 'compress'

const { TextField, SelectField } = Form
const HdfsTarget = forwardRef(
  (props: IDataSourceConfigProps, ref: ForwardedRef<ISourceRef>) => {
    const [dbInfo, setDbInfo] = useImmer<Partial<Record<FieldKeys, any>>>({})
    const targetForm = useRef<Form>()

    useLayoutEffect(() => {
      const sub = target$
        .pipe(
          map((e) => {
            if (!e) {
              return {}
            }
            return {
              id: get(e, 'data.id'),
              path: get(e, 'data.path'),
              fileName: get(e, 'data.file_name'),
              writeMode: get(e, 'data.write_mode'),
              fileType: get(e, 'data.file_type'),
              fieldDelimiter: get(e, 'data.field_delimiter'),
              encoding: get(e, 'data.encoding'),
              compress: get(e, 'data.compress'),
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

    useImperativeHandle(ref, () => ({
      getData: () => {
        if (!dbInfo?.id) {
          return undefined
        }
        return {
          compress: dbInfo?.compress,
          encoding: dbInfo?.encoding,
          field_delimiter: dbInfo?.fieldDelimiter,
          file_name: dbInfo?.fileName,
          file_type: dbInfo?.fileType,
          path: dbInfo?.path,
          write_mode: dbInfo?.writeMode,
        }
      },
      validate: () => {
        if (!targetForm.current) {
          return false
        }
        return targetForm.current?.validateForm()
      },
      refetchColumn: () => {},
    }))

    return (
      <Form css={styles.form} ref={targetForm}>
        <BaseConfigCommon from="target" />
        {dbInfo?.id && (
          <>
            <TextField
              label={<AffixLabel required>文件路径</AffixLabel>}
              name="path"
              value={dbInfo?.path}
              onChange={(e) => {
                setDbInfo((draft) => {
                  draft.path = e
                })
              }}
              placeholder="请输入文件路径"
              help={
                <HelpCenterLink hasIcon isIframe={false} href="###">
                  HDFS Sink 配置文档
                </HelpCenterLink>
              }
            />
            <TextField
              label={<AffixLabel required>写入文件名</AffixLabel>}
              name="fileName"
              value={dbInfo?.fileName}
              onChange={(e) => {
                setDbInfo((draft) => {
                  draft.fileName = e
                })
              }}
              placeholder="请输入写入文件名"
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
              options={
                /**
                 * append = 1;
                 * overwrite = 2;
                 */
                [
                  { label: 'append', value: 1 },
                  { label: 'overwrite', value: 2 },
                ]
              }
              placeholder="请选择写入模式"
            />
            <SelectField
              label={<AffixLabel required>文件类型</AffixLabel>}
              name="type"
              value={dbInfo?.fileType}
              onChange={(e) => {
                setDbInfo((draft) => {
                  draft.fileType = e
                })
              }}
              options={
                /**
                 * text = 1;
                 * orc = 2;
                 * parquet = 3;
                 */
                [
                  { label: 'text', value: 1 },
                  { label: 'orc', value: 2 },
                  { label: 'parquet', value: 3 },
                ]
              }
              placeholder="请选择文件类型"
            />

            {dbInfo?.fileType === 1 && (
              <>
                <TextField
                  label="分隔符"
                  name="fieldDelimiter"
                  value={dbInfo?.fieldDelimiter}
                  onChange={(e) => {
                    setDbInfo((draft) => {
                      draft.fieldDelimiter = e
                    })
                  }}
                  placeholder="请输入分隔符"
                />
                <SelectField
                  name="encoding"
                  label="字符编码"
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
                      { label: 'GBK', value: 2 },
                    ]
                  }
                  placeholder="请选择字符编码"
                />
              </>
            )}
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

export default HdfsTarget
