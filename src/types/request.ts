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
  data?: {
    limit: number
    offset: number
  }
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
export type DeleteFilesRequestType = {
  uri: {
    space_id: string
  }
  data?: {
    resource_ids: string[]
  }
}
export type DescribeFileMetaRequestType = {
  uri: {
    space_id: string
    resource_id: string
  }
}
export type DownloadFileRequestType = {
  uri: {
    space_id: string
    resource_id: string
  }
}
export type ListFileMetasRequestType = {
  uri: {
    space_id: string
  }
  params?: {
    limit?: string
    offset?: string
    pid?: string
    resource_name?: string
    resource_type?: string
    reverse?: string
    search?: string
    sort_by?: string
  }
}
export type ReUploadFileRequestType = {
  uri: {
    space_id: string
    resource_id: string
  }
  data?: {
    file?: File
  }
}
export type UpdateFileMetaRequestType = {
  uri: {
    space_id: string
    resource_id: string
  }
  data?: {
    resource_name: string
    resource_type: number
    description: string
  }
}
export type UploadFileRequestType = {
  uri: {
    space_id: string
  }
  data?: {
    description?: unknown
    resource_name?: unknown
    resource_type?: unknown
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
  data?: {
    instance_ids: string[]
  }
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
  }
}
export type OfflineReleaseSyncJobRequestType = {
  uri: {
    space_id: string
  }
  data?: {
    stop_running: boolean
  }
}
export type ReleaseSyncJobRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
  data?: {
    stop_running: boolean
    desc: string
  }
}
export type ResumeReleaseSyncJobsRequestType = {
  uri: {
    space_id: string
  }
}
export type SuspendReleaseSyncJobRequestType = {
  uri: {
    space_id: string
  }
  data?: {
    stop_running: boolean
  }
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
  data?: {
    conf: {
      job_content: string
      cluster_id: string
      sync_resource: {
        mysql_source: {
          express: string
          mapping_type: number
          split_pk: string
          table: string[]
          where: string
          condition_type: number
          column: {
            format: string
            is_part: boolean
            value: string
            index: number
            type: string
            name: string
          }[]
          visualization: {
            start_value: string
            start_condition: string
            end_condition: string
            end_value: string
            column: string
          }
          schema: string
        }
        mysql_target: {
          table: string[]
          schema: string
          update_key: string[]
          semantic: number
          batch_size: number
          post_sql: string[]
          write_mode: number
          column: {
            format: string
            index: number
            type: string
            value: string
            is_part: boolean
            name: string
          }[]
          pre_sql: string[]
          with_no_lock: string
        }
        db2_target: {
          post_sql: string[]
          column: {
            type: string
            is_part: boolean
            index: number
            name: string
            value: string
            format: string
          }[]
          write_mode: number
          schema: string
          semantic: number
          update_key: string[]
          with_no_lock: string
          batch_size: number
          pre_sql: string[]
          table: string[]
        }
        mongodb_source: {
          column: {
            name: string
            value: string
            format: string
            is_part: boolean
            type: string
            index: number
          }[]
          collection_name: string
          fetch_size: number
          filter: string
          database: string
        }
        logminer_source: {
          fetch_size: number
          read_position: string
          support_auto_add_log: boolean
          table: string[]
          cat: string
          paving_data: boolean
          split_update: boolean
          query_timeout: number
          start_time: number
          start_scn: string
        }
        kafka_target: {
          tableFields: {
            value: string
            format: string
            index: number
            name: string
            is_part: boolean
            type: string
          }[]
          topic: string
          consumer_settings: {
            auto_commit_enable: string
          }
        }
        mongodb_target: {
          database: string
          column: {
            index: number
            type: string
            format: string
            name: string
            value: string
            is_part: boolean
          }[]
          batch_size: number
          replace_key: string
          write_mode: number
          collection_name: string
          flush_interval_mills: number
        }
        postgresql_target: {
          with_no_lock: string
          pre_sql: string[]
          update_key: string[]
          write_mode: number
          schema: string
          column: {
            is_part: boolean
            format: string
            index: number
            value: string
            name: string
            type: string
          }[]
          semantic: number
          batch_size: number
          post_sql: string[]
          table: string[]
        }
        sqlserver_target: {
          post_sql: string[]
          table: string[]
          with_no_lock: string
          schema: string
          batch_size: number
          column: {
            index: number
            value: string
            is_part: boolean
            format: string
            name: string
            type: string
          }[]
          pre_sql: string[]
          semantic: number
          update_key: string[]
          write_mode: number
        }
        binlog_source: {
          is_gtid_mode: boolean
          connect_timeout: number
          schema: string
          split_update: boolean
          start: {
            position: number
            timestamp: number
            journal_name: string
          }
          paving_data: boolean
          table: string[]
          filter: string
          cat: string
          query_timeout: number
        }
        hive_target: {
          use_partition: boolean
          encoding: number
          tables_column: string
          compress: number
          write_mode: number
          table: string
          file_type: number
          field_delimiter: string
          column: {
            type: string
            key: string
          }[]
          partition_type: number
          partition: string
        }
        ftp_source: {
          control_encoding: string
          connect_pattern: string
          path: string
          private_key_path: string
          compress_type: string
          is_first_line_header: boolean
          column: {
            is_part: boolean
            name: string
            index: number
            type: string
            value: string
            format: string
          }[]
          encoding: string
          file_config: string
          file_type: string
          timeout: string
          field_delimiter: string
        }
        kafka_source: {
          topic: string
          group_id: string
          mode: string
          consumer_settings: {
            auto_commit_enable: string
          }
          offset: string
          timestamp: number
          column: {
            value: string
            name: string
            index: number
            format: string
            is_part: boolean
            type: string
          }[]
          encoding: string
          codec: string
        }
        redis_target: {
          value_field_delimiter: string
          key_field_delimiter: string
          expire_time: number
          timeout: number
          database: number
          date_format: string
          mode: string
          keyIndexes: number[]
          type: number
        }
        oracle_target: {
          update_key: string[]
          table: string[]
          batch_size: number
          semantic: number
          column: {
            type: string
            index: number
            is_part: boolean
            name: string
            format: string
            value: string
          }[]
          pre_sql: string[]
          post_sql: string[]
          schema: string
          with_no_lock: string
          write_mode: number
        }
        hbase_source: {
          table: {
            table_name: string
          }
          name: string
          parameter: {
            change_log: string
            hadoopConfig: string
            hbaseConfig: string
            encoding: string
            scan_cache_size: number
            column: {
              name: string
              type: string
              format: string
              is_part: boolean
              value: string
              index: number
            }[]
            range: {
              end_row_key: string
              start_row_key: string
              is_binary_rowkey: boolean
            }
            scan_batch_size: number
          }
        }
        sap_hana_target: {
          column: {
            value: string
            is_part: boolean
            format: string
            name: string
            index: number
            type: string
          }[]
          with_no_lock: string
          post_sql: string[]
          write_mode: number
          pre_sql: string[]
          batch_size: number
          schema: string
          semantic: number
          table: string[]
          update_key: string[]
        }
        hbase_target: {
          table: {
            table_name: string
          }
          parameter: {
            version_column_value: string
            column: {
              type: string
              format: string
              value: string
              index: number
              name: string
              is_part: boolean
            }[]
            scan_batch_size: number
            hbase_config: string
            rowkey_express: string
            null_mode: string
            change_log: string
            version_column_index: number
            scan_cache_size: number
            write_buffer_size: number
            wal_flag: boolean
          }
          name: string
        }
        elastic_search_target: {
          batch_size: number
          index: string
          key_delimiter: string
          column: {
            format: string
            index: number
            name: string
            value: string
            is_part: boolean
            type: string
          }[]
          version: string
        }
        hdfs_source: {
          filter_regex: string
          path: string
          column: {
            name: string
            index: number
            format: string
            type: string
            is_part: boolean
            value: string
          }[]
          field_delimiter: string
          encoding: number
          file_type: number
        }
        click_house_source: {
          mapping_type: number
          table: string[]
          express: string
          where: string
          column: {
            name: string
            format: string
            type: string
            is_part: boolean
            index: number
            value: string
          }[]
          split_pk: string
          condition_type: number
          visualization: {
            start_value: string
            end_value: string
            column: string
            end_condition: string
            start_condition: string
          }
          schema: string
        }
        sqlserver_source: {
          visualization: {
            end_condition: string
            end_value: string
            start_condition: string
            start_value: string
            column: string
          }
          express: string
          where: string
          table: string[]
          column: {
            format: string
            name: string
            is_part: boolean
            type: string
            value: string
            index: number
          }[]
          schema: string
          condition_type: number
          mapping_type: number
          split_pk: string
        }
        elastic_search_source: {
          column: {
            value: string
            type: string
            index: number
            format: string
            is_part: boolean
            name: string
          }[]
          batch_size: number
          version: string
          index: string
        }
        ftp_target: {
          path: string
          connect_pattern: string
          encoding: string
          field_delimiter: string
          column: {
            format: string
            is_part: boolean
            index: number
            name: string
            type: string
            value: string
          }[]
          is_first_line_header: boolean
          control_encoding: string
          private_key_path: string
          timeout: number
          ftp_file_name: string
        }
        hdfs_target: {
          file_name: string
          write_mode: number
          file_type: number
          encoding: number
          compress: number
          field_delimiter: string
          path: string
          column: {
            name: string
            is_part: boolean
            type: string
            format: string
            index: number
            value: string
          }[]
        }
        pg_wal_source: {
          slot_available: boolean
          slot_name: string
          lsn: number
          temporary: boolean
          allow_created: boolean
          status_interval: number
          database_name: string
          paving_data: boolean
          table_list: string[]
        }
        sap_hana_source: {
          condition_type: number
          mapping_type: number
          visualization: {
            end_condition: string
            start_condition: string
            start_value: string
            end_value: string
            column: string
          }
          where: string
          column: {
            name: string
            format: string
            value: string
            index: number
            is_part: boolean
            type: string
          }[]
          express: string
          split_pk: string
          table: string[]
          schema: string
        }
        sql_server_cdc_source: {
          poll_interval: number
          lsn: string
          split_update: boolean
          paving_data: boolean
          table_list: string[]
          database_name: string
          cat: string
        }
        postgresql_source: {
          express: string
          schema: string
          table: string[]
          where: string
          split_pk: string
          condition_type: number
          visualization: {
            start_value: string
            start_condition: string
            end_condition: string
            end_value: string
            column: string
          }
          mapping_type: number
          column: {
            name: string
            index: number
            type: string
            value: string
            is_part: boolean
            format: string
          }[]
        }
        oracle_source: {
          condition_type: number
          split_pk: string
          column: {
            is_part: boolean
            value: string
            index: number
            type: string
            name: string
            format: string
          }[]
          schema: string
          express: string
          visualization: {
            end_condition: string
            start_condition: string
            start_value: string
            column: string
            end_value: string
          }
          mapping_type: number
          table: string[]
          where: string
        }
        click_house_target: {
          schema: string
          pre_sql: string[]
          table: string[]
          post_sql: string[]
          semantic: number
          batch_size: number
          update_key: string[]
          write_mode: number
          column: {
            format: string
            index: number
            type: string
            name: string
            is_part: boolean
            value: string
          }[]
          with_no_lock: string
        }
        db2_source: {
          table: string[]
          column: {
            index: number
            type: string
            value: string
            format: string
            is_part: boolean
            name: string
          }[]
          condition_type: number
          schema: string
          where: string
          split_pk: string
          mapping_type: number
          visualization: {
            start_condition: string
            end_value: string
            end_condition: string
            start_value: string
            column: string
          }
          express: string
        }
      }
      job_mode: number
      target_id: string
      channel_control: {
        percentage: number
        bytes: number
        record_num: number
        parallelism: number
        rate: number
      }
      source_id: string
    }
  }
}
export type DeleteSyncJobsRequestType = {
  uri: {
    space_id: string
  }
  data?: {
    job_ids: string[]
  }
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
  data?: {
    desc: string
    cluster_id: string
    is_directory: boolean
    target_type: number
    source_type: number
    type: number
    pid: string
    name: string
  }
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
  data?: {
    target: string
    job_ids: string[]
  }
}
export type PingSyncJobConnectionRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
  data?: {
    source_id: string
    target_id: string
    cluster_id: string
  }
}
export type SetSyncJobConfRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
  data?: {
    channel_control: {
      percentage: number
      parallelism: number
      bytes: number
      rate: number
      record_num: number
    }
    job_mode: number
    source_id: string
    job_content: string
    cluster_id: string
    sync_resource: {
      hive_target: {
        use_partition: boolean
        field_delimiter: string
        table: string
        partition_type: number
        compress: number
        partition: string
        tables_column: string
        write_mode: number
        column: {
          type: string
          key: string
        }[]
        file_type: number
        encoding: number
      }
      oracle_target: {
        pre_sql: string[]
        update_key: string[]
        batch_size: number
        write_mode: number
        post_sql: string[]
        table: string[]
        with_no_lock: string
        column: {
          is_part: boolean
          type: string
          value: string
          index: number
          name: string
          format: string
        }[]
        schema: string
        semantic: number
      }
      sql_server_cdc_source: {
        cat: string
        lsn: string
        paving_data: boolean
        table_list: string[]
        split_update: boolean
        database_name: string
        poll_interval: number
      }
      db2_target: {
        post_sql: string[]
        with_no_lock: string
        column: {
          type: string
          index: number
          format: string
          is_part: boolean
          name: string
          value: string
        }[]
        semantic: number
        schema: string
        update_key: string[]
        write_mode: number
        batch_size: number
        pre_sql: string[]
        table: string[]
      }
      mysql_source: {
        table: string[]
        condition_type: number
        express: string
        column: {
          name: string
          value: string
          index: number
          format: string
          is_part: boolean
          type: string
        }[]
        schema: string
        mapping_type: number
        visualization: {
          start_condition: string
          end_condition: string
          column: string
          end_value: string
          start_value: string
        }
        split_pk: string
        where: string
      }
      mongodb_source: {
        collection_name: string
        database: string
        filter: string
        column: {
          format: string
          index: number
          name: string
          is_part: boolean
          value: string
          type: string
        }[]
        fetch_size: number
      }
      oracle_source: {
        schema: string
        visualization: {
          start_value: string
          column: string
          end_value: string
          end_condition: string
          start_condition: string
        }
        mapping_type: number
        column: {
          value: string
          index: number
          format: string
          name: string
          type: string
          is_part: boolean
        }[]
        condition_type: number
        express: string
        table: string[]
        where: string
        split_pk: string
      }
      sqlserver_source: {
        table: string[]
        split_pk: string
        column: {
          name: string
          type: string
          value: string
          index: number
          format: string
          is_part: boolean
        }[]
        visualization: {
          end_condition: string
          start_condition: string
          start_value: string
          end_value: string
          column: string
        }
        express: string
        condition_type: number
        mapping_type: number
        where: string
        schema: string
      }
      elastic_search_source: {
        batch_size: number
        version: string
        column: {
          value: string
          type: string
          format: string
          index: number
          is_part: boolean
          name: string
        }[]
        index: string
      }
      sap_hana_source: {
        column: {
          type: string
          index: number
          name: string
          is_part: boolean
          format: string
          value: string
        }[]
        table: string[]
        mapping_type: number
        schema: string
        split_pk: string
        express: string
        condition_type: number
        visualization: {
          start_condition: string
          start_value: string
          end_condition: string
          column: string
          end_value: string
        }
        where: string
      }
      mysql_target: {
        pre_sql: string[]
        update_key: string[]
        column: {
          index: number
          name: string
          type: string
          value: string
          format: string
          is_part: boolean
        }[]
        schema: string
        table: string[]
        batch_size: number
        post_sql: string[]
        with_no_lock: string
        write_mode: number
        semantic: number
      }
      pg_wal_source: {
        slot_name: string
        slot_available: boolean
        paving_data: boolean
        database_name: string
        lsn: number
        temporary: boolean
        status_interval: number
        table_list: string[]
        allow_created: boolean
      }
      redis_target: {
        keyIndexes: number[]
        key_field_delimiter: string
        type: number
        expire_time: number
        timeout: number
        database: number
        mode: string
        value_field_delimiter: string
        date_format: string
      }
      kafka_target: {
        consumer_settings: {
          auto_commit_enable: string
        }
        tableFields: {
          value: string
          is_part: boolean
          index: number
          format: string
          name: string
          type: string
        }[]
        topic: string
      }
      binlog_source: {
        table: string[]
        cat: string
        paving_data: boolean
        connect_timeout: number
        is_gtid_mode: boolean
        query_timeout: number
        split_update: boolean
        start: {
          journal_name: string
          position: number
          timestamp: number
        }
        schema: string
        filter: string
      }
      elastic_search_target: {
        version: string
        column: {
          type: string
          value: string
          format: string
          index: number
          is_part: boolean
          name: string
        }[]
        index: string
        batch_size: number
        key_delimiter: string
      }
      db2_source: {
        where: string
        column: {
          format: string
          value: string
          is_part: boolean
          index: number
          name: string
          type: string
        }[]
        visualization: {
          start_value: string
          end_value: string
          end_condition: string
          start_condition: string
          column: string
        }
        mapping_type: number
        schema: string
        condition_type: number
        table: string[]
        express: string
        split_pk: string
      }
      hbase_source: {
        table: {
          table_name: string
        }
        parameter: {
          hadoopConfig: string
          range: {
            is_binary_rowkey: boolean
            start_row_key: string
            end_row_key: string
          }
          scan_cache_size: number
          column: {
            type: string
            index: number
            is_part: boolean
            format: string
            name: string
            value: string
          }[]
          encoding: string
          scan_batch_size: number
          change_log: string
          hbaseConfig: string
        }
        name: string
      }
      hdfs_target: {
        column: {
          index: number
          is_part: boolean
          format: string
          type: string
          name: string
          value: string
        }[]
        file_name: string
        compress: number
        path: string
        encoding: number
        write_mode: number
        file_type: number
        field_delimiter: string
      }
      ftp_source: {
        field_delimiter: string
        encoding: string
        is_first_line_header: boolean
        column: {
          type: string
          value: string
          name: string
          index: number
          format: string
          is_part: boolean
        }[]
        compress_type: string
        file_type: string
        private_key_path: string
        timeout: string
        connect_pattern: string
        control_encoding: string
        file_config: string
        path: string
      }
      mongodb_target: {
        database: string
        replace_key: string
        collection_name: string
        flush_interval_mills: number
        write_mode: number
        column: {
          type: string
          format: string
          index: number
          is_part: boolean
          value: string
          name: string
        }[]
        batch_size: number
      }
      logminer_source: {
        start_scn: string
        table: string[]
        fetch_size: number
        paving_data: boolean
        query_timeout: number
        cat: string
        split_update: boolean
        start_time: number
        read_position: string
        support_auto_add_log: boolean
      }
      sap_hana_target: {
        pre_sql: string[]
        write_mode: number
        post_sql: string[]
        schema: string
        with_no_lock: string
        semantic: number
        update_key: string[]
        column: {
          is_part: boolean
          name: string
          value: string
          index: number
          type: string
          format: string
        }[]
        batch_size: number
        table: string[]
      }
      sqlserver_target: {
        update_key: string[]
        with_no_lock: string
        column: {
          index: number
          value: string
          name: string
          is_part: boolean
          format: string
          type: string
        }[]
        write_mode: number
        batch_size: number
        table: string[]
        post_sql: string[]
        pre_sql: string[]
        semantic: number
        schema: string
      }
      hbase_target: {
        table: {
          table_name: string
        }
        parameter: {
          scan_cache_size: number
          version_column_index: number
          change_log: string
          hbase_config: string
          column: {
            index: number
            type: string
            format: string
            is_part: boolean
            name: string
            value: string
          }[]
          version_column_value: string
          null_mode: string
          write_buffer_size: number
          wal_flag: boolean
          rowkey_express: string
          scan_batch_size: number
        }
        name: string
      }
      postgresql_target: {
        schema: string
        column: {
          value: string
          format: string
          index: number
          name: string
          is_part: boolean
          type: string
        }[]
        table: string[]
        semantic: number
        update_key: string[]
        batch_size: number
        post_sql: string[]
        with_no_lock: string
        pre_sql: string[]
        write_mode: number
      }
      postgresql_source: {
        express: string
        condition_type: number
        mapping_type: number
        split_pk: string
        column: {
          name: string
          value: string
          index: number
          is_part: boolean
          type: string
          format: string
        }[]
        schema: string
        visualization: {
          end_condition: string
          end_value: string
          start_value: string
          column: string
          start_condition: string
        }
        where: string
        table: string[]
      }
      click_house_target: {
        post_sql: string[]
        schema: string
        batch_size: number
        write_mode: number
        table: string[]
        semantic: number
        update_key: string[]
        column: {
          name: string
          type: string
          value: string
          index: number
          format: string
          is_part: boolean
        }[]
        pre_sql: string[]
        with_no_lock: string
      }
      click_house_source: {
        column: {
          type: string
          value: string
          index: number
          format: string
          is_part: boolean
          name: string
        }[]
        express: string
        split_pk: string
        where: string
        condition_type: number
        schema: string
        mapping_type: number
        table: string[]
        visualization: {
          end_condition: string
          start_value: string
          start_condition: string
          column: string
          end_value: string
        }
      }
      kafka_source: {
        group_id: string
        mode: string
        consumer_settings: {
          auto_commit_enable: string
        }
        timestamp: number
        column: {
          is_part: boolean
          name: string
          index: number
          type: string
          format: string
          value: string
        }[]
        encoding: string
        topic: string
        offset: string
        codec: string
      }
      ftp_target: {
        field_delimiter: string
        ftp_file_name: string
        private_key_path: string
        column: {
          type: string
          value: string
          format: string
          index: number
          is_part: boolean
          name: string
        }[]
        connect_pattern: string
        encoding: string
        is_first_line_header: boolean
        path: string
        control_encoding: string
        timeout: number
      }
      hdfs_source: {
        column: {
          value: string
          format: string
          index: number
          name: string
          is_part: boolean
          type: string
        }[]
        encoding: number
        filter_regex: string
        path: string
        field_delimiter: string
        file_type: number
      }
    }
    target_id: string
  }
}
export type SetSyncJobScheduleRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
  data?: {
    ended: number
    concurrency_policy: number
    parameters: {
      value: string
      key: string
    }[]
    express: string
    schedule_policy: number
    started: number
    timeout: number
    period_type: string
    executed: number
  }
}
export type UpdateSyncJobRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
  data?: {
    desc: string
    name: string
  }
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
export type CreateStreamJobRequestType = {
  uri: {
    space_id: string
  }
  data?: {
    name: string
    cluster_id: string
    desc: string
    pid: string
    type: number
    is_directory: boolean
  }
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
export type DeleteStreamJobsRequestType = {
  uri: {
    space_id: string
  }
  data?: {
    job_ids: string[]
  }
}
export type MoveStreamJobsRequestType = {
  uri: {
    space_id: string
  }
  data?: {
    target: string
    job_ids: string[]
  }
}
export type SetStreamJobArgsRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
  data?: {
    built_in_connectors: string[]
    parallelism: number
    delete_cluster_id: string
    cluster_id: string
    files: string[]
    delete_files: string[]
  }
}
export type SetStreamJobCodeRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
  data?: {
    type: number
    jar: {
      jar_entry: string
      delete_file_id: string
      file_id: string
      jar_args: string
    }
    operators: {
      upstream: string
      point_y: number
      upstream_right: string
      name: string
      point_x: number
      down_stream: string
      type: number
      id: string
      property: {
        intersect: {}
        order_by: {
          column: {
            order: string
            field: string
          }[]
        }
        dest: {
          table_id: string
          columns: string[]
        }
        udttf: {
          udf_id: string
          column: {
            as: string
            type: string
            field: string
            func: string
          }[]
          args: string
        }
        union: {
          all: boolean
        }
        dimension: {
          distinct: string
          custom_column: {
            func: string
            as: string
            field: string
            type: string
          }[]
          table_as: string
          table_id: string
          column: {
            field: string
            func: string
            type: string
            as: string
          }[]
          time_column: {
            type: string
            field: string
            func: string
            as: string
          }
        }
        filter: {
          in: string
          where: string
          expression: string
          exists: string
        }
        source: {
          column: {
            field: string
            as: string
            type: string
            func: string
          }[]
          table_as: string
          distinct: string
          time_column: {
            as: string
            func: string
            field: string
            type: string
          }[]
          table_id: string
          custom_column: {
            func: string
            type: string
            as: string
            field: string
          }[]
        }
        limit: {
          limit: number
        }
        const: {
          column: {
            func: string
            type: string
            as: string
            field: string
          }[]
          table: string
        }
        fetch: {
          fetch: number
        }
        having: {
          having: string
        }
        values: {
          rows: {
            values: string[]
          }[]
        }
        group_by: {
          group_by: string[]
        }
        offset: {
          offset: number
        }
        join: {
          column: {
            type: string
            as: string
            field: string
            func: string
          }[]
          table_as_right: string
          expression: string
          generate_column: {
            field: string
            as: string
            type: string
            func: string
          }[]
          args: string
          join: string
          table_as: string
        }
        except: {}
        udtf: {
          column: {
            as: string
            type: string
            field: string
            func: string
          }[]
          select_column: {
            field: string
            func: string
            type: string
            as: string
          }[]
          args: string
          table_as: string
          udf_id: string
        }
      }
    }[]
    python: {
      code: string
    }
    sql: {
      code: string
    }
  }
}
export type SetStreamJobScheduleRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
  data?: {
    started: number
    retry_limit: number
    schedule_policy: number
    timeout: number
    period_type: string
    concurrency_policy: number
    express: string
    ended: number
    executed: number
    retry_interval: number
    retry_policy: number
  }
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
  data?: {
    type: number
    python: {
      code: string
    }
    operators: {
      id: string
      property: {
        offset: {
          offset: number
        }
        except: {}
        fetch: {
          fetch: number
        }
        dimension: {
          time_column: {
            func: string
            type: string
            as: string
            field: string
          }
          table_as: string
          column: {
            func: string
            as: string
            field: string
            type: string
          }[]
          custom_column: {
            func: string
            type: string
            as: string
            field: string
          }[]
          table_id: string
          distinct: string
        }
        const: {
          column: {
            as: string
            field: string
            type: string
            func: string
          }[]
          table: string
        }
        filter: {
          where: string
          expression: string
          in: string
          exists: string
        }
        intersect: {}
        limit: {
          limit: number
        }
        dest: {
          columns: string[]
          table_id: string
        }
        union: {
          all: boolean
        }
        source: {
          table_as: string
          table_id: string
          time_column: {
            field: string
            type: string
            as: string
            func: string
          }[]
          custom_column: {
            field: string
            type: string
            as: string
            func: string
          }[]
          column: {
            type: string
            field: string
            func: string
            as: string
          }[]
          distinct: string
        }
        values: {
          rows: {
            values: string[]
          }[]
        }
        udttf: {
          args: string
          column: {
            as: string
            field: string
            func: string
            type: string
          }[]
          udf_id: string
        }
        udtf: {
          column: {
            as: string
            type: string
            field: string
            func: string
          }[]
          args: string
          udf_id: string
          table_as: string
          select_column: {
            as: string
            type: string
            field: string
            func: string
          }[]
        }
        order_by: {
          column: {
            field: string
            order: string
          }[]
        }
        having: {
          having: string
        }
        join: {
          table_as: string
          table_as_right: string
          join: string
          column: {
            as: string
            func: string
            type: string
            field: string
          }[]
          generate_column: {
            as: string
            field: string
            type: string
            func: string
          }[]
          expression: string
          args: string
        }
        group_by: {
          group_by: string[]
        }
      }
      name: string
      point_x: number
      point_y: number
      type: number
      down_stream: string
      upstream: string
      upstream_right: string
    }[]
    sql: {
      code: string
    }
    jar: {
      jar_entry: string
      jar_args: string
      delete_file_id: string
      file_id: string
    }
  }
}
export type UpdateStreamJobRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
  data?: {
    name: string
    desc: string
  }
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
  data?: {
    instance_ids: string[]
  }
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
  data?: {
    stop_running: boolean
  }
}
export type ReleaseStreamJobRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
  data?: {
    desc: string
    stop_running: boolean
  }
}
export type ResumeReleaseStreamJobsRequestType = {
  uri: {
    space_id: string
  }
}
export type SuspendReleaseStreamJobRequestType = {
  uri: {
    space_id: string
  }
  data?: {
    stop_running: boolean
  }
}
export type JobBoundAlertPoliciesRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
  data?: {
    alert_ids: string[]
  }
}
export type AlertPolicyBoundJobsRequestType = {
  uri: {
    space_id: string
    alert_id: string
  }
  data?: {
    job_ids: string[]
  }
}
export type CreateAlertPolicyRequestType = {
  uri: {
    space_id: string
  }
  data?: {
    job_ids: string[]
    trigger_action: number
    monitor_object: number
    name: string
    notification_ids: string[]
    monitor_item: {
      stream_job: {
        instance_timeout: number
        instance_run_failed: boolean
        instance_run_timeout: boolean
      }
      sync_job: {
        instance_run_timeout: boolean
        instance_run_failed: boolean
        instance_timeout: number
      }
    }
    desc: string
    trigger_rule: number
    space_id: string
  }
}
export type DeleteAlertPoliciesRequestType = {
  uri: {
    space_id: string
  }
  data?: {
    alert_ids: string[]
  }
}
export type DescribeAlertPolicyRequestType = {
  uri: {
    space_id: string
    alert_id: string
  }
}
export type AlertPolicyUnboundJobsRequestType = {
  uri: {
    space_id: string
    alert_id: string
  }
  data?: {
    job_ids: string[]
  }
}
export type JobUnboundAlertPoliciesRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
  data?: {
    alert_ids: string[]
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
}
export type ListJobsByAlertPolicyRequestType = {
  uri: {
    space_id: string
    alert_id: string
  }
}
export type UpdateAlertPolicyRequestType = {
  uri: {
    space_id: string
    alert_id: string
  }
  data?: {
    monitor_item: {
      stream_job: {
        instance_timeout: number
        instance_run_failed: boolean
        instance_run_timeout: boolean
      }
      sync_job: {
        instance_timeout: number
        instance_run_failed: boolean
        instance_run_timeout: boolean
      }
    }
    name: string
    trigger_rule: number
    desc: string
    job_ids: string[]
    monitor_object: number
    trigger_action: number
    space_id: string
    notification_ids: string[]
  }
}
export type DescribePlatformConfigRequestType = {}
export type DisableWorkspacesRequestType = {
  data?: {
    space_ids: string[]
  }
}
export type CreateWorkspaceRequestType = {
  data?: {
    vxnet_id: string
    router_id: string
    desc: string
    name: string
  }
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
export type DescribeWorkspaceQuotaRequestType = {
  uri: {
    space_id: string
  }
}
export type DeleteWorkspacesRequestType = {
  data?: {
    space_ids: string[]
  }
}
export type EnableWorkspacesRequestType = {
  data?: {
    resume_job: boolean
    space_ids: string[]
  }
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
  data?: {
    desc: string
    name: string
  }
}
export type UpsertWorkspaceQuotaRequestType = {
  uri: {
    space_id: string
  }
  data?: {
    quota_set: {
      custom_role: {
        limit: number
      }
      workspace: {
        limit: number
      }
      udf: {
        limit: number
      }
      network: {
        limit: number
      }
      sync_job: {
        limit: number
      }
      file: {
        size: number
        size_total: number
        limit: number
      }
      data_source: {
        limit: number
      }
      flink_cluster: {
        cu: unknown
        cu_total: unknown
        limit: number
      }
      member: {
        limit: number
      }
      stream_job: {
        limit: number
      }
    }
  }
}
export type AddMembersRequestType = {
  uri: {
    space_id: string
  }
  data?: {
    user_ids: string[]
    desc: string
    system_role_ids: string[]
  }
}
export type DeleteMembersRequestType = {
  uri: {
    space_id: string
  }
  data?: {
    user_ids: string[]
  }
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
  data?: {
    user_id: string
    system_role_ids: string[]
    desc: string
  }
}
export type UpsertMemberQuotaRequestType = {
  uri: {
    space_id: string
    user_id: string
  }
  data?: {
    quota_set: {
      sync_job: {
        limit: number
      }
      flink_cluster: {
        limit: number
        cu: unknown
        cu_total: unknown
      }
      file: {
        limit: number
        size_total: number
        size: number
      }
      workspace: {
        limit: number
      }
      stream_job: {
        limit: number
      }
      data_source: {
        limit: number
      }
      member: {
        limit: number
      }
      udf: {
        limit: number
      }
      network: {
        limit: number
      }
      custom_role: {
        limit: number
      }
    }
  }
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
export type DisableDataSourcesRequestType = {
  uri: {
    space_id: string
  }
  data?: {
    source_ids: string[]
  }
}
export type CreateDataSourceRequestType = {
  uri: {
    space_id: string
  }
  data?: {
    last_connection: {
      created: number
      status: number
      elapse: number
      source_id: string
      network_info: {
        updated: number
        created: number
        router_id: string
        status: number
        space_id: string
        name: string
        vxnet_id: string
        created_by: string
        id: string
      }
      space_id: string
      message: string
      network_id: string
      result: number
    }
    name: string
    desc: string
    type: number
    url: {
      s3: {}
      db2: {
        password: string
        port: number
        host: string
        user: string
        database: string
      }
      hive: {
        config: string
        defaultFS: string
        port: number
        user: string
        host: string
        password: string
        database: string
      }
      elastic_search: {
        version: string
        port: number
        password: string
        host: string
        user: string
      }
      sqlserver: {
        host: string
        database: string
        user: string
        port: number
        password: string
      }
      ftp: {
        password: string
        connection_mode: number
        port: number
        user: string
        private_key: string
        protocol: number
        host: string
      }
      kafka: {
        kafka_brokers: {
          host: string
          port: number
        }[]
      }
      sap_hana: {
        user: string
        port: number
        database: string
        host: string
        password: string
      }
      hbase: {
        config: string
      }
      hdfs: {
        name_node: string
        port: number
        config: string
      }
      redis: {
        password: string
        hosts: {
          host: string
          port: number
        }[]
      }
      clickhouse: {
        user: string
        database: string
        password: string
        host: string
        port: number
      }
      oracle: {
        user: string
        port: number
        database: string
        host: string
        password: string
      }
      mongo_db: {
        database: string
        password: string
        user: string
        hosts: {
          host: string
          port: number
        }[]
      }
      mysql: {
        port: number
        database: string
        host: string
        password: string
        user: string
      }
      postgresql: {
        database: string
        password: string
        user: string
        port: number
        host: string
      }
    }
  }
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
  data?: {
    source_ids: string[]
  }
}
export type EnableDataSourcesRequestType = {
  uri: {
    space_id: string
  }
  data?: {
    source_ids: string[]
  }
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
    type?: string
    verbose?: string
  }
  data?: {
    reverse: boolean
    offset: number
    limit: number
    verbose: number
    sort_by: string
  }
}
export type ListDataSourcesRequestType = {
  params?: {
    limit?: string
    name?: string
    offset?: string
    reverse?: string
    search?: string
    sort_by?: string
    type?: string
    verbose?: string
  }
}
export type PingDataSourceConnectionRequestType = {
  uri: {
    space_id: string
  }
  data?: {
    network_id: string
    type: number
    source_id: string
    stage: number
    url: {
      hive: {
        port: number
        host: string
        password: string
        database: string
        config: string
        user: string
        defaultFS: string
      }
      kafka: {
        kafka_brokers: {
          host: string
          port: number
        }[]
      }
      s3: {}
      redis: {
        password: string
        hosts: {
          port: number
          host: string
        }[]
      }
      hbase: {
        config: string
      }
      sap_hana: {
        database: string
        password: string
        port: number
        host: string
        user: string
      }
      sqlserver: {
        database: string
        host: string
        port: number
        user: string
        password: string
      }
      clickhouse: {
        database: string
        host: string
        port: number
        user: string
        password: string
      }
      mysql: {
        password: string
        database: string
        port: number
        user: string
        host: string
      }
      oracle: {
        port: number
        user: string
        password: string
        host: string
        database: string
      }
      postgresql: {
        host: string
        database: string
        password: string
        user: string
        port: number
      }
      db2: {
        database: string
        port: number
        host: string
        password: string
        user: string
      }
      ftp: {
        protocol: number
        port: number
        password: string
        connection_mode: number
        user: string
        host: string
        private_key: string
      }
      mongo_db: {
        password: string
        database: string
        user: string
        hosts: {
          host: string
          port: number
        }[]
      }
      elastic_search: {
        host: string
        port: number
        user: string
        version: string
        password: string
      }
      hdfs: {
        name_node: string
        config: string
        port: number
      }
    }
  }
}
export type UpdateDataSourceRequestType = {
  uri: {
    space_id: string
    source_id: string
  }
  data?: {
    name: string
    url: {
      ftp: {
        connection_mode: number
        private_key: string
        host: string
        protocol: number
        user: string
        password: string
        port: number
      }
      sqlserver: {
        password: string
        host: string
        database: string
        port: number
        user: string
      }
      hdfs: {
        name_node: string
        config: string
        port: number
      }
      sap_hana: {
        password: string
        host: string
        database: string
        port: number
        user: string
      }
      oracle: {
        host: string
        user: string
        port: number
        database: string
        password: string
      }
      hbase: {
        config: string
      }
      elastic_search: {
        port: number
        version: string
        user: string
        host: string
        password: string
      }
      mysql: {
        database: string
        port: number
        user: string
        password: string
        host: string
      }
      db2: {
        port: number
        host: string
        user: string
        database: string
        password: string
      }
      postgresql: {
        user: string
        database: string
        password: string
        port: number
        host: string
      }
      hive: {
        host: string
        config: string
        defaultFS: string
        port: number
        user: string
        database: string
        password: string
      }
      clickhouse: {
        port: number
        password: string
        database: string
        host: string
        user: string
      }
      mongo_db: {
        user: string
        password: string
        hosts: {
          host: string
          port: number
        }[]
        database: string
      }
      redis: {
        hosts: {
          port: number
          host: string
        }[]
        password: string
      }
      s3: {}
      kafka: {
        kafka_brokers: {
          host: string
          port: number
        }[]
      }
    }
    type: number
    desc: string
  }
}
export type CreateFlinkClusterRequestType = {
  uri: {
    space_id: string
  }
  data?: {
    version: string
    config: {
      logger: {
        root_log_level: string
      }
      restart_strategy: {
        failure_rate_max_failures_per_interval: number
        restart_strategy: string
        failure_rate_delay: number
        failure_rate_failure_rate_interval: number
        fixed_delay_attempts: number
        fixed_delay_delay: number
      }
      custom: {
        value: string
        key: string
      }[]
    }
    host_aliases: {
      items: {
        hostname: string
        ip: string
      }[]
    }
    job_cu: unknown
    network_id: string
    name: string
    task_cu: unknown
    task_num: number
  }
}
export type DeleteFlinkClustersRequestType = {
  uri: {
    space_id: string
  }
  data?: {
    cluster_ids: string[]
  }
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
export type StartFlinkClustersRequestType = {
  uri: {
    space_id: string
  }
  data?: {
    cluster_ids: string[]
  }
}
export type StopFlinkClustersRequestType = {
  uri: {
    space_id: string
  }
  data?: {
    cluster_ids: string[]
  }
}
export type UpdateFlinkClusterRequestType = {
  uri: {
    space_id: string
    cluster_id: string
  }
  data?: {
    network_id: string
    task_cu: unknown
    task_num: number
    host_aliases: {
      items: {
        hostname: string
        ip: string
      }[]
    }
    name: string
    job_cu: unknown
    config: {
      custom: {
        value: string
        key: string
      }[]
      restart_strategy: {
        fixed_delay_attempts: number
        fixed_delay_delay: number
        restart_strategy: string
        failure_rate_delay: number
        failure_rate_failure_rate_interval: number
        failure_rate_max_failures_per_interval: number
      }
      logger: {
        root_log_level: string
      }
    }
  }
}
export type CreateNetworkRequestType = {
  uri: {
    space_id: string
  }
  data?: {
    vxnet_id: string
    name: string
    router_id: string
  }
}
export type DeleteNetworksRequestType = {
  uri: {
    space_id: string
  }
  data?: {
    network_ids: string[]
  }
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
  data?: {
    name: string
    router_id: string
    vxnet_id: string
  }
}
