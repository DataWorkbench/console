import { forwardRef, useImperativeHandle, useLayoutEffect, useRef } from 'react'
import styles from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/styles'
import BaseConfigCommon from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/BaseConfigCommon'
import { useImmer } from 'use-immer'
import { Form } from '@QCFE/qingcloud-portal-ui'
import { map } from 'rxjs'
import { get } from 'lodash-es'
import { AffixLabel, Center, FlexBox, HelpCenterLink } from 'components'
import { Control, Field, Icon, InputNumber, Label } from '@QCFE/lego-ui'
import { IDataSourceConfigProps, ISourceRef } from './interfaces'
import { target$ } from '../common/subjects'

type FieldKeys = 'id' | 'nullMode' | 'encoding' | 'walFlag' | 'writeBufferSize' | 'table'

const { SelectField, RadioGroupField, ToggleField, TextField } = Form
const HbaseTarget = forwardRef<ISourceRef, IDataSourceConfigProps>((props, ref) => {
  const [dbInfo, setDbInfo] = useImmer<Partial<Record<FieldKeys, any>>>({})
  const sourceForm = useRef<Form>()

  const [showAdvanced, setShowAdvanced] = useImmer(false)
  useLayoutEffect(() => {
    const sub = target$
      .pipe(
        map((e) => {
          if (!e) {
            return {}
          }
          return {
            id: get(e, 'data.id'),
            nullMode: get(e, 'data.null_mode', 1),
            encoding: get(e, 'data.encoding', 1),
            walFlag: get(e, 'data.wal_flag', false),
            writeBufferSize: get(e, 'data.write_buffer_size', 8388608),
            table: get(e, 'data.table')
          }
        })
      )
      .subscribe((e) => setDbInfo(e))
    return () => {
      sub.unsubscribe()
    }
  }, [setDbInfo])

  useImperativeHandle(ref, () => ({
    validate: () => {
      if (!sourceForm.current) {
        return false
      }
      return sourceForm.current?.validateForm()
    },
    getData: () => ({
      id: dbInfo?.id,
      null_mode: dbInfo?.nullMode,
      encoding: dbInfo?.encoding,
      wal_flag: dbInfo?.walFlag,
      write_buffer_size: dbInfo?.writeBufferSize,
      table: dbInfo?.table
    }),
    refetchColumn: () => {}
  }))
  return (
    <Form css={styles.form} ref={sourceForm}>
      <BaseConfigCommon from="target" />
      {dbInfo?.id && (
        <>
          <TextField
            label={<AffixLabel>数据源表</AffixLabel>}
            name="table"
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
                      HBase Sink 配置文档
                    </HelpCenterLink>
                  </div>
                ),
                status: 'error'
              }
            ]}
            help={
              <HelpCenterLink isIframe={false} hasIcon href="###">
                HBase Sink 配置文档
              </HelpCenterLink>
            }
          />
          <SelectField
            label={<AffixLabel required>空值操作</AffixLabel>}
            name="nullMode"
            value={dbInfo?.nullMode}
            onChange={(e) => {
              setDbInfo((draft) => {
                draft.nullMode = e
              })
            }}
            options={
              /**
               * skip：表示不向hbase写这列；
               * empty：写入HConstants.EMPTY_BYTE_ARRAY
               */
              [
                { label: 'skip: 不向hbase写这列', value: 1 },
                {
                  label: 'empty: 写入HConstants.EMPTY_BYTE_ARRAY，即new byte [0]',
                  value: 2
                }
              ]
            }
            validateOnChange
            schemas={[
              {
                rule: { required: true },
                help: '请选择空值操作',
                status: 'error'
              }
            ]}
            placeholder="请选择空值操作"
            help="读取的 null 值时的处理方式"
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
                { label: 'UTF-8', value: 1 },
                { label: 'GBK', value: 2 }
              ]
            }
            validateOnChange
            schemas={[
              {
                rule: { required: true },
                help: '请选择编码方式',
                status: 'error'
              }
            ]}
          />
          <FlexBox>
            <div css={styles.line} />
            <Center tw="px-1 cursor-pointer" onClick={() => setShowAdvanced((prev) => !prev)}>
              <Icon name={`chevron-${showAdvanced ? 'up' : 'down'}`} type="light" />
              高级配置
            </Center>
            <div css={styles.line} />
          </FlexBox>
          {showAdvanced && (
            <>
              <ToggleField
                label={
                  <AffixLabel
                    required
                    theme="green"
                    help="在 HBase client 向集群中的 RegionServer 提交数据时（Put/Delete操作），首先会先写 WAL（Write Ahead Log）日志（即HLog，一个 RegionServer 上的所有 Region 共享一个 HLog），只有当WAL日志写成功后，再接着写 MemStore，然后客户端被通知提交数据成功；如果写 WAL 日志失败，客户端则被通知提交失败。关闭（false）放弃写 WAL 日志，从而提高数据写入的性能"
                  >
                    WAL标志
                  </AffixLabel>
                }
                name="walFlag"
                value={dbInfo?.walFlag}
                onChange={(e) => {
                  setDbInfo((draft) => {
                    draft.walFlag = e
                  })
                }}
                onText="启用"
                offText="禁用"
              />
              <Field>
                <Label className="label">
                  <AffixLabel
                    required={false}
                    theme="green"
                    help={
                      '设置 HBase client 的写 buffer 大小，单位字节。配合 autoflush使用。' +
                      'autoflush 开启（true）表示 Hbase client 在写的时候有一条 put 就执行一次更新；关闭（false），' +
                      '表示 Hbase client 在写的时候只有当 put 填满客户端写缓存时，才实际向 HBase 服务端发起写请求，默认值：8388608（8M）'
                    }
                  >
                    Buffer size
                  </AffixLabel>
                </Label>
                <Control>
                  <InputNumber
                    label={null}
                    name="bufferSize"
                    showButton={false}
                    min={1}
                    step={1}
                    value={dbInfo?.writeBufferSize}
                    onChange={(e) => {
                      setDbInfo((draft) => {
                        draft.writeBufferSize = e
                      })
                    }}
                  />
                  <span tw="leading-7 ml-1.5"> 字节 </span>
                </Control>
                <div className="help">1-max</div>
              </Field>
            </>
          )}
        </>
      )}
    </Form>
  )
})

export default HbaseTarget
