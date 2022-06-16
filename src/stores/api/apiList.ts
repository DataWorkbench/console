// generated by https://github.com/spike2044/yapi2js

export default {
  auditManage: {
    listOpAudits: ['GET', '/v1/audit']
  },

  notifierManage: {
    listNotifications: ['GET', '/v1/workspace/{space_id}/op/notice'],

    listNotifications_copy: ['GET', '/v1/workspace/{space_id}/op/notice_1654143439204']
  },

  iaaSProxy: {
    listIaaSRouterVXNets: ['GET', '/v1/proxy/iaas/routers/{router_id}/vxnets'],

    listIaaSRouters: ['GET', '/v1/proxy/iaas/routers']
  },

  resourceManage: {
    deleteFiles: ['POST', '/v1/workspace/{space_id}/resource/deletes'],

    describeFileMeta: ['GET', '/v1/workspace/{space_id}/resource/{resource_id}/describe'],

    downloadFile: ['GET', '/v1/workspace/{space_id}/resource/{resource_id}/download'],

    listFileMetas: ['GET', '/v1/workspace/{space_id}/resource'],

    reUploadFile: ['POST', '/v1/workspace/{space_id}/resource/{resource_id}'],

    updateFileMeta: ['PUT', '/v1/workspace/{space_id}/resource/{resource_id}'],

    uploadFile: ['POST', '/v1/workspace/{space_id}/resource']
  },

  fileManage: {
    deleteFiles: ['POST', '/v1/workspace/{space_id}/file/deletes'],

    describeFileMeta: ['GET', '/v1/workspace/{space_id}/file/{file_id}'],

    downloadFile: ['GET', '/v1/workspace/{space_id}/file/{file_id}/download'],

    listFileMetas: ['GET', '/v1/workspace/{space_id}/file'],

    reUploadFile: ['POST', '/v1/workspace/{space_id}/file/{file_id}'],

    updateFileMeta: ['PUT', '/v1/workspace/{space_id}/file/{file_id}'],

    uploadFile: ['POST', '/v1/workspace/{space_id}/file']
  },

  syncJobInstanceManage: {
    describeSyncInstance: ['GET', '/v1/workspace/{space_id}/sync/job/instance/{instance_id}'],

    listSyncInstances: ['GET', '/v1/workspace/{space_id}/sync/job/instance'],

    terminateSyncInstances: ['POST', '/v1/workspace/{space_id}/sync/job/instance/terminates']
  },

  syncJobReleaseManage: {
    listReleaseSyncJobs: ['GET', '/v1/workspace/{space_id}/sync/job/release'],

    offlineReleaseSyncJob: ['POST', '/v1/workspace/{space_id}/sync/job/release/{job_id}/offline'],

    releaseSyncJob: ['POST', '/v1/workspace/{space_id}/sync/job/{job_id}/release'],

    reopenReleaseSyncJob: ['POST', '/v1/workspace/{space_id}/sync/job/release/{job_id}/reopen'],

    suspendReleaseSyncJob: ['POST', '/v1/workspace/{space_id}/sync/job/release/{job_id}/suspend']
  },

  syncJobVersionManage: {
    describeSyncJobVersion: ['GET', '/v1/workspace/{space_id}/sync/job/{job_id}/version/{ver_id}'],

    getSyncJobVersionConf: [
      'GET',
      '/v1/workspace/{space_id}/sync/job/{job_id}/version/{ver_id}/conf'
    ],

    getSyncJobVersionSchedule: [
      'GET',
      '/v1/workspace/{space_id}/sync/job/{job_id}/version/{ver_id}/schedule'
    ],

    listSyncJobVersions: ['GET', '/v1/workspace/{space_id}/sync/job/{job_id}/version']
  },

  syncJobDevManage: {
    getSyncJobSchedule: ['GET', '/v1/workspace/{space_id}/sync/job/{job_id}/schedule'],

    convertSyncJobMode: ['POST', '/v1/workspace/{space_id}/sync/job/{job_id}/convert'],

    deleteSyncJobs: ['POST', '/v1/workspace/{space_id}/sync/job/deletes'],

    describeSyncConnection: ['GET', '/v1/workspace/{space_id}/sync/job/{job_id}/conn'],

    describeSyncJob: ['GET', '/v1/workspace/{space_id}/sync/job/{job_id}'],

    generateJobJson: ['POST', '/v1/workspace/{space_id}/sync/job/{job_id}/generate'],

    getSyncJobConf: ['GET', '/v1/workspace/{space_id}/sync/job/{job_id}/conf'],

    createSyncJob: ['POST', '/v1/workspace/{space_id}/sync/job'],

    listSyncJobs: ['GET', '/v1/workspace/{space_id}/sync/job'],

    moveSyncJobs: ['POST', '/v1/workspace/{space_id}/sync/job/moves'],

    pingSyncJobConnection: ['POST', '/v1/workspace/{space_id}/sync/job/{job_id}/conn'],

    setSyncJobConf: ['PUT', '/v1/workspace/{space_id}/sync/job/{job_id}/conf'],

    setSyncJobSchedule: ['PUT', '/v1/workspace/{space_id}/sync/job/{job_id}/schedule'],

    updateSyncJob: ['PUT', '/v1/workspace/{space_id}/sync/job/{job_id}']
  },

  roleManage: {
    listSystemRolePermissions: ['GET', '/v1/workspace/{space_id}/role/system/permission'],

    listSystemRoles: ['GET', '/v1/workspace/{space_id}/role/system']
  },

  streamJobDevMange: {
    moveStreamJobs: ['POST', '/v1/workspace/{space_id}/stream/job/moves'],

    createStreamJob: ['POST', '/v1/workspace/{space_id}/stream/job'],

    describeStreamJob: ['GET', '/v1/workspace/{space_id}/stream/job/{job_id}'],

    getStreamJobArgs: ['GET', '/v1/workspace/{space_id}/stream/job/{job_id}/args'],

    getStreamJobCode: ['GET', '/v1/workspace/{space_id}/stream/job/{job_id}/code'],

    getStreamJobSchedule: ['GET', '/v1/workspace/{space_id}/stream/job/{job_id}/schedule'],

    listBuiltInConnectors: ['GET', '/v1/workspace/{space_id}/stream/job/{job_id}/args/connectors'],

    listStreamJobs: ['GET', '/v1/workspace/{space_id}/stream/job'],

    deleteStreamJobs: ['POST', '/v1/workspace/{space_id}/stream/job/deletes'],

    setStreamJobArgs: ['PUT', '/v1/workspace/{space_id}/stream/job/{job_id}/args'],

    setStreamJobCode: ['PUT', '/v1/workspace/{space_id}/stream/job/{job_id}/code'],

    setStreamJobSchedule: ['PUT', '/v1/workspace/{space_id}/stream/job/{job_id}/schedule'],

    streamJobCodeRun: ['GET', '/v1/workspace/{space_id}/stream/job/{job_id}/code/run'],

    streamJobCodeSyntax: ['POST', '/v1/workspace/{space_id}/stream/job/{job_id}/code/syntax'],

    submitFlinkSqlJobInteractive: ['GET', '/v1/workspace/{space_id}/stream/job/{job_id}/ws'],

    updateStreamJob: ['PUT', '/v1/workspace/{space_id}/stream/job/{job_id}']
  },

  streamJobVersionManage: {
    describeStreamJobVersion: [
      'GET',
      '/v1/workspace/{space_id}/stream/job/{job_id}/version/{ver_id}'
    ],

    getStreamJobVersionArgs: [
      'GET',
      '/v1/workspace/{space_id}/stream/job/{job_id}/version/{ver_id}/args'
    ],

    getStreamJobVersionCode: [
      'GET',
      '/v1/workspace/{space_id}/stream/job/{job_id}/version/{ver_id}/code'
    ],

    getStreamJobVersionSchedule: [
      'GET',
      '/v1/workspace/{space_id}/stream/job/{job_id}/version/{ver_id}/schedule'
    ],

    listStreamJobVersions: ['GET', '/v1/workspace/{space_id}/stream/job/{job_id}/version']
  },

  streamJobInstanceManage: {
    describeFlinkUIByInstanceId: [
      'GET',
      '/v1/workspace/{space_id}/stream/job/instance/{instance_id}/flink-ui'
    ],

    listStreamInstances: ['GET', '/v1/workspace/{space_id}/stream/job/instance'],

    terminateStreamInstances: ['POST', '/v1/workspace/{space_id}/stream/job/instance/terminates']
  },

  streamJobReleaseManage: {
    listReleaseStreamJobs: ['GET', '/v1/workspace/{space_id}/stream/job/release'],

    offlineReleaseStreamJob: [
      'POST',
      '/v1/workspace/{space_id}/stream/job/release/{job_id}/offline'
    ],

    releaseStreamJob: ['POST', '/v1/workspace/{space_id}/stream/job/{job_id}/release'],

    reopenReleaseStreamJob: ['POST', '/v1/workspace/{space_id}/stream/job/release/{job_id}/reopen'],

    resumeReleaseStreamJobs: [
      'POST',
      '/v1/workspace/{space_id}/stream/job/release/{job_id}/resume'
    ],

    suspendReleaseStreamJob: [
      'POST',
      '/v1/workspace/{space_id}/stream/job/release/{job_id}/suspend'
    ]
  },

  alertManage: {
    jobBoundAlertPolicies: ['POST', '/v1/workspace/{space_id}/op/alert/map/job/{job_id}/bound'],

    alertPolicyBoundJobs: ['POST', '/v1/workspace/{space_id}/op/alert/map/policy/{alert_id}/bound'],

    createAlertPolicy: ['POST', '/v1/workspace/{space_id}/op/alert'],

    deleteAlertPolicies: ['POST', '/v1/workspace/{space_id}/op/alert/deletes'],

    describeAlertPolicy: ['GET', '/v1/workspace/{space_id}/op/alert/{alert_id}'],

    alertPolicyUnboundJobs: [
      'POST',
      '/v1/workspace/{space_id}/op/alert/map/policy/{alert_id}/unbound'
    ],

    jobUnboundAlertPolicies: ['POST', '/v1/workspace/{space_id}/op/alert/map/job/{job_id}/unbound'],

    listAlertPolicies: ['GET', '/v1/workspace/{space_id}/op/alert'],

    listAlertPoliciesByJob: ['GET', '/v1/workspace/{space_id}/op/alert/map/job/{job_id}'],

    listJobsByAlertPolicy: ['GET', '/v1/workspace/{space_id}/op/alert/map/policy/{alert_id}'],

    updateAlertPolicy: ['PUT', '/v1/workspace/{space_id}/op/alert/{alert_id}']
  },

  platformManage: {
    describePlatformConfig: ['GET', '/v1/platform/config']
  },

  spaceManage: {
    describeWorkspaceQuota: ['GET', '/v1/workspace/{space_id}/quota'],

    attachVPCToWorkspace: ['POST', '/v1/workspace/{space_id}/config/networks/vpc/attach'],

    deleteWorkspaces: ['POST', '/v1/workspace/deletes'],

    describeNetworkConfig: ['GET', '/v1/workspace/{space_id}/config/networks'],

    describeResourceBinding: ['GET', '/v1/workspace/{space_id}/binding/resources'],

    describeWorkspace: ['GET', '/v1/workspace/{space_id}'],

    createWorkspace: ['POST', '/v1/workspace'],

    disableWorkspaces: ['POST', '/v1/workspace/disables'],

    enableWorkspaces: ['POST', '/v1/workspace/enables'],

    listMemberWorkspaces: ['GET', '/v1/workspace/members'],

    listWorkspaces: ['GET', '/v1/workspace'],

    updateWorkspace: ['PUT', '/v1/workspace/{space_id}'],

    upsertWorkspaceQuota: ['POST', '/v1/workspace/{space_id}/quota']
  },

  memberManage: {
    addMembers: ['POST', '/v1/workspace/{space_id}/member'],

    deleteMembers: ['POST', '/v1/workspace/{space_id}/member/deletes'],

    describeMember: ['GET', '/v1/workspace/{space_id}/member/{user_id}'],

    describeMemberQuota: ['GET', '/v1/workspace/{space_id}/member/{user_id}/quota'],

    listMembers: ['GET', '/v1/workspace/{space_id}/member'],

    updateMember: ['POST', '/v1/workspace/{space_id}/member/{user_id}'],

    upsertMemberQuota: ['POST', '/v1/workspace/{space_id}/member/{user_id}/quota']
  },

  statManage: {
    getPeriodicTasksDispatchCount: ['GET', '/v1/workspace/:space_id/statistics/periodic/tasks'],

    getPeriodicTasksErrorRanking: ['GET', '/v1/workspace/:space_id/statistics/periodic/error'],

    getPeriodicTasksExecutingStatistics: [
      'GET',
      '/v1/workspace/:space_id/statistics/periodic/execution'
    ],

    getPeriodicTasksRuntimeRanking: ['GET', '/v1/workspace/:space_id/statistics/periodic/runtime'],

    getPeriodicTasksStatusStatistics: ['GET', '/v1/workspace/:space_id/statistics/periodic/status']
  },

  dataSourceManage: {
    disableDataSources: ['POST', '/v1/workspace/{space_id}/datasource/disables'],

    createDataSource: ['POST', '/v1/workspace/{space_id}/datasource'],

    describeDataSource: ['GET', '/v1/workspace/{space_id}/datasource/{source_id}'],

    describeDataSourceKinds: ['GET', '/v1/workspace/{space_id}/datasource/kinds'],

    describeDataSourceTableSchema: [
      'GET',
      '/v1/workspace/{space_id}/datasource/{source_id}/table/{table_name}/schema'
    ],

    describeDataSourceTables: ['GET', '/v1/workspace/{space_id}/datasource/{source_id}/tables'],

    deleteDataSources: ['POST', '/v1/workspace/{space_id}/datasource/deletes'],

    enableDataSources: ['POST', '/v1/workspace/{space_id}/datasource/enables'],

    listDataSourceConnections: ['GET', '/v1/workspace/{space_id}/datasource/{source_id}/conn'],

    listDataSources: ['GET', '/v1/workspace/{space_id}/datasource'],

    pingDataSourceConnection: ['POST', '/v1/workspace/{space_id}/datasource/ping'],

    updateDataSource: ['PUT', '/v1/workspace/{space_id}/datasource/{source_id}']
  },

  clusterManage: {
    createFlinkCluster: ['POST', '/v1/workspace/{space_id}/cluster/flink'],

    deleteFlinkClusters: ['POST', '/v1/workspace/{space_id}/cluster/flink/deletes'],

    describeFlinkCluster: ['GET', '/v1/workspace/{space_id}/cluster/flink/{cluster_id}'],

    listAvailableFlinkVersions: ['GET', '/v1/workspace/{space_id}/cluster/flink/versions'],

    listFlinkClusters: ['GET', '/v1/workspace/{space_id}/cluster/flink'],

    startFlinkClusters: ['POST', '/v1/workspace/{space_id}/cluster/flink/starts'],

    stopFlinkClusters: ['POST', '/v1/workspace/{space_id}/cluster/flink/stops'],

    updateFlinkCluster: ['PUT', '/v1/workspace/{space_id}/cluster/flink/{cluster_id}']
  },

  networkMange: {
    createNetwork: ['POST', '/v1/workspace/{space_id}/network'],

    deleteNetworks: ['POST', '/v1/workspace/{space_id}/network/deletes'],

    describeNetwork: ['GET', '/v1/workspace/{space_id}/network/{network_id}'],

    listNetworks: ['GET', '/v1/workspace/{space_id}/network'],

    updateNetwork: ['PUT', '/v1/workspace/{space_id}/network/{network_id}']
  }
}
