import { Icon } from '@QCFE/lego-ui'
import { Loading } from '@QCFE/qingcloud-portal-ui'
import { get, cloneDeep, findKey } from 'lodash-es'
import tw, { styled } from 'twin.macro'
import { Center } from 'components'

export enum JobMode {
  /** 数据集成 */
  DI = 'DI',
  /**  实时流式开发 */
  RT = 'RT',
  /** 离线批量开发 */
  OLE = 'OLE'
}
/**  作业类型 */
export enum JobType {
  /** 离线批量 */
  OFFLINE = 'OFFLINE',
  /** 实时流式 */
  REALTIME = 'REALTIME',
  /** 算子编排 */
  OPERATOR = 1,
  /** SQL模式 */
  SQL = 2,
  /** JAR包 */
  JAR = 3,
  /** python模式 */
  PYTHON = 4,
  /** scala模式 */
  SCALA = 5
}
/** 数据集成作业类型 */
export enum SyncJobType {
  /** 1 => "OfflineFull"(离线全量) */
  OFFLINEFULL = 1,
  /**  2 => "OfflineIncrement"(离线增量)  */
  OFFLINEINCREMENT = 2,
  /** 3 => "RealTime"(实时)  */
  REALTIME = 3
}

/** 作业树icon主题 */
export enum TreeIconTheme {
  BLUE = 'blue',
  GREEN = 'green',
  GREY = 'grey',
  YELLOW = 'yellow'
}

export enum RootKey {
  /** 数据集成 */
  DI = 'di-root',
  /** 实时流式开发 */
  RT = 'rt-root',
  /** 离线批量开发 */
  OLE = 'ole-root'
}

export type DataSourceType =
  | 'MySQL'
  | 'TIDB'
  | 'Kafka'
  | 'S3'
  | 'ClickHouse'
  | 'HBase'
  | 'FTP'
  | 'HDFS'
  | 'SQLServer'
  | 'Oracle'
  | 'PostgreSQL'
  | 'DB2'
  | 'SAP HANA'
  | 'Hive'
  | 'MongoDB'
  | 'Redis'
  | 'ElasticSearch'

export const dataSourceTypes: { [key in DataSourceType]?: number } = {
  MySQL: 1,
  // TIDB: 2,
  // Kafka: 3,
  // S3: 4,
  ClickHouse: 5,
  // HBase: 6,
  // FTP: 7,
  // HDFS: 8,
  SQLServer: 9,
  // Oracle: 10,
  PostgreSQL: 2
  // DB2: 11,
  // 'SAP HANA': 12,
  // Hive: 13,
  // MongoDB: 15,
  // Redis: 16,
  // ElasticSearch: 14,
}

export const getSourceNameByType = (type: DataSourceType) =>
  findKey(dataSourceTypes, (v) => v === dataSourceTypes[type])

export const jobModeData = [
  {
    mode: JobMode.DI,
    title: '数据集成',
    desc: '提供异构数据源之间的数据搬运和数据同步的能力',
    icon: 'EqualizerFill',
    selTitle: '同步方式',
    items: [
      {
        icon: 'DownloadBoxFill',
        title: '离线-批量同步作业',
        desc: '离线批量同步的描述文案，尽量简短，一句话内',
        value: JobType.OFFLINE
      },
      {
        icon: 'LayerFill',
        title: '实时-流式同步作业',
        desc: '实时-流式的描述文案，尽量简短，一句话内',
        value: JobType.REALTIME,
        disabled: true
      }
    ]
  },
  {
    mode: JobMode.RT,
    title: '实时-流式开发',
    desc: '实时开发说明占位文字实时开发说明占位文字实时开发说明占位文字。占位文字',
    icon: 'EventFill',
    selTitle: '实时开发模式',
    items: [
      {
        icon: 'sql',
        title: 'SQL 模式',
        desc: 'SQL 模式的描述文案，尽量简短，一句话内',
        value: JobType.SQL
      },
      {
        icon: 'JavaFill',
        title: '代码开发-Jar 包模式',
        desc: 'Jar 模式的描述文案，尽量简短，一句话内',
        value: JobType.JAR
      },
      {
        icon: 'PythonFill',
        title: '代码开发-Python 模式',
        desc: 'Python 模式的描述文案，尽量简短，一句话内',
        value: JobType.PYTHON,
        disabled: true
      },
      {
        icon: 'scala',
        title: '代码开发-Scala 模式 ',
        desc: 'scala 模式的描述文案，尽量简短，一句话内',
        value: JobType.SCALA,
        disabled: true
      },
      {
        icon: 'Branch2Fill',
        title: '算子编排模式',
        desc: '算子编排模式描述文案，尽量简短，一句话内',
        value: JobType.OPERATOR,
        disabled: true
      }
    ]
  },
  {
    mode: JobMode.OLE,
    title: '离线-批量开发（敬请期待）',
    desc: '离线开发说明占位文字离线开发说明占位文字离线开发说明占位文字。占位文字',
    icon: 'DownloadBox2Fill',
    items: []
  }
]
// 1 => "OfflineFull" 2 => "OfflineIncrement" 3 => "RealTimeFull" 3 => "RealTimeIncrement"
type DiType = 1 | 2 | 3
export const getDiJobType = (type: DiType) => {
  if (type === 1 || type === 2) {
    return JobType.OFFLINE
  }
  return JobType.REALTIME
}

export const getJobMode = (jobType?: JobType) => {
  if (jobType === JobType.OFFLINE || jobType === JobType.REALTIME) {
    return JobMode.DI
  }
  if (
    jobType === JobType.SQL ||
    jobType === JobType.JAR ||
    jobType === JobType.PYTHON ||
    jobType === JobType.SCALA
  ) {
    return JobMode.RT
  }
  if (jobType === JobType.OPERATOR) {
    return JobMode.OLE
  }
  return null
}

export const findTreeNode: any = (treeData: any[], nodeKey: string) => {
  let find = null
  treeData.forEach((node) => {
    if (node.key === nodeKey) {
      find = node
    } else if (node.children?.length) {
      const findInChildren = findTreeNode(node.children, nodeKey)
      if (findInChildren) {
        find = findInChildren
      }
    }
  })
  return find
}

export const filterFolderOfTreeData = (treeNodeData: any[], excludeKey: string | number = '') => {
  const newTreeData = treeNodeData.filter((node) => {
    if (node.key === excludeKey) {
      return false
    }
    if (node.children?.length) {
      node.children = filterFolderOfTreeData(node.children, excludeKey)
      // return node.children.length > 0
      return true
    }
    return !node.isLeaf
  })
  return newTreeData
}

export const getNewTreeData = (
  treeData: any[],
  node: any,
  jobs: any[],
  movingNode: { key: string } | null = null
) => {
  const newTreeData = cloneDeep(treeData)
  const pNode = findTreeNode(newTreeData, node.key)
  if (pNode) {
    const children = jobs.map((api) => {
      const childNode = pNode.children?.find((c: any) => c.key === api.id)
      if (childNode) {
        if (get(childNode, 'api.api_id') !== api.api_id) {
          return { ...childNode, title: api.api_name, api }
        }
        return childNode
      }
      if (movingNode && movingNode.key === api.api_id) {
        return { ...movingNode, pid: node.key }
      }
      return {
        key: api.api_id,
        id: api.api_id,
        pid: node.key,
        jobMode: pNode.jobMode,
        title: api.api_name,
        isLeaf: true,
        api: {
          ...api,
          key: api.api_id
        }
      }
    })
    pNode.children = children
  }
  return newTreeData
}

export const removeTreeNode = (treeData: any[], node: any) => {
  const newTreeData = cloneDeep(treeData)
  const { pid, key } = node
  const pNode = findTreeNode(newTreeData, pid)
  if (pNode) {
    pNode.children = pNode.children.filter((c: any) => c.key !== key)
  }
  return newTreeData
}

export const IconWrapper = styled(Center)(() => [tw`w-4 h-4 rounded-sm bg-white bg-opacity-20 `])

export const renderSwitcherIcon = (props: { expanded: any; isLeaf: any }) => {
  const { expanded, isLeaf } = props
  if (isLeaf) {
    return null
  }
  return <Icon name={expanded ? 'chevron-up' : 'chevron-down'} type="light" />
}

// eslint-disable-next-line consistent-return
export const renderIcon = (props: any) => {
  const { data, loading } = props
  if (loading) {
    return <Loading size={16} />
  }
  let iconName = 'q-apps3Fill'
  if (data) {
    const { isLeaf } = data
    if (isLeaf) {
      iconName = 'q-apiFill'
    }
    return (
      <IconWrapper>
        <Icon
          name={iconName}
          color={{ secondary: '#ffd0275d', primary: isLeaf ? '#fff' : '#FFD127' }}
          size={12}
        />
      </IconWrapper>
    )
  }
}
