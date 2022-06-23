import { apiConfig } from 'utils/api'

export const auditManage = apiConfig({
  ListOpAudits: ['get', '/v1/audit'],
})

export const notifierManage = apiConfig({
  ListNotifications: ['get', '/v1/workspace/{space_id}/op/notice'],
})

export const convertSyncJobMode = apiConfig({
  GenerateJobJson: [
    'post',
    '/v1/workspace/{space_id}/sync/job/{job_id}/convert',
  ],
})

export const uDFManage = apiConfig({
  '/v1/workspace/{space_id}/udf/{udf_id}': [
    'get',
    '/v1/workspace/{space_id}/udf/{udf_id}',
  ],

  CreateUDF: ['post', '/v1/workspace/{space_id}/udf'],

  DeleteUDFs: ['post', '/v1/workspace/{space_id}/udf/deletes'],

  ListUDFs: ['get', '/v1/workspace/{space_id}/udf'],

  UpdateUDF: ['put', '/v1/workspace/{space_id}/udf/{udf_id}'],
})

export const resourceManage = apiConfig({
  DeleteFiles: ['post', '/v1/workspace/{space_id}/resource/deletes'],

  DescribeFileMeta: [
    'get',
    '/v1/workspace/{space_id}/resource/{resource_id}/describe',
  ],

  DownloadFile: [
    'get',
    '/v1/workspace/{space_id}/resource/{resource_id}/download',
  ],

  ListFileMetas: ['get', '/v1/workspace/{space_id}/resource'],

  ReUploadFile: ['post', '/v1/workspace/{space_id}/resource/{resource_id}'],

  UpdateFileMeta: ['put', '/v1/workspace/{space_id}/resource/{resource_id}'],

  UploadFile: ['post', '/v1/workspace/{space_id}/resource'],
})

export const fileManage = apiConfig({
  DeleteFiles: ['post', '/v1/workspace/{space_id}/file/deletes'],

  DescribeFileMeta: ['get', '/v1/workspace/{space_id}/file/{file_id}'],

  DownloadFile: ['get', '/v1/workspace/{space_id}/file/{file_id}/download'],

  ListFileMetas: ['get', '/v1/workspace/{space_id}/file'],

  ReUploadFile: ['post', '/v1/workspace/{space_id}/file/{file_id}'],

  UpdateFileMeta: ['put', '/v1/workspace/{space_id}/file/{file_id}'],

  UploadFile: ['post', '/v1/workspace/{space_id}/file'],
})

export const syncJobInstanceManage = apiConfig({
  DescribeSyncInstance: [
    'get',
    '/v1/workspace/{space_id}/sync/job/instance/{instance_id}',
  ],

  ListSyncInstances: ['get', '/v1/workspace/{space_id}/sync/job/instance'],

  TerminateSyncInstances: [
    'post',
    '/v1/workspace/{space_id}/sync/job/instance/terminates',
  ],
})

export const syncJobReleaseManage = apiConfig({
  ListReleaseSyncJobs: ['get', '/v1/workspace/{space_id}/sync/job/release'],

  OfflineReleaseSyncJob: [
    'post',
    '/v1/workspace/{space_id}/sync/job/release/{job_id}/offline',
  ],

  ReleaseSyncJob: [
    'post',
    '/v1/workspace/{space_id}/sync/job/{job_id}/release',
  ],

  ResumeReleaseSyncJobs: [
    'post',
    '/v1/workspace/{space_id}/sync/job/release/{job_id}/resume',
  ],

  SuspendReleaseSyncJob: [
    'post',
    '/v1/workspace/{space_id}/sync/job/release/{job_id}/suspend',
  ],
})

export const syncJobVersionManage = apiConfig({
  DescribeSyncJobVersion: [
    'get',
    '/v1/workspace/{space_id}/sync/job/{job_id}/version/{ver_id}',
  ],

  GetSyncJobVersionConf: [
    'get',
    '/v1/workspace/{space_id}/sync/job/{job_id}/version/{ver_id}/conf',
  ],

  GetSyncJobVersionSchedule: [
    'get',
    '/v1/workspace/{space_id}/sync/job/{job_id}/version/{ver_id}/schedule',
  ],

  ListSyncJobVersions: [
    'get',
    '/v1/workspace/{space_id}/sync/job/{job_id}/version',
  ],
})

export const syncJobDevManage = apiConfig({
  GetSyncJobSchedule: [
    'get',
    '/v1/workspace/{space_id}/sync/job/{job_id}/schedule',
  ],

  CreateSyncJob: ['post', '/v1/workspace/{space_id}/sync/job'],

  DescribeSyncConnection: [
    'get',
    '/v1/workspace/{space_id}/sync/job/{job_id}/conn',
  ],

  DescribeSyncJob: ['get', '/v1/workspace/{space_id}/sync/job/{job_id}'],

  GenerateJobJson: [
    'post',
    '/v1/workspace/{space_id}/sync/job/{job_id}/generate',
  ],

  GetSyncJobConf: ['get', '/v1/workspace/{space_id}/sync/job/{job_id}/conf'],

  DeleteSyncJobs: ['post', '/v1/workspace/{space_id}/sync/job/deletes'],

  ListSyncJobs: ['get', '/v1/workspace/{space_id}/sync/job'],

  MoveSyncJobs: ['post', '/v1/workspace/{space_id}/sync/job/moves'],

  PingSyncJobConnection: [
    'post',
    '/v1/workspace/{space_id}/sync/job/{job_id}/conn',
  ],

  SetSyncJobConf: ['put', '/v1/workspace/{space_id}/sync/job/{job_id}/conf'],

  SetSyncJobSchedule: [
    'put',
    '/v1/workspace/{space_id}/sync/job/{job_id}/schedule',
  ],

  UpdateSyncJob: ['put', '/v1/workspace/{space_id}/sync/job/{job_id}'],
})

export const roleManage = apiConfig({
  ListSystemRolePermissions: [
    'get',
    '/v1/workspace/{space_id}/role/system/permission',
  ],

  ListSystemRoles: ['get', '/v1/workspace/{space_id}/role/system'],
})

export const streamJobDevMange = apiConfig({
  ListStreamJobs: ['get', '/v1/workspace/{space_id}/stream/job'],

  CreateStreamJob: ['post', '/v1/workspace/{space_id}/stream/job'],

  DescribeStreamJob: ['get', '/v1/workspace/{space_id}/stream/job/{job_id}'],

  GetStreamJobArgs: [
    'get',
    '/v1/workspace/{space_id}/stream/job/{job_id}/args',
  ],

  GetStreamJobCode: [
    'get',
    '/v1/workspace/{space_id}/stream/job/{job_id}/code',
  ],

  GetStreamJobSchedule: [
    'get',
    '/v1/workspace/{space_id}/stream/job/{job_id}/schedule',
  ],

  ListBuiltInConnectors: [
    'get',
    '/v1/workspace/{space_id}/stream/job/{job_id}/args/connectors',
  ],

  DeleteStreamJobs: ['post', '/v1/workspace/{space_id}/stream/job/deletes'],

  MoveStreamJobs: ['post', '/v1/workspace/{space_id}/stream/job/moves'],

  SetStreamJobArgs: [
    'put',
    '/v1/workspace/{space_id}/stream/job/{job_id}/args',
  ],

  SetStreamJobCode: [
    'put',
    '/v1/workspace/{space_id}/stream/job/{job_id}/code',
  ],

  SetStreamJobSchedule: [
    'put',
    '/v1/workspace/{space_id}/stream/job/{job_id}/schedule',
  ],

  StreamJobCodeRun: [
    'get',
    '/v1/workspace/{space_id}/stream/job/{job_id}/code/run',
  ],

  StreamJobCodeSyntax: [
    'post',
    '/v1/workspace/{space_id}/stream/job/{job_id}/code/syntax',
  ],

  UpdateStreamJob: ['put', '/v1/workspace/{space_id}/stream/job/{job_id}'],
})

export const streamJobVersionManage = apiConfig({
  DescribeStreamJobVersion: [
    'get',
    '/v1/workspace/{space_id}/stream/job/{job_id}/version/{ver_id}',
  ],

  GetStreamJobVersionArgs: [
    'get',
    '/v1/workspace/{space_id}/stream/job/{job_id}/version/{ver_id}/args',
  ],

  GetStreamJobVersionCode: [
    'get',
    '/v1/workspace/{space_id}/stream/job/{job_id}/version/{ver_id}/code',
  ],

  GetStreamJobVersionSchedule: [
    'get',
    '/v1/workspace/{space_id}/stream/job/{job_id}/version/{ver_id}/schedule',
  ],

  ListStreamJobVersions: [
    'get',
    '/v1/workspace/{space_id}/stream/job/{job_id}/version',
  ],
})

export const streamJobInstanceManage = apiConfig({
  DescribeFlinkUIByInstanceId: [
    'get',
    '/v1/workspace/{space_id}/stream/job/instance/{instance_id}/flink-ui',
  ],

  ListStreamInstances: ['get', '/v1/workspace/{space_id}/stream/job/instance'],

  TerminateStreamInstances: [
    'post',
    '/v1/workspace/{space_id}/stream/job/instance/terminates',
  ],
})

export const streamJobReleaseManage = apiConfig({
  ListReleaseStreamJobs: ['get', '/v1/workspace/{space_id}/stream/job/release'],

  OfflineReleaseStreamJob: [
    'post',
    '/v1/workspace/{space_id}/stream/job/release/{job_id}/offline',
  ],

  ReleaseStreamJob: [
    'post',
    '/v1/workspace/{space_id}/stream/job/{job_id}/release',
  ],

  ResumeReleaseStreamJobs: [
    'post',
    '/v1/workspace/{space_id}/stream/job/release/{job_id}/resume',
  ],

  SuspendReleaseStreamJob: [
    'post',
    '/v1/workspace/{space_id}/stream/job/release/{job_id}/suspend',
  ],
})

export const alertManage = apiConfig({
  JobBoundAlertPolicies: [
    'post',
    '/v1/workspace/{space_id}/op/alert/map/job/{job_id}/bound',
  ],

  AlertPolicyBoundJobs: [
    'post',
    '/v1/workspace/{space_id}/op/alert/map/policy/{alert_id}/bound',
  ],

  CreateAlertPolicy: ['post', '/v1/workspace/{space_id}/op/alert'],

  DeleteAlertPolicies: ['post', '/v1/workspace/{space_id}/op/alert/deletes'],

  DescribeAlertPolicy: ['get', '/v1/workspace/{space_id}/op/alert/{alert_id}'],

  AlertPolicyUnboundJobs: [
    'post',
    '/v1/workspace/{space_id}/op/alert/map/policy/{alert_id}/unbound',
  ],

  JobUnboundAlertPolicies: [
    'post',
    '/v1/workspace/{space_id}/op/alert/map/job/{job_id}/unbound',
  ],

  ListAlertPolicies: ['get', '/v1/workspace/{space_id}/op/alert'],

  ListAlertPoliciesByJob: [
    'get',
    '/v1/workspace/{space_id}/op/alert/map/job/{job_id}',
  ],

  ListJobsByAlertPolicy: [
    'get',
    '/v1/workspace/{space_id}/op/alert/map/policy/{alert_id}',
  ],

  UpdateAlertPolicy: ['put', '/v1/workspace/{space_id}/op/alert/{alert_id}'],
})

export const platformManage = apiConfig({
  DescribePlatformConfig: ['get', '/v1/platform/config'],
})

export const spaceManage = apiConfig({
  DisableWorkspaces: ['post', '/v1/workspace/disables'],

  CreateWorkspace: ['post', '/v1/workspace'],

  DescribeResourceBinding: [
    'get',
    '/v1/workspace/{space_id}/binding/resources',
  ],

  DescribeWorkspace: ['get', '/v1/workspace/{space_id}'],

  DescribeWorkspaceQuota: ['get', '/v1/workspace/{space_id}/quota'],

  DeleteWorkspaces: ['post', '/v1/workspace/deletes'],

  EnableWorkspaces: ['post', '/v1/workspace/enables'],

  ListMemberWorkspaces: ['get', '/v1/workspace/members'],

  ListWorkspaces: ['get', '/v1/workspace'],

  UpdateWorkspace: ['put', '/v1/workspace/{space_id}'],

  UpsertWorkspaceQuota: ['post', '/v1/workspace/{space_id}/quota'],
})

export const memberManage = apiConfig({
  AddMembers: ['post', '/v1/workspace/{space_id}/member'],

  DeleteMembers: ['post', '/v1/workspace/{space_id}/member/deletes'],

  DescribeMember: ['get', '/v1/workspace/{space_id}/member/{user_id}'],

  DescribeMemberQuota: [
    'get',
    '/v1/workspace/{space_id}/member/{user_id}/quota',
  ],

  ListMembers: ['get', '/v1/workspace/{space_id}/member'],

  UpdateMember: ['post', '/v1/workspace/{space_id}/member/{user_id}'],

  UpsertMemberQuota: [
    'post',
    '/v1/workspace/{space_id}/member/{user_id}/quota',
  ],
})

export const statManage = apiConfig({
  GetPeriodicTasksDispatchCount: [
    'get',
    '/v1/workspace/:space_id/statistics/periodic/tasks',
  ],

  GetPeriodicTasksErrorRanking: [
    'get',
    '/v1/workspace/:space_id/statistics/periodic/error',
  ],

  GetPeriodicTasksExecutingStatistics: [
    'get',
    '/v1/workspace/:space_id/statistics/periodic/execution',
  ],

  GetPeriodicTasksRuntimeRanking: [
    'get',
    '/v1/workspace/:space_id/statistics/periodic/runtime',
  ],

  GetPeriodicTasksStatusStatistics: [
    'get',
    '/v1/workspace/:space_id/statistics/periodic/status',
  ],
})

export const dataSourceManage = apiConfig({
  DisableDataSources: ['post', '/v1/workspace/{space_id}/datasource/disables'],

  CreateDataSource: ['post', '/v1/workspace/{space_id}/datasource'],

  DescribeDataSource: [
    'get',
    '/v1/workspace/{space_id}/datasource/{source_id}',
  ],

  DescribeDataSourceKinds: ['get', '/v1/workspace/{space_id}/datasource/kinds'],

  DescribeDataSourceTableSchema: [
    'get',
    '/v1/workspace/{space_id}/datasource/{source_id}/table/{table_name}/schema',
  ],

  DescribeDataSourceTables: [
    'get',
    '/v1/workspace/{space_id}/datasource/{source_id}/tables',
  ],

  DeleteDataSources: ['post', '/v1/workspace/{space_id}/datasource/deletes'],

  EnableDataSources: ['post', '/v1/workspace/{space_id}/datasource/enables'],

  ListDataSourceConnections: [
    'get',
    '/v1/workspace/{space_id}/datasource/{source_id}/conn',
  ],

  ListDataSources: ['get', '/v1/workspace/{space_id}/datasource'],

  PingDataSourceConnection: [
    'post',
    '/v1/workspace/{space_id}/datasource/ping',
  ],

  UpdateDataSource: ['put', '/v1/workspace/{space_id}/datasource/{source_id}'],
})

export const clusterManage = apiConfig({
  CreateFlinkCluster: ['post', '/v1/workspace/{space_id}/cluster/flink'],

  DeleteFlinkClusters: [
    'post',
    '/v1/workspace/{space_id}/cluster/flink/deletes',
  ],

  DescribeFlinkCluster: [
    'get',
    '/v1/workspace/{space_id}/cluster/flink/{cluster_id}',
  ],

  ListAvailableFlinkVersions: [
    'get',
    '/v1/workspace/{space_id}/cluster/flink/versions',
  ],

  ListFlinkClusters: ['get', '/v1/workspace/{space_id}/cluster/flink'],

  StartFlinkClusters: ['post', '/v1/workspace/{space_id}/cluster/flink/starts'],

  StopFlinkClusters: ['post', '/v1/workspace/{space_id}/cluster/flink/stops'],

  UpdateFlinkCluster: [
    'put',
    '/v1/workspace/{space_id}/cluster/flink/{cluster_id}',
  ],
})

export const networkMange = apiConfig({
  CreateNetwork: ['post', '/v1/workspace/{space_id}/network'],

  DeleteNetworks: ['post', '/v1/workspace/{space_id}/network/deletes'],

  DescribeNetwork: ['get', '/v1/workspace/{space_id}/network/{network_id}'],

  ListNetworks: ['get', '/v1/workspace/{space_id}/network'],

  UpdateNetwork: ['put', '/v1/workspace/{space_id}/network/{network_id}'],
})
