import { FormH7Wrapper } from 'views/Space/Dm/RealTime/styled'
import { FlexBox } from 'components/Box'
import { Center } from 'components/Center'
import { ArrowLine } from 'components/ArrowLine'
import DataSourceSelectModal from 'views/Space/Upcloud/DataSourceList/DataSourceSelectModal'
import { findKey, get, pick } from 'lodash-es'
import {
  dataSourceTypes,
  getDataSourceTypes,
} from 'views/Space/Dm/RealTime/Job/JobUtils'
import { observer } from 'mobx-react-lite'
import tw, { css, styled } from 'twin.macro'
import {
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { SourceType } from 'views/Space/Upcloud/DataSourceList/constant'
import BaseSourceConfig from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/BaseSourceConfig'
import BaseTargetConfig from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/BaseTargetConfig'
import MysqlBinlogSourceConfig from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/MysqlBinlogSourceConfig'
import { source$, syncJobOp$, target$ } from '../common/subjects'

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

const Label = styled('div')(() => [
  tw`border border-white px-2 py-1 leading-none rounded-[3px]`,
])

const DashedLine = styled('div')(() => [
  tw`border-neut-13 border-l border-dashed my-1`,
])

type OpType = 'source' | 'target'

const getJobTypeName = (type: 1 | 2 | 3) => {
  const typeNameMap = new Map([
    [1, '离线 - 全量'],
    [2, '离线 - 增量'],
    [3, '实时'],
  ])
  return typeNameMap.get(type)
}

const baseSource = new Set([
  SourceType.Mysql,
  SourceType.PostgreSQL,
  SourceType.SqlServer,
  SourceType.ClickHouse,
])

const baseTarget = new Set([
  SourceType.Mysql,
  SourceType.PostgreSQL,
  SourceType.SqlServer,
  SourceType.ClickHouse,
])

interface IDataSourceConfigProps {
  curJob?: Record<string, any>
}
interface ISourceRef {
  validate: () => boolean
  getData?: () => Record<string, any> | undefined
  refetchColumn: () => void
}

const DatasourceConfig = observer(
  (props: IDataSourceConfigProps, ref) => {
    const { curJob } = props
    const [visible, setVisible] = useState(false)
    const op = useRef<OpType>('source')
    const [sourceTypeName, targetTypeName] = useMemo(() => {
      const sourceType = curJob?.source_type
      const targetType = curJob?.target_type
      return [getDataSourceTypes(sourceType), getDataSourceTypes(targetType)]
    }, [curJob])

    const handleVisible = (v: boolean) => {
      syncJobOp$.next({ ...syncJobOp$.getValue(), visible: v })
    }
    const handleSelectDb = (e: Record<string, any>) => {
      if (op.current === 'source') {
        source$.next({ ...source$.getValue(), data: e })
      } else {
        target$.next({ ...target$.getValue(), data: e })
      }
    }

    const sourceRef = useRef<ISourceRef>()
    const targetRef = useRef<ISourceRef>()

    const renderSource = () => {
      return <MysqlBinlogSourceConfig curJob={curJob} ref={sourceRef} />
      if (baseSource.has(curJob?.source_type)) {
        return <BaseSourceConfig curJob={curJob} ref={sourceRef} />
      }
      return null
    }

    const renderTarget = () => {
      if (baseTarget.has(curJob?.target_type)) {
        return <BaseTargetConfig curJob={curJob} ref={targetRef} />
      }
      return null
    }

    useLayoutEffect(() => {
      const unSub = syncJobOp$.subscribe((e) => {
        op.current = e.op as OpType
        setVisible(e.visible)
      })
      return () => {
        unSub.unsubscribe()
      }
    }, [])

    useImperativeHandle(ref, () => {
      return {
        validate: () => {
          const re = sourceRef.current?.validate()
          const re1 = targetRef.current?.validate()
          return re && re1
        },
        getResource: () => {
          const source = source$.getValue()
          const target = target$.getValue()
          const config = {
            source_id: source?.data?.id,
            target_id: target?.data?.id,
            sync_resource: {
              [`${source?.sourceType?.name}_source`]:
                sourceRef.current?.getData?.(),
              [`${target?.sourceType?.name}_target`]:
                targetRef.current?.getData?.(),
            },
          }
          return config
        },

        getTypeNames: () => {
          return [
            source$.getValue()?.sourceType?.name,
            target$.getValue()?.sourceType?.name,
          ]
        },
        refetchColumns: () => {
          sourceRef.current?.refetchColumn?.()
          targetRef.current?.refetchColumn?.()
        },
      }
    })

    console.log(source$.getValue())
    return (
      <FormH7Wrapper>
        <FlexBox tw="flex-col">
          <Center tw="mb-[-15px]">
            <Center css={styles.arrowBox}>
              <Label>来源: {sourceTypeName}</Label>
              <ArrowLine />
              <Label>{curJob && getJobTypeName(curJob.type)}</Label>
              <ArrowLine />
              <Label>目的: {targetTypeName}</Label>
            </Center>
          </Center>
          <FlexBox css={styles.dashedBox}>
            {renderSource()}
            <DashedLine />
            {renderTarget()}
          </FlexBox>
          <DataSourceSelectModal
            selected={
              op.current === 'source'
                ? [source$.getValue()?.data?.id]
                : [target$.getValue()?.data?.id]
            }
            title={`选择${
              op.current === 'source' ? '来源' : '目的'
            }数据源（已选类型为 ${findKey(
              dataSourceTypes,
              (v) => v === get(curJob, `${op.current}_type`)
            )})`}
            visible={visible}
            sourceType={get(curJob, `${op.current}_type`)!}
            onCancel={() => handleVisible(false)}
            onOk={(v: any) => {
              handleVisible(false)
              if (v) {
                handleSelectDb({
                  ...pick(v, ['id', 'name']),
                  networkId: get(v, 'last_connection.network_id', ''),
                })
              }
            }}
          />
        </FlexBox>
      </FormH7Wrapper>
    )
  },
  { forwardRef: true }
)

export default DatasourceConfig
