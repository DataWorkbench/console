import {
  ForwardedRef,
  forwardRef,
  memo,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import tw, { css } from 'twin.macro'
import { Form } from '@QCFE/qingcloud-portal-ui'
import { Field, Icon, Label, RadioButton } from '@QCFE/lego-ui'
import BaseConfigCommon from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/BaseConfigCommon'
import { useImmer } from 'use-immer'
import { source$ } from 'views/Space/Dm/RealTime/Sync/common/subjects'
import { get, isEmpty } from 'lodash-es'
import { map } from 'rxjs'

import { AffixLabel, FlexBox, Center, SelectWithRefresh } from 'components'
import { useQuerySourceTables } from 'hooks'
import {
  IDataSourceConfigProps,
  ISourceRef,
} from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/interfaces'
import useSetRealtimeColumns from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/hooks/useSetRealtimeColumns'

const {
  CheckboxGroupField,
  SelectField,
  TextField,
  RadioGroupField,
  NumberField,
  ToggleField,
} = Form

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
    `,
  ],
  line: [tw`flex-1 border-t border-neut-13 translate-y-1/2`],
}

const updateTypes = [
  {
    label: 'insert',
    value: 1,
  },
  {
    label: 'update',
    value: 2,
  },
  {
    label: 'delete',
    value: 3,
  },
]

const startTypes = [
  {
    label: '从指定时间戳开始消费',
    value: 1,
  },
  {
    label: '从指定文件的指定位置处消费',
    value: 2,
  },
]

const MysqlBinlogSourceConfig = forwardRef(
  (props: IDataSourceConfigProps, ref: ForwardedRef<ISourceRef>) => {
    const sourceForm = useRef<Form>()

    const [dbInfo, setDbInfo] = useImmer<Record<string, any>>({})
    const [showAdvanced, setShowAdvanced] = useState(false)
    const { refetch: refetchColumns } = useSetRealtimeColumns(dbInfo?.id)
    useLayoutEffect(() => {
      const sub = source$
        .pipe(
          map((e) => {
            if (!e) {
              return {}
            }
            return {
              id: e?.data?.id,
              filterType: e?.data?.filter ? 2 : 1,
              tableName: get(e, 'data.table', []),
              updateType: [], // TODO ????
              charset: undefined, // TODO ???
              bufNumber: undefined,
              threads: undefined,
              isGtidMode: get(e, 'data.is_gtid_mode', false),
              startType: e?.data?.start?.journal_name ? 2 : 1,
              startTime: get(e, 'data.start.timestamp'),
              startFile: get(e, 'data.start.journal_name'),
              startPosition: get(e, 'data.start.position'),
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
          return {}
        },
        refetchColumn: () => {
          console.log(111)
          refetchColumns()
        },
      }
    })

    const renderCommon = () => {
      return <BaseConfigCommon from="source" />
    }

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
                value: 1,
              },
              {
                label: 'GBK',
                value: 2,
              },
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
            <Field>
              <Label>
                <AffixLabel required>数据源表</AffixLabel>
              </Label>
              <Center
                css={css`
                  .field.radio-group-field {
                    ${tw`mb-0!`}
                  }
                `}
              >
                <RadioGroupField
                  label={null}
                  name="filterType"
                  value={dbInfo?.filterType ?? 1}
                  onChange={(e) => {
                    setDbInfo((draft) => {
                      draft.filterType = e
                    })
                  }}
                >
                  <RadioButton key="table" value={1}>
                    表名
                  </RadioButton>
                  <RadioButton key="filter" value={2}>
                    过滤规则
                  </RadioButton>
                </RadioGroupField>
                <AffixLabel
                  required={false}
                  help={
                    <div tw="whitespace-pre-line">
                      {`Perl 正则表达式，例：
所有表：.* or .*\\\\..* 
canal schema下所有表： canal\\\\..* 
canal下的以 canal 打头的表：canal\\\\.canal.* 
canal schema下的一张表：canal.test1 `}
                    </div>
                  }
                  theme="green"
                />
              </Center>
            </Field>
            {dbInfo?.filterType !== 2 && (
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
            />
            {dbInfo?.startType === 1 && (
              <TextField
                label={<AffixLabel required>指定时间戳</AffixLabel>}
                name="startTime"
                value={dbInfo?.startTime}
                onChange={(e: string) => {
                  setDbInfo((draft) => {
                    draft.startTime = e
                  })
                }}
                placeholder="时间戳（timestamp），采集起点从指定的时间戳处消费"
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
                />
              </>
            )}
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
            {renderAdvanced()}
          </>
        )}
      </Form>
    )
  }
)

export default memo(MysqlBinlogSourceConfig)
