// generated by https://github.com/spike2044/yapi2js
// Fri, 29 Jul 2022 18:03:09 +0800
import {
  PbrequestReleaseSyncJob,
  PbrequestDeleteAlertPolicies,
  PbrequestUpdateStreamJob,
  PbrequestStopFlinkClusters,
  PbrequestCreateSyncJob,
  PbrequestListDataServiceClusters,
  PbrequestListApiConfigs,
  PbrequestUpdateMember,
  PbrequestUpdateNetwork,
  PbrequestUpdateDataServiceCluster,
  PbrequestTerminateStreamInstances,
  PbrequestReopenReleaseStreamJob,
  PbrequestUpsertMemberQuota,
  PbrequestConvertSyncJobMode,
  PbmodelSyncJobSchedule,
  PbrequestDeleteDataSources,
  PbrequestOfflineReleaseSyncJob,
  PbrequestAlertPolicyUnboundJobs,
  PbrequestCreateWorkspace,
  PbrequestStartDataServiceClusters,
  PbmodelStreamJobCode,
  PbrequestJobBoundAlertPolicies,
  PbrequestDeleteNetworks,
  PbrequestDeleteFlinkClusters,
  PbrequestDisableDataSources,
  PbrequestUpdateApiGroup,
  PbrequestMoveStreamJobs,
  PbrequestCreateNetwork,
  PbrequestSuspendReleaseStreamJob,
  PbrequestCreateAlertPolicy,
  PbrequestUpdateFlinkCluster,
  PbrequestTestDataServiceApi,
  PbrequestDeleteApiGroups,
  PbrequestCreateFlinkCluster,
  PbrequestAlertPolicyBoundJobs,
  PbrequestBindAuthKey,
  PbrequestStopDataServiceClusters,
  PbrequestUpdateSyncJob,
  PbrequestEnableDataSources,
  PbrequestSuspendReleaseSyncJob,
  PbrequestStartFlinkClusters,
  PbmodelStreamJobArgs,
  PbrequestDeleteSyncJobs,
  PbrequestDeleteAuthKey,
  PbrequestDeleteFileMetas,
  PbrequestCreateAuthKey,
  PbrequestUpdateFileMeta,
  PbrequestUpdateAuthKey,
  PbrequestListNotificationsByProxy,
  PbrequestListApiGroups,
  PbrequestCreateApiConfig,
  PbrequestUpdateWorkspace,
  PbmodelSyncJobConf,
  PbrequestDeleteStreamJobs,
  PbrequestDeleteApiConfigs,
  PbrequestUpdateApiConfig,
  PbrequestUpdateApiBaseConfig,
  PbrequestDeleteDataServiceClusters,
  PbrequestPingSyncJobConnection,
  PbrequestDisableWorkspaces,
  PbrequestMoveSyncJobs,
  PbrequestUpdateDataSource,
  PbrequestCreateApiGroup,
  PbrequestEnableWorkspaces,
  PbrequestUpsertWorkspaceQuota,
  PbmodelStreamJobSchedule,
  PbrequestReleaseStreamJob,
  PbrequestAddMembers,
  PbrequestOfflineReleaseStreamJob,
  PbrequestCreateStreamJob,
  PbrequestDeleteMembers,
  PbrequestPingDataSourceConnection,
  PbrequestAbolishDataServiceApis,
  RequestListDataSourceConnections,
  PbrequestDescribePublishedApiHttpDetails,
  PbrequestRestartFlinkClusters,
  PbrequestUpdateAlertPolicy,
  PbrequestAttachVPCToWorkspace,
  PbrequestCreateDataSource,
  PbrequestUnbindAuthKey,
  PbrequestReopenReleaseSyncJob,
  PbrequestJobUnboundAlertPolicies,
  PbrequestCreateDataServiceCluster,
  PbrequestDeleteWorkspaces,
  PbrequestListDataServiceApiVersions,
  PbrequestTerminateSyncInstances
} from './types'

export type ListOpAuditsRequestType = {
  params?: {
    api_name?: string
    ended?: string
    limit?: string
    offset?: string
    perm_type?: string
    reverse?: string
    sort_by?: string
    space_id?: string
    started?: string
    state?: string
  }
}
export type ListNotificationsRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestListNotificationsByProxy
}
export type ListIaaSRouterVXNetsRequestType = {
  params?: {
    limit?: string
    offset?: string
  }
}
export type ListIaaSRoutersRequestType = {
  params?: {
    limit?: string
    offset?: string
  }
}
export type BindAuthKeyRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestBindAuthKey
}
export type CreateAuthKeyRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestCreateAuthKey
}
export type DeleteAuthKeyRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestDeleteAuthKey
}
export type ListApiServicesRequestType = {
  uri: {
    space_id: string
  }
  params?: {
    auth_key_id?: string
    curr_status?: string
    ids?: string
    limit?: string
    name?: string
    offset?: string
    reverse?: string
    sort_by?: string
  }
}
export type ListAuthKeysRequestType = {
  uri: {
    space_id: string
  }
  params?: {
    created_by?: string
    curr_status?: string
    ids?: string
    limit?: string
    name?: string
    offset?: string
    reverse?: string
    sort_by?: string
  }
}
export type ListRoutesRequestType = {
  uri: {
    space_id: string
  }
  params?: {
    api_service_id?: string
    api_version_id?: string
    curr_status?: string
    ids?: string
    limit?: string
    name?: string
    offset?: string
    reverse?: string
    sort_by?: string
    uri?: string
  }
}
export type UnbindAuthKeyRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestUnbindAuthKey
}
export type UpdateAuthKeyRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestUpdateAuthKey
}
export type ListApiConfigsRequestType = {
  uri: {
    space_id: string
  }
  params?: {
    group_id?: string
  }
  data?: PbrequestListApiConfigs
}
export type AbolishDataServiceApisRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestAbolishDataServiceApis
}
export type CreateApiGroupRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestCreateApiGroup
}
export type CreateDataServiceClusterRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestCreateDataServiceCluster
}
export type DeleteApiConfigsRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestDeleteApiConfigs
}
export type DeleteApiGroupsRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestDeleteApiGroups
}
export type DeleteDataServiceClustersRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestDeleteDataServiceClusters
}
export type DescribeApiConfigRequestType = {
  uri: {
    space_id: string
    api_id: string
  }
}
export type DescribeApiGroupRequestType = {
  uri: {
    space_id: string
    group_id: string
  }
}
export type DescribeDataServiceApiVersionRequestType = {
  uri: {
    space_id: string
    api_id: string
    ver_id: string
  }
}
export type DescribeDataServiceClusterRequestType = {
  uri: {
    space_id: string
    cluster_id: string
  }
}
export type DescribePublishedApiHttpDetailsRequestType = {
  uri: {
    space_id: string
    ver_id: string
  }
  data?: PbrequestDescribePublishedApiHttpDetails
}
export type DescribeServiceDataSourceKindsRequestType = {
  uri: {
    space_id: string
  }
  data?: {}
}
export type CreateApiConfigRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestCreateApiConfig
}
export type ListApiGroupsRequestType = {
  uri: {
    space_id: string
  }
  params?: {
    limit?: string
    offset?: string
    reverse?: string
    sort_by?: string
  }
  data?: PbrequestListApiGroups
}
export type ListDataServiceApiVersionsRequestType = {
  uri: {
    space_id: string
    api_id: string
  }
  params?: {
    limit?: string
    offset?: string
    sort_by?: string
  }
  data?: PbrequestListDataServiceApiVersions
}
export type ListDataServiceClustersRequestType = {
  uri: {
    space_id: string
  }
  params?: {
    limit?: string
    name?: string
    offset?: string
    reverse?: string
    sort_by?: string
  }
  data?: PbrequestListDataServiceClusters
}
export type ListPublishedApiVersionsByClusterIdRequestType = {
  uri: {
    space_id: string
    cluster_id: string
  }
  params?: {
    limit?: string
    offset?: string
    sort_by?: string
  }
}
export type PublishDataServiceApiRequestType = {
  uri: {
    space_id: string
    api_id: string
  }
  data?: {}
}
export type RepublishDataServiceApiRequestType = {
  uri: {
    space_id: string
    api_id: string
    ver_id: string
  }
  data?: {}
}
export type StartDataServiceClustersRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestStartDataServiceClusters
}
export type StopDataServiceClustersRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestStopDataServiceClusters
}
export type TestDataServiceApiRequestType = {
  uri: {
    space_id: string
    api_id: string
  }
  data?: PbrequestTestDataServiceApi
}
export type UpdateApiBaseConfigRequestType = {
  uri: {
    space_id: string
    api_id: string
  }
  data?: PbrequestUpdateApiBaseConfig
}
export type UpdateApiConfigRequestType = {
  uri: {
    space_id: string
    api_id: string
  }
  data?: PbrequestUpdateApiConfig
}
export type UpdateApiGroupRequestType = {
  uri: {
    space_id: string
    group_id: string
  }
  data?: PbrequestUpdateApiGroup
}
export type UpdateDataServiceClusterRequestType = {
  uri: {
    space_id: string
    cluster_id: string
  }
  data?: PbrequestUpdateDataServiceCluster
}
export type DescribeWorkspaceOverviewRequestType = {
  uri: {
    space_id: string
  }
}
export type DeleteFilesRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestDeleteFileMetas
}
export type DescribeFileMetaRequestType = {
  uri: {
    space_id: string
    file_id: string
  }
}
export type DownloadFileRequestType = {
  uri: {
    space_id: string
    file_id: string
  }
}
export type ListFileMetasRequestType = {
  uri: {
    space_id: string
  }
  params?: {
    limit?: string
    name?: string
    offset?: string
    pid?: string
    reverse?: string
    search?: string
    sort_by?: string
    types?: string
  }
}
export type ReUploadFileRequestType = {
  uri: {
    space_id: string
    file_id: string
  }
  data?: {
    file?: File
  }
}
export type UpdateFileMetaRequestType = {
  uri: {
    space_id: string
    file_id: string
  }
  data?: PbrequestUpdateFileMeta
}
export type UploadFileRequestType = {
  uri: {
    space_id: string
  }
  data?: {
    desc?: unknown
    name?: unknown
    file?: File
  }
}
export type DescribeSyncInstanceRequestType = {
  uri: {
    space_id: string
    instance_id: string
  }
  params?: {
    verbose?: string
  }
}
export type ListSyncInstancesRequestType = {
  uri: {
    space_id: string
  }
  params?: {
    instance_id?: string
    job_id?: string
    limit?: string
    offset?: string
    reverse?: string
    sort_by?: string
    state?: string
    verbose?: string
    version?: string
  }
}
export type TerminateSyncInstancesRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestTerminateSyncInstances
}
export type ListReleaseSyncJobsRequestType = {
  uri: {
    space_id: string
  }
  params?: {
    job_id?: string
    limit?: string
    offset?: string
    reverse?: string
    search?: string
    sort_by?: string
    status?: string
    verbose?: string
  }
}
export type OfflineReleaseSyncJobRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestOfflineReleaseSyncJob
}
export type ReleaseSyncJobRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
  data?: PbrequestReleaseSyncJob
}
export type ReopenReleaseSyncJobRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestReopenReleaseSyncJob
}
export type SuspendReleaseSyncJobRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestSuspendReleaseSyncJob
}
export type DescribeSyncJobVersionRequestType = {
  uri: {
    space_id: string
    job_id: string
    ver_id: string
  }
}
export type GetSyncJobVersionConfRequestType = {
  uri: {
    space_id: string
    job_id: string
    ver_id: string
  }
}
export type GetSyncJobVersionScheduleRequestType = {
  uri: {
    space_id: string
    job_id: string
    ver_id: string
  }
}
export type ListSyncJobVersionsRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
  params?: {
    limit?: string
    offset?: string
    reverse?: string
    sort_by?: string
    verbose?: string
    version?: string
  }
}
export type GetSyncJobScheduleRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
}
export type ConvertSyncJobModeRequestType = {
  uri: {
    job_id: string
  }
  data?: PbrequestConvertSyncJobMode
}
export type DeleteSyncJobsRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestDeleteSyncJobs
}
export type DescribeSyncConnectionRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
  params?: {
    cluster_id?: string
    source_id?: string
    target_id?: string
  }
}
export type DescribeSyncJobRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
}
export type GenerateJobJsonRequestType = {
  uri: {
    job_id: string
  }
  data?: {}
}
export type GetSyncJobConfRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
}
export type CreateSyncJobRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestCreateSyncJob
}
export type ListSyncJobsRequestType = {
  uri: {
    space_id: string
  }
  params?: {
    is_directory?: string
    limit?: string
    offset?: string
    pid?: string
    reverse?: string
    search?: string
    sort_by?: string
  }
}
export type MoveSyncJobsRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestMoveSyncJobs
}
export type PingSyncJobConnectionRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
  data?: PbrequestPingSyncJobConnection
}
export type SetSyncJobConfRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
  data?: PbmodelSyncJobConf
}
export type SetSyncJobScheduleRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
  data?: PbmodelSyncJobSchedule
}
export type UpdateSyncJobRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
  data?: PbrequestUpdateSyncJob
}
export type ListSystemRolePermissionsRequestType = {
  uri: {
    space_id: string
  }
}
export type ListSystemRolesRequestType = {
  uri: {
    space_id: string
  }
}
export type MoveStreamJobsRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestMoveStreamJobs
}
export type CreateStreamJobRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestCreateStreamJob
}
export type DescribeStreamJobRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
}
export type GetStreamJobArgsRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
}
export type GetStreamJobCodeRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
}
export type GetStreamJobScheduleRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
}
export type ListBuiltInConnectorsRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
}
export type ListStreamJobsRequestType = {
  uri: {
    space_id: string
  }
  params?: {
    is_directory?: string
    limit?: string
    offset?: string
    pid?: string
    reverse?: string
    search?: string
    sort_by?: string
  }
}
export type DeleteStreamJobsRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestDeleteStreamJobs
}
export type SetStreamJobArgsRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
  data?: PbmodelStreamJobArgs
}
export type SetStreamJobCodeRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
  data?: PbmodelStreamJobCode
}
export type SetStreamJobScheduleRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
  data?: PbmodelStreamJobSchedule
}
export type StreamJobCodeRunRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
}
export type StreamJobCodeSyntaxRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
  data?: PbmodelStreamJobCode
}
export type SubmitFlinkSqlJobInteractiveRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
}
export type UpdateStreamJobRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
  data?: PbrequestUpdateStreamJob
}
export type DescribeStreamJobVersionRequestType = {
  uri: {
    space_id: string
    job_id: string
    ver_id: string
  }
}
export type GetStreamJobVersionArgsRequestType = {
  uri: {
    space_id: string
    job_id: string
    ver_id: string
  }
}
export type GetStreamJobVersionCodeRequestType = {
  uri: {
    space_id: string
    job_id: string
    ver_id: string
  }
}
export type GetStreamJobVersionScheduleRequestType = {
  uri: {
    space_id: string
    job_id: string
    ver_id: string
  }
}
export type ListStreamJobVersionsRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
  params?: {
    limit?: string
    offset?: string
    reverse?: string
    sort_by?: string
    version?: string
  }
}
export type DescribeFlinkUIByInstanceIdRequestType = {
  uri: {
    space_id: string
    instance_id: string
  }
}
export type ListStreamInstancesRequestType = {
  uri: {
    space_id: string
  }
  params?: {
    instance_id?: string
    job_id?: string
    limit?: string
    offset?: string
    reverse?: string
    sort_by?: string
    state?: string
    version?: string
  }
}
export type TerminateStreamInstancesRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestTerminateStreamInstances
}
export type ListReleaseStreamJobsRequestType = {
  uri: {
    space_id: string
  }
  params?: {
    job_id?: string
    limit?: string
    offset?: string
    reverse?: string
    search?: string
    sort_by?: string
    status?: string
  }
}
export type OfflineReleaseStreamJobRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestOfflineReleaseStreamJob
}
export type ReleaseStreamJobRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
  data?: PbrequestReleaseStreamJob
}
export type ReopenReleaseStreamJobRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestReopenReleaseStreamJob
}
export type ResumeReleaseStreamJobsRequestType = {
  uri: {
    space_id: string
  }
  data?: {}
}
export type SuspendReleaseStreamJobRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestSuspendReleaseStreamJob
}
export type JobUnboundAlertPoliciesRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
  data?: PbrequestJobUnboundAlertPolicies
}
export type AlertPolicyBoundJobsRequestType = {
  uri: {
    space_id: string
    alert_id: string
  }
  data?: PbrequestAlertPolicyBoundJobs
}
export type CreateAlertPolicyRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestCreateAlertPolicy
}
export type DeleteAlertPoliciesRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestDeleteAlertPolicies
}
export type DescribeAlertPolicyRequestType = {
  uri: {
    space_id: string
    alert_id: string
  }
}
export type JobBoundAlertPoliciesRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
  data?: PbrequestJobBoundAlertPolicies
}
export type AlertPolicyUnboundJobsRequestType = {
  uri: {
    space_id: string
    alert_id: string
  }
  data?: PbrequestAlertPolicyUnboundJobs
}
export type ListAlertLogsRequestType = {
  uri: {
    space_id: string
  }
  params?: {
    alert_id?: string
    event_type?: string
    instance_id?: string
    job_id?: string
    limit?: string
    monitor_object?: string
    offset?: string
    reverse?: string
    sort_by?: string
  }
}
export type ListAlertPoliciesRequestType = {
  uri: {
    space_id: string
  }
  params?: {
    limit?: string
    monitor_object?: string
    name?: string
    offset?: string
    reverse?: string
    search?: string
    sort_by?: string
    verbose?: string
  }
}
export type ListAlertPoliciesByJobRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
  params?: {
    limit?: string
    offset?: string
  }
}
export type ListJobsByAlertPolicyRequestType = {
  uri: {
    space_id: string
    alert_id: string
  }
  params?: {
    limit?: string
    offset?: string
  }
}
export type UpdateAlertPolicyRequestType = {
  uri: {
    space_id: string
    alert_id: string
  }
  data?: PbrequestUpdateAlertPolicy
}
export type DescribePlatformConfigRequestType = {}
export type DescribeWorkspaceQuotaRequestType = {
  uri: {
    space_id: string
  }
}
export type AttachVPCToWorkspaceRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestAttachVPCToWorkspace
}
export type DeleteWorkspacesRequestType = {
  data?: PbrequestDeleteWorkspaces
}
export type DescribeNetworkConfigRequestType = {
  uri: {
    space_id: string
  }
}
export type DescribeResourceBindingRequestType = {
  params?: {
    ids?: string
  }
}
export type DescribeWorkspaceRequestType = {
  uri: {
    space_id: string
  }
}
export type DescribeWorkspaceConfigRequestType = {
  uri: {
    space_id: string
  }
}
export type CreateWorkspaceRequestType = {
  data?: PbrequestCreateWorkspace
}
export type DisableWorkspacesRequestType = {
  data?: PbrequestDisableWorkspaces
}
export type EnableWorkspacesRequestType = {
  data?: PbrequestEnableWorkspaces
}
export type ListMemberWorkspacesRequestType = {
  params?: {
    limit?: string
    name?: string
    offset?: string
    reverse?: string
    search?: string
    sort_by?: string
    status?: string
  }
}
export type ListWorkspacesRequestType = {
  params?: {
    limit?: string
    name?: string
    offset?: string
    reverse?: string
    search?: string
    sort_by?: string
    status?: string
  }
}
export type UpdateWorkspaceRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestUpdateWorkspace
}
export type UpsertWorkspaceQuotaRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestUpsertWorkspaceQuota
}
export type AddMembersRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestAddMembers
}
export type DeleteMembersRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestDeleteMembers
}
export type DescribeMemberRequestType = {
  uri: {
    space_id: string
    user_id: string
  }
}
export type DescribeMemberQuotaRequestType = {
  uri: {
    space_id: string
    user_id: string
  }
}
export type ListAvailableUsersRequestType = {
  uri: {
    space_id: string
  }
  params?: {
    limit?: string
    offset?: string
  }
}
export type ListMembersRequestType = {
  uri: {
    space_id: string
  }
}
export type UpdateMemberRequestType = {
  uri: {
    space_id: string
    user_id: string
  }
  data?: PbrequestUpdateMember
}
export type UpsertMemberQuotaRequestType = {
  uri: {
    space_id: string
    user_id: string
  }
  data?: PbrequestUpsertMemberQuota
}
export type GetPeriodicTasksDispatchCountRequestType = {
  uri: {
    space_id: string
  }
  params?: {
    end_time?: string
    start_time?: string
  }
}
export type GetPeriodicTasksErrorRankingRequestType = {
  uri: {
    space_id: string
  }
  params?: {
    limit?: string
    offset?: string
  }
}
export type GetPeriodicTasksExecutingStatisticsRequestType = {
  uri: {
    space_id: string
  }
  params?: {
    state?: string
  }
}
export type GetPeriodicTasksRuntimeRankingRequestType = {
  uri: {
    space_id: string
  }
  params?: {
    limit?: string
    offset?: string
  }
}
export type GetPeriodicTasksStatusStatisticsRequestType = {
  uri: {
    space_id: string
  }
  params?: {
    end_time?: string
    start_time?: string
  }
}
export type DescribeTableSchemaDataServiceApiRequestType = {
  uri: {
    space_id: string
    source_id: string
    table_name: string
  }
  params?: {
    source_id?: string
    space_id?: string
    table_name?: string
  }
}
export type CreateDataSourceRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestCreateDataSource
}
export type DescribeDataSourceRequestType = {
  uri: {
    space_id: string
    source_id: string
  }
}
export type DescribeDataSourceKindsRequestType = {
  uri: {
    space_id: string
  }
  data?: {}
}
export type DescribeDataSourceTableSchemaRequestType = {
  uri: {
    space_id: string
  }
  params?: {
    source_id?: string
    space_id?: string
    table_name?: string
  }
}
export type DescribeDataSourceTablesRequestType = {
  uri: {
    space_id: string
  }
  params?: {
    source_id?: string
    space_id?: string
  }
}
export type DeleteDataSourcesRequestType = {
  data?: PbrequestDeleteDataSources
}
export type DisableDataSourcesRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestDisableDataSources
}
export type EnableDataSourcesRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestEnableDataSources
}
export type ListDataSourceConnectionsRequestType = {
  uri: {
    space_id: string
  }
  params?: {
    limit?: string
    name?: string
    offset?: string
    reverse?: string
    search?: string
    sort_by?: string
    status?: string
    type?: string
    verbose?: string
  }
  data?: RequestListDataSourceConnections
}
export type ListDataSourcesRequestType = {
  params?: {
    limit?: string
    name?: string
    offset?: string
    reverse?: string
    search?: string
    sort_by?: string
    status?: string
    type?: string
    verbose?: string
  }
}
export type PingDataSourceConnectionRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestPingDataSourceConnection
}
export type UpdateDataSourceRequestType = {
  uri: {
    space_id: string
    source_id: string
  }
  data?: PbrequestUpdateDataSource
}
export type CreateFlinkClusterRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestCreateFlinkCluster
}
export type DeleteFlinkClustersRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestDeleteFlinkClusters
}
export type DescribeFlinkClusterRequestType = {
  uri: {
    space_id: string
    cluster_id: string
  }
}
export type ListAvailableFlinkVersionsRequestType = {
  uri: {
    space_id: string
  }
  params?: {
    source_kind?: string
  }
}
export type ListFlinkClustersRequestType = {
  uri: {
    space_id: string
  }
  params?: {
    limit?: string
    name?: string
    offset?: string
    reverse?: string
    search?: string
    sort_by?: string
    status?: string
    verbose?: string
  }
}
export type RestartFlinkClustersRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestRestartFlinkClusters
}
export type StartFlinkClustersRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestStartFlinkClusters
}
export type StopFlinkClustersRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestStopFlinkClusters
}
export type UpdateFlinkClusterRequestType = {
  uri: {
    space_id: string
    cluster_id: string
  }
  data?: PbrequestUpdateFlinkCluster
}
export type CreateNetworkRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestCreateNetwork
}
export type DeleteNetworksRequestType = {
  uri: {
    space_id: string
  }
  data?: PbrequestDeleteNetworks
}
export type DescribeNetworkRequestType = {
  uri: {
    space_id: string
    network_id: string
  }
}
export type ListNetworksRequestType = {
  uri: {
    space_id: string
  }
  params?: {
    limit?: string
    name?: string
    offset?: string
    reverse?: string
    search?: string
    sort_by?: string
  }
}
export type UpdateNetworkRequestType = {
  uri: {
    space_id: string
    network_id: string
  }
  data?: PbrequestUpdateNetwork
}
