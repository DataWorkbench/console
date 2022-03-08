import { useStore } from 'hooks'
import { FlexBox } from 'components'
import { Level, LevelLeft } from '@QCFE/lego-ui'
import { Icon, Divider } from '@QCFE/qingcloud-portal-ui'
import { AlertWrapper, Tag } from './styled'

export default function VersionHeader() {
  const {
    workFlowStore,
    workFlowStore: { curVersion },
  } = useStore()

  return (
    <div tw="w-full">
      <FlexBox orient="row" tw="h-9 px-3 text-white items-center">
        <FlexBox tw="items-center">
          <Tag>
            {(() => {
              switch (curVersion?.type) {
                case 1:
                  return '算子'
                case 2:
                  return 'Sql'
                case 3:
                  return 'Jar'
                case 4:
                  return 'Python'
                case 5:
                  return 'Scala'
                default:
                  return ''
              }
            })()}
          </Tag>
          <div tw="font-medium mr-3 truncate max-w-[160px]">
            {curVersion?.name}{' '}
          </div>
        </FlexBox>
        <div>{curVersion?.version}</div>
        <Divider
          type="vertical"
          height={12}
          style={{ borderColor: '#4C5E70', margin: '0 12px' }}
        />
        <div tw="text-neut-8  truncate max-w-[800px]">
          发布描述：
          {curVersion?.desc}
        </div>
        <FlexBox
          tw="items-center cursor-pointer ml-auto"
          onClick={() => workFlowStore.set({ curVersion: null })}
        >
          <Icon
            name="close"
            color={{ primary: '#fff', secondary: '#fff' }}
            tw="mr-1"
          />
          退出
        </FlexBox>
      </FlexBox>
      <AlertWrapper
        type="warning"
        isJar={curVersion?.type === 3}
        message={
          <Level as="nav">
            <LevelLeft>查看历史版本不可修改、保存、发布</LevelLeft>
          </Level>
        }
      />
    </div>
  )
}
