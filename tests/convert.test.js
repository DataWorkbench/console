import { parseI18n } from '../src/utils/convert'

test('parseI18n', () => {
  const input = {
    infos: [
      {
        id: 'staging',
        name: { en_us: 'staging', zh_cn: '\u5f00\u53d1\u6d4b\u8bd5\u533a' },
      },
      {
        id: 'mock',
        name: { en_us: 'mock', zh_cn: '\u6a21\u62df\u6d4b\u8bd5\u7528' },
        tt: [
          {
            name: { en_us: 'staging', zh_cn: '\u5f00\u53d1\u6d4b\u8bd5\u533a' },
          },
          {
            name: { en_us: 'staging', zh_cn: '\u5f00\u53d1\u6d4b\u8bd5\u533a' },
          },
        ],
      },
    ],
    ret_code: 0,
  }

  const output = {
    infos: [
      {
        id: 'staging',
        name: '\u5f00\u53d1\u6d4b\u8bd5\u533a',
      },
      {
        id: 'mock',
        name: '\u6a21\u62df\u6d4b\u8bd5\u7528',
        tt: [
          {
            name: '\u5f00\u53d1\u6d4b\u8bd5\u533a',
          },
          {
            name: '\u5f00\u53d1\u6d4b\u8bd5\u533a',
          },
        ],
      },
    ],
    ret_code: 0,
  }

  const output2 = {
    infos: [
      {
        id: 'staging',
        name: 'staging',
      },
      {
        id: 'mock',
        name: 'mock',
        tt: [
          {
            name: 'staging',
          },
          {
            name: 'staging',
          },
        ],
      },
    ],
    ret_code: 0,
  }

  expect(parseI18n(input)).toEqual(output)
  expect(parseI18n(input, 'en')).toEqual(output2)
})
