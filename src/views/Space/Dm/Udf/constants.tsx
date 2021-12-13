import { LetterIcon } from '../styled'

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

export const udfTypesComment = {
  UDF: {
    comment: 'UDF (User-Defined Functions)：用户定义（普通）函数。',
    path: '',
  },
  UDTF: {
    comment:
      'UDTF (User-Defined Table Functions)：用来解决输入一行输出多行(On-to-many maping) 的需求。',
    path: '',
  },
  UDTTF: {
    comment:
      'UDTTF (User-Defined Temporal Table Functions)：一种时态表函数,通过一个时间属性来确定表数据的版本。',
    path: '',
  },
}

export const javaType = languageFilters.find((i) => i.text === 'Java')?.value

export const baseColumns = [
  {
    title: '函数名称',
    dataIndex: 'name',
    render: (value: string) => {
      return value ? (
        <span tw="inline-flex">
          <LetterIcon>
            <span>{value}</span>
          </LetterIcon>
          <span>{value}</span>
        </span>
      ) : (
        ''
      )
    },
  },
  {
    title: 'ID',
    dataIndex: 'udf_id',
  },
  {
    title: '语言类型',
    dataIndex: 'udf_language',
    render: (val: number) =>
      languageFilters.find((i) => i.value === val)?.text || val,
  },
]
