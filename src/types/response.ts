export type AuditManageListOpAuditsType = {
  has_more: boolean
  infos: {
    space_id: string
    state: number
    api_name: string
    user_id: string
    perm_type: number
    created: number
  }[]
}
export type NotifierManageListNotificationsType = {
  notification_lists: {
    create_time: string
    items: {
      verified: number
      notification_item_id: string
      content: string
      notification_item_type: string
      create_time: string
    }[]
    notification_list_id: string
    notification_list_name: string
    owner: string
  }[]
  total: number
}
export type IaaSProxyListIaaSRouterVXNetsType = {
  total: number
  has_more: boolean
  infos: {
    dyn_ipv6_end: string
    vpc_id: string
    ipv6_network: string
    border_id: string
    vxnet_id: string
    owner: string
    ip_network: string
    dyn_ip_end: string
    dyn_ipv6_start: string
    dyn_ip_start: string
    vxnet_name: string
    border_private_ip: string
    manager_ip: string
    mode: number
    router_id: string
  }[]
}
export type IaaSProxyListIaaSRoutersType = {
  total: number
  has_more: boolean
  infos: {
    status_time: string
    is_applied: number
    is_default: number
    dyn_ip_start: string
    dyn_ip_end: string
    vpc_id: string
    private_ip: string
    vpc_network: string
    router_id: string
    base_vxnet: string
    border_private_ip: string
    status: string
    router_type: number
    manager_ip: string
    ip_network: string
    vpc_ipv6_network: string
    owner: string
    router_name: string
    eip: {
      eip_id: string
      eip_name: string
      eip_addr: string
    }
  }[]
}
export type ResourceManageDescribeFileMetaType = {
  etag: string
  space_id: string
  is_directory: boolean
  description: string
  resource_id: string
  created: number
  version: string
  created_by: string
  status: number
  name: string
  size: number
  pid: string
  type: number
  updated: number
}
export type ResourceManageListFileMetasType = {
  has_more: boolean
  total: number
  infos: {
    version: string
    created: number
    name: string
    resource_id: string
    updated: number
    pid: string
    created_by: string
    status: number
    is_directory: boolean
    size: number
    etag: string
    type: number
    description: string
    space_id: string
  }[]
}
export type ResourceManageUploadFileType = {
  id: string
  version: string
}
export type FileManageDescribeFileMetaType = {
  version: string
  desc: string
  id: string
  updated: number
  is_directory: boolean
  pid: string
  created: number
  etag: string
  size: number
  space_id: string
  name: string
  created_by: string
  status: number
}
export type FileManageListFileMetasType = {
  has_more: boolean
  total: number
  infos: {
    created_by: string
    updated: number
    status: number
    version: string
    id: string
    name: string
    pid: string
    size: number
    desc: string
    is_directory: boolean
    etag: string
    created: number
    space_id: string
  }[]
}
export type FileManageUploadFileType = {
  id: string
  version: string
}
export type SyncJobInstanceManageDescribeSyncInstanceType = {
  created: number
  message: string
  state: number
  sync_job: {
    target_type: number
    type: number
    source_type: number
    version: string
    updated: number
    is_directory: boolean
    pid: string
    created: number
    id: string
    name: string
    created_by: string
    desc: string
    space_id: string
    status: number
  }
  job_id: string
  status: number
  id: string
  sync_job_property: {
    space_id: string
    version: string
    id: string
    schedule: {
      period_type: string
      started: number
      timeout: number
      ended: number
      express: string
      parameters: {
        value: string
        key: string
      }[]
      concurrency_policy: number
      schedule_policy: number
      executed: number
    }
    conf: {
      job_mode: number
      target_id: string
      job_content: string
      source_id: string
      cluster_id: string
      channel_control: {
        parallelism: number
        bytes: number
        rate: number
        record_num: number
        percentage: number
      }
      sync_resource: {
        mysql_target: {
          pre_sql: string[]
          semantic: number
          column: {
            type: string
            index: number
            value: string
            format: string
            is_part: boolean
            name: string
          }[]
          batch_size: number
          update_key: string[]
          table: string[]
          write_mode: number
          schema: string
          post_sql: string[]
          with_no_lock: string
        }
        db2_target: {
          column: {
            value: string
            format: string
            index: number
            is_part: boolean
            name: string
            type: string
          }[]
          write_mode: number
          table: string[]
          post_sql: string[]
          pre_sql: string[]
          schema: string
          semantic: number
          with_no_lock: string
          batch_size: number
          update_key: string[]
        }
        sql_server_cdc_source: {
          split_update: boolean
          paving_data: boolean
          cat: string
          poll_interval: number
          database_name: string
          lsn: string
          table_list: string[]
        }
        hdfs_source: {
          column: {
            name: string
            is_part: boolean
            index: number
            type: string
            value: string
            format: string
          }[]
          encoding: number
          file_type: number
          filter_regex: string
          path: string
          field_delimiter: string
        }
        hdfs_target: {
          write_mode: number
          path: string
          file_name: string
          compress: number
          encoding: number
          file_type: number
          column: {
            index: number
            value: string
            is_part: boolean
            name: string
            type: string
            format: string
          }[]
          field_delimiter: string
        }
        postgresql_target: {
          schema: string
          update_key: string[]
          pre_sql: string[]
          write_mode: number
          table: string[]
          with_no_lock: string
          batch_size: number
          post_sql: string[]
          semantic: number
          column: {
            type: string
            value: string
            format: string
            index: number
            is_part: boolean
            name: string
          }[]
        }
        sqlserver_source: {
          column: {
            index: number
            type: string
            name: string
            format: string
            is_part: boolean
            value: string
          }[]
          where: string
          mapping_type: number
          split_pk: string
          condition_type: number
          table: string[]
          express: string
          schema: string
          visualization: {
            end_value: string
            end_condition: string
            start_value: string
            start_condition: string
            column: string
          }
        }
        binlog_source: {
          split_update: boolean
          paving_data: boolean
          start: {
            journal_name: string
            timestamp: number
            position: number
          }
          connect_timeout: number
          filter: string
          schema: string
          table: string[]
          query_timeout: number
          is_gtid_mode: boolean
          cat: string
        }
        click_house_source: {
          where: string
          split_pk: string
          column: {
            is_part: boolean
            value: string
            index: number
            type: string
            name: string
            format: string
          }[]
          visualization: {
            start_condition: string
            start_value: string
            end_value: string
            column: string
            end_condition: string
          }
          mapping_type: number
          schema: string
          table: string[]
          express: string
          condition_type: number
        }
        ftp_target: {
          column: {
            type: string
            index: number
            is_part: boolean
            name: string
            format: string
            value: string
          }[]
          control_encoding: string
          ftp_file_name: string
          encoding: string
          is_first_line_header: boolean
          path: string
          timeout: number
          connect_pattern: string
          field_delimiter: string
          private_key_path: string
        }
        kafka_target: {
          topic: string
          consumer_settings: {
            auto_commit_enable: string
          }
          tableFields: {
            value: string
            is_part: boolean
            name: string
            index: number
            format: string
            type: string
          }[]
        }
        postgresql_source: {
          column: {
            name: string
            value: string
            is_part: boolean
            type: string
            index: number
            format: string
          }[]
          express: string
          condition_type: number
          split_pk: string
          where: string
          schema: string
          mapping_type: number
          visualization: {
            end_value: string
            column: string
            end_condition: string
            start_value: string
            start_condition: string
          }
          table: string[]
        }
        sap_hana_source: {
          split_pk: string
          column: {
            index: number
            format: string
            value: string
            name: string
            type: string
            is_part: boolean
          }[]
          where: string
          mapping_type: number
          visualization: {
            start_condition: string
            end_condition: string
            end_value: string
            start_value: string
            column: string
          }
          express: string
          schema: string
          table: string[]
          condition_type: number
        }
        oracle_source: {
          split_pk: string
          visualization: {
            column: string
            end_value: string
            end_condition: string
            start_condition: string
            start_value: string
          }
          condition_type: number
          where: string
          schema: string
          express: string
          table: string[]
          mapping_type: number
          column: {
            type: string
            is_part: boolean
            value: string
            format: string
            name: string
            index: number
          }[]
        }
        mysql_source: {
          condition_type: number
          mapping_type: number
          schema: string
          split_pk: string
          table: string[]
          express: string
          column: {
            name: string
            value: string
            is_part: boolean
            format: string
            type: string
            index: number
          }[]
          visualization: {
            end_condition: string
            column: string
            end_value: string
            start_condition: string
            start_value: string
          }
          where: string
        }
        db2_source: {
          condition_type: number
          column: {
            format: string
            name: string
            type: string
            value: string
            is_part: boolean
            index: number
          }[]
          split_pk: string
          schema: string
          mapping_type: number
          visualization: {
            column: string
            end_condition: string
            end_value: string
            start_condition: string
            start_value: string
          }
          table: string[]
          express: string
          where: string
        }
        ftp_source: {
          encoding: string
          compress_type: string
          control_encoding: string
          file_config: string
          file_type: string
          connect_pattern: string
          path: string
          timeout: string
          field_delimiter: string
          is_first_line_header: boolean
          private_key_path: string
          column: {
            type: string
            format: string
            is_part: boolean
            value: string
            name: string
            index: number
          }[]
        }
        elastic_search_target: {
          batch_size: number
          column: {
            format: string
            name: string
            is_part: boolean
            index: number
            type: string
            value: string
          }[]
          key_delimiter: string
          index: string
          version: string
        }
        hive_target: {
          partition_type: number
          write_mode: number
          table: string
          tables_column: string
          column: {
            key: string
            type: string
          }[]
          field_delimiter: string
          file_type: number
          use_partition: boolean
          partition: string
          compress: number
          encoding: number
        }
        pg_wal_source: {
          table_list: string[]
          slot_available: boolean
          slot_name: string
          lsn: number
          status_interval: number
          temporary: boolean
          allow_created: boolean
          database_name: string
          paving_data: boolean
        }
        sqlserver_target: {
          with_no_lock: string
          post_sql: string[]
          table: string[]
          batch_size: number
          schema: string
          semantic: number
          update_key: string[]
          pre_sql: string[]
          write_mode: number
          column: {
            type: string
            value: string
            is_part: boolean
            format: string
            name: string
            index: number
          }[]
        }
        mongodb_target: {
          batch_size: number
          column: {
            format: string
            name: string
            is_part: boolean
            type: string
            value: string
            index: number
          }[]
          collection_name: string
          flush_interval_mills: number
          replace_key: string
          database: string
          write_mode: number
        }
        kafka_source: {
          mode: string
          timestamp: number
          consumer_settings: {
            auto_commit_enable: string
          }
          topic: string
          group_id: string
          offset: string
          column: {
            type: string
            value: string
            format: string
            is_part: boolean
            name: string
            index: number
          }[]
          codec: string
          encoding: string
        }
        mongodb_source: {
          column: {
            is_part: boolean
            value: string
            index: number
            type: string
            name: string
            format: string
          }[]
          collection_name: string
          database: string
          fetch_size: number
          filter: string
        }
        hbase_source: {
          name: string
          parameter: {
            scan_cache_size: number
            change_log: string
            hbaseConfig: string
            scan_batch_size: number
            range: {
              end_row_key: string
              is_binary_rowkey: boolean
              start_row_key: string
            }
            encoding: string
            column: {
              type: string
              is_part: boolean
              name: string
              format: string
              index: number
              value: string
            }[]
            hadoopConfig: string
          }
          table: {
            table_name: string
          }
        }
        elastic_search_source: {
          column: {
            value: string
            format: string
            name: string
            is_part: boolean
            type: string
            index: number
          }[]
          index: string
          batch_size: number
          version: string
        }
        sap_hana_target: {
          batch_size: number
          pre_sql: string[]
          schema: string
          semantic: number
          column: {
            index: number
            name: string
            type: string
            value: string
            format: string
            is_part: boolean
          }[]
          with_no_lock: string
          post_sql: string[]
          table: string[]
          write_mode: number
          update_key: string[]
        }
        oracle_target: {
          table: string[]
          with_no_lock: string
          column: {
            is_part: boolean
            name: string
            type: string
            format: string
            index: number
            value: string
          }[]
          post_sql: string[]
          pre_sql: string[]
          write_mode: number
          schema: string
          update_key: string[]
          semantic: number
          batch_size: number
        }
        hbase_target: {
          table: {
            table_name: string
          }
          name: string
          parameter: {
            version_column_index: number
            wal_flag: boolean
            change_log: string
            hbase_config: string
            null_mode: string
            version_column_value: string
            scan_cache_size: number
            write_buffer_size: number
            scan_batch_size: number
            column: {
              name: string
              type: string
              value: string
              is_part: boolean
              format: string
              index: number
            }[]
            rowkey_express: string
          }
        }
        logminer_source: {
          cat: string
          split_update: boolean
          paving_data: boolean
          support_auto_add_log: boolean
          fetch_size: number
          read_position: string
          start_time: number
          table: string[]
          start_scn: string
          query_timeout: number
        }
        redis_target: {
          timeout: number
          keyIndexes: number[]
          type: number
          key_field_delimiter: string
          mode: string
          date_format: string
          expire_time: number
          value_field_delimiter: string
          database: number
        }
        click_house_target: {
          pre_sql: string[]
          batch_size: number
          write_mode: number
          schema: string
          column: {
            format: string
            index: number
            is_part: boolean
            name: string
            type: string
            value: string
          }[]
          table: string[]
          post_sql: string[]
          update_key: string[]
          with_no_lock: string
          semantic: number
        }
      }
    }
  }
  version: string
  flink_ui: string
  space_id: string
  updated: number
}
export type SyncJobInstanceManageListSyncInstancesType = {
  total: number
  infos: {
    state: number
    sync_job_property: {
      schedule: {
        parameters: {
          key: string
          value: string
        }[]
        ended: number
        started: number
        express: string
        concurrency_policy: number
        period_type: string
        executed: number
        timeout: number
        schedule_policy: number
      }
      space_id: string
      id: string
      conf: {
        cluster_id: string
        channel_control: {
          bytes: number
          percentage: number
          parallelism: number
          record_num: number
          rate: number
        }
        target_id: string
        job_content: string
        sync_resource: {
          kafka_source: {
            topic: string
            column: {
              is_part: boolean
              type: string
              name: string
              format: string
              index: number
              value: string
            }[]
            group_id: string
            consumer_settings: {
              auto_commit_enable: string
            }
            encoding: string
            offset: string
            codec: string
            mode: string
            timestamp: number
          }
          sap_hana_source: {
            column: {
              is_part: boolean
              name: string
              value: string
              index: number
              type: string
              format: string
            }[]
            table: string[]
            condition_type: number
            split_pk: string
            mapping_type: number
            visualization: {
              column: string
              end_condition: string
              end_value: string
              start_condition: string
              start_value: string
            }
            schema: string
            express: string
            where: string
          }
          oracle_target: {
            update_key: string[]
            post_sql: string[]
            table: string[]
            column: {
              value: string
              format: string
              type: string
              index: number
              is_part: boolean
              name: string
            }[]
            semantic: number
            pre_sql: string[]
            schema: string
            with_no_lock: string
            batch_size: number
            write_mode: number
          }
          mongodb_target: {
            database: string
            collection_name: string
            flush_interval_mills: number
            replace_key: string
            column: {
              format: string
              index: number
              value: string
              is_part: boolean
              type: string
              name: string
            }[]
            write_mode: number
            batch_size: number
          }
          logminer_source: {
            query_timeout: number
            fetch_size: number
            start_time: number
            cat: string
            read_position: string
            support_auto_add_log: boolean
            paving_data: boolean
            split_update: boolean
            start_scn: string
            table: string[]
          }
          postgresql_source: {
            column: {
              is_part: boolean
              format: string
              name: string
              type: string
              value: string
              index: number
            }[]
            schema: string
            express: string
            mapping_type: number
            condition_type: number
            table: string[]
            visualization: {
              start_condition: string
              end_value: string
              start_value: string
              end_condition: string
              column: string
            }
            where: string
            split_pk: string
          }
          oracle_source: {
            schema: string
            mapping_type: number
            split_pk: string
            column: {
              format: string
              name: string
              is_part: boolean
              type: string
              value: string
              index: number
            }[]
            where: string
            table: string[]
            express: string
            condition_type: number
            visualization: {
              end_condition: string
              start_value: string
              column: string
              end_value: string
              start_condition: string
            }
          }
          mongodb_source: {
            database: string
            filter: string
            fetch_size: number
            collection_name: string
            column: {
              is_part: boolean
              name: string
              value: string
              index: number
              type: string
              format: string
            }[]
          }
          db2_target: {
            column: {
              format: string
              name: string
              type: string
              index: number
              is_part: boolean
              value: string
            }[]
            post_sql: string[]
            schema: string
            table: string[]
            batch_size: number
            with_no_lock: string
            semantic: number
            update_key: string[]
            pre_sql: string[]
            write_mode: number
          }
          binlog_source: {
            connect_timeout: number
            split_update: boolean
            start: {
              timestamp: number
              position: number
              journal_name: string
            }
            table: string[]
            filter: string
            cat: string
            paving_data: boolean
            query_timeout: number
            schema: string
            is_gtid_mode: boolean
          }
          elastic_search_target: {
            key_delimiter: string
            version: string
            column: {
              index: number
              name: string
              type: string
              value: string
              is_part: boolean
              format: string
            }[]
            batch_size: number
            index: string
          }
          ftp_source: {
            control_encoding: string
            private_key_path: string
            file_type: string
            file_config: string
            path: string
            connect_pattern: string
            field_delimiter: string
            column: {
              is_part: boolean
              name: string
              index: number
              format: string
              type: string
              value: string
            }[]
            compress_type: string
            is_first_line_header: boolean
            encoding: string
            timeout: string
          }
          hdfs_source: {
            path: string
            encoding: number
            field_delimiter: string
            column: {
              name: string
              format: string
              is_part: boolean
              index: number
              type: string
              value: string
            }[]
            file_type: number
            filter_regex: string
          }
          pg_wal_source: {
            slot_name: string
            table_list: string[]
            temporary: boolean
            paving_data: boolean
            status_interval: number
            allow_created: boolean
            database_name: string
            slot_available: boolean
            lsn: number
          }
          click_house_target: {
            update_key: string[]
            column: {
              value: string
              name: string
              is_part: boolean
              format: string
              type: string
              index: number
            }[]
            semantic: number
            schema: string
            with_no_lock: string
            batch_size: number
            write_mode: number
            table: string[]
            post_sql: string[]
            pre_sql: string[]
          }
          db2_source: {
            visualization: {
              end_condition: string
              start_condition: string
              end_value: string
              start_value: string
              column: string
            }
            condition_type: number
            express: string
            schema: string
            mapping_type: number
            column: {
              format: string
              name: string
              type: string
              is_part: boolean
              index: number
              value: string
            }[]
            split_pk: string
            table: string[]
            where: string
          }
          postgresql_target: {
            write_mode: number
            batch_size: number
            post_sql: string[]
            with_no_lock: string
            update_key: string[]
            pre_sql: string[]
            semantic: number
            table: string[]
            schema: string
            column: {
              value: string
              index: number
              format: string
              type: string
              is_part: boolean
              name: string
            }[]
          }
          sqlserver_source: {
            column: {
              is_part: boolean
              format: string
              value: string
              name: string
              index: number
              type: string
            }[]
            where: string
            express: string
            mapping_type: number
            condition_type: number
            split_pk: string
            visualization: {
              start_condition: string
              end_value: string
              column: string
              end_condition: string
              start_value: string
            }
            table: string[]
            schema: string
          }
          hbase_target: {
            parameter: {
              scan_batch_size: number
              version_column_value: string
              write_buffer_size: number
              hbase_config: string
              rowkey_express: string
              column: {
                format: string
                index: number
                is_part: boolean
                name: string
                type: string
                value: string
              }[]
              version_column_index: number
              wal_flag: boolean
              scan_cache_size: number
              null_mode: string
              change_log: string
            }
            table: {
              table_name: string
            }
            name: string
          }
          hbase_source: {
            name: string
            parameter: {
              range: {
                start_row_key: string
                end_row_key: string
                is_binary_rowkey: boolean
              }
              hbaseConfig: string
              scan_batch_size: number
              column: {
                format: string
                is_part: boolean
                name: string
                value: string
                type: string
                index: number
              }[]
              change_log: string
              encoding: string
              hadoopConfig: string
              scan_cache_size: number
            }
            table: {
              table_name: string
            }
          }
          click_house_source: {
            mapping_type: number
            condition_type: number
            visualization: {
              start_condition: string
              end_condition: string
              end_value: string
              column: string
              start_value: string
            }
            where: string
            express: string
            column: {
              name: string
              is_part: boolean
              type: string
              value: string
              index: number
              format: string
            }[]
            table: string[]
            split_pk: string
            schema: string
          }
          kafka_target: {
            consumer_settings: {
              auto_commit_enable: string
            }
            tableFields: {
              type: string
              index: number
              name: string
              value: string
              format: string
              is_part: boolean
            }[]
            topic: string
          }
          mysql_target: {
            post_sql: string[]
            with_no_lock: string
            table: string[]
            pre_sql: string[]
            semantic: number
            column: {
              is_part: boolean
              format: string
              name: string
              type: string
              value: string
              index: number
            }[]
            schema: string
            update_key: string[]
            write_mode: number
            batch_size: number
          }
          hive_target: {
            write_mode: number
            file_type: number
            compress: number
            field_delimiter: string
            table: string
            encoding: number
            tables_column: string
            column: {
              key: string
              type: string
            }[]
            partition: string
            partition_type: number
            use_partition: boolean
          }
          ftp_target: {
            control_encoding: string
            field_delimiter: string
            timeout: number
            path: string
            connect_pattern: string
            ftp_file_name: string
            is_first_line_header: boolean
            column: {
              name: string
              type: string
              format: string
              index: number
              value: string
              is_part: boolean
            }[]
            private_key_path: string
            encoding: string
          }
          mysql_source: {
            column: {
              type: string
              is_part: boolean
              index: number
              name: string
              value: string
              format: string
            }[]
            condition_type: number
            schema: string
            split_pk: string
            where: string
            express: string
            visualization: {
              end_condition: string
              end_value: string
              column: string
              start_condition: string
              start_value: string
            }
            table: string[]
            mapping_type: number
          }
          redis_target: {
            date_format: string
            key_field_delimiter: string
            database: number
            timeout: number
            mode: string
            keyIndexes: number[]
            expire_time: number
            type: number
            value_field_delimiter: string
          }
          elastic_search_source: {
            column: {
              format: string
              is_part: boolean
              value: string
              index: number
              type: string
              name: string
            }[]
            index: string
            version: string
            batch_size: number
          }
          sap_hana_target: {
            update_key: string[]
            schema: string
            table: string[]
            batch_size: number
            post_sql: string[]
            column: {
              is_part: boolean
              index: number
              name: string
              type: string
              value: string
              format: string
            }[]
            pre_sql: string[]
            with_no_lock: string
            write_mode: number
            semantic: number
          }
          hdfs_target: {
            column: {
              is_part: boolean
              format: string
              name: string
              type: string
              value: string
              index: number
            }[]
            write_mode: number
            path: string
            field_delimiter: string
            encoding: number
            compress: number
            file_name: string
            file_type: number
          }
          sql_server_cdc_source: {
            poll_interval: number
            cat: string
            lsn: string
            split_update: boolean
            table_list: string[]
            database_name: string
            paving_data: boolean
          }
          sqlserver_target: {
            table: string[]
            update_key: string[]
            column: {
              type: string
              name: string
              value: string
              format: string
              index: number
              is_part: boolean
            }[]
            post_sql: string[]
            write_mode: number
            semantic: number
            schema: string
            with_no_lock: string
            batch_size: number
            pre_sql: string[]
          }
        }
        job_mode: number
        source_id: string
      }
      version: string
    }
    version: string
    space_id: string
    created: number
    job_id: string
    message: string
    status: number
    updated: number
    flink_ui: string
    id: string
    sync_job: {
      id: string
      version: string
      pid: string
      space_id: string
      status: number
      created: number
      name: string
      desc: string
      target_type: number
      created_by: string
      is_directory: boolean
      source_type: number
      type: number
      updated: number
    }
  }[]
  has_more: boolean
}
export type SyncJobReleaseManageListReleaseSyncJobsType = {
  has_more: boolean
  infos: {
    name: string
    space_id: string
    desc: string
    status: number
    type: number
    created: number
    version: string
    id: string
    created_by: string
    updated: number
  }[]
  total: number
}
export type SyncJobVersionManageDescribeSyncJobVersionType = {
  is_directory: boolean
  type: number
  created: number
  target_type: number
  version: string
  status: number
  updated: number
  space_id: string
  desc: string
  pid: string
  source_type: number
  created_by: string
  name: string
  id: string
}
export type SyncJobVersionManageGetSyncJobVersionConfType = {
  job_mode: number
  job_content: string
  cluster_id: string
  channel_control: {
    bytes: number
    parallelism: number
    rate: number
    record_num: number
    percentage: number
  }
  sync_resource: {
    postgresql_target: {
      post_sql: string[]
      with_no_lock: string
      pre_sql: string[]
      table: string[]
      write_mode: number
      update_key: string[]
      schema: string
      column: {
        name: string
        value: string
        index: number
        is_part: boolean
        type: string
        format: string
      }[]
      semantic: number
      batch_size: number
    }
    db2_source: {
      condition_type: number
      split_pk: string
      mapping_type: number
      schema: string
      column: {
        type: string
        is_part: boolean
        index: number
        name: string
        format: string
        value: string
      }[]
      where: string
      table: string[]
      visualization: {
        column: string
        end_condition: string
        end_value: string
        start_value: string
        start_condition: string
      }
      express: string
    }
    hive_target: {
      encoding: number
      compress: number
      file_type: number
      partition_type: number
      tables_column: string
      table: string
      column: {
        type: string
        key: string
      }[]
      field_delimiter: string
      write_mode: number
      partition: string
      use_partition: boolean
    }
    mysql_source: {
      where: string
      condition_type: number
      column: {
        index: number
        name: string
        type: string
        format: string
        is_part: boolean
        value: string
      }[]
      schema: string
      table: string[]
      split_pk: string
      mapping_type: number
      visualization: {
        end_value: string
        start_condition: string
        start_value: string
        end_condition: string
        column: string
      }
      express: string
    }
    hbase_source: {
      parameter: {
        hbaseConfig: string
        column: {
          value: string
          is_part: boolean
          index: number
          format: string
          name: string
          type: string
        }[]
        scan_cache_size: number
        encoding: string
        scan_batch_size: number
        change_log: string
        hadoopConfig: string
        range: {
          is_binary_rowkey: boolean
          start_row_key: string
          end_row_key: string
        }
      }
      table: {
        table_name: string
      }
      name: string
    }
    click_house_target: {
      update_key: string[]
      column: {
        is_part: boolean
        index: number
        format: string
        name: string
        type: string
        value: string
      }[]
      batch_size: number
      with_no_lock: string
      pre_sql: string[]
      write_mode: number
      table: string[]
      schema: string
      semantic: number
      post_sql: string[]
    }
    elastic_search_source: {
      index: string
      version: string
      column: {
        index: number
        type: string
        value: string
        is_part: boolean
        format: string
        name: string
      }[]
      batch_size: number
    }
    mysql_target: {
      semantic: number
      column: {
        format: string
        index: number
        type: string
        value: string
        is_part: boolean
        name: string
      }[]
      schema: string
      pre_sql: string[]
      post_sql: string[]
      batch_size: number
      write_mode: number
      table: string[]
      update_key: string[]
      with_no_lock: string
    }
    ftp_source: {
      field_delimiter: string
      column: {
        type: string
        format: string
        index: number
        name: string
        is_part: boolean
        value: string
      }[]
      compress_type: string
      file_config: string
      file_type: string
      connect_pattern: string
      path: string
      control_encoding: string
      private_key_path: string
      timeout: string
      encoding: string
      is_first_line_header: boolean
    }
    oracle_target: {
      update_key: string[]
      post_sql: string[]
      table: string[]
      with_no_lock: string
      column: {
        type: string
        is_part: boolean
        format: string
        index: number
        name: string
        value: string
      }[]
      pre_sql: string[]
      batch_size: number
      schema: string
      semantic: number
      write_mode: number
    }
    sqlserver_source: {
      mapping_type: number
      schema: string
      visualization: {
        start_condition: string
        column: string
        end_value: string
        start_value: string
        end_condition: string
      }
      condition_type: number
      express: string
      where: string
      column: {
        is_part: boolean
        index: number
        name: string
        type: string
        value: string
        format: string
      }[]
      split_pk: string
      table: string[]
    }
    sqlserver_target: {
      post_sql: string[]
      pre_sql: string[]
      schema: string
      batch_size: number
      semantic: number
      table: string[]
      update_key: string[]
      column: {
        index: number
        is_part: boolean
        name: string
        value: string
        format: string
        type: string
      }[]
      with_no_lock: string
      write_mode: number
    }
    elastic_search_target: {
      batch_size: number
      column: {
        format: string
        is_part: boolean
        name: string
        index: number
        value: string
        type: string
      }[]
      key_delimiter: string
      index: string
      version: string
    }
    hbase_target: {
      name: string
      parameter: {
        version_column_index: number
        hbase_config: string
        rowkey_express: string
        scan_cache_size: number
        change_log: string
        column: {
          type: string
          value: string
          format: string
          index: number
          is_part: boolean
          name: string
        }[]
        null_mode: string
        version_column_value: string
        wal_flag: boolean
        scan_batch_size: number
        write_buffer_size: number
      }
      table: {
        table_name: string
      }
    }
    hdfs_target: {
      field_delimiter: string
      encoding: number
      path: string
      compress: number
      file_type: number
      file_name: string
      write_mode: number
      column: {
        index: number
        format: string
        is_part: boolean
        name: string
        value: string
        type: string
      }[]
    }
    ftp_target: {
      private_key_path: string
      encoding: string
      ftp_file_name: string
      path: string
      connect_pattern: string
      timeout: number
      control_encoding: string
      field_delimiter: string
      column: {
        is_part: boolean
        format: string
        type: string
        name: string
        value: string
        index: number
      }[]
      is_first_line_header: boolean
    }
    mongodb_source: {
      column: {
        value: string
        index: number
        is_part: boolean
        name: string
        format: string
        type: string
      }[]
      database: string
      fetch_size: number
      filter: string
      collection_name: string
    }
    oracle_source: {
      where: string
      mapping_type: number
      schema: string
      visualization: {
        end_value: string
        start_value: string
        column: string
        end_condition: string
        start_condition: string
      }
      split_pk: string
      column: {
        index: number
        name: string
        type: string
        value: string
        format: string
        is_part: boolean
      }[]
      table: string[]
      express: string
      condition_type: number
    }
    logminer_source: {
      split_update: boolean
      query_timeout: number
      paving_data: boolean
      read_position: string
      start_time: number
      cat: string
      fetch_size: number
      table: string[]
      start_scn: string
      support_auto_add_log: boolean
    }
    pg_wal_source: {
      table_list: string[]
      slot_available: boolean
      allow_created: boolean
      status_interval: number
      slot_name: string
      lsn: number
      paving_data: boolean
      temporary: boolean
      database_name: string
    }
    binlog_source: {
      connect_timeout: number
      split_update: boolean
      table: string[]
      paving_data: boolean
      is_gtid_mode: boolean
      query_timeout: number
      schema: string
      filter: string
      cat: string
      start: {
        position: number
        timestamp: number
        journal_name: string
      }
    }
    kafka_target: {
      topic: string
      tableFields: {
        format: string
        name: string
        value: string
        type: string
        index: number
        is_part: boolean
      }[]
      consumer_settings: {
        auto_commit_enable: string
      }
    }
    sap_hana_source: {
      express: string
      mapping_type: number
      visualization: {
        start_value: string
        column: string
        end_condition: string
        end_value: string
        start_condition: string
      }
      split_pk: string
      condition_type: number
      where: string
      column: {
        is_part: boolean
        name: string
        type: string
        format: string
        value: string
        index: number
      }[]
      table: string[]
      schema: string
    }
    sap_hana_target: {
      post_sql: string[]
      table: string[]
      batch_size: number
      column: {
        value: string
        is_part: boolean
        name: string
        format: string
        type: string
        index: number
      }[]
      semantic: number
      with_no_lock: string
      pre_sql: string[]
      write_mode: number
      update_key: string[]
      schema: string
    }
    hdfs_source: {
      filter_regex: string
      path: string
      column: {
        value: string
        index: number
        format: string
        is_part: boolean
        name: string
        type: string
      }[]
      field_delimiter: string
      encoding: number
      file_type: number
    }
    mongodb_target: {
      column: {
        value: string
        index: number
        is_part: boolean
        name: string
        type: string
        format: string
      }[]
      database: string
      write_mode: number
      batch_size: number
      collection_name: string
      flush_interval_mills: number
      replace_key: string
    }
    kafka_source: {
      group_id: string
      topic: string
      offset: string
      timestamp: number
      column: {
        index: number
        format: string
        is_part: boolean
        name: string
        type: string
        value: string
      }[]
      mode: string
      consumer_settings: {
        auto_commit_enable: string
      }
      codec: string
      encoding: string
    }
    redis_target: {
      key_field_delimiter: string
      expire_time: number
      keyIndexes: number[]
      date_format: string
      database: number
      type: number
      mode: string
      timeout: number
      value_field_delimiter: string
    }
    sql_server_cdc_source: {
      database_name: string
      paving_data: boolean
      split_update: boolean
      table_list: string[]
      cat: string
      poll_interval: number
      lsn: string
    }
    db2_target: {
      pre_sql: string[]
      update_key: string[]
      schema: string
      batch_size: number
      semantic: number
      column: {
        value: string
        is_part: boolean
        format: string
        name: string
        index: number
        type: string
      }[]
      with_no_lock: string
      write_mode: number
      post_sql: string[]
      table: string[]
    }
    click_house_source: {
      visualization: {
        start_condition: string
        column: string
        end_value: string
        end_condition: string
        start_value: string
      }
      where: string
      condition_type: number
      mapping_type: number
      schema: string
      split_pk: string
      table: string[]
      express: string
      column: {
        format: string
        is_part: boolean
        name: string
        type: string
        index: number
        value: string
      }[]
    }
    postgresql_source: {
      condition_type: number
      schema: string
      table: string[]
      where: string
      split_pk: string
      mapping_type: number
      column: {
        index: number
        is_part: boolean
        format: string
        type: string
        value: string
        name: string
      }[]
      visualization: {
        start_condition: string
        end_value: string
        column: string
        end_condition: string
        start_value: string
      }
      express: string
    }
  }
  source_id: string
  target_id: string
}
export type SyncJobVersionManageGetSyncJobVersionScheduleType = {
  express: string
  schedule_policy: number
  parameters: {
    value: string
    key: string
  }[]
  concurrency_policy: number
  executed: number
  period_type: string
  started: number
  timeout: number
  ended: number
}
export type SyncJobVersionManageListSyncJobVersionsType = {
  total: number
  has_more: boolean
  infos: {
    created_by: string
    is_directory: boolean
    space_id: string
    version: string
    pid: string
    status: number
    target_type: number
    desc: string
    source_type: number
    type: number
    id: string
    name: string
    created: number
    updated: number
  }[]
}
export type SyncJobDevManageGetSyncJobScheduleType = {
  executed: number
  schedule_policy: number
  started: number
  express: string
  timeout: number
  ended: number
  period_type: string
  concurrency_policy: number
  parameters: {
    key: string
    value: string
  }[]
}
export type SyncJobDevManageConvertSyncJobModeType = {
  job: string
}
export type SyncJobDevManageDescribeSyncConnectionType = {
  info: {
    message: string
    created: number
    cluster_id: string
    result: number
    target_id: string
    space_id: string
    job_id: string
    elapse: number
    source_id: string
    status: number
  }
}
export type SyncJobDevManageDescribeSyncJobType = {
  pid: string
  id: string
  created: number
  created_by: string
  status: number
  desc: string
  version: string
  space_id: string
  target_type: number
  name: string
  updated: number
  source_type: number
  is_directory: boolean
  type: number
}
export type SyncJobDevManageGenerateJobJsonType = {
  sync_job_script: string
}
export type SyncJobDevManageGetSyncJobConfType = {
  source_id: string
  channel_control: {
    record_num: number
    parallelism: number
    bytes: number
    percentage: number
    rate: number
  }
  job_content: string
  job_mode: number
  cluster_id: string
  sync_resource: {
    kafka_source: {
      mode: string
      timestamp: number
      codec: string
      column: {
        name: string
        is_part: boolean
        index: number
        format: string
        type: string
        value: string
      }[]
      offset: string
      consumer_settings: {
        auto_commit_enable: string
      }
      group_id: string
      encoding: string
      topic: string
    }
    db2_source: {
      express: string
      visualization: {
        column: string
        end_value: string
        end_condition: string
        start_value: string
        start_condition: string
      }
      mapping_type: number
      condition_type: number
      where: string
      table: string[]
      schema: string
      column: {
        value: string
        format: string
        index: number
        name: string
        is_part: boolean
        type: string
      }[]
      split_pk: string
    }
    binlog_source: {
      connect_timeout: number
      filter: string
      paving_data: boolean
      query_timeout: number
      start: {
        position: number
        journal_name: string
        timestamp: number
      }
      is_gtid_mode: boolean
      schema: string
      split_update: boolean
      table: string[]
      cat: string
    }
    sql_server_cdc_source: {
      table_list: string[]
      cat: string
      database_name: string
      paving_data: boolean
      lsn: string
      poll_interval: number
      split_update: boolean
    }
    oracle_source: {
      express: string
      split_pk: string
      visualization: {
        start_value: string
        end_condition: string
        start_condition: string
        column: string
        end_value: string
      }
      mapping_type: number
      column: {
        value: string
        is_part: boolean
        name: string
        index: number
        type: string
        format: string
      }[]
      schema: string
      table: string[]
      where: string
      condition_type: number
    }
    sap_hana_source: {
      column: {
        format: string
        type: string
        is_part: boolean
        name: string
        value: string
        index: number
      }[]
      visualization: {
        end_value: string
        start_value: string
        end_condition: string
        start_condition: string
        column: string
      }
      split_pk: string
      where: string
      table: string[]
      express: string
      mapping_type: number
      schema: string
      condition_type: number
    }
    ftp_source: {
      file_type: string
      timeout: string
      compress_type: string
      column: {
        type: string
        name: string
        value: string
        is_part: boolean
        format: string
        index: number
      }[]
      field_delimiter: string
      file_config: string
      is_first_line_header: boolean
      path: string
      connect_pattern: string
      control_encoding: string
      private_key_path: string
      encoding: string
    }
    click_house_source: {
      visualization: {
        start_condition: string
        start_value: string
        column: string
        end_value: string
        end_condition: string
      }
      mapping_type: number
      condition_type: number
      schema: string
      split_pk: string
      express: string
      column: {
        is_part: boolean
        format: string
        name: string
        type: string
        index: number
        value: string
      }[]
      where: string
      table: string[]
    }
    redis_target: {
      date_format: string
      expire_time: number
      mode: string
      keyIndexes: number[]
      key_field_delimiter: string
      timeout: number
      type: number
      database: number
      value_field_delimiter: string
    }
    ftp_target: {
      connect_pattern: string
      encoding: string
      ftp_file_name: string
      private_key_path: string
      control_encoding: string
      is_first_line_header: boolean
      column: {
        is_part: boolean
        name: string
        index: number
        format: string
        type: string
        value: string
      }[]
      timeout: number
      field_delimiter: string
      path: string
    }
    mongodb_source: {
      collection_name: string
      column: {
        index: number
        is_part: boolean
        format: string
        type: string
        value: string
        name: string
      }[]
      fetch_size: number
      database: string
      filter: string
    }
    db2_target: {
      schema: string
      pre_sql: string[]
      post_sql: string[]
      column: {
        is_part: boolean
        type: string
        name: string
        format: string
        index: number
        value: string
      }[]
      update_key: string[]
      with_no_lock: string
      write_mode: number
      batch_size: number
      table: string[]
      semantic: number
    }
    mysql_source: {
      express: string
      split_pk: string
      table: string[]
      where: string
      column: {
        index: number
        type: string
        value: string
        is_part: boolean
        name: string
        format: string
      }[]
      mapping_type: number
      visualization: {
        end_value: string
        start_value: string
        end_condition: string
        start_condition: string
        column: string
      }
      condition_type: number
      schema: string
    }
    postgresql_source: {
      visualization: {
        end_condition: string
        end_value: string
        column: string
        start_condition: string
        start_value: string
      }
      condition_type: number
      column: {
        is_part: boolean
        index: number
        name: string
        type: string
        format: string
        value: string
      }[]
      schema: string
      express: string
      split_pk: string
      where: string
      table: string[]
      mapping_type: number
    }
    elastic_search_target: {
      column: {
        name: string
        type: string
        value: string
        is_part: boolean
        format: string
        index: number
      }[]
      batch_size: number
      key_delimiter: string
      version: string
      index: string
    }
    hbase_source: {
      name: string
      parameter: {
        hbaseConfig: string
        range: {
          end_row_key: string
          start_row_key: string
          is_binary_rowkey: boolean
        }
        encoding: string
        scan_cache_size: number
        column: {
          format: string
          name: string
          is_part: boolean
          index: number
          type: string
          value: string
        }[]
        hadoopConfig: string
        scan_batch_size: number
        change_log: string
      }
      table: {
        table_name: string
      }
    }
    hbase_target: {
      name: string
      parameter: {
        column: {
          index: number
          format: string
          is_part: boolean
          name: string
          type: string
          value: string
        }[]
        rowkey_express: string
        scan_batch_size: number
        version_column_value: string
        scan_cache_size: number
        change_log: string
        wal_flag: boolean
        null_mode: string
        version_column_index: number
        hbase_config: string
        write_buffer_size: number
      }
      table: {
        table_name: string
      }
    }
    logminer_source: {
      table: string[]
      support_auto_add_log: boolean
      split_update: boolean
      fetch_size: number
      read_position: string
      query_timeout: number
      cat: string
      start_scn: string
      start_time: number
      paving_data: boolean
    }
    sqlserver_source: {
      condition_type: number
      express: string
      where: string
      mapping_type: number
      split_pk: string
      table: string[]
      visualization: {
        end_condition: string
        start_condition: string
        start_value: string
        end_value: string
        column: string
      }
      column: {
        format: string
        index: number
        type: string
        value: string
        name: string
        is_part: boolean
      }[]
      schema: string
    }
    kafka_target: {
      topic: string
      tableFields: {
        index: number
        is_part: boolean
        name: string
        value: string
        type: string
        format: string
      }[]
      consumer_settings: {
        auto_commit_enable: string
      }
    }
    hive_target: {
      compress: number
      partition: string
      encoding: number
      partition_type: number
      tables_column: string
      file_type: number
      column: {
        type: string
        key: string
      }[]
      table: string
      use_partition: boolean
      field_delimiter: string
      write_mode: number
    }
    oracle_target: {
      column: {
        value: string
        index: number
        format: string
        name: string
        type: string
        is_part: boolean
      }[]
      pre_sql: string[]
      schema: string
      post_sql: string[]
      batch_size: number
      semantic: number
      with_no_lock: string
      write_mode: number
      table: string[]
      update_key: string[]
    }
    postgresql_target: {
      schema: string
      with_no_lock: string
      write_mode: number
      semantic: number
      update_key: string[]
      column: {
        value: string
        index: number
        is_part: boolean
        format: string
        name: string
        type: string
      }[]
      pre_sql: string[]
      batch_size: number
      table: string[]
      post_sql: string[]
    }
    mongodb_target: {
      batch_size: number
      flush_interval_mills: number
      column: {
        format: string
        value: string
        index: number
        type: string
        name: string
        is_part: boolean
      }[]
      collection_name: string
      database: string
      write_mode: number
      replace_key: string
    }
    mysql_target: {
      batch_size: number
      column: {
        is_part: boolean
        type: string
        value: string
        format: string
        index: number
        name: string
      }[]
      write_mode: number
      with_no_lock: string
      semantic: number
      schema: string
      pre_sql: string[]
      table: string[]
      post_sql: string[]
      update_key: string[]
    }
    sap_hana_target: {
      batch_size: number
      post_sql: string[]
      semantic: number
      with_no_lock: string
      pre_sql: string[]
      column: {
        name: string
        type: string
        value: string
        is_part: boolean
        format: string
        index: number
      }[]
      table: string[]
      update_key: string[]
      schema: string
      write_mode: number
    }
    sqlserver_target: {
      batch_size: number
      column: {
        value: string
        is_part: boolean
        format: string
        index: number
        name: string
        type: string
      }[]
      table: string[]
      with_no_lock: string
      pre_sql: string[]
      schema: string
      write_mode: number
      semantic: number
      post_sql: string[]
      update_key: string[]
    }
    click_house_target: {
      column: {
        format: string
        index: number
        is_part: boolean
        type: string
        value: string
        name: string
      }[]
      with_no_lock: string
      batch_size: number
      write_mode: number
      schema: string
      post_sql: string[]
      table: string[]
      semantic: number
      pre_sql: string[]
      update_key: string[]
    }
    pg_wal_source: {
      status_interval: number
      slot_name: string
      paving_data: boolean
      lsn: number
      database_name: string
      allow_created: boolean
      slot_available: boolean
      table_list: string[]
      temporary: boolean
    }
    elastic_search_source: {
      batch_size: number
      column: {
        name: string
        format: string
        is_part: boolean
        type: string
        value: string
        index: number
      }[]
      index: string
      version: string
    }
    hdfs_target: {
      file_type: number
      write_mode: number
      field_delimiter: string
      column: {
        type: string
        value: string
        is_part: boolean
        format: string
        name: string
        index: number
      }[]
      file_name: string
      path: string
      encoding: number
      compress: number
    }
    hdfs_source: {
      column: {
        index: number
        value: string
        type: string
        is_part: boolean
        format: string
        name: string
      }[]
      path: string
      field_delimiter: string
      filter_regex: string
      encoding: number
      file_type: number
    }
  }
  target_id: string
}
export type SyncJobDevManageListSyncJobsType = {
  infos: {
    id: string
    desc: string
    created_by: string
    created: number
    is_directory: boolean
    name: string
    target_type: number
    type: number
    updated: number
    pid: string
    space_id: string
    status: number
    version: string
    source_type: number
  }[]
  total: number
  has_more: boolean
}
export type SyncJobDevManagePingSyncJobConnectionType = {
  info: {
    status: number
    cluster_id: string
    elapse: number
    source_id: string
    job_id: string
    target_id: string
    result: number
    created: number
    message: string
    space_id: string
  }
}
export type RoleManageListSystemRolePermissionsType = {
  infos: {
    name: string
    api_lists: {
      api_name: string
      perm_type: number
      permissions: {
        system_role: {
          name: string
          type: number
          id: string
        }
        allowed: boolean
      }[]
      display_name: string
    }[]
    id: string
    classify: number
  }[]
}
export type RoleManageListSystemRolesType = {
  infos: {
    type: number
    id: string
    name: string
  }[]
}
export type StreamJobDevMangeListStreamJobsType = {
  has_more: boolean
  infos: {
    is_directory: boolean
    version: string
    desc: string
    created: number
    id: string
    name: string
    space_id: string
    status: number
    updated: number
    created_by: string
    pid: string
    type: number
  }[]
  total: number
}
export type StreamJobDevMangeDescribeStreamJobType = {
  type: number
  name: string
  status: number
  is_directory: boolean
  pid: string
  desc: string
  id: string
  created_by: string
  space_id: string
  updated: number
  version: string
  created: number
}
export type StreamJobDevMangeGetStreamJobArgsType = {
  files: string[]
  parallelism: number
  delete_cluster_id: string
  delete_files: string[]
  cluster_id: string
  built_in_connectors: string[]
}
export type StreamJobDevMangeGetStreamJobCodeType = {
  python: {
    code: string
  }
  sql: {
    code: string
  }
  type: number
  jar: {
    delete_file_id: string
    jar_args: string
    jar_entry: string
    file_id: string
  }
  operators: {
    id: string
    down_stream: string
    point_x: number
    type: number
    name: string
    upstream: string
    upstream_right: string
    property: {
      source: {
        column: {
          field: string
          as: string
          func: string
          type: string
        }[]
        time_column: {
          type: string
          field: string
          as: string
          func: string
        }[]
        table_as: string
        custom_column: {
          func: string
          field: string
          type: string
          as: string
        }[]
        distinct: string
        table_id: string
      }
      udttf: {
        udf_id: string
        args: string
        column: {
          func: string
          type: string
          as: string
          field: string
        }[]
      }
      dest: {
        columns: string[]
        table_id: string
      }
      filter: {
        exists: string
        expression: string
        where: string
        in: string
      }
      group_by: {
        group_by: string[]
      }
      having: {
        having: string
      }
      intersect: {}
      order_by: {
        column: {
          field: string
          order: string
        }[]
      }
      fetch: {
        fetch: number
      }
      join: {
        table_as: string
        generate_column: {
          as: string
          func: string
          type: string
          field: string
        }[]
        join: string
        table_as_right: string
        column: {
          func: string
          type: string
          as: string
          field: string
        }[]
        args: string
        expression: string
      }
      dimension: {
        column: {
          func: string
          as: string
          field: string
          type: string
        }[]
        table_as: string
        table_id: string
        time_column: {
          type: string
          as: string
          func: string
          field: string
        }
        custom_column: {
          field: string
          type: string
          func: string
          as: string
        }[]
        distinct: string
      }
      const: {
        column: {
          func: string
          as: string
          field: string
          type: string
        }[]
        table: string
      }
      limit: {
        limit: number
      }
      offset: {
        offset: number
      }
      udtf: {
        column: {
          field: string
          func: string
          as: string
          type: string
        }[]
        select_column: {
          as: string
          field: string
          type: string
          func: string
        }[]
        args: string
        table_as: string
        udf_id: string
      }
      union: {
        all: boolean
      }
      values: {
        rows: {
          values: string[]
        }[]
      }
      except: {}
    }
    point_y: number
  }[]
}
export type StreamJobDevMangeGetStreamJobScheduleType = {
  started: number
  period_type: string
  timeout: number
  retry_policy: number
  ended: number
  schedule_policy: number
  executed: number
  retry_interval: number
  express: string
  concurrency_policy: number
  retry_limit: number
}
export type StreamJobDevMangeListBuiltInConnectorsType = {
  items: string[]
}
export type StreamJobDevMangeStreamJobCodeSyntaxType = {
  message: string
  result: number
}
export type StreamJobVersionManageDescribeStreamJobVersionType = {
  pid: string
  updated: number
  id: string
  name: string
  version: string
  space_id: string
  status: number
  desc: string
  created: number
  created_by: string
  is_directory: boolean
  type: number
}
export type StreamJobVersionManageGetStreamJobVersionArgsType = {
  built_in_connectors: string[]
  files: string[]
  delete_cluster_id: string
  delete_files: string[]
  parallelism: number
  cluster_id: string
}
export type StreamJobVersionManageGetStreamJobVersionCodeType = {
  type: number
  jar: {
    jar_args: string
    file_id: string
    jar_entry: string
    delete_file_id: string
  }
  python: {
    code: string
  }
  operators: {
    id: string
    point_x: number
    down_stream: string
    point_y: number
    type: number
    upstream_right: string
    property: {
      having: {
        having: string
      }
      udtf: {
        table_as: string
        udf_id: string
        column: {
          type: string
          func: string
          field: string
          as: string
        }[]
        select_column: {
          type: string
          field: string
          as: string
          func: string
        }[]
        args: string
      }
      source: {
        column: {
          func: string
          field: string
          as: string
          type: string
        }[]
        table_as: string
        distinct: string
        custom_column: {
          type: string
          func: string
          as: string
          field: string
        }[]
        time_column: {
          func: string
          as: string
          field: string
          type: string
        }[]
        table_id: string
      }
      fetch: {
        fetch: number
      }
      values: {
        rows: {
          values: string[]
        }[]
      }
      offset: {
        offset: number
      }
      order_by: {
        column: {
          order: string
          field: string
        }[]
      }
      group_by: {
        group_by: string[]
      }
      limit: {
        limit: number
      }
      union: {
        all: boolean
      }
      dest: {
        columns: string[]
        table_id: string
      }
      except: {}
      dimension: {
        table_id: string
        table_as: string
        custom_column: {
          field: string
          type: string
          func: string
          as: string
        }[]
        column: {
          func: string
          as: string
          field: string
          type: string
        }[]
        distinct: string
        time_column: {
          as: string
          func: string
          type: string
          field: string
        }
      }
      const: {
        table: string
        column: {
          as: string
          func: string
          type: string
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
        generate_column: {
          type: string
          func: string
          as: string
          field: string
        }[]
        expression: string
        args: string
        table_as: string
        join: string
      }
      filter: {
        expression: string
        in: string
        exists: string
        where: string
      }
      intersect: {}
      udttf: {
        args: string
        udf_id: string
        column: {
          func: string
          as: string
          field: string
          type: string
        }[]
      }
    }
    upstream: string
    name: string
  }[]
  sql: {
    code: string
  }
}
export type StreamJobVersionManageGetStreamJobVersionScheduleType = {
  retry_limit: number
  executed: number
  express: string
  retry_policy: number
  retry_interval: number
  schedule_policy: number
  started: number
  concurrency_policy: number
  ended: number
  timeout: number
  period_type: string
}
export type StreamJobVersionManageListStreamJobVersionsType = {
  total: number
  infos: {
    is_directory: boolean
    status: number
    desc: string
    space_id: string
    version: string
    created: number
    created_by: string
    type: number
    updated: number
    pid: string
    name: string
    id: string
  }[]
  has_more: boolean
}
export type StreamJobInstanceManageDescribeFlinkUIByInstanceIdType = {
  web_ui: string
}
export type StreamJobInstanceManageListStreamInstancesType = {
  has_more: boolean
  total: number
  infos: {
    updated: number
    id: string
    space_id: string
    message: string
    status: number
    job_id: string
    created: number
    state: number
    version: string
  }[]
}
export type StreamJobReleaseManageListReleaseStreamJobsType = {
  has_more: boolean
  infos: {
    status: number
    id: string
    desc: string
    name: string
    updated: number
    created_by: string
    type: number
    space_id: string
    created: number
    version: string
  }[]
  total: number
}
export type AlertManageCreateAlertPolicyType = {
  id: string
}
export type AlertManageDescribeAlertPolicyType = {
  id: string
  trigger_rule: number
  name: string
  space_id: string
  status: number
  notification_ids: string
  monitor_item: {
    stream_job: {
      instance_run_timeout: boolean
      instance_run_failed: boolean
      instance_timeout: number
    }
    sync_job: {
      instance_run_failed: boolean
      instance_run_timeout: boolean
      instance_timeout: number
    }
  }
  notification_lists: {
    notification_list_id: string
    notification_list_name: string
    create_time: string
    items: {
      content: string
      create_time: string
      notification_item_id: string
      notification_item_type: string
      verified: number
    }[]
    owner: string
  }[]
  trigger_action: number
  created: number
  created_by: string
  monitor_object: number
  updated: number
  desc: string
}
export type AlertManageListAlertPoliciesType = {
  total: number
  infos: {
    space_id: string
    notification_ids: string
    trigger_action: number
    id: string
    monitor_object: number
    trigger_rule: number
    created_by: string
    monitor_item: {
      sync_job: {
        instance_run_timeout: boolean
        instance_timeout: number
        instance_run_failed: boolean
      }
      stream_job: {
        instance_run_failed: boolean
        instance_timeout: number
        instance_run_timeout: boolean
      }
    }
    desc: string
    status: number
    updated: number
    created: number
    name: string
    notification_lists: {
      create_time: string
      notification_list_name: string
      items: {
        create_time: string
        verified: number
        content: string
        notification_item_id: string
        notification_item_type: string
      }[]
      owner: string
      notification_list_id: string
    }[]
  }[]
  has_more: boolean
}
export type AlertManageListAlertPoliciesByJobType = {
  has_more: boolean
  total: number
  infos: {
    trigger_rule: number
    created_by: string
    id: string
    desc: string
    notification_lists: {
      items: {
        notification_item_type: string
        notification_item_id: string
        content: string
        verified: number
        create_time: string
      }[]
      owner: string
      notification_list_id: string
      create_time: string
      notification_list_name: string
    }[]
    notification_ids: string
    trigger_action: number
    created: number
    monitor_item: {
      sync_job: {
        instance_run_failed: boolean
        instance_timeout: number
        instance_run_timeout: boolean
      }
      stream_job: {
        instance_run_failed: boolean
        instance_run_timeout: boolean
        instance_timeout: number
      }
    }
    monitor_object: number
    name: string
    status: number
    space_id: string
    updated: number
  }[]
}
export type AlertManageListJobsByAlertPolicyType = {
  stream_jobs: {
    status: number
    updated: number
    id: string
    version: string
    created: number
    desc: string
    created_by: string
    type: number
    is_directory: boolean
    name: string
    pid: string
    space_id: string
  }[]
  sync_jobs: {
    created_by: string
    desc: string
    target_type: number
    id: string
    source_type: number
    name: string
    space_id: string
    is_directory: boolean
    status: number
    pid: string
    type: number
    updated: number
    version: string
    created: number
  }[]
  total: number
  has_more: boolean
}
export type PlatformManageDescribePlatformConfigType = {
  documents_address: string
  enable_network: boolean
  work_in_iaas: boolean
}
export type SpaceManageCreateWorkspaceType = {
  id: string
}
export type SpaceManageDescribeNetworkConfigType = {
  default_vxnet_id: string
  vxnets: {
    vxnet_id: string
    router: {
      router_id: string
      is_applied: number
      dyn_ip_end: string
      is_default: number
      owner: string
      manager_ip: string
      status_time: string
      base_vxnet: string
      router_name: string
      border_private_ip: string
      eip: {
        eip_name: string
        eip_addr: string
        eip_id: string
      }
      private_ip: string
      ip_network: string
      router_type: number
      status: string
      vpc_id: string
      vpc_network: string
      dyn_ip_start: string
      vpc_ipv6_network: string
    }
    tunnel_type: string
    owner: string
    vxnet_name: string
    vxnet_type: number
    vpc_router_id: string
  }[]
  router: {
    is_default: number
    vpc_id: string
    dyn_ip_end: string
    status_time: string
    router_name: string
    vpc_network: string
    router_type: number
    eip: {
      eip_id: string
      eip_addr: string
      eip_name: string
    }
    router_id: string
    border_private_ip: string
    status: string
    private_ip: string
    dyn_ip_start: string
    owner: string
    vpc_ipv6_network: string
    base_vxnet: string
    is_applied: number
    manager_ip: string
    ip_network: string
  }
}
export type SpaceManageDescribeResourceBindingType = {
  infos: {
    sync_job: {
      status: number
      version: string
      is_directory: boolean
      name: string
      type: number
      updated: number
      pid: string
      created_by: string
      source_type: number
      id: string
      created: number
      target_type: number
      desc: string
      space_id: string
    }[]
    stream_job_release: {
      is_directory: boolean
      pid: string
      status: number
      created_by: string
      name: string
      type: number
      updated: number
      version: string
      desc: string
      id: string
      space_id: string
      created: number
    }[]
    sync_job_release: {
      type: number
      updated: number
      created_by: string
      space_id: string
      version: string
      created: number
      pid: string
      target_type: number
      id: string
      source_type: number
      is_directory: boolean
      status: number
      desc: string
      name: string
    }[]
    flink_cluster: {
      network_info: {
        id: string
        router_id: string
        status: number
        name: string
        created_by: string
        vxnet_id: string
        updated: number
        space_id: string
        created: number
      }
      web_ui: string
      job_cu: unknown
      task_num: number
      name: string
      updated: number
      id: string
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
          failure_rate_max_failures_per_interval: number
          fixed_delay_attempts: number
          failure_rate_delay: number
          failure_rate_failure_rate_interval: number
        }
      }
      task_cu: unknown
      space_id: string
      version: string
      created_by: string
      created: number
      status: number
      host_aliases: {
        items: {
          ip: string
          hostname: string
        }[]
      }
      network_id: string
    }[]
    id: string
    stream_job: {
      id: string
      pid: string
      status: number
      space_id: string
      name: string
      is_directory: boolean
      updated: number
      type: number
      created: number
      desc: string
      created_by: string
      version: string
    }[]
  }[]
}
export type SpaceManageDescribeWorkspaceType = {
  name: string
  created: number
  status: number
  owner: string
  desc: string
  id: string
  updated: number
}
export type SpaceManageDescribeWorkspaceQuotaType = {
  space_id: string
  quota_set: {
    custom_role: {
      limit: number
    }
    workspace: {
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
    member: {
      limit: number
    }
    stream_job: {
      limit: number
    }
    sync_job: {
      limit: number
    }
    flink_cluster: {
      limit: number
      cu: unknown
      cu_total: unknown
    }
    udf: {
      limit: number
    }
    network: {
      limit: number
    }
  }
}
export type SpaceManageListMemberWorkspacesType = {
  infos: {
    updated: number
    id: string
    desc: string
    owner: string
    status: number
    name: string
    created: number
  }[]
  total: number
  has_more: boolean
}
export type SpaceManageListWorkspacesType = {
  infos: {
    updated: number
    created: number
    id: string
    owner: string
    status: number
    name: string
    desc: string
  }[]
  total: number
  has_more: boolean
}
export type MemberManageDescribeMemberType = {
  system_roles: {
    name: string
    type: number
    id: string
  }[]
  status: number
  system_role_ids: string
  created_by: string
  user_id: string
  custom_role_ids: string
  updated: number
  space_id: string
  desc: string
  created: number
  user_info: {
    email: string
    currency: string
    regions: string[]
    lang: string
    role: string
    password: string
    user_name: string
    zones: string[]
    privilege: number
    user_id: string
    status: string
    phone: string
    gravatar_email: string
  }
}
export type MemberManageDescribeMemberQuotaType = {
  space_id: string
  user_id: string
  quota_set: {
    stream_job: {
      limit: number
    }
    workspace: {
      limit: number
    }
    network: {
      limit: number
    }
    member: {
      limit: number
    }
    data_source: {
      limit: number
    }
    custom_role: {
      limit: number
    }
    sync_job: {
      limit: number
    }
    file: {
      limit: number
      size: number
      size_total: number
    }
    udf: {
      limit: number
    }
    flink_cluster: {
      cu: unknown
      cu_total: unknown
      limit: number
    }
  }
}
export type MemberManageListMembersType = {
  total: number
  infos: {
    created_by: string
    desc: string
    custom_role_ids: string
    system_role_ids: string
    system_roles: {
      type: number
      id: string
      name: string
    }[]
    created: number
    status: number
    user_id: string
    space_id: string
    user_info: {
      phone: string
      currency: string
      email: string
      privilege: number
      regions: string[]
      role: string
      lang: string
      gravatar_email: string
      user_id: string
      password: string
      user_name: string
      zones: string[]
      status: string
    }
    updated: number
  }[]
  has_more: boolean
}
export type StatManageGetPeriodicTasksDispatchCountType = {
  infos: {
    flow_count: number
    updated: number
    instance_id: number
  }[]
}
export type StatManageGetPeriodicTasksErrorRankingType = {
  infos: {
    error_count: number
    version: string
    job_id: string
  }[]
  total: number
}
export type StatManageGetPeriodicTasksExecutingStatisticsType = {
  yesterday: {
    instance_count: number
    hour: number
  }[]
  today: {
    hour: number
    instance_count: number
  }[]
  history: {
    instance_count: number
    hour: number
  }[]
}
export type StatManageGetPeriodicTasksRuntimeRankingType = {
  infos: {
    running_time: number
    id: string
    version: string
    job_id: string
  }[]
  total: number
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
  type: number
  created_by: string
  space_id: string
  status: number
  url: {
    db2: {
      database: string
      host: string
      port: number
      password: string
      user: string
    }
    elastic_search: {
      port: number
      user: string
      version: string
      password: string
      host: string
    }
    oracle: {
      password: string
      port: number
      user: string
      host: string
      database: string
    }
    mysql: {
      database: string
      user: string
      host: string
      password: string
      port: number
    }
    clickhouse: {
      port: number
      host: string
      password: string
      database: string
      user: string
    }
    ftp: {
      user: string
      connection_mode: number
      password: string
      host: string
      port: number
      private_key: string
      protocol: number
    }
    kafka: {
      kafka_brokers: {
        port: number
        host: string
      }[]
    }
    postgresql: {
      host: string
      password: string
      port: number
      user: string
      database: string
    }
    redis: {
      hosts: {
        host: string
        port: number
      }[]
      password: string
    }
    sqlserver: {
      port: number
      password: string
      host: string
      user: string
      database: string
    }
    hbase: {
      config: string
    }
    s3: {}
    hive: {
      defaultFS: string
      user: string
      config: string
      host: string
      password: string
      database: string
      port: number
    }
    hdfs: {
      name_node: string
      config: string
      port: number
    }
    sap_hana: {
      port: number
      password: string
      host: string
      database: string
      user: string
    }
    mongo_db: {
      user: string
      hosts: {
        port: number
        host: string
      }[]
      database: string
      password: string
    }
  }
  id: string
  name: string
  desc: string
  last_connection: {
    elapse: number
    created: number
    network_info: {
      id: string
      router_id: string
      created: number
      space_id: string
      updated: number
      vxnet_id: string
      created_by: string
      status: number
      name: string
    }
    source_id: string
    space_id: string
    network_id: string
    message: string
    result: number
    status: number
  }
  updated: number
  created: number
}
export type DataSourceManageDescribeDataSourceKindsType = {
  kinds: {
    name: string
  }[]
}
export type DataSourceManageDescribeDataSourceTableSchemaType = {
  schema: {
    columns: {
      type: string
      is_primary_key: boolean
      name: string
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
    created: number
    network_id: string
    elapse: number
    source_id: string
    network_info: {
      status: number
      name: string
      vxnet_id: string
      updated: number
      created: number
      space_id: string
      id: string
      created_by: string
      router_id: string
    }
    space_id: string
    result: number
    status: number
    message: string
  }[]
}
export type DataSourceManageListDataSourcesType = {
  has_more: boolean
  infos: {
    id: string
    created: number
    url: {
      hdfs: {
        config: string
        name_node: string
        port: number
      }
      clickhouse: {
        user: string
        host: string
        port: number
        database: string
        password: string
      }
      elastic_search: {
        password: string
        user: string
        host: string
        port: number
        version: string
      }
      mysql: {
        host: string
        password: string
        database: string
        port: number
        user: string
      }
      sqlserver: {
        password: string
        port: number
        host: string
        database: string
        user: string
      }
      postgresql: {
        user: string
        password: string
        port: number
        database: string
        host: string
      }
      ftp: {
        user: string
        password: string
        host: string
        private_key: string
        connection_mode: number
        port: number
        protocol: number
      }
      hive: {
        defaultFS: string
        config: string
        database: string
        password: string
        user: string
        host: string
        port: number
      }
      kafka: {
        kafka_brokers: {
          host: string
          port: number
        }[]
      }
      mongo_db: {
        password: string
        user: string
        database: string
        hosts: {
          host: string
          port: number
        }[]
      }
      db2: {
        database: string
        port: number
        host: string
        password: string
        user: string
      }
      oracle: {
        user: string
        password: string
        database: string
        host: string
        port: number
      }
      sap_hana: {
        host: string
        port: number
        password: string
        user: string
        database: string
      }
      hbase: {
        config: string
      }
      redis: {
        hosts: {
          host: string
          port: number
        }[]
        password: string
      }
      s3: {}
    }
    type: number
    created_by: string
    desc: string
    status: number
    updated: number
    name: string
    last_connection: {
      space_id: string
      status: number
      network_id: string
      result: number
      created: number
      message: string
      network_info: {
        name: string
        created_by: string
        id: string
        created: number
        vxnet_id: string
        updated: number
        router_id: string
        space_id: string
        status: number
      }
      source_id: string
      elapse: number
    }
    space_id: string
  }[]
  total: number
}
export type DataSourceManagePingDataSourceConnectionType = {
  elapse: number
  source_id: string
  created: number
  status: number
  result: number
  network_id: string
  message: string
  network_info: {
    vxnet_id: string
    created_by: string
    router_id: string
    status: number
    name: string
    created: number
    id: string
    space_id: string
    updated: number
  }
  space_id: string
}
export type ClusterManageCreateFlinkClusterType = {
  id: string
}
export type ClusterManageDescribeFlinkClusterType = {
  status: number
  updated: number
  network_info: {
    created_by: string
    status: number
    space_id: string
    updated: number
    id: string
    created: number
    name: string
    vxnet_id: string
    router_id: string
  }
  network_id: string
  web_ui: string
  task_num: number
  space_id: string
  created_by: string
  task_cu: unknown
  created: number
  version: string
  host_aliases: {
    items: {
      ip: string
      hostname: string
    }[]
  }
  name: string
  config: {
    restart_strategy: {
      failure_rate_delay: number
      restart_strategy: string
      failure_rate_failure_rate_interval: number
      fixed_delay_attempts: number
      failure_rate_max_failures_per_interval: number
      fixed_delay_delay: number
    }
    logger: {
      root_log_level: string
    }
    custom: {
      value: string
      key: string
    }[]
  }
  job_cu: unknown
  id: string
}
export type ClusterManageListAvailableFlinkVersionsType = {
  items: string[]
}
export type ClusterManageListFlinkClustersType = {
  infos: {
    network_id: string
    job_cu: unknown
    name: string
    version: string
    created: number
    config: {
      logger: {
        root_log_level: string
      }
      custom: {
        key: string
        value: string
      }[]
      restart_strategy: {
        failure_rate_failure_rate_interval: number
        restart_strategy: string
        fixed_delay_delay: number
        failure_rate_delay: number
        failure_rate_max_failures_per_interval: number
        fixed_delay_attempts: number
      }
    }
    id: string
    created_by: string
    network_info: {
      status: number
      id: string
      created: number
      created_by: string
      router_id: string
      name: string
      updated: number
      vxnet_id: string
      space_id: string
    }
    space_id: string
    updated: number
    task_num: number
    host_aliases: {
      items: {
        ip: string
        hostname: string
      }[]
    }
    web_ui: string
    status: number
    task_cu: unknown
  }[]
  total: number
  has_more: boolean
}
export type NetworkMangeCreateNetworkType = {
  id: string
}
export type NetworkMangeDescribeNetworkType = {
  web_ui: string
  network_info: {
    created_by: string
    space_id: string
    vxnet_id: string
    router_id: string
    id: string
    updated: number
    created: number
    status: number
    name: string
  }
  name: string
  job_cu: unknown
  created_by: string
  host_aliases: {
    items: {
      ip: string
      hostname: string
    }[]
  }
  status: number
  task_cu: unknown
  network_id: string
  config: {
    logger: {
      root_log_level: string
    }
    restart_strategy: {
      fixed_delay_delay: number
      failure_rate_max_failures_per_interval: number
      failure_rate_delay: number
      failure_rate_failure_rate_interval: number
      fixed_delay_attempts: number
      restart_strategy: string
    }
    custom: {
      value: string
      key: string
    }[]
  }
  version: string
  id: string
  space_id: string
  created: number
  task_num: number
  updated: number
}
export type NetworkMangeListNetworksType = {
  infos: {
    id: string
    space_id: string
    created_by: string
    created: number
    updated: number
    router_id: string
    name: string
    vxnet_id: string
    status: number
  }[]
  total: number
  has_more: boolean
}
