import MonitorItem from 'views/Space/Ops/Alert/Monitor/MonitorItem'
import { Alert, Button, Collapse } from '@QCFE/lego-ui'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import { Center } from 'components/Center'
import { useState } from 'react'
import tw, { css, styled } from 'twin.macro'
import { HelpCenterLink } from 'components/Link'
import { observer } from 'mobx-react-lite'
import { useAlertStore } from 'views/Space/Ops/Alert/AlertStore'
import { AlertManageListAlertPoliciesType } from 'types/response'
import { ListAlertPoliciesByJobRequestType } from 'types/request'
import { apiHooks } from 'hooks/apiHooks'
import { useParams } from 'react-router-dom'
import { get } from 'lodash-es'
import { FlexBox } from 'components/Box'

const { CollapseItem } = Collapse

const collapseStyle = {
  wrapper: css``,
  item: css`
    ${tw`border border-line-dark not-last:mb-5`}
    .collapse-item-label {
      ${tw`h-16 px-3 bg-neut-15! border-0!`}
      .icon {
        ${tw`hidden`}
      }
    }

    .collapse-item-content {
      ${tw`bg-neut-17!`}
    }
  `,
  showIcon: css`
    & .icon {
      ${tw`block! static`}
    }
  `,
  itemExpanded: tw`w-6 h-6 bg-transparent hover:bg-neut-13 active:bg-neut-12 border border-neut-13 hover:border-neut-13 active:border-neut-12 rounded-[1px] cursor-pointer`
}

const Empty = styled.div`
  & {
    ${tw` w-[72px] h-[82px] overflow-hidden`}
    -webkit-transform: rotate(60deg);
  }

  & div,
  & p {
    ${tw`inline-block w-full h-full overflow-hidden`}
  }

  & p {
    ${tw`inline-flex items-center justify-center m-0 p-0 bg-line-dark`}
  }

  & > div {
    -webkit-transform: rotate(-120deg);
  }

  & > div > div {
    -webkit-transform: rotate(60deg);
  }
`

const useQueryListAlertPoliciesByJob = apiHooks<
  'alertManage',
  ListAlertPoliciesByJobRequestType,
  AlertManageListAlertPoliciesType
>('alertManage', 'listAlertPoliciesByJob')

const Strategies = observer((props: { jobId?: string; showAdd: boolean; jobType: 1 | 2 }) => {
  // const arr = [{ name: '1 xxxx' }, { name: '2 asdfasdf' }]
  const { jobId, jobType, showAdd } = props
  const { regionId, spaceId, detail } = useParams<{
    spaceId: string
    regionId: string
    detail: string
    mod: string
  }>()
  const { data } = useQueryListAlertPoliciesByJob(
    {
      uri: { space_id: spaceId, job_id: detail }
    },
    { enabled: !!jobId }
  )
  const arr = get(data, 'infos', []) || []
  const defaultKeys = Array.from({ length: arr.length }, (v, k) => k.toString())

  const [activeKeys, setActiveKeys] = useState(defaultKeys)

  const { set } = useAlertStore()

  const handleClick = () => {
    set({
      showAddMonitor: true,
      jobDetail: {
        jobId,
        spaceId,
        regionId,
        jobType
      }
    })
  }

  return (
    <>
      <div tw="w-full">
        <Alert
          message={
            <div>
              <span>告警策略对作业每个版本的所有实例生效，具体可参考：</span>
              <HelpCenterLink
                isIframe={false}
                href="/manual/operation_center/monitor/alert_rules/"
                hasIcon
              >
                告警策略文档
              </HelpCenterLink>
            </div>
          }
          type="info"
        />
        {showAdd && (
          <Button size="large" tw="w-full mt-3 mb-4" onClick={handleClick}>
            <Icon name="add" size={14} type="light" />
            <span tw="text-xs">添加告警策略</span>
          </Button>
        )}

        <Collapse
          css={collapseStyle.wrapper}
          defaultActiveKey={defaultKeys}
          activeKey={activeKeys}
          onChange={setActiveKeys}
        >
          {arr.map((item, index) => (
            <CollapseItem
              css={collapseStyle.item}
              key={item.id}
              label={
                <div tw="flex items-center flex-auto">
                  <div tw="flex text-2xs flex-auto ml-2 items-center gap-2">
                    <Icon
                      name="q-bellGearDuotone"
                      tw="block!"
                      type="light"
                      css={css`
                        position: unset !important;
                        opacity: 0.4;
                      `}
                      size={40}
                    />
                    <div>
                      <div>告警策略 {item.name}</div>
                      <div tw="text-neut-8">描述: {item.desc} </div>
                    </div>
                  </div>
                  {/* <Button
                    css={collapseStyle.showIcon}
                    size="small"
                    tw="ml-2 pr-0"
                    type="text"
                  >
                    <Icon name="close" size={14} type="light" />
                    <span tw="text-xs ml-1!">解绑</span>
                  </Button> */}
                  <Center css={[collapseStyle.itemExpanded, collapseStyle.showIcon]}>
                    <Icon
                      tw="block"
                      name={activeKeys.includes(index.toString()) ? 'chevron-up' : 'chevron-down'}
                      size={16}
                      type="light"
                    />
                  </Center>
                </div>
              }
            >
              <MonitorItem data={item} />
            </CollapseItem>
          ))}
        </Collapse>
        {(!Array.isArray(arr) || !arr.length) && (
          <FlexBox tw="w-full flex-col items-center gap-3 pt-14">
            <Empty>
              <div>
                <div>
                  <p>
                    <Icon
                      name="q-bellGearDuotone"
                      color={{
                        primary: '#fff',
                        secondary: '##949ea9'
                      }}
                      size={40}
                    />
                  </p>
                </div>
              </div>
            </Empty>
            <div tw="text-neut-8">暂未绑定告警策略</div>
          </FlexBox>
        )}
      </div>
    </>
  )
})

export default Strategies
