import { makeAutoObservable } from 'mobx'
import type RootStore from './RootStore'

type OP =
  | ''
  | 'create'
  | 'update'
  | 'enable'
  | 'disable'
  | 'delete'
  | 'view'
  | 'ping'

class DataSourceStore {
  rootStore

  op: OP = ''

  opSourceList: any[] = []

  sourceKinds = [
    {
      name: 'MySQL',
      desc: '是一个完全托管的数据库服务，可使用世界上最受欢迎的开源数据库来部署云原生应用程序。',
      source_type: 1,
    },
    {
      name: 'PostgreSQL',
      desc: '开源的对象-关系数据库数据库管理系统，在类似 BSD 许可与 MIT 许可的 PostgreSQL 许可下发行。 ',
      source_type: 2,
    },
    // { name: 'S3', img: <S3Img />, desc: '是一种面向 Internet 的存储服务。', source_type: 4, },
    {
      name: 'ClickHouse',
      desc: '用于联机分析处理的开源列式数据库。 ClickHouse允许分析实时更新的数据。该系统以高性能为目标。',
      source_type: 5,
    },
    {
      name: 'Hbase',
      showname: 'HBase',
      desc: 'HBase 是一个开源的非关系型分布式数据库，实现的编程语言为 Java。它可以对稀疏文件提供极高的容错率。 ',
      source_type: 6,
    },
    {
      name: 'Kafka',
      desc: '由Scala和Java编写，目标是为处理实时数据提供一个统一、高吞吐、低延迟的平台。',
      source_type: 3,
    },
    {
      name: 'Ftp',
      showname: 'FTP',
      desc: '用于在网络上进行文件传输的一套标准协议，它工作在 OSI 模型中的应用层',
      source_type: 7,
    },
    {
      name: 'HDFS',
      desc: '在通用硬件上的分布式文件系统，提供高吞吐量的数据访问，适合大规模数据集上的应用。',
      source_type: 8,
    },
  ]

  constructor(rootStore: RootStore) {
    makeAutoObservable(this, {
      rootStore: false,
    })
    this.rootStore = rootStore
  }

  mutateOperation = (op: OP = '', sourceList: any[] = []) => {
    this.op = op
    this.opSourceList = sourceList
  }

  setSourceKinds = (data: any) => {
    this.sourceKinds = data
  }
}

export default DataSourceStore
