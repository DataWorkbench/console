import { observer } from 'mobx-react-lite'
import { useStore } from 'stores'
import FlowMenu from './FlowMenu'
import FlowTabs from './FlowTabs'
import FlowModal from './FlowModal'

const RealTime = observer(() => {
  const {
    workFlowStore: { curFlow },
  } = useStore()

  return (
    <div tw="flex min-h-[600px] h-full overflow-auto">
      <FlowMenu />
      {curFlow ? (
        <FlowTabs />
      ) : (
        <div tw="flex flex-1 items-center justify-center text-neut-8">
          <div>
            <ul>
              <li>1. 新建业务流程</li>
              <li>2. 新建表</li>
              <li>3. 新建节点</li>
              <li>4. 编辑节点</li>
              <li>5. 测试运行并设置调度</li>
              <li>6. 提交、发布节点</li>
              <li>7. 生产环境查看任务</li>
            </ul>
          </div>
        </div>
      )}
      <FlowModal />
    </div>
  )
})

export default RealTime
