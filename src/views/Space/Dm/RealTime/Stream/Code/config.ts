export default {
  sql: `-- 如果在 Flink SQL 里存在 flink_test 表则删除，防止重复创建
  drop table if exists flink_test;
  -- 在 Flink SQL 里注册 MySQL 数据库的 test 表，需提前在 MySQL 中创建该表
  create table flink_test (
    id BIGINT,
    name STRING,
    age INT,
    PRIMARY KEY (id) NOT ENFORCED
  ) WITH (
    'connector' = 'jdbc',
    'url' = 'jdbc:mysql://127.0.0.1:3306/database',
    'table-name' = 'test',
    'username' = 'root',
    'password' = '123456'
  );
  -- 通过 Flink SQL 向 MySQL 的 test 表中插入数据
  insert into flink_test values(1, 'Jack', 22);
  insert into flink_test values(2, 'Tom', 23);`,
  python: `from pyflink.datastream import StreamExecutionEnvironment, TimeCharacteristic
from pyflink.table import StreamTableEnvironment, EnvironmentSettings


def log_processing():
    env = StreamExecutionEnvironment.get_execution_environment()
    env_settings = EnvironmentSettings.Builder().use_blink_planner().build()
    t_env = StreamTableEnvironment.create(stream_execution_environment=env, environment_settings=env_settings)
    source_ddl = """
    CREATE TABLE source_table(
       a VARCHAR,
       b INT
    ) WITH (
      'connector' = 'datagen',
      'rows-per-second' = '1'
    )
"""
    sink_ddl = """
    CREATE TABLE sink_table(
      a VARCHAR
    ) WITH (
      'connector' = 'print'
    )
"""
    t_env.execute_sql(source_ddl)
    t_env.execute_sql(sink_ddl)
    t_env.sql_query("SELECT a FROM source_table").execute_insert("sink_table")
if __name__ == '__main__':
    log_processing()`,
  scala: `object HelloWorld {
    def main(args: Array[String]): Unit = {
        println("Hello, world!")
      }
    }`
}

export const error = `
Flink SQL> CREATE TABLE user_behavior (user_id BIGINT, item_id BIGINT,category_id BIGINT, behavior STRING,ts TIMESTAMP(3),proctime AS PROCTIME(),   -- gen
-ed columnWATERMARK FOR ts AS ts - INTERVAL '5' SECOND  -- defines watermark on ts column, marks ts as event-time attributeINTERVAL '5' SECOND  -- define
e attributeINTERVAL '5' SECOND  -- defines watermark on ts column, marks ts as event-time attributeINTERVAL '5' SECOND  -- defines watermark on ts column
>     'connector' = 'kafka',  -- using kafka connector
SQL：286
>     'scan.startup.mode' = 'earliest-offset',  -- reading from the beginning
>     'properties.bootstrap.servers' = 'kafka:9094',  -- kafka broker address
>     'format' = 'json'  -- the data format is json
> );
SQL：211
 Flink SQL> CREATE TABLE buy_cnt_per_hour (
>     hour_of_day BIGINT,
>     buy_cnt BIGINT
SQL：1211
Flink SQL> CREATE TABLE user_behavior (
Flink SQL> CREATE TABLE user_behavior (Flink SQL> CREATE TABLE user_behavior (
Flink SQL> CREATE TABLE user_behavior (Flink SQL> CREATE TABLE user_behavior (
Flink SQL> CREATE TABLE user_behavior (
Flink SQL> CREATE TABLE user_behavior (
`
