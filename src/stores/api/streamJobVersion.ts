import { request } from 'utils/index'

export interface IStreamVersionParams {
  regionId: string
  spaceId: string
  [k: string]: unknown
}

export const listStreamJobVersions = ({
  regionId,
  spaceId,
  jobId,
  ...rest
}: IStreamVersionParams) => {
  return request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/stream/job/${jobId}/version`,
    query: rest,
  })
}

export const getDescribeStreamJobVersion = ({
  regionId,
  spaceId,
  jobId,
  versionId,
}: IStreamVersionParams) => {
  return request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/stream/job/${jobId}/version/${versionId}`,
  })
}

export const getStreamJobVersionSchedule = ({
  regionId,
  spaceId,
  jobId,
  versionId,
}: IStreamVersionParams) => {
  return request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/stream/job/${jobId}/version/${versionId}/schedule`,
  })
}

export const getStreamJobVersionArgs = ({
  regionId,
  spaceId,
  jobId,
  versionId,
}: IStreamVersionParams) => {
  return request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/stream/job/${jobId}/version/${versionId}/args`,
  })
}

export const getStreamJobVersionCode = ({
  regionId,
  spaceId,
  jobIId,
  versionId,
}: IStreamVersionParams) => {
  return request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/stream/job/${jobIId}/version/${versionId}/code`,
  })
}
