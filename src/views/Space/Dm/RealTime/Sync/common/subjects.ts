import { camelCase, get, keys, trim } from 'lodash-es'
import { BehaviorSubject, pairwise, Subject } from 'rxjs'
import { filter, map } from 'rxjs/operators'
import {
  datasourceRealtimeTypeObjs,
  datasourceTypeObjs,
} from 'views/Space/Dm/RealTime/Job/JobUtils'
import { SourceType } from 'views/Space/Upcloud/DataSourceList/constant'

interface IJob {
  id: string
  name: string
  /**
   * 1 => "OfflineFull" 2 => "OfflineIncrement" 3 => "RealTime"
   *  */
  type: 1 | 2 | 3
  desc: string
  version: string
  source_type?: number
  target_type?: number
  jobMode?: 'DI' | 'RT' | 'OLE'
}

// 已选中节点
export const curJobSubject$ = new Subject<IJob | null>()

export const curJobDbConfSubject$ = new BehaviorSubject<Record<
  string,
  any
> | null>(null)

export const curJobConfSubject$ = new BehaviorSubject<Record<
  string,
  any
> | null>(null)

export const confColumns$ = new BehaviorSubject<
  [Record<string, any>, Record<string, any>][]
>([])

export const source$ = new BehaviorSubject<Record<string, any> | null>(null)
export const target$ = new BehaviorSubject<Record<string, any> | null>(null)

export const baseSource$ = new BehaviorSubject<Record<string, any> | null>(null)
export const baseTarget$ = new BehaviorSubject<Record<string, any> | null>(null)

export const sourceColumns$ = new BehaviorSubject<Record<string, any>[]>([])
export const targetColumns$ = new BehaviorSubject<Record<string, any>[]>([])

export const mapping$ = new BehaviorSubject<[string, string][]>([])
export const syncJobOp$ = new BehaviorSubject({
  op: 'source',
  visible: false,
})

const getSourceType = (sourceType: SourceType, realtime: boolean = false) => {
  if (
    realtime &&
    datasourceRealtimeTypeObjs.find((i) => i.type === sourceType)
  ) {
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
        target: get(e, `sync_resource.${targetKey?.name}_target`),
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
      return [e.source?.column ?? [], e.target?.column ?? []]
    })
  )
  .subscribe(confColumns$)

curJobConfSubject$
  .pipe(
    map((e) => {
      if (e === null) {
        return null
      }
      return {
        sourceType: e.sourceKey,
        data: { ...e.source, id: e.source_id },
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
        data: { ...e.target, id: e.target_id },
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
          tableName: get(dbTarget, 'table[0]', ''),
          writeMode: get(dbTarget, 'write_mode', ''),
          semantic: get(dbTarget, 'semantic', ''),
          batchSize: get(dbTarget, 'batch_size', ''),
          postSql: get(dbTarget, 'post_sql', []),
          preSql: get(dbTarget, 'pre_sql', []),
        },
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
        type: 1,
      }

      if (get(dbSource, 'condition_type') === 2) {
        condition = {
          type: 2,
          expression: get(dbSource, 'express'),
        }
      } else {
        const visualization = get<Record<string, string>>(
          dbSource,
          'visualization',
          {}
        )
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
        splitPk: get(dbSource, 'split_pk', ''),
      }
      return {
        sourceType: e.sourceType,
        data: newData,
      }
    })
  )
  .subscribe(baseSource$)

const changeTableName = () =>
  filter(([pervValue, value]) => {
    if (!pervValue || !value) {
      return true
    }
    if (
      value?.data?.tableName &&
      value?.data?.tableName !== pervValue?.data?.tableName
    ) {
      return true
    }
    return false
  })
const clearTargetColumns$ = baseTarget$.pipe(
  pairwise(),
  changeTableName(),
  map(() => [])
)
clearTargetColumns$.subscribe(targetColumns$)
clearTargetColumns$.subscribe(mapping$)

const clearSourceColumns$ = baseSource$.pipe(
  pairwise(),
  changeTableName(),
  map(() => [])
)
clearSourceColumns$.subscribe(sourceColumns$)
clearSourceColumns$.subscribe(mapping$)
