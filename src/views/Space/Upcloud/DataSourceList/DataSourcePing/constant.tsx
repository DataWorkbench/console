export const SOURCE_PING_START = 'sourcePingStart'

export const SOURCE_PING_RESULT = 'sourcePingResult'

export const CONNECTION_STATUS: Record<
  -1 | 3 | 1,
  'loading' | 'fail' | 'success'
> = {
  [-1]: 'loading',
  3: 'fail',
  1: 'success',
}
