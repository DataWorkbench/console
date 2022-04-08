import { Icon } from '@QCFE/lego-ui'
import { Loading } from '@QCFE/qingcloud-portal-ui'
import { get, cloneDeep } from 'lodash-es'
import tw, { styled } from 'twin.macro'
import { Icons, Center } from 'components'

export enum JobMode {
  /** 数据集成 */
  DI = 'DI',
  /**  实时流式开发 */
  RT = 'RT',
  /** 离线批量开发 */
  OLE = 'OLE',
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
  SCALA = 5,
}

/** 作业树icon主题 */
export enum TreeIconTheme {
  BLUE = 'blue',
  GREEN = 'green',
  GREY = 'grey',
  YELLOW = 'yellow',
}

export enum RootKey {
  /** 数据集成 */
  DI = 'di-root',
  /** 实时流式开发 */
  RT = 'rt-root',
  /** 离线批量开发 */
  OLE = 'ole-root',
}

export type DataSourceType =
  | 'MySQL'
  | 'TIDB'
  | 'Oracle'
  | 'SQLServer'
  | 'PostgreSQL'
  | 'DB2'
  | 'SAP HANA'
  | 'ClickHouse'
  | 'Hive'
  | 'HBase'
  | 'HDFS'
  | 'FTP'
  | 'MongoDB'
  | 'Redis'
  | 'ElasticSearch'
  | 'Kafka'
  | 'S3'

export const dataSourceTypes: { [key in DataSourceType]?: number } = {
  MySQL: 1,
  // TIDB: 2,
  Oracle: 10,
  SQLServer: 9,
  PostgreSQL: 2,
  DB2: 11,
  'SAP HANA': 12,
  ClickHouse: 5,
  Hive: 13,
  HBase: 6,
  HDFS: 8,
  FTP: 7,
  MongoDB: 15,
  Redis: 16,
  ElasticSearch: 14,
  Kafka: 3,
  // S3: 4
}

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
        value: JobType.OFFLINE,
      },
      {
        icon: 'LayerFill',
        title: '实时-流式同步作业',
        desc: '实时-流式的描述文案，尽量简短，一句话内',
        value: JobType.REALTIME,
      },
    ],
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
        value: JobType.SQL,
      },
      {
        icon: 'JavaFill',
        title: '代码开发-Jar 包模式',
        desc: 'Jar 模式的描述文案，尽量简短，一句话内',
        value: JobType.JAR,
      },
      {
        icon: 'PythonFill',
        title: '代码开发-Python 模式',
        desc: 'Python 模式的描述文案，尽量简短，一句话内',
        value: JobType.PYTHON,
      },
      {
        icon: 'scala',
        title: '代码开发-Scala 模式 ',
        desc: 'scala 模式的描述文案，尽量简短，一句话内',
        value: JobType.SCALA,
      },
      {
        icon: 'Branch2Fill',
        title: '算子编排模式',
        desc: '算子编排模式描述文案，尽量简短，一句话内',
        value: JobType.OPERATOR,
      },
    ],
  },
  {
    mode: JobMode.OLE,
    title: '离线-批量开发（敬请期待）',
    desc: '离线开发说明占位文字离线开发说明占位文字离线开发说明占位文字。占位文字',
    icon: 'DownloadBox2Fill',
    items: [],
  },
]
// 0 => "OfflineFull" 1 => "OfflineIncrement" 2 => "RealTimeFull" 3 => "RealTimeIncrement"
type DiType = 0 | 1 | 2 | 3
export const getDiJobType = (type: DiType) => {
  if (type === 0 || type === 1) {
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

export const isRootNode = (key: any) => [RootKey.DI, RootKey.RT].includes(key)

export const getJobIdByKey = (key: string) => (isRootNode(key) ? '' : key)

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

export const filterFolderOfTreeData = (
  treeNodeData: any[],
  excludeKey: string | number = ''
) => {
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
    const children = jobs.map((job) => {
      const childNode = pNode.children?.find((c: any) => c.key === job.id)
      if (childNode) {
        if (get(childNode, 'job.updated') !== job.updated) {
          return { ...childNode, title: job.name, job }
        }
        return childNode
      }
      if (movingNode && movingNode.key === job.id) {
        return { ...movingNode, pid: node.key }
      }
      return {
        key: job.id,
        pid: node.key,
        jobMode: pNode.jobMode,
        rootKey: isRootNode(node.key) ? node.key : node.rootKey,
        title: job.name,
        isLeaf: !job.is_directory,
        job,
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

export const IconWrapper = styled(Center)(
  ({ theme }: { theme: TreeIconTheme }) => [
    tw`w-4 h-4 rounded-sm`,
    theme === TreeIconTheme.BLUE && tw`bg-blue-10`,
    theme === TreeIconTheme.GREEN && tw`bg-green-11`,
    theme === TreeIconTheme.GREY && tw`bg-white bg-opacity-20 `,
    theme === TreeIconTheme.YELLOW && tw`bg-white bg-opacity-20 text-[#FFD127]`,
  ]
)

export const renderSwitcherIcon = (props) => {
  const { expanded, isLeaf } = props
  if (isLeaf) {
    return null
  }
  return <Icon name={expanded ? 'chevron-up' : 'chevron-down'} type="light" />
}

export const renderIcon = (props) => {
  const { data, loading } = props
  if (loading) {
    return <Loading size={16} />
  }
  let iconName = 'FolderFill'
  let theme: TreeIconTheme = TreeIconTheme.GREY
  if (data) {
    const { key } = data

    if (key === 'rt-root') {
      iconName = 'EventFill'
      theme = TreeIconTheme.GREEN
    } else if (key === 'di-root') {
      iconName = 'EqualizerFill'
      theme = TreeIconTheme.BLUE
    } else if (data.isLeaf) {
      const type = get(data, 'job.type')
      if (data.rootKey === 'rt-root') {
        if (type === JobType.SQL) {
          iconName = 'sql'
        } else if (type === JobType.JAR) {
          iconName = 'JavaFill'
        } else if (type === JobType.PYTHON) {
          iconName = 'PythonFill'
        }
      } else if (data.rootKey === 'di-root') {
        if (getDiJobType(type) === JobType.OFFLINE) {
          iconName = 'DownloadBoxFill'
        } else {
          iconName = 'LayerFill'
        }
      }
    } else if (!data.isLeaf || data.children?.length) {
      iconName = 'FolderFill'
      theme = TreeIconTheme.YELLOW
    }
  }
  return (
    <IconWrapper theme={theme}>
      <Icons name={iconName} size={12} />
    </IconWrapper>
  )
}
