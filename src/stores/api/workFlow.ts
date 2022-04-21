import { request } from 'utils'

export interface IWorkFlowParams {
  regionId?: string
  spaceId?: string
  jobId?: string
  version?: string
  tp?: 'sync' | 'stream'
  parameters?: Record<string, string>
  [k: string]: unknown
}

export const createJob = ({
  regionId,
  spaceId,
  tp,
  ...rest
}: IWorkFlowParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/${tp}/job`,
    body: rest,
    method: 'POST',
  })

export const updateJob = ({
  regionId,
  spaceId,
  tp,
  jobId,
  ...rest
}: IWorkFlowParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/${tp}/job/${jobId}`,
    body: rest,
    method: 'PUT',
  })

export const moveJob = ({ regionId, spaceId, tp, ...rest }: IWorkFlowParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/${tp}/job/moves`,
    body: rest,
    method: 'POST',
  })

export const deleteJobs = ({
  regionId,
  spaceId,
  tp,
  ...rest
}: IWorkFlowParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/${tp}/job/deletes`,
    body: rest,
    method: 'POST',
  })

export const listJobs = ({ regionId, spaceId, tp, ...rest }: IWorkFlowParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/${tp}/job`,
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

export const setSyncJobSchedule = ({
  regionId,
  spaceId,
  jobId,
  ...rest
}: IWorkFlowParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/sync/job/${jobId}/schedule`,
    body: rest,
    method: 'PUT',
  })

export const getStreamJobSchedule = (
  origin: String,
  { regionId, spaceId, jobId, version }: IWorkFlowParams
) => {
  const uri = version
    ? `/v1/workspace/${spaceId}/stream/job/${jobId}/version/${version}/schedule`
    : `/v1/workspace/${spaceId}/stream/job/${jobId}/schedule`
  return request({
    region: regionId,
    uri,
  })
}

export const getSyncJobSchedule = (
  origin: String,
  { regionId, spaceId, jobId, version }: IWorkFlowParams
) => {
  const uri = version
    ? `/v1/workspace/${spaceId}/sync/job/${jobId}/version/${version}/schedule`
    : `/v1/workspace/${spaceId}/sync/job/${jobId}/schedule`
  return request({
    region: regionId,
    uri,
  })
}

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

export const setSyncJobConf = ({
  regionId,
  spaceId,
  jobId,
  ...rest
}: IWorkFlowParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/sync/job/${jobId}/conf`,
    body: rest,
    method: 'PUT',
  })

export const getSyncJobConf = ({ regionId, spaceId, jobId }: IWorkFlowParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/sync/job/${jobId}/conf`,
    method: 'GET',
  })

export const pingSyncJobConnection = ({
  regionId,
  spaceId,
  jobId,
  ...rest
}: IWorkFlowParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/sync/job/${jobId}/conn`,
    body: rest,
    method: 'POST',
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

export const streamJobCodeRun = ({
  regionId,
  spaceId,
  jobId,
  ...rest
}: IWorkFlowParams) =>
  request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/stream/job/${jobId}/code/run`,
    body: rest,
    method: 'GET',
  })

export const getStreamJobCode = ({
  regionId,
  spaceId,
  jobId,
  version,
}: IWorkFlowParams) => {
  const uri = version
    ? `/v1/workspace/${spaceId}/stream/job/${jobId}/version/${version}/code`
    : `/v1/workspace/${spaceId}/stream/job/${jobId}/code`
  return request({
    region: regionId,
    uri,
  })
}

export const releaseStreamJob = ({
  regionId,
  spaceId,
  jobId,
  ...rest
}: IWorkFlowParams) =>
  request(
    {
      region: regionId,
      uri: `/v1/workspace/${spaceId}/stream/job/${jobId}/release`,
      body: rest,
      method: 'POST',
    },
    { timeout: 60000 }
  )

export const releaseSyncJob = ({
  regionId,
  spaceId,
  jobId,
  ...rest
}: IWorkFlowParams) =>
  request(
    {
      region: regionId,
      uri: `/v1/workspace/${spaceId}/sync/job/${jobId}/release`,
      body: rest,
      method: 'POST',
    },
    { timeout: 60000 }
  )

export const inConnectors = ({ regionId, spaceId, jobId }: IStreamParams) => {
  return request({
    region: regionId,
    uri: `/v1/workspace/${spaceId}/stream/job/${jobId}/args/connectors`,
  })
}
