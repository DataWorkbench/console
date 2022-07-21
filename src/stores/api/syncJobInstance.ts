import { request } from 'utils/index'

export interface ISyncInstanceParams {
  regionId: string
  spaceId: string
  [k: string]: unknown
}

export const listSyncInstances = ({ regionId, spaceId, apiType, ...rest }: ISyncInstanceParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/${apiType}/job/instance`,
    query: rest
  })

export const terminateSyncInstances = ({ regionId, spaceId, ids }: ISyncInstanceParams) =>
  request({
    region: regionId,
    method: 'POST',
    uri: `/v1/workspace/${spaceId}/sync/job/instance/terminates`,
    body: {
      instance_ids: ids
    }
  })

export const describeFlinkUiByInstanceId = ({
  regionId,
  spaceId,
  instanceId
}: ISyncInstanceParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/sync/job/instance/${instanceId}/flink-ui`
  })
