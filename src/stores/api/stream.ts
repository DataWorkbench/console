import { request } from 'utils'

export interface IStreamParams {
  regionId: string
  spaceId: string
  [k: string]: unknown
}

export const listReleaseStreamJobs = ({
  regionId,
  spaceId,
  ...rest
}: IStreamParams) => {
  return request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/stream/job/release`,
    query: rest,
  })
}

export const listReleaseJobVersions = ({
  region,
  spaceId,
  jobId,
  ...rest
}: IStreamParams) =>
  request({
    region,
    uri: `/v1/workspace/${spaceId}/stream/job/${jobId}/version`,
    query: rest,
  })

export const listStreamJobInstances = ({
  regionId,
  spaceId,
  ...rest
}: IStreamParams) => {
  return request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/stream/job/instance`,
    query: rest,
  })
}

export const resumeReleaseJob = ({
  regionId,
  spaceId,
  jobId,
}: IStreamParams) => {
  return request({
    region: regionId,
    method: 'POST',
    uri: `/v1/workspace/${spaceId}/stream/job/release/${jobId}/resume`,
    // body: {
    //   stop_running: true,
    // },
  })
}

export const suspendReleaseJob = ({
  regionId,
  spaceId,
  jobId,
  stopRunning,
}: IStreamParams) => {
  return request({
    region: regionId,
    method: 'POST',
    uri: `/v1/workspace/${spaceId}/stream/job/release/${jobId}/suspend`,
    body: {
      stop_running: stopRunning,
    },
  })
}

export const offlineReleaseJob = ({
  regionId,
  spaceId,
  jobId,
  stopRunning,
}: IStreamParams) => {
  return request({
    region: regionId,
    method: 'POST',
    uri: `/v1/workspace/${spaceId}/stream/job/release/${jobId}/offline`,
    body: {
      stop_running: stopRunning,
    },
  })
}

export const terminateInstances = ({
  regionId,
  spaceId,
  instance_ids,
}: IStreamParams) => {
  return request({
    region: regionId,
    method: 'POST',
    uri: `/v1/workspace/${spaceId}/stream/job/instance/terminates`,
    body: {
      instance_ids,
    },
  })
}

export const describeFlinkUI = ({
  regionId,
  spaceId,
  inst_id,
}: IStreamParams) => {
  return request({
    region: regionId,
    method: 'GET',
    uri: `/v1/workspace/${spaceId}/stream/job/instance/${inst_id}/flink-ui`,
  })
}
