export const SOURCE_PING_START = 'sourcePingStart'

export const SOURCE_PING_RESULT = 'sourcePingResult'

export const CONNECTION_STATUS: Record<
  -1 | 0 | 2 | 1,
  'loading' | 'fail' | 'success' | 'undo'
> = {
  [-1]: 'loading',
  0: 'undo',
  2: 'fail',
  1: 'success',
}
