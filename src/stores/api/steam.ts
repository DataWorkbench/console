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
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/stream/job/release`,
    query: rest,
  })
}

export const listStreamJobInstances = ({
  regionId,
  spaceId,
  ...rest
}: IStreamParams) => {
  request({
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
  request({
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
  stop_running,
}: IStreamParams) => {
  request({
    region: regionId,
    method: 'POST',
    uri: `/v1/workspace/${spaceId}/stream/job/release/${jobId}/suspend`,
    body: {
      stop_running,
    },
  })
}

export const offlineReleaseJob = ({
  regionId,
  spaceId,
  jobId,
  stop_running,
}: IStreamParams) => {
  request({
    region: regionId,
    method: 'POST',
    uri: `/v1/workspace/${spaceId}/stream/job/release/${jobId}/offline`,
    body: {
      stop_running,
    },
  })
}

export const terminateInstances = ({
  regionId,
  spaceId,
  inst_ids,
}: IStreamParams) => {
  request({
    region: regionId,
    method: 'POST',
    uri: `/v1/workspace/${spaceId}/stream/job/instance/terminates`,
    body: {
      inst_ids,
    },
  })
}
