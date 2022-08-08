import { camelCase, cloneDeep, get, keys, merge, trim } from 'lodash-es'
import { BehaviorSubject, distinctUntilChanged, Subject } from 'rxjs'
import { filter, map } from 'rxjs/operators'
// eslint-disable-next-line import/no-cycle
import {
  datasourceRealtimeTypeObjs,
  datasourceTypeObjs
} from 'views/Space/Dm/RealTime/Job/JobUtils'
import { SourceType } from 'views/Space/Upcloud/DataSourceList/constant'
import {
  defaultConfig,
  getMappingConfig,
  updateConfig,
  updateHbaseSourceType
} from 'components/FieldMappings/Subjects'

interface IJob {
  id: string
  name: string
  /**
   * 1 => "OfflineFull" 2 => "OfflineIncrement" 3 => "RealTime"
   *  */
  type: 2 | 3 | 3
  desc: string
  version: string
  source_type?: number
  target_type?: number
  jobMode?: 'DI' | 'RT' | 'OLE'
}

// 已选中节点
export const curJobSubject$ = new Subject<IJob | null>()

export const curJobDbConfSubject$ = new BehaviorSubject<Record<string, any> | null>(null)

export const curJobConfSubject$ = new BehaviorSubject<Record<string, any> | null>(null)

export const confColumns$ = new BehaviorSubject<[Record<string, any>, Record<string, any>][]>([])

export const source$ = new BehaviorSubject<Record<string, any> | null>(null)
export const target$ = new BehaviorSubject<Record<string, any> | null>(null)

export const baseSource$ = new BehaviorSubject<Record<string, any> | null>(null)
export const baseTarget$ = new BehaviorSubject<Record<string, any> | null>(null)

export const sourceColumns$ = new BehaviorSubject<Record<string, any>[]>([])
export const targetColumns$ = new BehaviorSubject<Record<string, any>[]>([])

export const clearMapping$ = new BehaviorSubject<[]>([])
export const syncJobOp$ = new BehaviorSubject({
  op: 'source',
  visible: false
})

const getSourceType = (sourceType: SourceType, realtime: boolean = false) => {
  if (realtime && datasourceRealtimeTypeObjs.find((i) => i.type === sourceType)) {
    return datasourceRealtimeTypeObjs.find((i) => i.type === sourceType)
  }
  return datasourceTypeObjs.find((i) => i.type === sourceType)
}
curJobDbConfSubject$
  .pipe(
    map((e) => {
      if (e === null) {
        return null
      }
      const { sourceType, targetType, jobType } = e
      const sourceKey = getSourceType(sourceType, jobType === 3)
      const targetKey = getSourceType(targetType, false)
      return {
        ...e,
        sourceKey,
        targetKey,
        source: get(e, `sync_resource.${sourceKey?.name}_source`),
        target: get(e, `sync_resource.${targetKey?.name}_target`)
      }
    })
  )
  .subscribe(curJobConfSubject$)

curJobConfSubject$
  .pipe(
    map((e) => {
      if (!e) {
        return []
      }
      return [
        e.source?.column ?? [],
        (e.target?.column ?? e.target?.tableFields ?? []).map((i) => {
          if (!i.name && i.key) {
            return {
              ...i,
              name: i.key
            }
          }
          return i
        })
      ]
    })
  )
  .subscribe(confColumns$)

clearMapping$.subscribe(confColumns$)
export const clearMapping = () => {
  clearMapping$.next([])
}

curJobConfSubject$
  .pipe(
    map((e) => {
      if (e === null) {
        return null
      }
      return {
        sourceType: e.sourceKey,
        data: { ...e.source, id: e.source_id }
      }
    })
  )
  .subscribe(source$)

curJobConfSubject$
  .pipe(
    map((e) => {
      if (e === null) {
        return null
      }
      return {
        sourceType: e.targetKey,
        data: { ...e.target, id: e.target_id }
      }
    })
  )
  .subscribe(target$)

target$
  .pipe(
    map((e) => {
      if (!e) {
        return null
      }
      const dbTarget = e.data
      return {
        sourceType: e.sourceType,
        data: {
          id: dbTarget?.id,
          tableName: get(dbTarget, 'table[0]'),
          writeMode: get(dbTarget, 'write_mode'),
          semantic: get(dbTarget, 'semantic'),
          batchSize: get(dbTarget, 'batch_size'),
          postSql: get(dbTarget, 'post_sql', ['']),
          preSql: get(dbTarget, 'pre_sql', [''])
        }
      }
    })
  )
  .subscribe(baseTarget$)

source$
  .pipe(
    map((e) => {
      if (!e) {
        return null
      }
      const dbSource = e.data
      let condition: any = {
        type: 1
      }

      if (get(dbSource, 'condition_type') === 2) {
        condition = {
          type: 2,
          expression: get(dbSource, 'express')
        }
      } else {
        const visualization = get<Record<string, string>>(dbSource, 'visualization', {})
        keys(visualization).forEach((v) => {
          condition[camelCase(v)] = visualization[v]
        })
        condition.type = 1
      }

      const newData = {
        id: dbSource?.id,
        tableName: get(dbSource, 'table[0]', ''),
        condition,
        where: trim(get(dbSource, 'where', '')),
        splitPk: get(dbSource, 'split_pk', '')
      }
      return {
        sourceType: e.sourceType,
        data: newData
      }
    })
  )
  .subscribe(baseSource$)

const changeTableName = () =>
  distinctUntilChanged<any>((prevValue, value) => {
    const oldId = get(prevValue, 'data.id', '')
    const id = get(value, 'data.id', '')
    const name = get(value, 'data.table[0]') || get(value, 'data.table_list[0]')
    const oldName = get(prevValue, 'data.table[0]') || get(prevValue, 'data.table_list[0]')
    if (!oldName && name) {
      return true
    }
    return oldName === name && oldId === id
  })

const clearTargetColumns$ = target$.pipe(
  changeTableName(),
  map(() => [])
)
clearTargetColumns$.subscribe(targetColumns$)

const clearSourceColumns$ = source$.pipe(
  changeTableName(),
  map(() => {
    return []
  })
)

export const kafkaSource$ = new BehaviorSubject<Partial<Record<string, any>>>({})

source$
  .pipe(
    filter((e) => {
      return e?.sourceType?.type === SourceType.HBase
    }),
    map((e) => {
      return e?.data?.is_binary_rowkey
    }),
    distinctUntilChanged(),
    map((e) => {
      return {
        text: e ? 'BINARY' : 'STRING'
      }
    })
  )
  .subscribe(updateHbaseSourceType)

source$
  .pipe(
    filter((e) => {
      return e?.sourceType?.type === SourceType.Kafka
    }),
    map((e) => {
      if (!e) {
        return {}
      }
      return {
        id: get(e, 'data.id'),
        topic: get(e, 'data.topic'),
        consumer: get(e, 'data.mode', 'group-offsets'),
        consumerId: get(e, 'data.group_id', 'default'),
        charset: get(e, 'data.encoding', 1),
        readType: get(e, 'data.codec', 2),
        config:
          e?.data?.consumer_settings !== null
            ? JSON.stringify(
                get(e, 'data.consumer_settings', {
                  'auto.commit.enable': 'false'
                }),
                null,
                2
              )
            : '',
        timestamp: get(e, 'data.timestamp'),
        offset: get(e, 'data.offset')
      }
    })
  )
  .subscribe(kafkaSource$)

const kafkaSourceReadType$ = kafkaSource$.pipe(
  distinctUntilChanged((prev, cur) => {
    return prev?.id === cur?.id && prev?.readType === cur?.readType
  })
)

clearSourceColumns$.subscribe(sourceColumns$)

const sql = new Set([
  SourceType.Mysql,
  SourceType.PostgreSQL,
  SourceType.Oracle,
  SourceType.SqlServer,
  SourceType.TiDB,
  SourceType.SapHana,
  SourceType.DB2
])

const configStrategy: {
  find: (jobType: 2 | 3, sourceType: SourceType, targetType: SourceType) => boolean
  value: () => Partial<typeof defaultConfig>
}[] = [
  {
    // 目的 关系型数据库 不可以增删改
    find: (jobType, sourceType, targetType) => {
      return sql.has(targetType)
    },
    value: () => {
      return {
        target: {
          readonly: true,
          add: false
        } as any
      }
    }
  },
  {
    // 关系型数据库 可增删改
    find: (jobType: 2 | 3, sourceType: SourceType) => {
      return sql.has(sourceType)
    },
    value: () => {
      return {
        source: {
          readonly: false,
          edit: true,
          add: true,
          delete: true,
          sort: true,
          mapping: true,
          time: true
        }
      }
    }
  },
  // [实时同步 来源关系型数据库 且 目的 kafka]： 来源表字段是固定的结构，不可增删改
  {
    find: (jobType: 2 | 3, sourceType: SourceType, targetType) => {
      return jobType === 3 && sql.has(sourceType) && targetType === SourceType.Kafka
    },
    value: () => {
      return {
        source: {
          readonly: true,
          add: false
        }
      } as any
    }
  },
  // [ 非关系型数据库 ] 目的表字段有新增
  {
    find: (jobType, sourceType, targetType) => {
      return !sql.has(targetType)
    },
    value: () => {
      return {
        target: {
          readonly: false,
          add: true,
          edit: true,
          sort: true,
          mapping: true,
          time: false,
          showValue: false,
          delete: true
        }
      }
    }
  }
]

kafkaSourceReadType$
  .pipe(
    filter(Boolean),
    map((e: any) => {
      let v: any
      if (e.readType === 1) {
        v = {
          readonly: true,
          add: false,
          edit: false,
          sort: false,
          mapping: true,
          showValue: false
        }
      } else {
        v = {
          readonly: false,
          add: true,
          edit: true,
          sort: true,
          mapping: true,
          showValue: true
        }
      }
      return merge(getMappingConfig(), { source: v })
    })
  )
  .subscribe(updateConfig)

curJobDbConfSubject$
  .pipe(
    filter(Boolean),
    map((e: any) => {
      const { sourceType, targetType, jobType } = e
      const fn = configStrategy.filter((item) => item.find(jobType, sourceType, targetType))
      let v = cloneDeep(defaultConfig)
      if (fn.length !== 0) {
        v = fn?.reduce((previousValue, currentValue) => {
          return merge(previousValue, currentValue.value())
        }, v)
      }
      return merge(v, {
        is: {
          isKafkaTarget: targetType === SourceType.Kafka,
          isHbaseSource: sourceType === SourceType.HBase,
          isHbaseTarget: targetType === SourceType.HBase,
          isReal: jobType === 3,
          isSqlSource: sql.has(sourceType)
        }
      })
    })
  )
  .subscribe(updateConfig)
