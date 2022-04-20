import tw, { css, styled } from 'twin.macro'

import mySQLImg from 'assets/MySQL.png'
import PostgreSQLImg from 'assets/PostgreSQL.png'
import clickHouseImg from 'assets/ClickHouse.png'
import hbaseImg from 'assets/HBase.png'
import kafkaImg from 'assets/Kafka.png'
import ftpImg from 'assets/FTP.png'
import hdfsImg from 'assets/Hadoop.png'
import MongoDbImg from 'assets/MongoDB.png'
import RedisImg from 'assets/Redis.png'
import OracleImg from 'assets/Oracle.png'
import ElasticSearchImg from 'assets/ElasticSearch.png'
import SqlServerImg from 'assets/SQL-Server.png'
import DB2Img from 'assets/DB2.png'
import SapHanaImg from 'assets/SAP-HANA.png'
import HiveImg from 'assets/Hive.png'

type SourceType =
  | 'MySQL'
  | 'PostgreSQL'
  | 'ClickHouse'
  | 'Hbase'
  | 'Kafka'
  | 'Ftp'
  | 'HDFS'

const kindImgObj: { [k: string]: any } = {
  MySQL: mySQLImg,
  PostgreSQL: PostgreSQLImg,
  ClickHouse: clickHouseImg,
  HBase: hbaseImg,
  Kafka: kafkaImg,
  Ftp: ftpImg,
  HDFS: hdfsImg,
  // TiDB: hdfsImg,
  Oracle: OracleImg,
  SqlServer: SqlServerImg,
  DB2: DB2Img,
  SapHana: SapHanaImg,
  Hive: HiveImg,
  ElasticSearch: ElasticSearchImg,
  Redis: RedisImg,
  MongoDb: MongoDbImg,
}

export const SourceKindImg = styled('div')(({ type }: { type: SourceType }) => [
  tw`w-10 h-10 bg-no-repeat bg-center bg-cover`,
  kindImgObj[type] &&
    css`
      background-image: url(${kindImgObj[type]});
    `,
])
export default {}
