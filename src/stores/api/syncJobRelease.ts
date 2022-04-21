import { request } from 'utils/index'

export interface IJobReleaseParams {
  regionId: string
  spaceId: string
  [k: string]: unknown
}

export const listReleaseSyncJobs = ({
  regionId,
  spaceId,
  ...rest
}: IJobReleaseParams) => {
  return request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/sync/job/release`,
    query: rest,
  })
}

export const offlineReleaseSyncJob = ({
  regionId,
  spaceId,
  jobId,
}: IJobReleaseParams) => {
  return request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/sync/job/release/${jobId}/offline`,
    method: 'POST',
  })
}

export const resumeReleaseSyncJobs = ({
  regionId,
  spaceId,
  jobId,
}: IJobReleaseParams) => {
  return request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/sync/job/release/${jobId}/resume`,
    method: 'POST',
  })
}

export const suspendReleaseSyncJob = ({
  regionId,
  spaceId,
  jobId,
}: IJobReleaseParams) => {
  return request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/sync/job/release/${jobId}/suspend`,
    method: 'POST',
  })
}

export const jobReleaseSyncJob = ({
  regionId,
  spaceId,
  jobId,
}: IJobReleaseParams) => {
  return request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/sync/job/${jobId}/release`,
    method: 'POST',
  })
}
