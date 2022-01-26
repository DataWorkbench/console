export const SOURCE_PING_START = 'sourcePingStart'

export const SOURCE_PING_RESULT = 'sourcePingResult'

export const CONNECTION_STATUS: Record<
  'LOADING' | 'FAIL' | 'SUCCESS' | 'UNDO',
  -1 | 0 | 1 | 2
> = {
  LOADING: -1,
  UNDO: 0,
  SUCCESS: 1,
  FAIL: 2,
}

export const DATASOURCE_STATUS = {
  DELETE: 1,
  ENABLED: 2,
  DISABLED: 3,
}

export const DATASOURCE_PING_STAGE: Record<'CREATE' | 'UPDATE', 1 | 2> = {
  CREATE: 1,
  UPDATE: 2,
}
