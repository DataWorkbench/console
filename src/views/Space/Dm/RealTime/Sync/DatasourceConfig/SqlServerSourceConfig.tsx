import { Form, InputNumber } from '@QCFE/qingcloud-portal-ui'
import {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState
} from 'react'
import BaseConfigCommon from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/BaseConfigCommon'
import tw, { css } from 'twin.macro'
import { AffixLabel, Center, FlexBox, HelpCenterLink, SelectWithRefresh } from 'components'
import { useImmer } from 'use-immer'
import { useQuerySourceTables } from 'hooks'
import { Control, Field, Icon, Label } from '@QCFE/lego-ui'
import { source$ } from 'views/Space/Dm/RealTime/Sync/common/subjects'
import { map } from 'rxjs'
import {
  IDataSourceConfigProps,
  ISourceRef
} from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/interfaces'
import { get } from 'lodash-es'
import useTableColumns from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/hooks/useTableColumns'

const {
  // RadioGroupField,
  CheckboxGroupField,
  // TextField,
  ToggleField,
  NumberField
} = Form
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

type FieldKeys =
  | 'tableName'
  | 'updateType'
  | 'slot'
  | 'autoCreate'
  | 'temp'
  | 'jump'
  | 'time'
  | 'lsn'
  | 'id'
const SqlServerSourceConfig = forwardRef(
  (props: IDataSourceConfigProps, ref: ForwardedRef<ISourceRef>) => {
    const sourceForm = useRef<Form>()

    const [dbInfo, setDbInfo] = useImmer<Partial<Record<FieldKeys, any>>>({})
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
              tableName: get(e, 'data.table_list[0]'),
              updateType: get(e, 'data.cat', 'insert,update,delete').split(','),
              // slot: get(e, 'data.slot_name'),
              lsn: get(e, 'data.lsn', 0),
              time: get(e, 'data.poll_interval', 120),
              autoCreate: get(e, 'data.allow_create_slot', true),
              temp: get(e, 'data.temporary', true)
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
      validate: () => {
        if (!sourceForm.current) {
          return false
        }
        return sourceForm.current?.validateForm()
      },
      getData: () => ({
        id: dbInfo?.id,
        lsn: dbInfo?.lsn.toString(),
        poll_interval: dbInfo?.time,
        // slot_name: dbInfo?.slot,
        table_list: [dbInfo?.tableName],
        cat: dbInfo?.updateType.join(',')
        // allow_create_slot: dbInfo?.autoCreate,
        // temporary: dbInfo?.temp,
      }),
      refetchColumn: () => {
        refetchColumns()
      }
    }))

    const { data: tableList, refetch } = useQuerySourceTables(
      {
        sourceId: dbInfo?.id
      },
      { enabled: !!dbInfo?.id }
    )

    const renderCommon = () => (
      <>
        <BaseConfigCommon from="source" />
      </>
    )

    const [showAdvanced, setShowAdvanced] = useState(false)

    const renderAdvanced = () => {
      if (!showAdvanced) {
        return null
      }
      return (
        <>
          <Field>
            <Label className="label">
              <AffixLabel>采集时间间隔</AffixLabel>
            </Label>
            <Control>
              <InputNumber
                label={null}
                name="time"
                showButton={false}
                min={1}
                step={1}
                value={dbInfo?.time}
                onChange={(e) => {
                  setDbInfo((draft) => {
                    draft.time = e
                  })
                }}
              />
              <span tw="leading-7 ml-1.5"> 毫秒 </span>
            </Control>
            <div className="help">1-max</div>
          </Field>
          <NumberField
            name="lsn"
            step={1}
            min={0}
            showButton={false}
            label="lsn"
            value={dbInfo?.lsn}
            onChange={(e) => {
              setDbInfo((draft) => {
                draft.lsn = e
              })
            }}
            placeholder="请输入"
            help="读取 SqlServer CDC 日志序列号的开始位置"
          />
        </>
      )
    }

    const hasSource = !!dbInfo?.id
    return (
      <Form css={styles.form} ref={sourceForm}>
        {renderCommon()}
        {hasSource && (
          <>
            <SelectWithRefresh
              label={<AffixLabel required>数据源表</AffixLabel>}
              name="tableName"
              onRefresh={refetch}
              options={tableList?.items?.map((i) => ({ label: i, value: i })) ?? []}
              value={dbInfo?.tableName ?? []}
              onChange={(e) => {
                setDbInfo((draft) => {
                  draft.tableName = e
                })
              }}
              validateOnChange
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
                        href="/bigdata/dataomnis/manual/integration_job/cfg_source/sqlserver_cdc/"
                      >
                        SqlServer （SqlServer CDC）Source 配置文档
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
                  href="/bigdata/dataomnis/manual/integration_job/cfg_source/sqlserver_cdc/"
                >
                  SqlServer （SqlServer CDC）Source 配置文档
                </HelpCenterLink>
              }
              placeholder="请选择数据源表"
            />
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
              validateOnChange
              schemas={[
                {
                  rule: { required: true },
                  help: '请选择更新类型',
                  status: 'error'
                },
                {
                  rule: (v) => {
                    return v.filter(Boolean).length > 0
                  },
                  help: '请至少选择一种更新类型',
                  status: 'error'
                }
              ]}
            />
            {false && !!dbInfo?.slot && (
              <>
                <ToggleField
                  name="autoCreate"
                  label="自动创建 slot"
                  value={dbInfo?.autoCreate}
                  onChange={(e) => {
                    setDbInfo((draft) => {
                      draft.autoCreate = e
                    })
                  }}
                />
                <ToggleField
                  value={dbInfo?.temp}
                  name="temp"
                  label={<AffixLabel required>临时 slot</AffixLabel>}
                  onChange={(e) => {
                    setDbInfo((draft) => {
                      draft.temp = e
                    })
                  }}
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

export default SqlServerSourceConfig
