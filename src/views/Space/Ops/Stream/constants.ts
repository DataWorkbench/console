import { ISuggestion } from '../DataIntegration/interfaces'

export const InstanceState: any = {
  0: { name: '全部' },
  1: { name: '准备资源', color: { primary: '#FFD127', secondary: '#FFF0BA' } },
  2: { name: '运行中', color: { primary: '#3B82F6', secondary: '#F0F9FF' } },
  3: { name: '失败重试', color: { primary: '#A855F7', secondary: '#FAF5FF' } },
  4: { name: '已暂停', color: '' },
  5: { name: '已终止', color: '' },
  6: { name: '运行成功', color: { primary: '#15A675', secondary: '#C6F4E4' } },
  7: { name: '运行超时', color: { primary: '#CF3B37', secondary: '#F6DBDA' } },
  8: { name: '运行失败', color: { primary: '#CF3B37', secondary: '#F6DBDA' } }
}

export const JobInstanceTabletSuggestions: ISuggestion[] = [
  {
    label: '实例 ID',
    key: 'instance_id'
  },
  {
    label: '作业 ID',
    key: 'job_id'
  },
  {
    label: '作业版本',
    key: 'version'
  },
  {
    label: '实例状态',
    key: 'state',
    options: Object.keys(InstanceState).map((el) => ({
      key: Number(el),
      label: InstanceState[el].name
    }))
  }
]

export default {}
