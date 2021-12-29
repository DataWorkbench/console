import { request } from 'utils'

export interface IWorkFlowParams {
  regionId?: string
  spaceId?: string
  jobId?: string
  [k: string]: unknown
}

export const createStreamJob = ({
  regionId,
  spaceId,
  ...rest
}: IWorkFlowParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/stream/job`,
    body: rest,
    method: 'POST',
  })

export const updateStreamJob = ({
  regionId,
  spaceId,
  jobId,
  ...rest
}: IWorkFlowParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/stream/job/${jobId}`,
    body: rest,
    method: 'PUT',
  })

export const deleteStreamJobs = ({
  regionId,
  spaceId,
  ...rest
}: IWorkFlowParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/stream/job/deletes`,
    body: rest,
    method: 'POST',
  })

export const loadWorkFlow = ({ regionId, spaceId, ...rest }: IWorkFlowParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/stream/job`,
    query: rest,
  })

export const setStreamJobSchedule = ({
  regionId,
  spaceId,
  jobId,
  ...rest
}: IWorkFlowParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/stream/job/${jobId}/schedule`,
    body: rest,
    method: 'PUT',
  })

export const getStreamJobSchedule = ({
  regionId,
  spaceId,
  jobId,
}: IWorkFlowParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/stream/job/${jobId}/schedule`,
  })

export const setStreamJobArgs = ({
  regionId,
  spaceId,
  jobId,
  ...rest
}: IWorkFlowParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/stream/job/${jobId}/args`,
    body: rest,
    method: 'PUT',
  })

export const getStreamJobArgs = ({
  regionId,
  spaceId,
  jobId,
}: IWorkFlowParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/stream/job/${jobId}/args`,
  })

export const setStreamJobCode = ({
  regionId,
  spaceId,
  jobId,
  ...rest
}: IWorkFlowParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/stream/job/${jobId}/code`,
    body: rest,
    method: 'PUT',
  })

export const streamJobCodeSyntax = ({
  regionId,
  spaceId,
  jobId,
  ...rest
}: IWorkFlowParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/stream/job/${jobId}/code/syntax`,
    body: rest,
    method: 'POST',
  })

export const getStreamJobCode = ({
  regionId,
  spaceId,
  jobId,
}: IWorkFlowParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/stream/job/${jobId}/code`,
  })

export const releaseStreamJob = ({
  regionId,
  spaceId,
  jobId,
  ...rest
}: IWorkFlowParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/stream/job/${jobId}/release`,
    body: rest,
    method: 'POST',
  })

export const inConnectors = ({ regionId, spaceId, jobId }: IStreamParams) => {
  return request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/stream/job/${jobId}/args/connectors`,
  })
}
