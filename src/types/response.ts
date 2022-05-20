export type AuditManageListOpAuditsType = {
  infos: {
    state: number
    created: number
    user_id: string
    api_name: string
    space_id: string
    perm_type: number
  }[]
  has_more: boolean
}
export type NotifierManageListNotificationsType = {
  notification_lists: {
    items: {
      create_time: string
      content: string
      notification_item_type: string
      verified: number
      notification_item_id: string
    }[]
    notification_list_name: string
    notification_list_id: string
    create_time: string
    owner: string
  }[]
  total: number
}
export type ConvertSyncJobModeGenerateJobJsonType = {
  job: string
}
export type UDFManageCreateUDFType = {
  id: string
}
export type UDFManageListUDFsType = {
  total: number
  infos: {
    file_id: string
    language: number
    created_by: string
    status: number
    type: number
    id: string
    usage_sample: string
    desc: string
    space_id: string
    code: string
    updated: number
    created: number
    name: string
  }[]
}
export type ResourceManageDescribeFileMetaType = {
  created: number
  updated: number
  description: string
  is_directory: boolean
  type: number
  created_by: string
  status: number
  name: string
  size: number
  space_id: string
  pid: string
  resource_id: string
  etag: string
  version: string
}
export type ResourceManageListFileMetasType = {
  total: number
  infos: {
    type: number
    description: string
    version: string
    space_id: string
    created_by: string
    pid: string
    is_directory: boolean
    name: string
    size: number
    updated: number
    created: number
    etag: string
    status: number
    resource_id: string
  }[]
  has_more: boolean
}
export type ResourceManageUploadFileType = {
  version: string
  id: string
}
export type FileManageDescribeFileMetaType = {
  id: string
  space_id: string
  name: string
  created: number
  updated: number
  etag: string
  pid: string
  created_by: string
  version: string
  status: number
  is_directory: boolean
  size: number
  desc: string
}
export type FileManageListFileMetasType = {
  has_more: boolean
  infos: {
    id: string
    is_directory: boolean
    created_by: string
    created: number
    pid: string
    desc: string
    space_id: string
    etag: string
    version: string
    size: number
    name: string
    status: number
    updated: number
  }[]
  total: number
}
export type FileManageUploadFileType = {
  id: string
  version: string
}
export type SyncJobInstanceManageDescribeSyncInstanceType = {
  updated: number
  status: number
  message: string
  flink_ui: string
  created: number
  id: string
  job_id: string
  sync_job: {
    pid: string
    space_id: string
    source_type: number
    status: number
    updated: number
    target_type: number
    desc: string
    version: string
    created_by: string
    created: number
    id: string
    name: string
    is_directory: boolean
    type: number
  }
  version: string
  state: number
  space_id: string
  sync_job_property: {
    conf: {
      job_mode: number
      channel_control: {
        parallelism: number
        bytes: number
        percentage: number
        rate: number
        record_num: number
      }
      source_id: string
      sync_resource: {
        postgresql_target: {
          update_key: string[]
          post_sql: string[]
          schema: string
          table: string[]
          batch_size: number
          pre_sql: string[]
          column: {
            index: number
            format: string
            is_part: boolean
            type: string
            value: string
            name: string
          }[]
          with_no_lock: string
          write_mode: number
          semantic: number
        }
        elastic_search_source: {
          index: string
          batch_size: number
          version: string
          column: {
            format: string
            value: string
            is_part: boolean
            name: string
            index: number
            type: string
          }[]
        }
        kafka_source: {
          consumer_settings: {
            auto_commit_enable: string
          }
          codec: string
          mode: string
          timestamp: number
          encoding: string
          topic: string
          group_id: string
          column: {
            value: string
            format: string
            type: string
            is_part: boolean
            index: number
            name: string
          }[]
          offset: string
        }
        click_house_source: {
          column: {
            name: string
            index: number
            is_part: boolean
            format: string
            type: string
            value: string
          }[]
          schema: string
          condition_type: number
          table: string[]
          where: string
          split_pk: string
          express: string
          mapping_type: number
          visualization: {
            end_condition: string
            column: string
            end_value: string
            start_condition: string
            start_value: string
          }
        }
        db2_target: {
          column: {
            name: string
            format: string
            type: string
            is_part: boolean
            index: number
            value: string
          }[]
          update_key: string[]
          with_no_lock: string
          schema: string
          semantic: number
          table: string[]
          pre_sql: string[]
          batch_size: number
          post_sql: string[]
          write_mode: number
        }
        hbase_source: {
          parameter: {
            change_log: string
            hbaseConfig: string
            encoding: string
            range: {
              end_row_key: string
              start_row_key: string
              is_binary_rowkey: boolean
            }
            scan_cache_size: number
            scan_batch_size: number
            hadoopConfig: string
            column: {
              format: string
              name: string
              value: string
              index: number
              is_part: boolean
              type: string
            }[]
          }
          name: string
          table: {
            table_name: string
          }
        }
        hbase_target: {
          parameter: {
            scan_cache_size: number
            wal_flag: boolean
            write_buffer_size: number
            column: {
              format: string
              type: string
              is_part: boolean
              index: number
              name: string
              value: string
            }[]
            rowkey_express: string
            version_column_value: string
            scan_batch_size: number
            null_mode: string
            change_log: string
            hbase_config: string
            version_column_index: number
          }
          name: string
          table: {
            table_name: string
          }
        }
        hdfs_target: {
          file_type: number
          encoding: number
          compress: number
          path: string
          field_delimiter: string
          write_mode: number
          column: {
            name: string
            value: string
            is_part: boolean
            format: string
            type: string
            index: number
          }[]
          file_name: string
        }
        kafka_target: {
          tableFields: {
            is_part: boolean
            type: string
            value: string
            index: number
            format: string
            name: string
          }[]
          consumer_settings: {
            auto_commit_enable: string
          }
          topic: string
        }
        mongodb_target: {
          batch_size: number
          collection_name: string
          replace_key: string
          column: {
            name: string
            type: string
            value: string
            format: string
            index: number
            is_part: boolean
          }[]
          write_mode: number
          database: string
          flush_interval_mills: number
        }
        sap_hana_target: {
          update_key: string[]
          write_mode: number
          schema: string
          column: {
            type: string
            value: string
            index: number
            is_part: boolean
            name: string
            format: string
          }[]
          with_no_lock: string
          pre_sql: string[]
          semantic: number
          post_sql: string[]
          table: string[]
          batch_size: number
        }
        oracle_target: {
          schema: string
          table: string[]
          batch_size: number
          pre_sql: string[]
          post_sql: string[]
          with_no_lock: string
          semantic: number
          update_key: string[]
          column: {
            name: string
            value: string
            type: string
            is_part: boolean
            index: number
            format: string
          }[]
          write_mode: number
        }
        redis_target: {
          expire_time: number
          mode: string
          timeout: number
          database: number
          date_format: string
          type: number
          value_field_delimiter: string
          keyIndexes: number[]
          key_field_delimiter: string
        }
        oracle_source: {
          column: {
            name: string
            index: number
            format: string
            type: string
            value: string
            is_part: boolean
          }[]
          split_pk: string
          express: string
          condition_type: number
          mapping_type: number
          visualization: {
            column: string
            end_condition: string
            end_value: string
            start_condition: string
            start_value: string
          }
          where: string
          schema: string
          table: string[]
        }
        mongodb_source: {
          column: {
            type: string
            value: string
            format: string
            index: number
            is_part: boolean
            name: string
          }[]
          collection_name: string
          filter: string
          database: string
          fetch_size: number
        }
        ftp_target: {
          encoding: string
          timeout: number
          column: {
            index: number
            format: string
            is_part: boolean
            type: string
            name: string
            value: string
          }[]
          is_first_line_header: boolean
          field_delimiter: string
          connect_pattern: string
          control_encoding: string
          ftp_file_name: string
          path: string
          private_key_path: string
        }
        elastic_search_target: {
          key_delimiter: string
          column: {
            name: string
            index: number
            type: string
            is_part: boolean
            value: string
            format: string
          }[]
          index: string
          batch_size: number
          version: string
        }
        sql_server_cdc_source: {
          cat: string
          poll_interval: number
          table_list: string[]
          lsn: string
          paving_data: boolean
          split_update: boolean
          database_name: string
        }
        sap_hana_source: {
          schema: string
          visualization: {
            end_condition: string
            column: string
            start_condition: string
            end_value: string
            start_value: string
          }
          where: string
          column: {
            value: string
            name: string
            type: string
            format: string
            index: number
            is_part: boolean
          }[]
          table: string[]
          mapping_type: number
          split_pk: string
          condition_type: number
          express: string
        }
        binlog_source: {
          filter: string
          schema: string
          paving_data: boolean
          cat: string
          query_timeout: number
          table: string[]
          split_update: boolean
          start: {
            timestamp: number
            position: number
            journal_name: string
          }
          is_gtid_mode: boolean
          connect_timeout: number
        }
        click_house_target: {
          semantic: number
          table: string[]
          with_no_lock: string
          column: {
            name: string
            value: string
            is_part: boolean
            format: string
            index: number
            type: string
          }[]
          write_mode: number
          update_key: string[]
          post_sql: string[]
          batch_size: number
          pre_sql: string[]
          schema: string
        }
        ftp_source: {
          private_key_path: string
          file_config: string
          connect_pattern: string
          compress_type: string
          control_encoding: string
          field_delimiter: string
          column: {
            type: string
            format: string
            index: number
            name: string
            value: string
            is_part: boolean
          }[]
          file_type: string
          is_first_line_header: boolean
          path: string
          encoding: string
          timeout: string
        }
        sqlserver_source: {
          where: string
          column: {
            index: number
            type: string
            value: string
            name: string
            is_part: boolean
            format: string
          }[]
          visualization: {
            end_condition: string
            column: string
            start_condition: string
            start_value: string
            end_value: string
          }
          express: string
          schema: string
          split_pk: string
          table: string[]
          mapping_type: number
          condition_type: number
        }
        mysql_source: {
          schema: string
          where: string
          mapping_type: number
          column: {
            value: string
            format: string
            is_part: boolean
            name: string
            index: number
            type: string
          }[]
          table: string[]
          express: string
          condition_type: number
          split_pk: string
          visualization: {
            end_value: string
            end_condition: string
            start_condition: string
            start_value: string
            column: string
          }
        }
        hdfs_source: {
          column: {
            format: string
            index: number
            is_part: boolean
            type: string
            value: string
            name: string
          }[]
          field_delimiter: string
          encoding: number
          file_type: number
          filter_regex: string
          path: string
        }
        db2_source: {
          where: string
          column: {
            name: string
            format: string
            index: number
            type: string
            is_part: boolean
            value: string
          }[]
          split_pk: string
          express: string
          visualization: {
            start_value: string
            start_condition: string
            end_condition: string
            column: string
            end_value: string
          }
          mapping_type: number
          table: string[]
          condition_type: number
          schema: string
        }
        hive_target: {
          field_delimiter: string
          partition: string
          write_mode: number
          tables_column: string
          compress: number
          column: {
            type: string
            key: string
          }[]
          partition_type: number
          table: string
          use_partition: boolean
          encoding: number
          file_type: number
        }
        pg_wal_source: {
          slot_available: boolean
          allow_created: boolean
          lsn: number
          database_name: string
          paving_data: boolean
          status_interval: number
          table_list: string[]
          temporary: boolean
          slot_name: string
        }
        mysql_target: {
          update_key: string[]
          write_mode: number
          table: string[]
          semantic: number
          post_sql: string[]
          schema: string
          with_no_lock: string
          batch_size: number
          pre_sql: string[]
          column: {
            type: string
            is_part: boolean
            name: string
            value: string
            format: string
            index: number
          }[]
        }
        postgresql_source: {
          column: {
            name: string
            type: string
            index: number
            value: string
            format: string
            is_part: boolean
          }[]
          schema: string
          visualization: {
            start_value: string
            start_condition: string
            column: string
            end_condition: string
            end_value: string
          }
          express: string
          table: string[]
          condition_type: number
          mapping_type: number
          split_pk: string
          where: string
        }
        logminer_source: {
          cat: string
          support_auto_add_log: boolean
          paving_data: boolean
          split_update: boolean
          fetch_size: number
          table: string[]
          start_time: number
          read_position: string
          start_scn: string
          query_timeout: number
        }
        sqlserver_target: {
          table: string[]
          update_key: string[]
          pre_sql: string[]
          schema: string
          semantic: number
          batch_size: number
          write_mode: number
          column: {
            value: string
            index: number
            is_part: boolean
            type: string
            format: string
            name: string
          }[]
          post_sql: string[]
          with_no_lock: string
        }
      }
      target_id: string
      job_content: string
      cluster_id: string
    }
    id: string
    schedule: {
      executed: number
      started: number
      timeout: number
      express: string
      period_type: string
      parameters: {
        key: string
        value: string
      }[]
      ended: number
      schedule_policy: number
      concurrency_policy: number
    }
    version: string
    space_id: string
  }
}
export type SyncJobInstanceManageListSyncInstancesType = {
  has_more: boolean
  total: number
  infos: {
    created: number
    id: string
    message: string
    status: number
    flink_ui: string
    sync_job_property: {
      conf: {
        job_mode: number
        cluster_id: string
        job_content: string
        channel_control: {
          bytes: number
          percentage: number
          record_num: number
          parallelism: number
          rate: number
        }
        target_id: string
        source_id: string
        sync_resource: {
          hbase_target: {
            table: {
              table_name: string
            }
            name: string
            parameter: {
              change_log: string
              version_column_value: string
              column: {
                name: string
                is_part: boolean
                type: string
                index: number
                value: string
                format: string
              }[]
              null_mode: string
              rowkey_express: string
              version_column_index: number
              hbase_config: string
              scan_cache_size: number
              wal_flag: boolean
              write_buffer_size: number
              scan_batch_size: number
            }
          }
          sqlserver_target: {
            post_sql: string[]
            batch_size: number
            column: {
              name: string
              type: string
              value: string
              index: number
              is_part: boolean
              format: string
            }[]
            pre_sql: string[]
            table: string[]
            with_no_lock: string
            write_mode: number
            update_key: string[]
            semantic: number
            schema: string
          }
          postgresql_source: {
            split_pk: string
            visualization: {
              end_condition: string
              end_value: string
              start_condition: string
              column: string
              start_value: string
            }
            where: string
            express: string
            table: string[]
            mapping_type: number
            schema: string
            column: {
              is_part: boolean
              index: number
              format: string
              type: string
              value: string
              name: string
            }[]
            condition_type: number
          }
          hdfs_source: {
            encoding: number
            field_delimiter: string
            file_type: number
            filter_regex: string
            path: string
            column: {
              format: string
              name: string
              type: string
              index: number
              value: string
              is_part: boolean
            }[]
          }
          elastic_search_source: {
            batch_size: number
            column: {
              index: number
              format: string
              name: string
              type: string
              value: string
              is_part: boolean
            }[]
            index: string
            version: string
          }
          ftp_target: {
            timeout: number
            encoding: string
            connect_pattern: string
            private_key_path: string
            column: {
              is_part: boolean
              name: string
              value: string
              type: string
              format: string
              index: number
            }[]
            ftp_file_name: string
            is_first_line_header: boolean
            field_delimiter: string
            control_encoding: string
            path: string
          }
          db2_source: {
            column: {
              name: string
              is_part: boolean
              value: string
              format: string
              type: string
              index: number
            }[]
            mapping_type: number
            table: string[]
            schema: string
            split_pk: string
            visualization: {
              start_condition: string
              end_value: string
              column: string
              end_condition: string
              start_value: string
            }
            where: string
            condition_type: number
            express: string
          }
          elastic_search_target: {
            version: string
            batch_size: number
            key_delimiter: string
            column: {
              index: number
              format: string
              is_part: boolean
              name: string
              type: string
              value: string
            }[]
            index: string
          }
          kafka_source: {
            offset: string
            mode: string
            encoding: string
            codec: string
            group_id: string
            consumer_settings: {
              auto_commit_enable: string
            }
            column: {
              is_part: boolean
              index: number
              value: string
              name: string
              format: string
              type: string
            }[]
            timestamp: number
            topic: string
          }
          postgresql_target: {
            post_sql: string[]
            column: {
              value: string
              format: string
              is_part: boolean
              index: number
              type: string
              name: string
            }[]
            table: string[]
            write_mode: number
            semantic: number
            schema: string
            with_no_lock: string
            pre_sql: string[]
            batch_size: number
            update_key: string[]
          }
          click_house_source: {
            express: string
            condition_type: number
            split_pk: string
            visualization: {
              column: string
              end_condition: string
              end_value: string
              start_condition: string
              start_value: string
            }
            column: {
              type: string
              value: string
              name: string
              index: number
              format: string
              is_part: boolean
            }[]
            mapping_type: number
            schema: string
            where: string
            table: string[]
          }
          click_house_target: {
            write_mode: number
            column: {
              index: number
              is_part: boolean
              name: string
              format: string
              type: string
              value: string
            }[]
            schema: string
            semantic: number
            table: string[]
            post_sql: string[]
            pre_sql: string[]
            update_key: string[]
            batch_size: number
            with_no_lock: string
          }
          db2_target: {
            column: {
              format: string
              is_part: boolean
              name: string
              type: string
              value: string
              index: number
            }[]
            batch_size: number
            schema: string
            table: string[]
            update_key: string[]
            semantic: number
            post_sql: string[]
            with_no_lock: string
            pre_sql: string[]
            write_mode: number
          }
          sqlserver_source: {
            column: {
              format: string
              index: number
              name: string
              value: string
              type: string
              is_part: boolean
            }[]
            express: string
            mapping_type: number
            condition_type: number
            where: string
            schema: string
            table: string[]
            split_pk: string
            visualization: {
              start_value: string
              column: string
              end_condition: string
              end_value: string
              start_condition: string
            }
          }
          mysql_target: {
            column: {
              format: string
              index: number
              name: string
              is_part: boolean
              type: string
              value: string
            }[]
            semantic: number
            update_key: string[]
            post_sql: string[]
            pre_sql: string[]
            with_no_lock: string
            batch_size: number
            table: string[]
            write_mode: number
            schema: string
          }
          oracle_source: {
            column: {
              name: string
              type: string
              index: number
              value: string
              format: string
              is_part: boolean
            }[]
            express: string
            visualization: {
              column: string
              end_condition: string
              start_value: string
              end_value: string
              start_condition: string
            }
            table: string[]
            split_pk: string
            condition_type: number
            mapping_type: number
            where: string
            schema: string
          }
          mysql_source: {
            visualization: {
              start_value: string
              column: string
              end_value: string
              end_condition: string
              start_condition: string
            }
            table: string[]
            schema: string
            express: string
            column: {
              value: string
              format: string
              name: string
              index: number
              is_part: boolean
              type: string
            }[]
            split_pk: string
            mapping_type: number
            where: string
            condition_type: number
          }
          redis_target: {
            date_format: string
            timeout: number
            key_field_delimiter: string
            database: number
            mode: string
            type: number
            value_field_delimiter: string
            keyIndexes: number[]
            expire_time: number
          }
          binlog_source: {
            split_update: boolean
            query_timeout: number
            connect_timeout: number
            schema: string
            paving_data: boolean
            cat: string
            filter: string
            is_gtid_mode: boolean
            start: {
              position: number
              journal_name: string
              timestamp: number
            }
            table: string[]
          }
          pg_wal_source: {
            lsn: number
            allow_created: boolean
            status_interval: number
            table_list: string[]
            slot_name: string
            database_name: string
            paving_data: boolean
            slot_available: boolean
            temporary: boolean
          }
          hdfs_target: {
            write_mode: number
            path: string
            compress: number
            encoding: number
            field_delimiter: string
            column: {
              value: string
              index: number
              is_part: boolean
              format: string
              name: string
              type: string
            }[]
            file_type: number
            file_name: string
          }
          hive_target: {
            tables_column: string
            write_mode: number
            file_type: number
            use_partition: boolean
            partition: string
            compress: number
            partition_type: number
            column: {
              type: string
              key: string
            }[]
            encoding: number
            table: string
            field_delimiter: string
          }
          sap_hana_source: {
            express: string
            condition_type: number
            where: string
            column: {
              type: string
              value: string
              name: string
              index: number
              format: string
              is_part: boolean
            }[]
            split_pk: string
            schema: string
            table: string[]
            visualization: {
              end_value: string
              start_condition: string
              column: string
              end_condition: string
              start_value: string
            }
            mapping_type: number
          }
          sap_hana_target: {
            column: {
              index: number
              is_part: boolean
              type: string
              format: string
              name: string
              value: string
            }[]
            batch_size: number
            post_sql: string[]
            pre_sql: string[]
            table: string[]
            semantic: number
            schema: string
            update_key: string[]
            write_mode: number
            with_no_lock: string
          }
          sql_server_cdc_source: {
            lsn: string
            poll_interval: number
            paving_data: boolean
            table_list: string[]
            database_name: string
            cat: string
            split_update: boolean
          }
          mongodb_source: {
            filter: string
            column: {
              index: number
              type: string
              value: string
              name: string
              is_part: boolean
              format: string
            }[]
            collection_name: string
            database: string
            fetch_size: number
          }
          ftp_source: {
            compress_type: string
            control_encoding: string
            field_delimiter: string
            path: string
            file_type: string
            private_key_path: string
            is_first_line_header: boolean
            file_config: string
            timeout: string
            column: {
              value: string
              is_part: boolean
              format: string
              index: number
              name: string
              type: string
            }[]
            connect_pattern: string
            encoding: string
          }
          hbase_source: {
            parameter: {
              change_log: string
              encoding: string
              range: {
                is_binary_rowkey: boolean
                start_row_key: string
                end_row_key: string
              }
              column: {
                index: number
                type: string
                value: string
                is_part: boolean
                format: string
                name: string
              }[]
              scan_batch_size: number
              scan_cache_size: number
              hbaseConfig: string
              hadoopConfig: string
            }
            name: string
            table: {
              table_name: string
            }
          }
          kafka_target: {
            consumer_settings: {
              auto_commit_enable: string
            }
            topic: string
            tableFields: {
              index: number
              is_part: boolean
              name: string
              type: string
              format: string
              value: string
            }[]
          }
          logminer_source: {
            fetch_size: number
            start_scn: string
            split_update: boolean
            paving_data: boolean
            read_position: string
            query_timeout: number
            start_time: number
            table: string[]
            support_auto_add_log: boolean
            cat: string
          }
          mongodb_target: {
            batch_size: number
            replace_key: string
            flush_interval_mills: number
            write_mode: number
            database: string
            collection_name: string
            column: {
              is_part: boolean
              format: string
              type: string
              value: string
              name: string
              index: number
            }[]
          }
          oracle_target: {
            batch_size: number
            post_sql: string[]
            table: string[]
            semantic: number
            schema: string
            column: {
              format: string
              index: number
              is_part: boolean
              name: string
              type: string
              value: string
            }[]
            update_key: string[]
            with_no_lock: string
            write_mode: number
            pre_sql: string[]
          }
        }
      }
      version: string
      schedule: {
        executed: number
        express: string
        timeout: number
        period_type: string
        parameters: {
          key: string
          value: string
        }[]
        concurrency_policy: number
        started: number
        ended: number
        schedule_policy: number
      }
      id: string
      space_id: string
    }
    job_id: string
    sync_job: {
      source_type: number
      name: string
      version: string
      target_type: number
      desc: string
      created: number
      space_id: string
      is_directory: boolean
      id: string
      updated: number
      created_by: string
      status: number
      type: number
      pid: string
    }
    space_id: string
    version: string
    state: number
    updated: number
  }[]
}
export type SyncJobReleaseManageListReleaseSyncJobsType = {
  has_more: boolean
  infos: {
    id: string
    name: string
    desc: string
    created_by: string
    created: number
    space_id: string
    status: number
    type: number
    updated: number
    version: string
  }[]
  total: number
}
export type SyncJobVersionManageDescribeSyncJobVersionType = {
  is_directory: boolean
  space_id: string
  status: number
  type: number
  updated: number
  id: string
  source_type: number
  target_type: number
  version: string
  created: number
  name: string
  pid: string
  created_by: string
  desc: string
}
export type SyncJobVersionManageGetSyncJobVersionConfType = {
  sync_resource: {
    ftp_target: {
      field_delimiter: string
      column: {
        type: string
        format: string
        is_part: boolean
        value: string
        name: string
        index: number
      }[]
      control_encoding: string
      encoding: string
      private_key_path: string
      ftp_file_name: string
      timeout: number
      path: string
      is_first_line_header: boolean
      connect_pattern: string
    }
    sql_server_cdc_source: {
      paving_data: boolean
      poll_interval: number
      cat: string
      lsn: string
      split_update: boolean
      database_name: string
      table_list: string[]
    }
    hbase_source: {
      table: {
        table_name: string
      }
      name: string
      parameter: {
        encoding: string
        hbaseConfig: string
        hadoopConfig: string
        scan_cache_size: number
        column: {
          format: string
          is_part: boolean
          index: number
          name: string
          type: string
          value: string
        }[]
        change_log: string
        range: {
          is_binary_rowkey: boolean
          start_row_key: string
          end_row_key: string
        }
        scan_batch_size: number
      }
    }
    kafka_target: {
      tableFields: {
        index: number
        format: string
        name: string
        type: string
        value: string
        is_part: boolean
      }[]
      consumer_settings: {
        auto_commit_enable: string
      }
      topic: string
    }
    hive_target: {
      partition: string
      partition_type: number
      field_delimiter: string
      compress: number
      encoding: number
      table: string
      file_type: number
      use_partition: boolean
      write_mode: number
      column: {
        type: string
        key: string
      }[]
      tables_column: string
    }
    mysql_target: {
      schema: string
      update_key: string[]
      batch_size: number
      write_mode: number
      semantic: number
      table: string[]
      post_sql: string[]
      with_no_lock: string
      column: {
        index: number
        type: string
        name: string
        value: string
        format: string
        is_part: boolean
      }[]
      pre_sql: string[]
    }
    oracle_source: {
      where: string
      schema: string
      condition_type: number
      express: string
      column: {
        format: string
        is_part: boolean
        value: string
        name: string
        index: number
        type: string
      }[]
      split_pk: string
      table: string[]
      mapping_type: number
      visualization: {
        end_value: string
        column: string
        start_condition: string
        start_value: string
        end_condition: string
      }
    }
    elastic_search_source: {
      version: string
      batch_size: number
      index: string
      column: {
        type: string
        index: number
        format: string
        value: string
        is_part: boolean
        name: string
      }[]
    }
    hdfs_target: {
      column: {
        value: string
        is_part: boolean
        index: number
        format: string
        type: string
        name: string
      }[]
      field_delimiter: string
      file_type: number
      encoding: number
      compress: number
      write_mode: number
      path: string
      file_name: string
    }
    hbase_target: {
      name: string
      table: {
        table_name: string
      }
      parameter: {
        write_buffer_size: number
        version_column_value: string
        column: {
          index: number
          format: string
          is_part: boolean
          name: string
          type: string
          value: string
        }[]
        rowkey_express: string
        null_mode: string
        scan_batch_size: number
        version_column_index: number
        wal_flag: boolean
        scan_cache_size: number
        change_log: string
        hbase_config: string
      }
    }
    kafka_source: {
      timestamp: number
      consumer_settings: {
        auto_commit_enable: string
      }
      encoding: string
      codec: string
      offset: string
      column: {
        type: string
        is_part: boolean
        name: string
        format: string
        value: string
        index: number
      }[]
      mode: string
      topic: string
      group_id: string
    }
    logminer_source: {
      cat: string
      start_scn: string
      start_time: number
      split_update: boolean
      fetch_size: number
      support_auto_add_log: boolean
      paving_data: boolean
      read_position: string
      query_timeout: number
      table: string[]
    }
    mongodb_source: {
      collection_name: string
      database: string
      filter: string
      column: {
        value: string
        format: string
        index: number
        type: string
        name: string
        is_part: boolean
      }[]
      fetch_size: number
    }
    oracle_target: {
      update_key: string[]
      schema: string
      table: string[]
      semantic: number
      write_mode: number
      pre_sql: string[]
      column: {
        format: string
        index: number
        is_part: boolean
        name: string
        type: string
        value: string
      }[]
      batch_size: number
      post_sql: string[]
      with_no_lock: string
    }
    pg_wal_source: {
      temporary: boolean
      slot_available: boolean
      slot_name: string
      status_interval: number
      lsn: number
      table_list: string[]
      allow_created: boolean
      database_name: string
      paving_data: boolean
    }
    postgresql_target: {
      table: string[]
      post_sql: string[]
      semantic: number
      column: {
        format: string
        name: string
        type: string
        value: string
        is_part: boolean
        index: number
      }[]
      write_mode: number
      batch_size: number
      schema: string
      with_no_lock: string
      pre_sql: string[]
      update_key: string[]
    }
    db2_source: {
      mapping_type: number
      condition_type: number
      table: string[]
      visualization: {
        start_condition: string
        start_value: string
        column: string
        end_value: string
        end_condition: string
      }
      where: string
      schema: string
      express: string
      split_pk: string
      column: {
        type: string
        name: string
        format: string
        index: number
        value: string
        is_part: boolean
      }[]
    }
    hdfs_source: {
      column: {
        format: string
        name: string
        value: string
        type: string
        index: number
        is_part: boolean
      }[]
      path: string
      encoding: number
      file_type: number
      filter_regex: string
      field_delimiter: string
    }
    sqlserver_source: {
      where: string
      column: {
        type: string
        value: string
        format: string
        index: number
        is_part: boolean
        name: string
      }[]
      schema: string
      mapping_type: number
      condition_type: number
      split_pk: string
      visualization: {
        start_condition: string
        start_value: string
        column: string
        end_value: string
        end_condition: string
      }
      express: string
      table: string[]
    }
    sqlserver_target: {
      column: {
        is_part: boolean
        name: string
        value: string
        index: number
        format: string
        type: string
      }[]
      schema: string
      update_key: string[]
      batch_size: number
      semantic: number
      post_sql: string[]
      with_no_lock: string
      write_mode: number
      table: string[]
      pre_sql: string[]
    }
    sap_hana_target: {
      schema: string
      batch_size: number
      column: {
        is_part: boolean
        value: string
        name: string
        format: string
        index: number
        type: string
      }[]
      table: string[]
      post_sql: string[]
      with_no_lock: string
      update_key: string[]
      write_mode: number
      pre_sql: string[]
      semantic: number
    }
    postgresql_source: {
      condition_type: number
      express: string
      schema: string
      split_pk: string
      where: string
      column: {
        index: number
        value: string
        type: string
        name: string
        is_part: boolean
        format: string
      }[]
      visualization: {
        start_condition: string
        end_condition: string
        end_value: string
        column: string
        start_value: string
      }
      mapping_type: number
      table: string[]
    }
    mysql_source: {
      mapping_type: number
      column: {
        name: string
        is_part: boolean
        type: string
        value: string
        format: string
        index: number
      }[]
      table: string[]
      condition_type: number
      express: string
      split_pk: string
      visualization: {
        column: string
        end_condition: string
        start_value: string
        start_condition: string
        end_value: string
      }
      where: string
      schema: string
    }
    ftp_source: {
      file_type: string
      field_delimiter: string
      encoding: string
      control_encoding: string
      file_config: string
      connect_pattern: string
      compress_type: string
      private_key_path: string
      path: string
      timeout: string
      column: {
        is_part: boolean
        format: string
        index: number
        name: string
        type: string
        value: string
      }[]
      is_first_line_header: boolean
    }
    click_house_target: {
      post_sql: string[]
      schema: string
      semantic: number
      batch_size: number
      with_no_lock: string
      table: string[]
      write_mode: number
      column: {
        format: string
        type: string
        value: string
        name: string
        is_part: boolean
        index: number
      }[]
      pre_sql: string[]
      update_key: string[]
    }
    mongodb_target: {
      write_mode: number
      batch_size: number
      replace_key: string
      column: {
        name: string
        type: string
        format: string
        value: string
        index: number
        is_part: boolean
      }[]
      collection_name: string
      database: string
      flush_interval_mills: number
    }
    binlog_source: {
      table: string[]
      schema: string
      split_update: boolean
      connect_timeout: number
      paving_data: boolean
      query_timeout: number
      cat: string
      is_gtid_mode: boolean
      filter: string
      start: {
        position: number
        journal_name: string
        timestamp: number
      }
    }
    db2_target: {
      write_mode: number
      column: {
        type: string
        value: string
        index: number
        is_part: boolean
        name: string
        format: string
      }[]
      post_sql: string[]
      pre_sql: string[]
      table: string[]
      schema: string
      update_key: string[]
      with_no_lock: string
      semantic: number
      batch_size: number
    }
    elastic_search_target: {
      version: string
      column: {
        value: string
        index: number
        is_part: boolean
        name: string
        format: string
        type: string
      }[]
      batch_size: number
      index: string
      key_delimiter: string
    }
    sap_hana_source: {
      visualization: {
        column: string
        start_value: string
        start_condition: string
        end_value: string
        end_condition: string
      }
      table: string[]
      split_pk: string
      schema: string
      express: string
      where: string
      condition_type: number
      mapping_type: number
      column: {
        index: number
        format: string
        is_part: boolean
        name: string
        type: string
        value: string
      }[]
    }
    click_house_source: {
      express: string
      where: string
      condition_type: number
      column: {
        is_part: boolean
        type: string
        name: string
        index: number
        format: string
        value: string
      }[]
      mapping_type: number
      split_pk: string
      visualization: {
        end_condition: string
        column: string
        end_value: string
        start_value: string
        start_condition: string
      }
      schema: string
      table: string[]
    }
    redis_target: {
      value_field_delimiter: string
      timeout: number
      date_format: string
      database: number
      key_field_delimiter: string
      mode: string
      keyIndexes: number[]
      expire_time: number
      type: number
    }
  }
  channel_control: {
    bytes: number
    rate: number
    record_num: number
    percentage: number
    parallelism: number
  }
  target_id: string
  job_content: string
  job_mode: number
  cluster_id: string
  source_id: string
}
export type SyncJobVersionManageGetSyncJobVersionScheduleType = {
  started: number
  ended: number
  express: string
  parameters: {
    key: string
    value: string
  }[]
  schedule_policy: number
  executed: number
  period_type: string
  concurrency_policy: number
  timeout: number
}
export type SyncJobVersionManageListSyncJobVersionsType = {
  has_more: boolean
  infos: {
    status: number
    target_type: number
    desc: string
    version: string
    source_type: number
    id: string
    created: number
    name: string
    pid: string
    type: number
    updated: number
    is_directory: boolean
    created_by: string
    space_id: string
  }[]
  total: number
}
export type SyncJobDevManageGetSyncJobScheduleType = {
  executed: number
  express: string
  parameters: {
    key: string
    value: string
  }[]
  concurrency_policy: number
  timeout: number
  period_type: string
  schedule_policy: number
  ended: number
  started: number
}
export type SyncJobDevManageDescribeSyncConnectionType = {
  info: {
    message: string
    source_id: string
    cluster_id: string
    status: number
    elapse: number
    result: number
    created: number
    space_id: string
    target_id: string
    job_id: string
  }
}
export type SyncJobDevManageDescribeSyncJobType = {
  pid: string
  is_directory: boolean
  name: string
  version: string
  created_by: string
  created: number
  updated: number
  status: number
  type: number
  space_id: string
  target_type: number
  desc: string
  source_type: number
  id: string
}
export type SyncJobDevManageGenerateJobJsonType = {
  sync_job_script: string
}
export type SyncJobDevManageGetSyncJobConfType = {
  channel_control: {
    bytes: number
    parallelism: number
    percentage: number
    rate: number
    record_num: number
  }
  job_content: string
  source_id: string
  cluster_id: string
  sync_resource: {
    hbase_source: {
      table: {
        table_name: string
      }
      parameter: {
        hadoopConfig: string
        change_log: string
        scan_batch_size: number
        encoding: string
        hbaseConfig: string
        scan_cache_size: number
        column: {
          name: string
          format: string
          type: string
          index: number
          is_part: boolean
          value: string
        }[]
        range: {
          end_row_key: string
          is_binary_rowkey: boolean
          start_row_key: string
        }
      }
      name: string
    }
    kafka_target: {
      consumer_settings: {
        auto_commit_enable: string
      }
      tableFields: {
        is_part: boolean
        index: number
        name: string
        type: string
        format: string
        value: string
      }[]
      topic: string
    }
    hbase_target: {
      parameter: {
        version_column_index: number
        change_log: string
        scan_batch_size: number
        hbase_config: string
        wal_flag: boolean
        write_buffer_size: number
        null_mode: string
        column: {
          is_part: boolean
          name: string
          index: number
          value: string
          format: string
          type: string
        }[]
        rowkey_express: string
        scan_cache_size: number
        version_column_value: string
      }
      table: {
        table_name: string
      }
      name: string
    }
    pg_wal_source: {
      status_interval: number
      slot_name: string
      paving_data: boolean
      temporary: boolean
      lsn: number
      table_list: string[]
      slot_available: boolean
      allow_created: boolean
      database_name: string
    }
    click_house_source: {
      schema: string
      visualization: {
        end_condition: string
        column: string
        start_value: string
        start_condition: string
        end_value: string
      }
      split_pk: string
      express: string
      condition_type: number
      where: string
      column: {
        type: string
        format: string
        value: string
        name: string
        index: number
        is_part: boolean
      }[]
      table: string[]
      mapping_type: number
    }
    db2_source: {
      where: string
      column: {
        is_part: boolean
        format: string
        name: string
        index: number
        type: string
        value: string
      }[]
      visualization: {
        start_condition: string
        end_value: string
        column: string
        start_value: string
        end_condition: string
      }
      condition_type: number
      mapping_type: number
      schema: string
      express: string
      split_pk: string
      table: string[]
    }
    hive_target: {
      column: {
        type: string
        key: string
      }[]
      file_type: number
      encoding: number
      compress: number
      tables_column: string
      field_delimiter: string
      partition_type: number
      partition: string
      use_partition: boolean
      write_mode: number
      table: string
    }
    mysql_source: {
      express: string
      where: string
      table: string[]
      mapping_type: number
      split_pk: string
      column: {
        name: string
        format: string
        is_part: boolean
        index: number
        type: string
        value: string
      }[]
      condition_type: number
      schema: string
      visualization: {
        end_condition: string
        column: string
        end_value: string
        start_value: string
        start_condition: string
      }
    }
    oracle_source: {
      where: string
      split_pk: string
      condition_type: number
      express: string
      schema: string
      table: string[]
      column: {
        format: string
        is_part: boolean
        type: string
        index: number
        name: string
        value: string
      }[]
      mapping_type: number
      visualization: {
        start_value: string
        end_value: string
        column: string
        start_condition: string
        end_condition: string
      }
    }
    postgresql_target: {
      write_mode: number
      table: string[]
      semantic: number
      column: {
        name: string
        format: string
        index: number
        type: string
        value: string
        is_part: boolean
      }[]
      schema: string
      batch_size: number
      with_no_lock: string
      post_sql: string[]
      update_key: string[]
      pre_sql: string[]
    }
    oracle_target: {
      with_no_lock: string
      schema: string
      batch_size: number
      column: {
        value: string
        type: string
        is_part: boolean
        name: string
        format: string
        index: number
      }[]
      table: string[]
      semantic: number
      pre_sql: string[]
      post_sql: string[]
      write_mode: number
      update_key: string[]
    }
    redis_target: {
      expire_time: number
      value_field_delimiter: string
      type: number
      date_format: string
      database: number
      keyIndexes: number[]
      mode: string
      timeout: number
      key_field_delimiter: string
    }
    ftp_source: {
      connect_pattern: string
      encoding: string
      column: {
        is_part: boolean
        format: string
        index: number
        name: string
        value: string
        type: string
      }[]
      control_encoding: string
      compress_type: string
      path: string
      file_config: string
      field_delimiter: string
      private_key_path: string
      file_type: string
      timeout: string
      is_first_line_header: boolean
    }
    binlog_source: {
      cat: string
      split_update: boolean
      is_gtid_mode: boolean
      table: string[]
      paving_data: boolean
      query_timeout: number
      filter: string
      connect_timeout: number
      schema: string
      start: {
        position: number
        timestamp: number
        journal_name: string
      }
    }
    postgresql_source: {
      express: string
      split_pk: string
      where: string
      column: {
        index: number
        format: string
        is_part: boolean
        name: string
        type: string
        value: string
      }[]
      table: string[]
      condition_type: number
      visualization: {
        start_condition: string
        start_value: string
        column: string
        end_value: string
        end_condition: string
      }
      schema: string
      mapping_type: number
    }
    click_house_target: {
      post_sql: string[]
      batch_size: number
      write_mode: number
      column: {
        format: string
        name: string
        index: number
        is_part: boolean
        value: string
        type: string
      }[]
      update_key: string[]
      with_no_lock: string
      schema: string
      pre_sql: string[]
      semantic: number
      table: string[]
    }
    elastic_search_target: {
      version: string
      batch_size: number
      key_delimiter: string
      column: {
        is_part: boolean
        value: string
        index: number
        format: string
        type: string
        name: string
      }[]
      index: string
    }
    ftp_target: {
      private_key_path: string
      control_encoding: string
      column: {
        index: number
        format: string
        is_part: boolean
        name: string
        type: string
        value: string
      }[]
      field_delimiter: string
      is_first_line_header: boolean
      timeout: number
      encoding: string
      connect_pattern: string
      path: string
      ftp_file_name: string
    }
    elastic_search_source: {
      version: string
      batch_size: number
      index: string
      column: {
        name: string
        format: string
        index: number
        type: string
        value: string
        is_part: boolean
      }[]
    }
    sql_server_cdc_source: {
      split_update: boolean
      cat: string
      lsn: string
      poll_interval: number
      paving_data: boolean
      table_list: string[]
      database_name: string
    }
    kafka_source: {
      mode: string
      timestamp: number
      topic: string
      consumer_settings: {
        auto_commit_enable: string
      }
      encoding: string
      codec: string
      group_id: string
      column: {
        name: string
        is_part: boolean
        value: string
        type: string
        index: number
        format: string
      }[]
      offset: string
    }
    sqlserver_source: {
      where: string
      mapping_type: number
      condition_type: number
      table: string[]
      schema: string
      split_pk: string
      column: {
        name: string
        is_part: boolean
        type: string
        index: number
        format: string
        value: string
      }[]
      express: string
      visualization: {
        start_value: string
        end_value: string
        start_condition: string
        end_condition: string
        column: string
      }
    }
    sap_hana_target: {
      update_key: string[]
      semantic: number
      write_mode: number
      column: {
        index: number
        value: string
        is_part: boolean
        name: string
        format: string
        type: string
      }[]
      table: string[]
      batch_size: number
      pre_sql: string[]
      schema: string
      post_sql: string[]
      with_no_lock: string
    }
    hdfs_source: {
      column: {
        type: string
        format: string
        index: number
        value: string
        is_part: boolean
        name: string
      }[]
      encoding: number
      field_delimiter: string
      path: string
      file_type: number
      filter_regex: string
    }
    mongodb_source: {
      database: string
      fetch_size: number
      collection_name: string
      column: {
        value: string
        format: string
        name: string
        type: string
        is_part: boolean
        index: number
      }[]
      filter: string
    }
    sap_hana_source: {
      visualization: {
        end_value: string
        start_value: string
        start_condition: string
        column: string
        end_condition: string
      }
      where: string
      condition_type: number
      schema: string
      table: string[]
      mapping_type: number
      column: {
        value: string
        format: string
        index: number
        type: string
        name: string
        is_part: boolean
      }[]
      express: string
      split_pk: string
    }
    logminer_source: {
      support_auto_add_log: boolean
      table: string[]
      query_timeout: number
      start_scn: string
      paving_data: boolean
      start_time: number
      read_position: string
      split_update: boolean
      cat: string
      fetch_size: number
    }
    db2_target: {
      post_sql: string[]
      column: {
        index: number
        format: string
        is_part: boolean
        name: string
        value: string
        type: string
      }[]
      table: string[]
      semantic: number
      update_key: string[]
      with_no_lock: string
      write_mode: number
      schema: string
      batch_size: number
      pre_sql: string[]
    }
    hdfs_target: {
      compress: number
      file_name: string
      write_mode: number
      path: string
      field_delimiter: string
      file_type: number
      encoding: number
      column: {
        is_part: boolean
        format: string
        type: string
        value: string
        name: string
        index: number
      }[]
    }
    mysql_target: {
      column: {
        is_part: boolean
        name: string
        type: string
        index: number
        value: string
        format: string
      }[]
      batch_size: number
      post_sql: string[]
      update_key: string[]
      pre_sql: string[]
      schema: string
      write_mode: number
      semantic: number
      table: string[]
      with_no_lock: string
    }
    mongodb_target: {
      collection_name: string
      column: {
        index: number
        value: string
        is_part: boolean
        type: string
        format: string
        name: string
      }[]
      replace_key: string
      batch_size: number
      database: string
      flush_interval_mills: number
      write_mode: number
    }
    sqlserver_target: {
      schema: string
      with_no_lock: string
      batch_size: number
      update_key: string[]
      pre_sql: string[]
      column: {
        type: string
        name: string
        index: number
        value: string
        is_part: boolean
        format: string
      }[]
      table: string[]
      semantic: number
      post_sql: string[]
      write_mode: number
    }
  }
  target_id: string
  job_mode: number
}
export type SyncJobDevManageListSyncJobsType = {
  infos: {
    desc: string
    space_id: string
    is_directory: boolean
    created_by: string
    name: string
    updated: number
    source_type: number
    version: string
    created: number
    id: string
    pid: string
    target_type: number
    status: number
    type: number
  }[]
  has_more: boolean
  total: number
}
export type SyncJobDevManagePingSyncJobConnectionType = {
  info: {
    source_id: string
    job_id: string
    cluster_id: string
    result: number
    message: string
    target_id: string
    space_id: string
    status: number
    created: number
    elapse: number
  }
}
export type RoleManageListSystemRolePermissionsType = {
  infos: {
    api_lists: {
      permissions: {
        allowed: boolean
        system_role: {
          id: string
          name: string
          type: number
        }
      }[]
      display_name: string
      perm_type: number
      api_name: string
    }[]
    id: string
    classify: number
    name: string
  }[]
}
export type RoleManageListSystemRolesType = {
  infos: {
    name: string
    id: string
    type: number
  }[]
}
export type StreamJobDevMangeListStreamJobsType = {
  has_more: boolean
  infos: {
    name: string
    version: string
    created_by: string
    pid: string
    id: string
    is_directory: boolean
    status: number
    space_id: string
    desc: string
    type: number
    updated: number
    created: number
  }[]
  total: number
}
export type StreamJobDevMangeDescribeStreamJobType = {
  updated: number
  is_directory: boolean
  pid: string
  desc: string
  name: string
  id: string
  type: number
  version: string
  status: number
  created: number
  created_by: string
  space_id: string
}
export type StreamJobDevMangeGetStreamJobArgsType = {
  cluster_id: string
  built_in_connectors: string[]
  delete_cluster_id: string
  delete_files: string[]
  files: string[]
  parallelism: number
}
export type StreamJobDevMangeGetStreamJobCodeType = {
  sql: {
    code: string
  }
  operators: {
    upstream: string
    type: number
    name: string
    down_stream: string
    id: string
    upstream_right: string
    point_x: number
    point_y: number
    property: {
      order_by: {
        column: {
          order: string
          field: string
        }[]
      }
      source: {
        custom_column: {
          func: string
          type: string
          as: string
          field: string
        }[]
        distinct: string
        table_as: string
        table_id: string
        time_column: {
          type: string
          func: string
          field: string
          as: string
        }[]
        column: {
          type: string
          as: string
          func: string
          field: string
        }[]
      }
      join: {
        table_as_right: string
        column: {
          type: string
          func: string
          as: string
          field: string
        }[]
        table_as: string
        generate_column: {
          field: string
          func: string
          as: string
          type: string
        }[]
        args: string
        expression: string
        join: string
      }
      limit: {
        limit: number
      }
      except: {}
      dimension: {
        column: {
          func: string
          type: string
          field: string
          as: string
        }[]
        table_as: string
        table_id: string
        time_column: {
          func: string
          type: string
          field: string
          as: string
        }
        custom_column: {
          func: string
          as: string
          field: string
          type: string
        }[]
        distinct: string
      }
      udtf: {
        args: string
        column: {
          type: string
          field: string
          as: string
          func: string
        }[]
        udf_id: string
        table_as: string
        select_column: {
          as: string
          field: string
          func: string
          type: string
        }[]
      }
      having: {
        having: string
      }
      intersect: {}
      filter: {
        in: string
        exists: string
        expression: string
        where: string
      }
      group_by: {
        group_by: string[]
      }
      fetch: {
        fetch: number
      }
      const: {
        table: string
        column: {
          func: string
          field: string
          type: string
          as: string
        }[]
      }
      offset: {
        offset: number
      }
      udttf: {
        udf_id: string
        args: string
        column: {
          as: string
          func: string
          type: string
          field: string
        }[]
      }
      dest: {
        table_id: string
        columns: string[]
      }
      values: {
        rows: {
          values: string[]
        }[]
      }
      union: {
        all: boolean
      }
    }
  }[]
  type: number
  python: {
    code: string
  }
  jar: {
    delete_file_id: string
    jar_args: string
    file_id: string
    jar_entry: string
  }
}
export type StreamJobDevMangeGetStreamJobScheduleType = {
  express: string
  retry_interval: number
  timeout: number
  period_type: string
  concurrency_policy: number
  executed: number
  ended: number
  started: number
  retry_limit: number
  retry_policy: number
  schedule_policy: number
}
export type StreamJobDevMangeListBuiltInConnectorsType = {
  items: string[]
}
export type StreamJobDevMangeStreamJobCodeSyntaxType = {
  result: number
  message: string
}
export type StreamJobVersionManageDescribeStreamJobVersionType = {
  id: string
  created_by: string
  space_id: string
  pid: string
  is_directory: boolean
  name: string
  status: number
  updated: number
  created: number
  desc: string
  version: string
  type: number
}
export type StreamJobVersionManageGetStreamJobVersionArgsType = {
  delete_cluster_id: string
  files: string[]
  built_in_connectors: string[]
  parallelism: number
  cluster_id: string
  delete_files: string[]
}
export type StreamJobVersionManageGetStreamJobVersionCodeType = {
  sql: {
    code: string
  }
  jar: {
    jar_entry: string
    file_id: string
    jar_args: string
    delete_file_id: string
  }
  python: {
    code: string
  }
  operators: {
    upstream_right: string
    id: string
    down_stream: string
    point_x: number
    type: number
    property: {
      udtf: {
        args: string
        udf_id: string
        select_column: {
          field: string
          type: string
          func: string
          as: string
        }[]
        column: {
          as: string
          func: string
          field: string
          type: string
        }[]
        table_as: string
      }
      udttf: {
        udf_id: string
        args: string
        column: {
          as: string
          func: string
          field: string
          type: string
        }[]
      }
      const: {
        column: {
          as: string
          type: string
          func: string
          field: string
        }[]
        table: string
      }
      union: {
        all: boolean
      }
      limit: {
        limit: number
      }
      values: {
        rows: {
          values: string[]
        }[]
      }
      intersect: {}
      dest: {
        columns: string[]
        table_id: string
      }
      dimension: {
        distinct: string
        table_as: string
        custom_column: {
          type: string
          func: string
          field: string
          as: string
        }[]
        column: {
          field: string
          func: string
          type: string
          as: string
        }[]
        table_id: string
        time_column: {
          as: string
          field: string
          type: string
          func: string
        }
      }
      except: {}
      group_by: {
        group_by: string[]
      }
      order_by: {
        column: {
          field: string
          order: string
        }[]
      }
      source: {
        table_id: string
        time_column: {
          func: string
          type: string
          field: string
          as: string
        }[]
        table_as: string
        distinct: string
        column: {
          func: string
          as: string
          field: string
          type: string
        }[]
        custom_column: {
          field: string
          as: string
          type: string
          func: string
        }[]
      }
      filter: {
        expression: string
        exists: string
        in: string
        where: string
      }
      join: {
        column: {
          type: string
          as: string
          func: string
          field: string
        }[]
        expression: string
        args: string
        generate_column: {
          field: string
          type: string
          as: string
          func: string
        }[]
        join: string
        table_as: string
        table_as_right: string
      }
      offset: {
        offset: number
      }
      having: {
        having: string
      }
      fetch: {
        fetch: number
      }
    }
    point_y: number
    name: string
    upstream: string
  }[]
  type: number
}
export type StreamJobVersionManageGetStreamJobVersionScheduleType = {
  retry_limit: number
  concurrency_policy: number
  express: string
  ended: number
  timeout: number
  period_type: string
  retry_interval: number
  retry_policy: number
  started: number
  schedule_policy: number
  executed: number
}
export type StreamJobVersionManageListStreamJobVersionsType = {
  infos: {
    version: string
    pid: string
    created_by: string
    created: number
    space_id: string
    status: number
    type: number
    is_directory: boolean
    name: string
    updated: number
    desc: string
    id: string
  }[]
  has_more: boolean
  total: number
}
export type StreamJobInstanceManageDescribeFlinkUIByInstanceIdType = {
  web_ui: string
}
export type StreamJobInstanceManageListStreamInstancesType = {
  has_more: boolean
  total: number
  infos: {
    id: string
    job_id: string
    updated: number
    created: number
    state: number
    version: string
    status: number
    message: string
    space_id: string
  }[]
}
export type StreamJobReleaseManageListReleaseStreamJobsType = {
  infos: {
    created: number
    id: string
    status: number
    name: string
    type: number
    space_id: string
    created_by: string
    desc: string
    version: string
    updated: number
  }[]
  total: number
  has_more: boolean
}
export type AlertManageCreateAlertPolicyType = {
  id: string
}
export type AlertManageDescribeAlertPolicyType = {
  notification_ids: string
  monitor_object: number
  monitor_item: {
    stream_job: {
      instance_timeout: number
      instance_run_failed: boolean
      instance_run_timeout: boolean
    }
    sync_job: {
      instance_timeout: number
      instance_run_timeout: boolean
      instance_run_failed: boolean
    }
  }
  space_id: string
  trigger_rule: number
  name: string
  id: string
  status: number
  updated: number
  created: number
  desc: string
  notification_lists: {
    notification_list_id: string
    items: {
      content: string
      create_time: string
      notification_item_type: string
      notification_item_id: string
      verified: number
    }[]
    create_time: string
    owner: string
    notification_list_name: string
  }[]
  trigger_action: number
  created_by: string
}
export type AlertManageListAlertPoliciesType = {
  has_more: boolean
  infos: {
    monitor_object: number
    notification_ids: string
    trigger_rule: number
    desc: string
    monitor_item: {
      stream_job: {
        instance_run_timeout: boolean
        instance_timeout: number
        instance_run_failed: boolean
      }
      sync_job: {
        instance_timeout: number
        instance_run_failed: boolean
        instance_run_timeout: boolean
      }
    }
    status: number
    space_id: string
    id: string
    updated: number
    created_by: string
    name: string
    created: number
    notification_lists: {
      owner: string
      items: {
        create_time: string
        verified: number
        notification_item_id: string
        content: string
        notification_item_type: string
      }[]
      notification_list_id: string
      create_time: string
      notification_list_name: string
    }[]
    trigger_action: number
  }[]
  total: number
}
export type AlertManageListAlertPoliciesByJobType = {
  infos: {
    name: string
    id: string
    notification_ids: string
    space_id: string
    created: number
    trigger_action: number
    monitor_object: number
    notification_lists: {
      notification_list_id: string
      items: {
        notification_item_id: string
        create_time: string
        notification_item_type: string
        content: string
        verified: number
      }[]
      notification_list_name: string
      create_time: string
      owner: string
    }[]
    trigger_rule: number
    status: number
    updated: number
    desc: string
    monitor_item: {
      sync_job: {
        instance_run_timeout: boolean
        instance_timeout: number
        instance_run_failed: boolean
      }
      stream_job: {
        instance_run_failed: boolean
        instance_run_timeout: boolean
        instance_timeout: number
      }
    }
    created_by: string
  }[]
  has_more: boolean
  total: number
}
export type AlertManageListJobsByAlertPolicyType = {
  total: number
  stream_jobs: {
    id: string
    created: number
    created_by: string
    pid: string
    status: number
    is_directory: boolean
    type: number
    version: string
    desc: string
    name: string
    updated: number
    space_id: string
  }[]
  sync_jobs: {
    source_type: number
    space_id: string
    type: number
    updated: number
    version: string
    is_directory: boolean
    id: string
    status: number
    target_type: number
    name: string
    pid: string
    created: number
    created_by: string
    desc: string
  }[]
  has_more: boolean
}
export type PlatformManageDescribePlatformConfigType = {
  documents_address: string
  work_in_iaas: boolean
  enable_network: boolean
}
export type SpaceManageCreateWorkspaceType = {
  id: string
}
export type SpaceManageDescribeResourceBindingType = {
  infos: {
    sync_job: {
      type: number
      created_by: string
      updated: number
      version: string
      is_directory: boolean
      pid: string
      space_id: string
      created: number
      desc: string
      source_type: number
      id: string
      status: number
      target_type: number
      name: string
    }[]
    stream_job: {
      space_id: string
      updated: number
      id: string
      created_by: string
      is_directory: boolean
      status: number
      desc: string
      name: string
      version: string
      pid: string
      type: number
      created: number
    }[]
    stream_job_release: {
      desc: string
      name: string
      pid: string
      space_id: string
      updated: number
      version: string
      id: string
      is_directory: boolean
      type: number
      created: number
      created_by: string
      status: number
    }[]
    id: string
    flink_cluster: {
      task_num: number
      status: number
      web_ui: string
      id: string
      network_id: string
      task_cu: unknown
      network_info: {
        updated: number
        created_by: string
        vxnet_id: string
        id: string
        space_id: string
        status: number
        router_id: string
        created: number
        name: string
      }
      host_aliases: {
        items: {
          ip: string
          hostname: string
        }[]
      }
      config: {
        custom: {
          value: string
          key: string
        }[]
        logger: {
          root_log_level: string
        }
        restart_strategy: {
          restart_strategy: string
          failure_rate_failure_rate_interval: number
          failure_rate_max_failures_per_interval: number
          failure_rate_delay: number
          fixed_delay_attempts: number
          fixed_delay_delay: number
        }
      }
      created: number
      created_by: string
      space_id: string
      job_cu: unknown
      version: string
      name: string
      updated: number
    }[]
    sync_job_release: {
      desc: string
      updated: number
      space_id: string
      type: number
      version: string
      id: string
      is_directory: boolean
      target_type: number
      source_type: number
      status: number
      created: number
      pid: string
      name: string
      created_by: string
    }[]
  }[]
}
export type SpaceManageDescribeWorkspaceType = {
  created: number
  name: string
  owner: string
  status: number
  id: string
  updated: number
  desc: string
}
export type SpaceManageDescribeWorkspaceQuotaType = {
  quota_set: {
    custom_role: {
      limit: number
    }
    file: {
      size_total: number
      limit: number
      size: number
    }
    flink_cluster: {
      cu_total: unknown
      cu: unknown
      limit: number
    }
    member: {
      limit: number
    }
    sync_job: {
      limit: number
    }
    workspace: {
      limit: number
    }
    network: {
      limit: number
    }
    data_source: {
      limit: number
    }
    stream_job: {
      limit: number
    }
    udf: {
      limit: number
    }
  }
  space_id: string
}
export type SpaceManageListMemberWorkspacesType = {
  infos: {
    updated: number
    created: number
    name: string
    owner: string
    desc: string
    id: string
    status: number
  }[]
  total: number
  has_more: boolean
}
export type SpaceManageListWorkspacesType = {
  total: number
  infos: {
    name: string
    owner: string
    status: number
    desc: string
    created: number
    id: string
    updated: number
  }[]
  has_more: boolean
}
export type MemberManageDescribeMemberType = {
  desc: string
  system_role_ids: string
  updated: number
  user_id: string
  created_by: string
  system_roles: {
    id: string
    type: number
    name: string
  }[]
  user_info: {
    user_id: string
    lang: string
    password: string
    zones: string[]
    privilege: number
    role: string
    user_name: string
    email: string
    status: string
    gravatar_email: string
    currency: string
    phone: string
    regions: string[]
  }
  custom_role_ids: string
  status: number
  space_id: string
  created: number
}
export type MemberManageDescribeMemberQuotaType = {
  user_id: string
  space_id: string
  quota_set: {
    file: {
      limit: number
      size_total: number
      size: number
    }
    member: {
      limit: number
    }
    udf: {
      limit: number
    }
    workspace: {
      limit: number
    }
    custom_role: {
      limit: number
    }
    data_source: {
      limit: number
    }
    sync_job: {
      limit: number
    }
    flink_cluster: {
      cu: unknown
      cu_total: unknown
      limit: number
    }
    network: {
      limit: number
    }
    stream_job: {
      limit: number
    }
  }
}
export type MemberManageListMembersType = {
  total: number
  infos: {
    status: number
    system_roles: {
      name: string
      id: string
      type: number
    }[]
    updated: number
    user_info: {
      currency: string
      role: string
      privilege: number
      status: string
      user_id: string
      phone: string
      user_name: string
      gravatar_email: string
      zones: string[]
      regions: string[]
      email: string
      lang: string
      password: string
    }
    space_id: string
    created: number
    created_by: string
    custom_role_ids: string
    desc: string
    user_id: string
    system_role_ids: string
  }[]
  has_more: boolean
}
export type StatManageGetPeriodicTasksDispatchCountType = {
  infos: {
    updated: number
    flow_count: number
    instance_id: number
  }[]
}
export type StatManageGetPeriodicTasksErrorRankingType = {
  total: number
  infos: {
    job_id: string
    error_count: number
    version: string
  }[]
}
export type StatManageGetPeriodicTasksExecutingStatisticsType = {
  yesterday: {
    instance_count: number
    hour: number
  }[]
  history: {
    instance_count: number
    hour: number
  }[]
  today: {
    hour: number
    instance_count: number
  }[]
}
export type StatManageGetPeriodicTasksRuntimeRankingType = {
  total: number
  infos: {
    job_id: string
    version: string
    running_time: number
    id: string
  }[]
}
export type StatManageGetPeriodicTasksStatusStatisticsType = {
  infos: {
    state: number
    count: number
  }[]
}
export type DataSourceManageCreateDataSourceType = {
  id: string
}
export type DataSourceManageDescribeDataSourceType = {
  created_by: string
  type: number
  desc: string
  name: string
  space_id: string
  updated: number
  created: number
  id: string
  url: {
    sap_hana: {
      host: string
      password: string
      database: string
      port: number
      user: string
    }
    s3: {}
    clickhouse: {
      database: string
      host: string
      user: string
      password: string
      port: number
    }
    sqlserver: {
      user: string
      password: string
      host: string
      database: string
      port: number
    }
    postgresql: {
      password: string
      user: string
      host: string
      port: number
      database: string
    }
    redis: {
      password: string
      hosts: {
        port: number
        host: string
      }[]
    }
    mysql: {
      port: number
      user: string
      password: string
      database: string
      host: string
    }
    kafka: {
      kafka_brokers: {
        host: string
        port: number
      }[]
    }
    hive: {
      host: string
      port: number
      config: string
      password: string
      database: string
      user: string
      defaultFS: string
    }
    mongo_db: {
      hosts: {
        port: number
        host: string
      }[]
      database: string
      password: string
      user: string
    }
    hbase: {
      config: string
    }
    elastic_search: {
      port: number
      password: string
      version: string
      user: string
      host: string
    }
    ftp: {
      host: string
      connection_mode: number
      port: number
      private_key: string
      protocol: number
      user: string
      password: string
    }
    hdfs: {
      port: number
      name_node: string
      config: string
    }
    oracle: {
      host: string
      password: string
      database: string
      port: number
      user: string
    }
    db2: {
      password: string
      database: string
      port: number
      user: string
      host: string
    }
  }
  last_connection: {
    message: string
    network_info: {
      name: string
      id: string
      created_by: string
      router_id: string
      status: number
      vxnet_id: string
      space_id: string
      created: number
      updated: number
    }
    created: number
    network_id: string
    space_id: string
    source_id: string
    result: number
    status: number
    elapse: number
  }
  status: number
}
export type DataSourceManageDescribeDataSourceKindsType = {
  kinds: {
    name: string
  }[]
}
export type DataSourceManageDescribeDataSourceTableSchemaType = {
  schema: {
    columns: {
      is_primary_key: boolean
      name: string
      type: string
    }[]
  }
}
export type DataSourceManageDescribeDataSourceTablesType = {
  items: string[]
}
export type DataSourceManageListDataSourceConnectionsType = {
  total: number
  has_more: boolean
  infos: {
    result: number
    space_id: string
    elapse: number
    network_id: string
    network_info: {
      id: string
      updated: number
      created: number
      created_by: string
      vxnet_id: string
      router_id: string
      name: string
      space_id: string
      status: number
    }
    source_id: string
    message: string
    created: number
    status: number
  }[]
}
export type DataSourceManageListDataSourcesType = {
  total: number
  has_more: boolean
  infos: {
    desc: string
    created_by: string
    id: string
    last_connection: {
      result: number
      elapse: number
      space_id: string
      status: number
      network_id: string
      source_id: string
      created: number
      message: string
      network_info: {
        name: string
        status: number
        space_id: string
        id: string
        updated: number
        created: number
        created_by: string
        router_id: string
        vxnet_id: string
      }
    }
    space_id: string
    url: {
      elastic_search: {
        user: string
        host: string
        version: string
        port: number
        password: string
      }
      clickhouse: {
        host: string
        password: string
        database: string
        user: string
        port: number
      }
      hdfs: {
        port: number
        name_node: string
        config: string
      }
      sap_hana: {
        password: string
        host: string
        database: string
        user: string
        port: number
      }
      postgresql: {
        user: string
        database: string
        port: number
        password: string
        host: string
      }
      kafka: {
        kafka_brokers: {
          port: number
          host: string
        }[]
      }
      oracle: {
        database: string
        password: string
        user: string
        host: string
        port: number
      }
      hbase: {
        config: string
      }
      mongo_db: {
        database: string
        hosts: {
          port: number
          host: string
        }[]
        password: string
        user: string
      }
      db2: {
        host: string
        database: string
        port: number
        user: string
        password: string
      }
      redis: {
        hosts: {
          port: number
          host: string
        }[]
        password: string
      }
      s3: {}
      hive: {
        defaultFS: string
        host: string
        config: string
        user: string
        database: string
        port: number
        password: string
      }
      sqlserver: {
        port: number
        password: string
        host: string
        user: string
        database: string
      }
      mysql: {
        user: string
        database: string
        host: string
        password: string
        port: number
      }
      ftp: {
        password: string
        connection_mode: number
        host: string
        port: number
        private_key: string
        protocol: number
        user: string
      }
    }
    created: number
    name: string
    status: number
    updated: number
    type: number
  }[]
}
export type DataSourceManagePingDataSourceConnectionType = {
  space_id: string
  status: number
  network_info: {
    vxnet_id: string
    router_id: string
    updated: number
    status: number
    created: number
    name: string
    space_id: string
    id: string
    created_by: string
  }
  source_id: string
  network_id: string
  message: string
  created: number
  result: number
  elapse: number
}
export type ClusterManageCreateFlinkClusterType = {
  id: string
}
export type ClusterManageDescribeFlinkClusterType = {
  name: string
  network_id: string
  created_by: string
  status: number
  task_num: number
  web_ui: string
  id: string
  network_info: {
    space_id: string
    vxnet_id: string
    updated: number
    router_id: string
    id: string
    created: number
    created_by: string
    name: string
    status: number
  }
  host_aliases: {
    items: {
      ip: string
      hostname: string
    }[]
  }
  task_cu: unknown
  updated: number
  config: {
    custom: {
      key: string
      value: string
    }[]
    logger: {
      root_log_level: string
    }
    restart_strategy: {
      failure_rate_failure_rate_interval: number
      fixed_delay_delay: number
      failure_rate_delay: number
      restart_strategy: string
      fixed_delay_attempts: number
      failure_rate_max_failures_per_interval: number
    }
  }
  job_cu: unknown
  version: string
  space_id: string
  created: number
}
export type ClusterManageListAvailableFlinkVersionsType = {
  items: string[]
}
export type ClusterManageListFlinkClustersType = {
  total: number
  infos: {
    host_aliases: {
      items: {
        ip: string
        hostname: string
      }[]
    }
    version: string
    name: string
    updated: number
    network_id: string
    job_cu: unknown
    task_cu: unknown
    created_by: string
    id: string
    config: {
      custom: {
        key: string
        value: string
      }[]
      restart_strategy: {
        failure_rate_delay: number
        failure_rate_max_failures_per_interval: number
        failure_rate_failure_rate_interval: number
        fixed_delay_delay: number
        fixed_delay_attempts: number
        restart_strategy: string
      }
      logger: {
        root_log_level: string
      }
    }
    task_num: number
    web_ui: string
    network_info: {
      created_by: string
      space_id: string
      id: string
      status: number
      vxnet_id: string
      updated: number
      name: string
      router_id: string
      created: number
    }
    status: number
    created: number
    space_id: string
  }[]
  has_more: boolean
}
export type NetworkMangeCreateNetworkType = {
  id: string
}
export type NetworkMangeDescribeNetworkType = {
  space_id: string
  job_cu: unknown
  id: string
  name: string
  created_by: string
  task_num: number
  network_id: string
  created: number
  task_cu: unknown
  web_ui: string
  version: string
  updated: number
  config: {
    restart_strategy: {
      fixed_delay_attempts: number
      failure_rate_delay: number
      failure_rate_failure_rate_interval: number
      fixed_delay_delay: number
      restart_strategy: string
      failure_rate_max_failures_per_interval: number
    }
    custom: {
      key: string
      value: string
    }[]
    logger: {
      root_log_level: string
    }
  }
  host_aliases: {
    items: {
      hostname: string
      ip: string
    }[]
  }
  status: number
  network_info: {
    created_by: string
    space_id: string
    id: string
    status: number
    name: string
    created: number
    updated: number
    vxnet_id: string
    router_id: string
  }
}
export type NetworkMangeListNetworksType = {
  total: number
  has_more: boolean
  infos: {
    status: number
    created: number
    id: string
    created_by: string
    space_id: string
    name: string
    vxnet_id: string
    router_id: string
    updated: number
  }[]
}
