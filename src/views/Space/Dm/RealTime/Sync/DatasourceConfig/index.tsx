import { FormH7Wrapper } from 'views/Space/Dm/RealTime/styled'
import { FlexBox } from 'components/Box'
import { Center } from 'components/Center'
import { ArrowLine } from 'components/ArrowLine'
import DataSourceSelectModal from 'views/Space/Upcloud/DataSourceList/DataSourceSelectModal'
import { get, pick } from 'lodash-es'
import { getDataSourceTypes } from 'views/Space/Dm/RealTime/Job/JobUtils'
import { observer } from 'mobx-react-lite'
import tw, { css, styled } from 'twin.macro'
import { useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { SourceType } from 'views/Space/Upcloud/DataSourceList/constant'
import BaseSourceConfig from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/BaseSourceConfig'
import BaseTargetConfig from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/BaseTargetConfig'
import MysqlBinlogSourceConfig from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/MysqlBinlogSourceConfig'
import PgSourceConfig from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/PgSourceConfig'
import {
  IDataSourceConfigProps,
  ISourceRef
} from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/interfaces'

import HbaseSource from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/HbaseSource'
import HbaseTarget from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/HbaseTarget'
import MongoDbTarget from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/MongoDbTarget'
import MongoDbSource from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/MongoDbSource'
import { source$, syncJobOp$, target$ } from '../common/subjects'

import KafkaSourceConfig from './KafkaSourceConfig'
import SqlServerSourceConfig from './SqlServerSourceConfig'
import KafkaTargetConfig from './KafkaTargetConfig'
import HiveTargetConfig from './HiveTargetConfig'
import EsTarget from './EsTarget'
import EsSource from './EsSource'
import HdfsSource from './HdfsSource'
import HdfsTarget from './HdfsTarget'

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
    `
  ],
  line: [tw`flex-1 border-t border-neut-13 translate-y-1/2`]
}

const Label = styled('div')(() => [tw`border border-white px-2 py-1 leading-none rounded-[3px]`])

const DashedLine = styled('div')(() => [tw`border-neut-13 border-l border-dashed my-1`])

type OpType = 'source' | 'target'

const getJobTypeName = (type: 1 | 2 | 3) => {
  const typeNameMap = new Map([
    [1, '离线 - 全量'],
    [2, '离线 - 增量'],
    [3, '实时同步']
  ])
  return typeNameMap.get(type)
}

const baseSource = new Set([
  SourceType.Mysql,
  SourceType.PostgreSQL,
  SourceType.SqlServer,
  SourceType.ClickHouse
])

const baseTarget = new Set([
  SourceType.Mysql,
  SourceType.PostgreSQL,
  SourceType.SqlServer,
  SourceType.ClickHouse
])

const DatasourceConfig = observer(
  (props: IDataSourceConfigProps, ref) => {
    const { curJob } = props
    const [visible, setVisible] = useState(false)
    const op = useRef<OpType>('source')
    const [sourceTypeName, targetTypeName] = useMemo(() => {
      const sourceType = curJob?.source_type
      const targetType = curJob?.target_type
      return [getDataSourceTypes(sourceType, curJob?.type === 3), getDataSourceTypes(targetType)]
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

    const sourceRef = useRef<ISourceRef>(null)
    const targetRef = useRef<ISourceRef>(null)

    const renderRealTimeSource = () => {
      switch (curJob?.source_type) {
        case SourceType.Mysql:
          return <MysqlBinlogSourceConfig curJob={curJob} ref={sourceRef} />
        case SourceType.PostgreSQL:
          return <PgSourceConfig curJob={curJob} ref={sourceRef} />
        case SourceType.SqlServer:
          return <SqlServerSourceConfig curJob={curJob} ref={sourceRef} />
        case SourceType.Kafka:
          return <KafkaSourceConfig curJob={curJob} ref={sourceRef} />
        default:
          return null
      }
    }

    const renderSource = () => {
      // return <HbaseSource curJob={curJob} ref={sourceRef} />
      if (curJob?.type === 3) {
        return renderRealTimeSource()
      }

      if (baseSource.has(curJob?.source_type!)) {
        return <BaseSourceConfig curJob={curJob} ref={sourceRef} />
      }
      switch (curJob?.source_type) {
        case SourceType.ElasticSearch:
          return <EsSource curJob={curJob} ref={sourceRef} />
        case SourceType.HDFS:
          return <HdfsSource curJob={curJob} ref={sourceRef} />
        case SourceType.HBase:
          return <HbaseSource curJob={curJob} ref={sourceRef} />
        case SourceType.MongoDB:
          return <MongoDbSource curJob={curJob} ref={sourceRef} />
        default:
          break
      }
      return null
    }

    const renderTarget = () => {
      if (baseTarget.has(curJob?.target_type!)) {
        return <BaseTargetConfig curJob={curJob} ref={targetRef} />
      }

      switch (curJob?.target_type) {
        case SourceType.Kafka:
          return <KafkaTargetConfig curJob={curJob} ref={targetRef} />
        case SourceType.Hive:
          return <HiveTargetConfig curJob={curJob} ref={targetRef} />
        case SourceType.ElasticSearch:
          return <EsTarget curJob={curJob} ref={targetRef} />
        case SourceType.HDFS:
          return <HdfsTarget curJob={curJob} ref={targetRef} />
        case SourceType.HBase:
          return <HbaseTarget curJob={curJob} ref={targetRef} />
        case SourceType.MongoDB:
          return <MongoDbTarget curJob={curJob} ref={targetRef} />
        default:
          return null
      }
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

    useImperativeHandle(ref, () => ({
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
            [`${source?.sourceType?.name}_source`]: source?.data?.id
              ? sourceRef.current?.getData?.()
              : undefined,
            [`${target?.sourceType?.name}_target`]: target?.data?.id
              ? targetRef.current?.getData?.()
              : undefined
          }
        }
        return config
      },

      getTypeNames: () => [
        source$.getValue()?.sourceType?.name,
        target$.getValue()?.sourceType?.name
      ],
      refetchColumns: () => {
        sourceRef.current?.refetchColumn?.()
        targetRef.current?.refetchColumn?.()
      }
    }))

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
            title={`选择${op.current === 'source' ? '来源' : '目的'}数据源（已选类型为 ${
              op.current === 'source'
                ? source$.getValue()?.sourceType?.label
                : target$.getValue()?.sourceType?.label
            })`}
            visible={visible}
            sourceType={get(curJob, `${op.current}_type`)!}
            onCancel={() => handleVisible(false)}
            onOk={(v: any) => {
              handleVisible(false)
              if (v) {
                handleSelectDb({
                  ...pick(v, ['id', 'name']),
                  networkId: get(v, 'last_connection.network_id', '')
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
