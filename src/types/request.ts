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
    offset: number
    limit: number
  }
}
export type GenerateJobJsonRequestType = {
  uri: {
    job_id: string
  }
  data?: {
    conf: {
      job_mode: number
      target_id: string
      channel_control: {
        rate: number
        parallelism: number
        record_num: number
        percentage: number
        bytes: number
      }
      cluster_id: string
      job_content: string
      sync_resource: {
        oracle_target: {
          pre_sql: string[]
          write_mode: number
          column: {
            value: string
            name: string
            format: string
            type: string
            is_part: boolean
            index: number
          }[]
          schema: string
          batch_size: number
          semantic: number
          post_sql: string[]
          update_key: string[]
          table: string[]
          with_no_lock: string
        }
        mysql_source: {
          where: string
          schema: string
          split_pk: string
          condition_type: number
          visualization: {
            start_condition: string
            column: string
            start_value: string
            end_value: string
            end_condition: string
          }
          express: string
          column: {
            is_part: boolean
            index: number
            name: string
            format: string
            type: string
            value: string
          }[]
          mapping_type: number
          table: string[]
        }
        hdfs_target: {
          field_delimiter: string
          path: string
          compress: number
          file_name: string
          file_type: number
          encoding: number
          column: {
            type: string
            value: string
            index: number
            name: string
            format: string
            is_part: boolean
          }[]
          write_mode: number
        }
        mongodb_target: {
          batch_size: number
          collection_name: string
          replace_key: string
          write_mode: number
          database: string
          column: {
            index: number
            is_part: boolean
            name: string
            value: string
            type: string
            format: string
          }[]
          flush_interval_mills: number
        }
        ftp_source: {
          encoding: string
          column: {
            is_part: boolean
            format: string
            value: string
            type: string
            index: number
            name: string
          }[]
          is_first_line_header: boolean
          path: string
          timeout: string
          file_type: string
          private_key_path: string
          file_config: string
          connect_pattern: string
          compress_type: string
          field_delimiter: string
          control_encoding: string
        }
        pg_wal_source: {
          lsn: number
          database_name: string
          allow_created: boolean
          slot_name: string
          paving_data: boolean
          table_list: string[]
          temporary: boolean
          slot_available: boolean
          status_interval: number
        }
        sap_hana_source: {
          where: string
          split_pk: string
          express: string
          column: {
            is_part: boolean
            value: string
            name: string
            format: string
            index: number
            type: string
          }[]
          mapping_type: number
          table: string[]
          visualization: {
            end_condition: string
            start_value: string
            start_condition: string
            column: string
            end_value: string
          }
          schema: string
          condition_type: number
        }
        hive_target: {
          compress: number
          table: string
          partition_type: number
          write_mode: number
          field_delimiter: string
          encoding: number
          tables_column: string
          column: {
            key: string
            type: string
          }[]
          use_partition: boolean
          file_type: number
          partition: string
        }
        click_house_target: {
          with_no_lock: string
          update_key: string[]
          schema: string
          write_mode: number
          column: {
            is_part: boolean
            name: string
            type: string
            index: number
            value: string
            format: string
          }[]
          batch_size: number
          semantic: number
          table: string[]
          post_sql: string[]
          pre_sql: string[]
        }
        binlog_source: {
          split_update: boolean
          filter: string
          paving_data: boolean
          query_timeout: number
          table: string[]
          connect_timeout: number
          is_gtid_mode: boolean
          start: {
            journal_name: string
            position: number
            timestamp: number
          }
          schema: string
          cat: string
        }
        logminer_source: {
          support_auto_add_log: boolean
          table: string[]
          read_position: string
          split_update: boolean
          cat: string
          fetch_size: number
          start_time: number
          paving_data: boolean
          start_scn: string
          query_timeout: number
        }
        hbase_source: {
          parameter: {
            hbaseConfig: string
            column: {
              index: number
              is_part: boolean
              name: string
              format: string
              type: string
              value: string
            }[]
            hadoopConfig: string
            change_log: string
            range: {
              start_row_key: string
              is_binary_rowkey: boolean
              end_row_key: string
            }
            scan_batch_size: number
            scan_cache_size: number
            encoding: string
          }
          name: string
          table: {
            table_name: string
          }
        }
        postgresql_target: {
          pre_sql: string[]
          schema: string
          table: string[]
          semantic: number
          column: {
            index: number
            is_part: boolean
            type: string
            value: string
            name: string
            format: string
          }[]
          update_key: string[]
          with_no_lock: string
          write_mode: number
          post_sql: string[]
          batch_size: number
        }
        kafka_target: {
          topic: string
          consumer_settings: {
            auto_commit_enable: string
          }
          tableFields: {
            type: string
            name: string
            is_part: boolean
            index: number
            value: string
            format: string
          }[]
        }
        click_house_source: {
          column: {
            type: string
            is_part: boolean
            value: string
            format: string
            index: number
            name: string
          }[]
          mapping_type: number
          visualization: {
            start_condition: string
            end_value: string
            start_value: string
            end_condition: string
            column: string
          }
          split_pk: string
          table: string[]
          express: string
          condition_type: number
          where: string
          schema: string
        }
        db2_source: {
          column: {
            name: string
            index: number
            type: string
            value: string
            format: string
            is_part: boolean
          }[]
          express: string
          condition_type: number
          visualization: {
            start_condition: string
            start_value: string
            end_condition: string
            column: string
            end_value: string
          }
          mapping_type: number
          where: string
          table: string[]
          split_pk: string
          schema: string
        }
        elastic_search_source: {
          version: string
          batch_size: number
          column: {
            format: string
            index: number
            type: string
            is_part: boolean
            value: string
            name: string
          }[]
          index: string
        }
        hbase_target: {
          name: string
          table: {
            table_name: string
          }
          parameter: {
            column: {
              type: string
              value: string
              is_part: boolean
              index: number
              format: string
              name: string
            }[]
            hbase_config: string
            null_mode: string
            scan_batch_size: number
            wal_flag: boolean
            rowkey_express: string
            version_column_index: number
            version_column_value: string
            change_log: string
            write_buffer_size: number
            scan_cache_size: number
          }
        }
        db2_target: {
          pre_sql: string[]
          update_key: string[]
          with_no_lock: string
          post_sql: string[]
          write_mode: number
          column: {
            format: string
            name: string
            type: string
            index: number
            is_part: boolean
            value: string
          }[]
          batch_size: number
          schema: string
          semantic: number
          table: string[]
        }
        sqlserver_source: {
          split_pk: string
          express: string
          condition_type: number
          mapping_type: number
          schema: string
          visualization: {
            end_value: string
            end_condition: string
            start_condition: string
            start_value: string
            column: string
          }
          where: string
          table: string[]
          column: {
            is_part: boolean
            name: string
            index: number
            format: string
            value: string
            type: string
          }[]
        }
        oracle_source: {
          column: {
            name: string
            value: string
            index: number
            is_part: boolean
            format: string
            type: string
          }[]
          express: string
          split_pk: string
          condition_type: number
          visualization: {
            column: string
            start_condition: string
            end_condition: string
            start_value: string
            end_value: string
          }
          schema: string
          where: string
          table: string[]
          mapping_type: number
        }
        sql_server_cdc_source: {
          paving_data: boolean
          database_name: string
          split_update: boolean
          cat: string
          lsn: string
          table_list: string[]
          poll_interval: number
        }
        kafka_source: {
          mode: string
          offset: string
          codec: string
          encoding: string
          group_id: string
          consumer_settings: {
            auto_commit_enable: string
          }
          timestamp: number
          topic: string
          column: {
            format: string
            is_part: boolean
            index: number
            name: string
            type: string
            value: string
          }[]
        }
        ftp_target: {
          encoding: string
          connect_pattern: string
          column: {
            is_part: boolean
            name: string
            type: string
            format: string
            value: string
            index: number
          }[]
          private_key_path: string
          timeout: number
          path: string
          control_encoding: string
          field_delimiter: string
          is_first_line_header: boolean
          ftp_file_name: string
        }
        sqlserver_target: {
          batch_size: number
          update_key: string[]
          with_no_lock: string
          post_sql: string[]
          schema: string
          table: string[]
          pre_sql: string[]
          column: {
            type: string
            index: number
            is_part: boolean
            name: string
            format: string
            value: string
          }[]
          semantic: number
          write_mode: number
        }
        elastic_search_target: {
          index: string
          batch_size: number
          version: string
          key_delimiter: string
          column: {
            is_part: boolean
            value: string
            index: number
            format: string
            type: string
            name: string
          }[]
        }
        redis_target: {
          value_field_delimiter: string
          expire_time: number
          timeout: number
          date_format: string
          database: number
          type: number
          keyIndexes: number[]
          mode: string
          key_field_delimiter: string
        }
        hdfs_source: {
          encoding: number
          filter_regex: string
          path: string
          field_delimiter: string
          file_type: number
          column: {
            format: string
            type: string
            index: number
            value: string
            is_part: boolean
            name: string
          }[]
        }
        postgresql_source: {
          visualization: {
            start_value: string
            start_condition: string
            end_value: string
            end_condition: string
            column: string
          }
          condition_type: number
          column: {
            format: string
            name: string
            type: string
            is_part: boolean
            index: number
            value: string
          }[]
          table: string[]
          express: string
          schema: string
          split_pk: string
          where: string
          mapping_type: number
        }
        mongodb_source: {
          collection_name: string
          database: string
          filter: string
          fetch_size: number
          column: {
            name: string
            value: string
            format: string
            is_part: boolean
            index: number
            type: string
          }[]
        }
        mysql_target: {
          write_mode: number
          post_sql: string[]
          schema: string
          with_no_lock: string
          update_key: string[]
          table: string[]
          column: {
            format: string
            name: string
            type: string
            value: string
            is_part: boolean
            index: number
          }[]
          batch_size: number
          semantic: number
          pre_sql: string[]
        }
        sap_hana_target: {
          write_mode: number
          post_sql: string[]
          batch_size: number
          pre_sql: string[]
          with_no_lock: string
          schema: string
          column: {
            format: string
            index: number
            name: string
            value: string
            is_part: boolean
            type: string
          }[]
          semantic: number
          table: string[]
          update_key: string[]
        }
      }
      source_id: string
    }
    job_id: string
  }
}
export type CreateUDFRequestType = {
  data?: {
    name: string
    desc: string
    language: number
    usage_sample: string
    type: number
    file_id: string
    code: string
  }
}
export type DeleteUDFsRequestType = {
  data?: {
    udf_ids: string[]
  }
}
export type ListUDFsRequestType = {
  params?: {
    limit?: string
    offset?: string
    reverse?: string
    search?: string
    sort_by?: string
    type?: string
  }
}
export type UpdateUDFRequestType = {
  data?: {
    file_id: string
    desc: string
    name: string
    usage_sample: string
    code: string
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
    description: string
    resource_type: number
    resource_name: string
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
export type CreateSyncJobRequestType = {
  uri: {
    space_id: string
  }
  data?: {
    cluster_id: string
    name: string
    source_type: number
    is_directory: boolean
    pid: string
    desc: string
    target_type: number
    type: number
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
export type GetSyncJobConfRequestType = {
  uri: {
    space_id: string
    job_id: string
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
    job_ids: string[]
    target: string
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
    job_content: string
    channel_control: {
      record_num: number
      bytes: number
      percentage: number
      parallelism: number
      rate: number
    }
    source_id: string
    sync_resource: {
      oracle_source: {
        express: string
        column: {
          type: string
          value: string
          index: number
          name: string
          format: string
          is_part: boolean
        }[]
        schema: string
        condition_type: number
        table: string[]
        visualization: {
          column: string
          start_value: string
          end_value: string
          end_condition: string
          start_condition: string
        }
        where: string
        mapping_type: number
        split_pk: string
      }
      logminer_source: {
        split_update: boolean
        query_timeout: number
        read_position: string
        start_scn: string
        fetch_size: number
        paving_data: boolean
        cat: string
        table: string[]
        start_time: number
        support_auto_add_log: boolean
      }
      mongodb_target: {
        column: {
          index: number
          type: string
          is_part: boolean
          name: string
          value: string
          format: string
        }[]
        batch_size: number
        database: string
        write_mode: number
        replace_key: string
        collection_name: string
        flush_interval_mills: number
      }
      ftp_source: {
        path: string
        control_encoding: string
        field_delimiter: string
        file_type: string
        is_first_line_header: boolean
        private_key_path: string
        file_config: string
        column: {
          value: string
          index: number
          name: string
          format: string
          is_part: boolean
          type: string
        }[]
        connect_pattern: string
        encoding: string
        timeout: string
        compress_type: string
      }
      ftp_target: {
        column: {
          type: string
          value: string
          is_part: boolean
          format: string
          index: number
          name: string
        }[]
        connect_pattern: string
        encoding: string
        is_first_line_header: boolean
        ftp_file_name: string
        private_key_path: string
        timeout: number
        control_encoding: string
        field_delimiter: string
        path: string
      }
      hdfs_source: {
        filter_regex: string
        file_type: number
        field_delimiter: string
        column: {
          value: string
          index: number
          is_part: boolean
          name: string
          format: string
          type: string
        }[]
        encoding: number
        path: string
      }
      mysql_source: {
        split_pk: string
        table: string[]
        schema: string
        express: string
        mapping_type: number
        visualization: {
          column: string
          start_value: string
          end_value: string
          start_condition: string
          end_condition: string
        }
        condition_type: number
        where: string
        column: {
          is_part: boolean
          name: string
          value: string
          type: string
          format: string
          index: number
        }[]
      }
      sap_hana_target: {
        update_key: string[]
        with_no_lock: string
        pre_sql: string[]
        column: {
          name: string
          value: string
          type: string
          index: number
          is_part: boolean
          format: string
        }[]
        batch_size: number
        schema: string
        post_sql: string[]
        semantic: number
        write_mode: number
        table: string[]
      }
      click_house_target: {
        post_sql: string[]
        schema: string
        column: {
          name: string
          type: string
          value: string
          format: string
          index: number
          is_part: boolean
        }[]
        with_no_lock: string
        pre_sql: string[]
        update_key: string[]
        write_mode: number
        table: string[]
        semantic: number
        batch_size: number
      }
      hbase_source: {
        parameter: {
          hbaseConfig: string
          scan_cache_size: number
          column: {
            index: number
            value: string
            type: string
            format: string
            is_part: boolean
            name: string
          }[]
          change_log: string
          encoding: string
          hadoopConfig: string
          range: {
            end_row_key: string
            is_binary_rowkey: boolean
            start_row_key: string
          }
          scan_batch_size: number
        }
        name: string
        table: {
          table_name: string
        }
      }
      hdfs_target: {
        file_type: number
        field_delimiter: string
        file_name: string
        encoding: number
        path: string
        column: {
          type: string
          format: string
          index: number
          value: string
          is_part: boolean
          name: string
        }[]
        compress: number
        write_mode: number
      }
      hbase_target: {
        parameter: {
          scan_batch_size: number
          version_column_index: number
          change_log: string
          column: {
            format: string
            index: number
            is_part: boolean
            name: string
            type: string
            value: string
          }[]
          write_buffer_size: number
          wal_flag: boolean
          rowkey_express: string
          version_column_value: string
          hbase_config: string
          scan_cache_size: number
          null_mode: string
        }
        table: {
          table_name: string
        }
        name: string
      }
      elastic_search_target: {
        column: {
          value: string
          index: number
          type: string
          name: string
          format: string
          is_part: boolean
        }[]
        batch_size: number
        index: string
        key_delimiter: string
        version: string
      }
      postgresql_target: {
        batch_size: number
        pre_sql: string[]
        column: {
          index: number
          format: string
          type: string
          name: string
          value: string
          is_part: boolean
        }[]
        write_mode: number
        update_key: string[]
        semantic: number
        table: string[]
        schema: string
        with_no_lock: string
        post_sql: string[]
      }
      oracle_target: {
        update_key: string[]
        with_no_lock: string
        pre_sql: string[]
        post_sql: string[]
        column: {
          name: string
          index: number
          is_part: boolean
          format: string
          value: string
          type: string
        }[]
        write_mode: number
        semantic: number
        table: string[]
        batch_size: number
        schema: string
      }
      mysql_target: {
        column: {
          type: string
          value: string
          is_part: boolean
          format: string
          index: number
          name: string
        }[]
        post_sql: string[]
        pre_sql: string[]
        update_key: string[]
        batch_size: number
        schema: string
        with_no_lock: string
        table: string[]
        write_mode: number
        semantic: number
      }
      mongodb_source: {
        filter: string
        database: string
        collection_name: string
        column: {
          format: string
          type: string
          is_part: boolean
          value: string
          index: number
          name: string
        }[]
        fetch_size: number
      }
      pg_wal_source: {
        temporary: boolean
        database_name: string
        status_interval: number
        slot_available: boolean
        table_list: string[]
        slot_name: string
        allow_created: boolean
        lsn: number
        paving_data: boolean
      }
      binlog_source: {
        start: {
          timestamp: number
          position: number
          journal_name: string
        }
        table: string[]
        split_update: boolean
        connect_timeout: number
        filter: string
        schema: string
        cat: string
        query_timeout: number
        is_gtid_mode: boolean
        paving_data: boolean
      }
      sqlserver_source: {
        where: string
        column: {
          format: string
          is_part: boolean
          index: number
          value: string
          name: string
          type: string
        }[]
        condition_type: number
        visualization: {
          start_condition: string
          end_value: string
          column: string
          end_condition: string
          start_value: string
        }
        table: string[]
        schema: string
        split_pk: string
        mapping_type: number
        express: string
      }
      db2_source: {
        split_pk: string
        express: string
        column: {
          name: string
          is_part: boolean
          index: number
          format: string
          type: string
          value: string
        }[]
        visualization: {
          start_value: string
          end_condition: string
          column: string
          end_value: string
          start_condition: string
        }
        table: string[]
        mapping_type: number
        schema: string
        where: string
        condition_type: number
      }
      sap_hana_source: {
        schema: string
        condition_type: number
        table: string[]
        express: string
        column: {
          is_part: boolean
          name: string
          type: string
          format: string
          value: string
          index: number
        }[]
        split_pk: string
        visualization: {
          start_value: string
          end_value: string
          column: string
          start_condition: string
          end_condition: string
        }
        mapping_type: number
        where: string
      }
      postgresql_source: {
        visualization: {
          end_condition: string
          start_condition: string
          column: string
          end_value: string
          start_value: string
        }
        express: string
        split_pk: string
        condition_type: number
        table: string[]
        column: {
          index: number
          is_part: boolean
          name: string
          type: string
          value: string
          format: string
        }[]
        schema: string
        where: string
        mapping_type: number
      }
      db2_target: {
        schema: string
        post_sql: string[]
        update_key: string[]
        table: string[]
        column: {
          value: string
          is_part: boolean
          format: string
          name: string
          type: string
          index: number
        }[]
        semantic: number
        write_mode: number
        batch_size: number
        with_no_lock: string
        pre_sql: string[]
      }
      sql_server_cdc_source: {
        cat: string
        lsn: string
        poll_interval: number
        database_name: string
        paving_data: boolean
        table_list: string[]
        split_update: boolean
      }
      elastic_search_source: {
        version: string
        index: string
        column: {
          is_part: boolean
          index: number
          name: string
          format: string
          type: string
          value: string
        }[]
        batch_size: number
      }
      kafka_target: {
        topic: string
        consumer_settings: {
          auto_commit_enable: string
        }
        tableFields: {
          value: string
          index: number
          format: string
          name: string
          type: string
          is_part: boolean
        }[]
      }
      click_house_source: {
        schema: string
        table: string[]
        express: string
        visualization: {
          end_condition: string
          end_value: string
          start_condition: string
          start_value: string
          column: string
        }
        condition_type: number
        mapping_type: number
        column: {
          name: string
          index: number
          is_part: boolean
          value: string
          type: string
          format: string
        }[]
        split_pk: string
        where: string
      }
      redis_target: {
        expire_time: number
        date_format: string
        timeout: number
        database: number
        keyIndexes: number[]
        key_field_delimiter: string
        mode: string
        type: number
        value_field_delimiter: string
      }
      kafka_source: {
        group_id: string
        topic: string
        encoding: string
        mode: string
        timestamp: number
        column: {
          type: string
          is_part: boolean
          format: string
          value: string
          name: string
          index: number
        }[]
        consumer_settings: {
          auto_commit_enable: string
        }
        offset: string
        codec: string
      }
      sqlserver_target: {
        column: {
          type: string
          value: string
          index: number
          name: string
          format: string
          is_part: boolean
        }[]
        with_no_lock: string
        write_mode: number
        schema: string
        semantic: number
        post_sql: string[]
        update_key: string[]
        table: string[]
        pre_sql: string[]
        batch_size: number
      }
      hive_target: {
        encoding: number
        column: {
          type: string
          key: string
        }[]
        file_type: number
        field_delimiter: string
        partition: string
        tables_column: string
        compress: number
        write_mode: number
        table: string
        use_partition: boolean
        partition_type: number
      }
    }
    target_id: string
    cluster_id: string
    job_mode: number
  }
}
export type SetSyncJobScheduleRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
  data?: {
    started: number
    period_type: string
    schedule_policy: number
    concurrency_policy: number
    ended: number
    executed: number
    parameters: {
      key: string
      value: string
    }[]
    express: string
    timeout: number
  }
}
export type UpdateSyncJobRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
  data?: {
    name: string
    desc: string
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
    cluster_id: string
    desc: string
    is_directory: boolean
    pid: string
    name: string
    type: number
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
    delete_cluster_id: string
    cluster_id: string
    parallelism: number
    files: string[]
    built_in_connectors: string[]
    delete_files: string[]
  }
}
export type SetStreamJobCodeRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
  data?: {
    jar: {
      delete_file_id: string
      jar_args: string
      file_id: string
      jar_entry: string
    }
    python: {
      code: string
    }
    sql: {
      code: string
    }
    type: number
    operators: {
      point_x: number
      point_y: number
      down_stream: string
      upstream_right: string
      name: string
      id: string
      property: {
        udttf: {
          udf_id: string
          column: {
            as: string
            type: string
            func: string
            field: string
          }[]
          args: string
        }
        filter: {
          expression: string
          exists: string
          in: string
          where: string
        }
        dest: {
          columns: string[]
          table_id: string
        }
        udtf: {
          table_as: string
          udf_id: string
          select_column: {
            as: string
            func: string
            field: string
            type: string
          }[]
          column: {
            type: string
            field: string
            as: string
            func: string
          }[]
          args: string
        }
        offset: {
          offset: number
        }
        join: {
          args: string
          generate_column: {
            func: string
            field: string
            as: string
            type: string
          }[]
          table_as: string
          table_as_right: string
          join: string
          column: {
            func: string
            as: string
            type: string
            field: string
          }[]
          expression: string
        }
        order_by: {
          column: {
            order: string
            field: string
          }[]
        }
        except: {}
        intersect: {}
        limit: {
          limit: number
        }
        dimension: {
          time_column: {
            func: string
            as: string
            field: string
            type: string
          }
          custom_column: {
            as: string
            func: string
            field: string
            type: string
          }[]
          table_as: string
          column: {
            field: string
            func: string
            as: string
            type: string
          }[]
          distinct: string
          table_id: string
        }
        group_by: {
          group_by: string[]
        }
        fetch: {
          fetch: number
        }
        union: {
          all: boolean
        }
        values: {
          rows: {
            values: string[]
          }[]
        }
        source: {
          table_as: string
          custom_column: {
            as: string
            field: string
            func: string
            type: string
          }[]
          time_column: {
            type: string
            field: string
            func: string
            as: string
          }[]
          table_id: string
          column: {
            func: string
            as: string
            type: string
            field: string
          }[]
          distinct: string
        }
        having: {
          having: string
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
      }
      upstream: string
      type: number
    }[]
  }
}
export type SetStreamJobScheduleRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
  data?: {
    timeout: number
    ended: number
    retry_limit: number
    executed: number
    express: string
    period_type: string
    started: number
    concurrency_policy: number
    retry_policy: number
    retry_interval: number
    schedule_policy: number
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
    sql: {
      code: string
    }
    operators: {
      point_y: number
      point_x: number
      upstream_right: string
      type: number
      down_stream: string
      id: string
      property: {
        const: {
          column: {
            field: string
            as: string
            type: string
            func: string
          }[]
          table: string
        }
        dimension: {
          table_as: string
          table_id: string
          time_column: {
            field: string
            type: string
            as: string
            func: string
          }
          column: {
            func: string
            field: string
            as: string
            type: string
          }[]
          custom_column: {
            as: string
            field: string
            type: string
            func: string
          }[]
          distinct: string
        }
        filter: {
          where: string
          expression: string
          exists: string
          in: string
        }
        udttf: {
          column: {
            type: string
            as: string
            field: string
            func: string
          }[]
          udf_id: string
          args: string
        }
        group_by: {
          group_by: string[]
        }
        intersect: {}
        dest: {
          table_id: string
          columns: string[]
        }
        join: {
          expression: string
          column: {
            field: string
            func: string
            as: string
            type: string
          }[]
          join: string
          args: string
          table_as_right: string
          generate_column: {
            as: string
            field: string
            func: string
            type: string
          }[]
          table_as: string
        }
        limit: {
          limit: number
        }
        values: {
          rows: {
            values: string[]
          }[]
        }
        except: {}
        fetch: {
          fetch: number
        }
        having: {
          having: string
        }
        udtf: {
          args: string
          select_column: {
            func: string
            type: string
            field: string
            as: string
          }[]
          udf_id: string
          column: {
            as: string
            type: string
            field: string
            func: string
          }[]
          table_as: string
        }
        union: {
          all: boolean
        }
        source: {
          column: {
            as: string
            field: string
            type: string
            func: string
          }[]
          time_column: {
            func: string
            field: string
            as: string
            type: string
          }[]
          table_as: string
          distinct: string
          table_id: string
          custom_column: {
            as: string
            field: string
            func: string
            type: string
          }[]
        }
        order_by: {
          column: {
            field: string
            order: string
          }[]
        }
        offset: {
          offset: number
        }
      }
      name: string
      upstream: string
    }[]
    python: {
      code: string
    }
    jar: {
      delete_file_id: string
      jar_entry: string
      file_id: string
      jar_args: string
    }
  }
}
export type UpdateStreamJobRequestType = {
  uri: {
    space_id: string
    job_id: string
  }
  data?: {
    desc: string
    name: string
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
    desc: string
    space_id: string
    monitor_object: number
    job_ids: string[]
    notification_ids: string[]
    trigger_rule: number
    trigger_action: number
    name: string
    monitor_item: {
      stream_job: {
        instance_timeout: number
        instance_run_timeout: boolean
        instance_run_failed: boolean
      }
      sync_job: {
        instance_run_failed: boolean
        instance_run_timeout: boolean
        instance_timeout: number
      }
    }
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
    space_id: string
    notification_ids: string[]
    trigger_rule: number
    monitor_object: number
    trigger_action: number
    desc: string
    job_ids: string[]
    name: string
    monitor_item: {
      sync_job: {
        instance_run_timeout: boolean
        instance_timeout: number
        instance_run_failed: boolean
      }
      stream_job: {
        instance_timeout: number
        instance_run_timeout: boolean
        instance_run_failed: boolean
      }
    }
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
    name: string
    desc: string
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
    space_ids: string[]
    resume_job: boolean
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
      udf: {
        limit: number
      }
      member: {
        limit: number
      }
      custom_role: {
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
      sync_job: {
        limit: number
      }
      stream_job: {
        limit: number
      }
      network: {
        limit: number
      }
      workspace: {
        limit: number
      }
      flink_cluster: {
        limit: number
        cu: unknown
        cu_total: unknown
      }
    }
  }
}
export type AddMembersRequestType = {
  uri: {
    space_id: string
  }
  data?: {
    desc: string
    system_role_ids: string[]
    user_ids: string[]
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
    system_role_ids: string[]
    user_id: string
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
      udf: {
        limit: number
      }
      file: {
        size: number
        size_total: number
        limit: number
      }
      stream_job: {
        limit: number
      }
      flink_cluster: {
        limit: number
        cu_total: unknown
        cu: unknown
      }
      workspace: {
        limit: number
      }
      custom_role: {
        limit: number
      }
      sync_job: {
        limit: number
      }
      member: {
        limit: number
      }
      data_source: {
        limit: number
      }
      network: {
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
    type: number
    last_connection: {
      space_id: string
      created: number
      network_id: string
      result: number
      elapse: number
      network_info: {
        name: string
        updated: number
        vxnet_id: string
        created: number
        status: number
        space_id: string
        router_id: string
        created_by: string
        id: string
      }
      message: string
      status: number
      source_id: string
    }
    name: string
    url: {
      hbase: {
        config: string
      }
      redis: {
        hosts: {
          port: number
          host: string
        }[]
        password: string
      }
      elastic_search: {
        version: string
        port: number
        user: string
        password: string
        host: string
      }
      clickhouse: {
        port: number
        database: string
        password: string
        host: string
        user: string
      }
      ftp: {
        host: string
        private_key: string
        password: string
        connection_mode: number
        protocol: number
        user: string
        port: number
      }
      s3: {}
      mongo_db: {
        database: string
        password: string
        user: string
        hosts: {
          host: string
          port: number
        }[]
      }
      kafka: {
        kafka_brokers: {
          port: number
          host: string
        }[]
      }
      db2: {
        database: string
        host: string
        password: string
        user: string
        port: number
      }
      oracle: {
        user: string
        password: string
        port: number
        host: string
        database: string
      }
      hive: {
        config: string
        defaultFS: string
        host: string
        database: string
        password: string
        port: number
        user: string
      }
      mysql: {
        password: string
        host: string
        port: number
        user: string
        database: string
      }
      sqlserver: {
        user: string
        password: string
        host: string
        database: string
        port: number
      }
      sap_hana: {
        database: string
        port: number
        password: string
        host: string
        user: string
      }
      hdfs: {
        config: string
        name_node: string
        port: number
      }
      postgresql: {
        user: string
        password: string
        host: string
        database: string
        port: number
      }
    }
    desc: string
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
    verbose: number
    reverse: boolean
    sort_by: string
    limit: number
    offset: number
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
    source_id: string
    type: number
    stage: number
    network_id: string
    url: {
      mysql: {
        user: string
        database: string
        port: number
        password: string
        host: string
      }
      s3: {}
      hbase: {
        config: string
      }
      redis: {
        hosts: {
          port: number
          host: string
        }[]
        password: string
      }
      elastic_search: {
        version: string
        user: string
        port: number
        host: string
        password: string
      }
      oracle: {
        database: string
        host: string
        user: string
        password: string
        port: number
      }
      sqlserver: {
        user: string
        port: number
        database: string
        host: string
        password: string
      }
      kafka: {
        kafka_brokers: {
          port: number
          host: string
        }[]
      }
      hdfs: {
        config: string
        port: number
        name_node: string
      }
      hive: {
        host: string
        config: string
        defaultFS: string
        password: string
        port: number
        database: string
        user: string
      }
      ftp: {
        protocol: number
        host: string
        password: string
        private_key: string
        connection_mode: number
        user: string
        port: number
      }
      db2: {
        password: string
        host: string
        port: number
        database: string
        user: string
      }
      mongo_db: {
        hosts: {
          port: number
          host: string
        }[]
        password: string
        user: string
        database: string
      }
      sap_hana: {
        host: string
        port: number
        database: string
        user: string
        password: string
      }
      clickhouse: {
        password: string
        port: number
        database: string
        host: string
        user: string
      }
      postgresql: {
        user: string
        database: string
        host: string
        password: string
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
    desc: string
    url: {
      mongo_db: {
        user: string
        password: string
        database: string
        hosts: {
          port: number
          host: string
        }[]
      }
      redis: {
        password: string
        hosts: {
          port: number
          host: string
        }[]
      }
      sap_hana: {
        database: string
        port: number
        user: string
        host: string
        password: string
      }
      elastic_search: {
        host: string
        version: string
        password: string
        user: string
        port: number
      }
      sqlserver: {
        user: string
        database: string
        host: string
        password: string
        port: number
      }
      db2: {
        host: string
        database: string
        password: string
        port: number
        user: string
      }
      hdfs: {
        config: string
        port: number
        name_node: string
      }
      mysql: {
        user: string
        database: string
        host: string
        password: string
        port: number
      }
      s3: {}
      postgresql: {
        host: string
        port: number
        password: string
        user: string
        database: string
      }
      kafka: {
        kafka_brokers: {
          host: string
          port: number
        }[]
      }
      hive: {
        port: number
        user: string
        password: string
        database: string
        defaultFS: string
        config: string
        host: string
      }
      ftp: {
        user: string
        password: string
        port: number
        host: string
        private_key: string
        protocol: number
        connection_mode: number
      }
      hbase: {
        config: string
      }
      clickhouse: {
        database: string
        host: string
        user: string
        password: string
        port: number
      }
      oracle: {
        port: number
        database: string
        user: string
        host: string
        password: string
      }
    }
    type: number
  }
}
export type CreateFlinkClusterRequestType = {
  uri: {
    space_id: string
  }
  data?: {
    network_id: string
    config: {
      logger: {
        root_log_level: string
      }
      custom: {
        value: string
        key: string
      }[]
      restart_strategy: {
        restart_strategy: string
        fixed_delay_delay: number
        fixed_delay_attempts: number
        failure_rate_failure_rate_interval: number
        failure_rate_delay: number
        failure_rate_max_failures_per_interval: number
      }
    }
    task_num: number
    task_cu: unknown
    job_cu: unknown
    name: string
    host_aliases: {
      items: {
        ip: string
        hostname: string
      }[]
    }
    version: string
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
    name: string
    task_cu: unknown
    task_num: number
    network_id: string
    host_aliases: {
      items: {
        ip: string
        hostname: string
      }[]
    }
    config: {
      custom: {
        key: string
        value: string
      }[]
      logger: {
        root_log_level: string
      }
      restart_strategy: {
        fixed_delay_delay: number
        restart_strategy: string
        failure_rate_failure_rate_interval: number
        failure_rate_max_failures_per_interval: number
        failure_rate_delay: number
        fixed_delay_attempts: number
      }
    }
    job_cu: unknown
  }
}
export type CreateNetworkRequestType = {
  uri: {
    space_id: string
  }
  data?: {
    router_id: string
    name: string
    vxnet_id: string
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
    router_id: string
    vxnet_id: string
    name: string
  }
}
