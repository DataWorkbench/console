import { Icon } from '@QCFE/lego-ui'
import { Loading } from '@QCFE/qingcloud-portal-ui'
import { get } from 'lodash-es'
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

/**  数据集成类型 */
export enum DiType {
  /** 离线批量 */
  OFFLINE_BATCH = 'OFFLINE_BATCH',
  /** 实时流式 */
  REALTIME_FLOW = 'REALTIME_FLOW',
}

/** 实时流式开发类型  */
export enum RtType {
  /** 算子编排 */
  OPERATOR = 1,
  /** SQL模式 */
  SQL = 2,
  /** JAR包 */
  JAR = 3,
  /** python */
  PYTHON = 4,
  /** scala */
  SCALA = 5,
}

/** 离线-批量开发 */
export enum OleType {}

/** 作业树icon主题 */
export enum TreeIconTheme {
  BLUE = 'blue',
  GREEN = 'green',
  GREY = 'grey',
  YELLOW = 'yellow',
}

export const jobModeData = [
  {
    mode: JobMode.DI,
    title: '数据集成',
    desc: '提供异构数据源之间的数据搬运和数据同步的能力',
    icon: 'equalizer',
    selTitle: '同步方式',
    items: [
      {
        icon: 'inbox1',
        title: '离线-批量同步作业',
        desc: '离线批量同步的描述文案，尽量简短，一句话内',
        value: DiType.OFFLINE_BATCH,
      },
      {
        icon: 'inbox0',
        title: '实时-流式同步作业',
        desc: '实时-流式的描述文案，尽量简短，一句话内',
        value: DiType.REALTIME_FLOW,
      },
    ],
  },
  {
    mode: JobMode.RT,
    title: '实时-流式开发',
    desc: '实时开发说明占位文字实时开发说明占位文字实时开发说明占位文字。占位文字',
    icon: 'flash',
    selTitle: '实时开发模式',
    items: [
      {
        icon: 'sql',
        title: 'SQL 模式',
        desc: 'SQL 模式的描述文案，尽量简短，一句话内',
        value: RtType.SQL,
      },
      {
        icon: 'jar',
        title: '代码开发-Jar 包模式',
        desc: 'Jar 模式的描述文案，尽量简短，一句话内',
        value: RtType.JAR,
      },
      {
        icon: 'python',
        title: '代码开发-Python 模式',
        desc: 'Python 模式的描述文案，尽量简短，一句话内',
        value: RtType.PYTHON,
      },
      {
        icon: 'scala',
        title: '代码开发-Scala 模式 ',
        desc: 'scala 模式的描述文案，尽量简短，一句话内',
        value: RtType.SCALA,
      },
      {
        icon: 'operator',
        title: '算子编排模式',
        desc: '算子编排模式描述文案，尽量简短，一句话内',
        value: RtType.OPERATOR,
      },
    ],
  },
  {
    mode: JobMode.OLE,
    title: '离线-批量开发（敬请期待）',
    desc: '离线开发说明占位文字离线开发说明占位文字离线开发说明占位文字。占位文字',
    icon: 'inbox1',
    items: [],
  },
]

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

const IconWrapper = styled(Center)(({ theme }: { theme: TreeIconTheme }) => [
  tw`w-4 h-4 rounded-sm`,
  theme === TreeIconTheme.BLUE && tw`bg-blue-10`,
  theme === TreeIconTheme.GREEN && tw`bg-green-11`,
  theme === TreeIconTheme.GREY && tw`bg-white bg-opacity-20 `,
  theme === TreeIconTheme.YELLOW && tw`bg-white bg-opacity-20 text-[#FFD127]`,
])

export const getSwitcherIcon = (props) => {
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
  let iconName = 'folder'
  let theme: TreeIconTheme = TreeIconTheme.GREY
  if (data) {
    const { key } = data

    if (key === 'rt-root') {
      iconName = 'flash'
      theme = TreeIconTheme.BLUE
    } else if (key === 'di-root') {
      iconName = 'equalizer'
      theme = TreeIconTheme.GREEN
    } else if (data.isLeaf) {
      if (data.rootKey === 'rt-root') {
        const type = get(data, 'job.type')
        if (type === RtType.SQL) {
          iconName = 'sql'
        } else if (type === RtType.JAR) {
          iconName = 'jar'
        } else if (type === RtType.PYTHON) {
          iconName = 'python'
        }
      }
    } else if (!data.isLeaf || data.children?.length) {
      iconName = 'folder'
      theme = TreeIconTheme.YELLOW
    }
  }
  return (
    <IconWrapper theme={theme}>
      <Icons name={iconName} size={12} />
    </IconWrapper>
  )
}
