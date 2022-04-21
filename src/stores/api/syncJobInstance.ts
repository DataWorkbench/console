import { request } from 'utils/index'

export interface ISyncInstanceParams {
  regionId: string
  spaceId: string
  [k: string]: unknown
}

export const listSyncInstances = ({
  regionId,
  spaceId,
  ...rest
}: ISyncInstanceParams) => {
  return request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/stream/job/release`,
    query: rest,
  })
}
