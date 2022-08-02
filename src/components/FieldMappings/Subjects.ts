import { BehaviorSubject } from 'rxjs'
import select from 'utils/stateSelect'

export const fieldChangeSubject$ = new BehaviorSubject<[string, string] | null>(null)

export const defaultConfig = {
  source: {
    readonly: false,
    custom: false,
    edit: true,
    add: true,
    delete: true,
    sort: true,
    mapping: true,
    time: false,
    showValue: true
  },
  target: {
    readonly: false,
    custom: false,
    edit: false,
    add: false,
    delete: false,
    sort: false,
    mapping: false,
    time: false,
    showValue: false
  },
  show: {
    showHeaderButton: false,
    showHeaderHelp: false,
    showHbaseTarget: false,
    showKafkaTarget: false,
    showDefaultTarget: true
  },
  is: {
    isKafkaTarget: false,
    isHbaseSource: false,
    isHbaseTarget: false,
    isReal: false,
    isSqlSource: true
  }
}
export const fieldConfigSubject$ = new BehaviorSubject<Partial<typeof defaultConfig>>(defaultConfig)

export const updateConfig = (config: Partial<typeof defaultConfig>) => {
  fieldConfigSubject$.next(config)
}

export const getMappingConfig = () => fieldConfigSubject$.getValue()

export const useFieldConfig = select(fieldConfigSubject$)()

export const useFieldConfigRealSqlKafka = select(fieldConfigSubject$)((e) => {
  const { isReal, isSqlSource, isKafkaTarget } = e.is
  return isReal && isSqlSource && isKafkaTarget
})
