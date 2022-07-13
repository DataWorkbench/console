import {
  Center,
  HelpCenterLink,
  Modal,
  ModalContent,
  PopConfirm,
} from 'components/index'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { Alert, Button, Icon } from '@QCFE/qingcloud-portal-ui'
import { Collapse } from '@QCFE/lego-ui'
import tw, { css } from 'twin.macro'
import MonitorItem from 'views/Space/Ops/Alert/Monitor/MonitorItem'
import { useAlertStore } from 'views/Space/Ops/Alert/AlertStore'
import useIcon from 'hooks/useHooks/useIcon'
import {
  getQueryKeyListAlertPoliciesByJob,
  useMutationAlert,
  useQueryListAlertPoliciesByJob,
} from 'hooks/useAlert'

import icons from '../common/icons'

const { CollapseItem } = Collapse

const collapseStyle = {
  wrapper: css`
    .collapse-item {
      ${tw`mb-1`}
    }
  `,
  item: css`
    .collapse-item-label {
      ${tw`h-10 px-3 bg-neut-15! border-0!`}
      .icon {
        ${tw`hidden`}
      }
    }

    .collapse-item-content {
      ${tw`bg-neut-17! mb-4`}
    }
  `,
  showIcon: css`
    & .icon {
      ${tw`block! static`}
    }
  `,
  itemExpanded: tw`w-6 h-6 bg-transparent hover:bg-neut-13 active:bg-neut-12 border border-neut-13 hover:border-neut-13 active:border-neut-12 rounded-[1px] cursor-pointer`,
}

interface IMonitorModalProps {
  onCancel: () => void
}

const MonitorModal = observer((props: IMonitorModalProps) => {
  useIcon(icons)
  const { set, jobDetail: { spaceId, jobId, jobName, regionId } = {} } =
    useAlertStore()
  const { onCancel } = props
  const { data, isFetching } = useQueryListAlertPoliciesByJob({
    uri: {
      space_id: spaceId,
      job_id: jobId,
    },
    regionId,
  } as any)

  const { mutateAsync, isLoading } = useMutationAlert(
    {},
    getQueryKeyListAlertPoliciesByJob
  )

  const arr = data?.infos ?? []
  const defaultKeys = Array.from({ length: arr.length }, (v, k) => k.toString())
  const [activeKeys, setActiveKeys] = useState(defaultKeys)
  return (
    <Modal
      orient="fullright"
      visible
      appendToBody
      title={`作业：${jobName} 告警策略`}
      width={800}
      onCancel={onCancel}
      onOk={onCancel}
    >
      <ModalContent>
        <Alert
          message={
            <div>
              <span>告警策略对作业每个版本的所有实例生效，具体可参考：</span>
              <HelpCenterLink
                hasIcon
                isIframe={false}
                href="/manual/operation_center/monitor/alert_rules/"
              >
                告警策略文档
              </HelpCenterLink>
            </div>
          }
          type="info"
        />
        <Button
          size="large"
          tw="w-full mt-3 mb-4"
          loading={isLoading || isFetching}
          onClick={() =>
            set({ showAddMonitor: true, disabledIds: arr.map((v) => v.id) })
          }
        >
          <Icon name="add" size={14} type="light" />
          <span tw="text-xs">添加告警策略</span>
        </Button>
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
                  <Center
                    css={[collapseStyle.itemExpanded, collapseStyle.showIcon]}
                  >
                    <Icon
                      tw="block"
                      name={
                        activeKeys.includes(index.toString())
                          ? 'chevron-up'
                          : 'chevron-down'
                      }
                      size={16}
                      type="light"
                    />
                  </Center>
                  <div tw="text-2xs flex-auto ml-2">告警策略 {item.name}</div>
                  <PopConfirm
                    twChild={tw`inline-flex`}
                    content={`确定要解除告警策略 ${item.name} 的绑定吗？`}
                    onOk={() => {
                      mutateAsync({
                        op: 'unbound',
                        uri: {
                          space_id: spaceId,
                          job_id: jobId,
                        },
                        data: {
                          alert_ids: [item.id],
                        },
                        regionId,
                      })
                    }}
                  >
                    <Button
                      css={collapseStyle.showIcon}
                      size="small"
                      tw="ml-2 pr-0"
                      type="text"
                    >
                      <Icon name="close" size={14} type="light" />
                      <span tw="text-xs ml-1!">解绑</span>
                    </Button>
                  </PopConfirm>
                </div>
              }
            >
              <MonitorItem data={item} />
            </CollapseItem>
          ))}
        </Collapse>
      </ModalContent>
    </Modal>
  )
})

export default MonitorModal
