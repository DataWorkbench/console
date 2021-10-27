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
    action: `${regionId}/v1/workspace/${spaceId}/stream/job`,
    ...rest,
    method: 'POST',
  })

export const updateStreamJob = ({
  regionId,
  spaceId,
  jobId,
  ...rest
}: IWorkFlowParams) =>
  request({
    action: `${regionId}/v1/workspace/${spaceId}/stream/job/${jobId}`,
    ...rest,
    method: 'PUT',
  })

export const deleteStreamJobs = ({
  regionId,
  spaceId,
  ...rest
}: IWorkFlowParams) =>
  request({
    action: `${regionId}/v1/workspace/${spaceId}/stream/job/deletes`,
    ...rest,
    method: 'POST',
  })

export const loadWorkFlow = ({ regionId, spaceId, ...rest }: IWorkFlowParams) =>
  request({
    action: `${regionId}/v1/workspace/${spaceId}/stream/job`,
    ...rest,
  })

export const setStreamJobSchedule = ({
  regionId,
  spaceId,
  jobId,
  ...rest
}: IWorkFlowParams) =>
  request({
    action: `${regionId}/v1/workspace/${spaceId}/stream/job/${jobId}/schedule`,
    ...rest,
    method: 'PUT',
  })

export const getStreamJobSchedule = ({
  regionId,
  spaceId,
  jobId,
}: IWorkFlowParams) =>
  request({
    action: `${regionId}/v1/workspace/${spaceId}/stream/job/${jobId}/schedule`,
  })

export const setStreamJobArgs = ({
  regionId,
  spaceId,
  jobId,
  ...rest
}: IWorkFlowParams) =>
  request({
    action: `${regionId}/v1/workspace/${spaceId}/stream/job/${jobId}/args`,
    ...rest,
    method: 'PUT',
  })

export const getStreamJobArgs = ({
  regionId,
  spaceId,
  jobId,
}: IWorkFlowParams) =>
  request({
    action: `${regionId}/v1/workspace/${spaceId}/stream/job/${jobId}/args`,
  })

export const setStreamJobCode = ({
  regionId,
  spaceId,
  jobId,
  ...rest
}: IWorkFlowParams) =>
  request({
    action: `${regionId}/v1/workspace/${spaceId}/stream/job/${jobId}/code`,
    ...rest,
    method: 'PUT',
  })

export const getStreamJobCode = ({
  regionId,
  spaceId,
  jobId,
}: IWorkFlowParams) =>
  request({
    action: `${regionId}/v1/workspace/${spaceId}/stream/job/${jobId}/code`,
  })

export const releaseStreamJob = ({
  regionId,
  spaceId,
  jobId,
  ...rest
}: IWorkFlowParams) =>
  request({
    action: `${regionId}/v1/workspace/${spaceId}/stream/job/${jobId}/release`,
    ...rest,
    method: 'POST',
  })
