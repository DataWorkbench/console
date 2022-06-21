import { makeObservable, observable, set, action } from 'mobx'
import type RootStore from './RootStore'

class OverViewStore {
  rootStore

  showSpaceModal = false

  curItemName = ''

  constructor(rootStore: RootStore) {
    makeObservable(this, {
      showSpaceModal: observable,
      curItemName: observable,
      set: action,
    })
    this.rootStore = rootStore
  }

  items = [
    {
      name: 'upcloud',
      text: '数据源管理',
      icon: 'edge-cloud',
      xlink: 'icon_service_0',
      desc: '数据源定义结构化数据库、非结构化数据库、半结构化数据库以及消息队列等多种数据类型，主要用于数据集成和数据加工。您可以在数据源列表进行编辑和停用/启用管理。',
      enabled: true,
      moreLink: '/manual/data_up_cloud/data_summary/',
    },
    {
      name: 'dm',
      text: '数据开发',
      icon: 'smart-edge-configuration',
      xlink: 'icon_service_1',
      desc: '在云上的大数据开发环境，采用全托管式的Flink加工您的数据。您只需配置计算集群的大小、并发度，即可开始数据加工流程。\n根据您的业务需求，提供高兼容性的SQL开发模式，降低数据开发门槛。',
      enabled: true,
      moreLink: '/manual/data_development/summary/',
    },
    {
      text: '数据仓库',
      icon: 'database',
      xlink: 'icon_service_2',
      desc: '将处理完的结果数据，根据数据特性，存储在不同的存储介质中，以便结果数据的使用。您可以随时管理数据资产，厘清数据脉络，为企业的运营和决策提供源源不断的数据支撑。',
      enabled: false,
      // moreLink: '##',
    },
    {
      text: '数据服务',
      icon: 'resist',
      xlink: 'icon_service_3',
      desc: '根据企业数据仓库的结构，数据服务可生成自定义、可扩展的restfulAPI，提供数据权限、数据操作、数据查询等服务，助力企业构建轻量化的业务中台。',
      enabled: false,
      // moreLink: '##',
    },
    {
      text: '数据治理',
      icon: 'web-security',
      xlink: 'icon_service_4',
      desc: '提供全领域数据治理服务，全方位检测您的数据健康，提供数据资产、数据探查、元数据管理等多项服务，为整个数据加工流程保驾护航，提供优质安全的数据质量。',
      enabled: false,
      // moreLink: '##',
    },
    {
      name: 'ops',
      text: '运维中心',
      icon: 'web-security',
      xlink: 'icon_service_5',
      desc: '实时监测数据加工的任务状态，监测实时任务实例的运行情况。\n未来，我们将支持更多的监控维度，帮助您监测资源调度的分配、工作耗时的情况，并及时发出预警。',
      enabled: true,
      moreLink: '/manual/operation_maintence/summary/',
    },
  ]

  platFeats = [
    {
      title: '任务监控与运维',
      subtitle:
        '可以按照工作空间、责任人等对节点聚合。支持任务和实例的上下游分析。',
    },
    {
      title: '可视化编排开发流程',
      subtitle:
        '作业开发、版本管理、作业调度等可视化操作，轻松完成整个数据的处理流程。',
    },
    {
      title: '成员角色授权与管理',
      subtitle:
        '资源委托给更专业、高效的其他云帐号或者云服务，可以根据权限进行代运维。',
    },
  ]

  set = (params: { [key: string]: any }) => {
    set(this, { ...params })
  }
}

export default OverViewStore
