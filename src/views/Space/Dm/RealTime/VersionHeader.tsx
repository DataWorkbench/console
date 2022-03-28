import { useInfiniteQueryJobVersions, useStore } from 'hooks'
import { FlexBox } from 'components'
import { Level, LevelLeft, Select } from '@QCFE/lego-ui'
import { Icon, Divider } from '@QCFE/qingcloud-portal-ui'
import { flatten } from 'lodash-es'
import tw, { css, styled } from 'twin.macro'
import { AlertWrapper, Tag } from './styled'

const SelectWrapper = styled(Select)(() => [
  css`
    ${tw`w-[150px]`}
    .select-menu-outer {
      .select-option.is-selected {
        .option-selected-area {
          ${tw`inline-flex!`}
        }
      }
    }

    &.is-open {
      .select-control {
        .select-value {
          .select-value-label {
            ${tw`text-[#15A675]!`}
          }
        }
      }
    }
    .select-control {
      ${tw`border-none bg-transparent! p-0`}
      .select-multi-value-wrapper {
      }
      .select-value {
        ${tw`pl-0`}
      }
      .select-value-label {
      }
    }
    .select-menu-outer {
      ${tw`w-[180px]!`}
    }
  `,
])

export default function VersionHeader() {
  const {
    workFlowStore,
    workFlowStore: { curVersion },
  } = useStore()

  const versionRet = useInfiniteQueryJobVersions()

  const versions = flatten(
    versionRet.data?.pages.map((page) => page.infos || [])
  )

  const handleVersionChange = (value: any) => {
    workFlowStore.set({
      curVersion: versions.find((el: any) => el.version === value),
    })
  }

  const arrowRenderer = ({ onMouseDown, isOpen }: any) => (
    <span className="select-arrow" onMouseDown={onMouseDown}>
      <Icon
        name="caret-down"
        size="small"
        clickable
        color={isOpen && { primary: '#15A675', secondary: '#15A675' }}
      />
    </span>
  )

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
        <SelectWrapper
          placeholder={curVersion?.version}
          options={versions.map(({ version }) => ({
            value: version,
            label: version,
          }))}
          backspaceRemoves={false}
          value={curVersion?.version}
          onChange={handleVersionChange}
          arrowRenderer={arrowRenderer}
        />
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
