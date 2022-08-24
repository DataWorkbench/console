type ValueOf<ObjectType, ValueType extends keyof ObjectType = keyof ObjectType> =
  ObjectType[ValueType]

interface EnumsMapLike {
  [key: string]: {
    label: string
    value: any
    [key: string]: any
  }
}

type EnhancedEnum<EnumsMap extends EnumsMapLike> = {
  [K in keyof EnumsMap]: EnumsMap[K]['value']
} & {
  getList: () => ValueOf<EnumsMap>[]
  getLabel: (value: ValueOf<EnumsMap>['value']) => string | undefined
  getEnumLabel: (enumKey: keyof EnumsMap) => string | undefined
  getEnum: (label: string, placeholder?: string) => ValueOf<EnumsMap>
}

export const createEnhancedEnum = <T extends EnumsMapLike>(enumsMap: T): EnhancedEnum<T> => {
  const enhancedEnum = {
    getList: () => Object.values(enumsMap),
    getLabel: (value: ValueOf<T>['value'], placeholder?: string) =>
      Object.values(enumsMap).find((item) => item.value === value)?.label || placeholder,
    getEnumLabel: (enumKey: keyof T, placeholder?: string) =>
      enumsMap[enumKey].label || placeholder,
    getEnum: (label: string, placeholder?: string) =>
      Object.values(enumsMap).find((item) => item.label === label) || placeholder
  } as EnhancedEnum<T>

  // eslint-disable-next-line no-restricted-syntax
  for (const [enumKey, { value }] of Object.entries(enumsMap)) {
    enhancedEnum[enumKey as keyof T] = value
  }

  return enhancedEnum
}

export default createEnhancedEnum
