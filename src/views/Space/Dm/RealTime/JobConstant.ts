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
