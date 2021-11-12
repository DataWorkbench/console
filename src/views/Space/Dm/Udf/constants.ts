export const udfActions = ['create', 'detail', 'edit']
export const languageFilters = [
  {
    text: 'Java',
    value: 2,
  },
  {
    text: 'Python',
    value: 3,
  },
  {
    text: 'Scala',
    value: 1,
  },
]

export const udfTypes = {
  UDF: 1,
  UDTF: 2,
  UDTTF: 3,
}

export const languageData = [
  { text: 'Java', icon: 'java', type: 2, /*    */ bit: 0b0001 },
  { text: 'Python', icon: 'python', type: 3, /**/ bit: 0b0010 },
  { text: 'Scala', icon: 'coding', type: 1, /* */ bit: 0b0100 },
]

export const udfHasLangBits = {
  UDF: /**  */ 0b0111,
  UDTF: /** */ 0b0111,
  UDTTF: /***/ 0b0101,
}

export const javaType = languageFilters.find((i) => i.text === 'Java')?.value
