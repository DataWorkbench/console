import { request } from 'utils/index'

export interface IJobVersionParams {
  regionId: string
  spaceId: string
  [k: string]: unknown
}

export const listSyncJobVersions = ({
  regionId,
  spaceId,
  jobId,
  ...rest
}: IJobVersionParams) => {
  return request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/sync/job/${jobId}/version`,
    query: rest,
  })
}

export const getDescribeSyncJobVersion = ({
  regionId,
  spaceId,
  jobId,
  versionId,
}: IJobVersionParams) => {
  return request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/sync/job/${jobId}/version/${versionId}`,
  })
}

export const getSyncJobVersionSchedule = ({
  regionId,
  spaceId,
  jobId,
  versionId,
}: IJobVersionParams) => {
  return request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/sync/job/${jobId}/version/${versionId}/schedule`,
  })
}

export const getSyncJobVersionConf = ({
  regionId,
  spaceId,
  jobId,
  versionId,
}: IJobVersionParams) => {
  return request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/sync/job/${jobId}/version/${versionId}/conf`,
  })
}
