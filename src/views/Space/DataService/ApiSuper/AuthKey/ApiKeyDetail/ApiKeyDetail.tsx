import { Collapse, Icon, Tabs } from '@QCFE/lego-ui'
import { Card, Center, FlexBox, MoreAction, Tooltip, Confirm } from 'components'
import tw, { css } from 'twin.macro'
import { Button, Loading, Notification as Notify } from '@QCFE/qingcloud-portal-ui'

import { useState } from 'react'
import {
  useQueryListAuthKeys,
  useMutationListApiServices,
  useMutationAuthKey,
  getQueryKeyListApiServices
} from 'hooks'
import { get } from 'lodash-es'
import { PbmodelAuthKeyEntity } from 'types/types'

import { useParams, useHistory } from 'react-router-dom'
import { formatDate } from 'utils'
import { useQueryClient } from 'react-query'
import { ApiKeyDetailActions } from '../../constants'
import { HorizonTabs, GridItem, Circle, CopyTextWrapper, Root } from '../../styles'
import BindApiTable from './BindApiTable'
import SelectApiServiceModal from './SelectApiServiceModal'
import AuthKeyModal from '../AuthKeyModal'

const { CollapsePanel } = Collapse

const { TabPanel } = Tabs as any

const ApiServiceDetail = (props: { id: string }) => {
  const { id } = props

  const { spaceId, regionId } = useParams<{ spaceId: string; regionId: string }>()
  const history = useHistory()

  const [isOpen, setOpen] = useState(true)
  const [isDeleteKey, setIsDeleteKey] = useState<boolean>(false)
  const [infos, setInfos] = useState<any[]>([])
  const [curOp, setCurOp] = useState<string>()

  const { isLoading, data } = useQueryListAuthKeys({
    uri: { space_id: spaceId },
    params: { ids: [id] } as any
  })
  const detail: PbmodelAuthKeyEntity = get(data, 'entities[0]')

  const mutation = useMutationListApiServices()
  const authMutation = useMutationAuthKey()
  const queryClient = useQueryClient()

  const refetchData = () => {
    queryClient.invalidateQueries(getQueryKeyListApiServices())
  }

  const handleCancel = () => {
    refetchData()
    setCurOp('')
  }

  const handleConfirmOK = () => {
    const paramsData = {
      option: 'delete' as any,
      id: detail?.id
    }
    authMutation.mutate(paramsData, {
      onSuccess: (res) => {
        if (res.ret_code === 0) {
          Notify.success({
            title: '操作提示',
            content: '删除密钥成功',
            placement: 'bottomRight'
          })
          handleCancel()
          // 回退到列表
          history.push(`/${regionId}/workspace/${spaceId}/dts/authKey`)
        }
      }
    })
  }

  const handleAction = (row: PbmodelAuthKeyEntity, key: string) => {
    setCurOp(key)
    if (['delete', 'bingKey'].includes(key)) {
      mutation.mutate(
        { auth_key_id: row.id },
        {
          onSuccess: (source) => {
            const entities = get(source, 'entities', []) || []
            setInfos(entities)
            setIsDeleteKey(entities.length === 0)
          }
        }
      )
    }
  }

  return (
    <Root tw="relative">
      <FlexBox tw="items-center gap-2">
        <Tooltip
          theme="light"
          content="返回"
          hasPadding
          placement="bottom"
          twChild={tw`inline-flex`}
        >
          <div
            tw="inline-flex items-center justify-center w-6 h-6 rounded-full"
            onClick={() => {
              history.goBack()
            }}
          >
            <Icon
              name="previous"
              size={20}
              type="light"
              css={css`
                svg.qicon {
                  ${tw`text-[#939EA9]! fill-[#939EA9]!`}
                }
              `}
            />
          </div>
        </Tooltip>
        <CopyTextWrapper text={`密钥名称 ${detail?.name}`} theme="light" />
      </FlexBox>
      <Card hasBoxShadow tw="bg-neut-16 relative">
        {isLoading && (
          <div tw="absolute inset-0 z-50">
            <Loading size="large" />
          </div>
        )}
        <div tw="flex justify-between items-center px-4 h-[72px]">
          <Center tw="flex-auto">
            <Circle tw="w-10! h-10!">
              <Icon
                name="q-kmsFill"
                type="light"
                size={28}
                css={css`
                  & .qicon {
                    ${tw`text-white! fill-[#fff]! `}
                  }
                `}
              />
            </Circle>
            <div tw="flex-auto">
              <div tw="text-white">
                <span tw="mr-3">{detail?.name}</span>
              </div>
            </div>
          </Center>
          <FlexBox tw="gap-4">
            <MoreAction
              items={ApiKeyDetailActions.map((i) => ({
                ...i,
                value: detail
              }))}
              type="button"
              buttonText="更多操作"
              placement="bottom-start"
              onMenuClick={handleAction}
            />

            <Button
              type="icon"
              onClick={() => {
                setOpen(!isOpen)
              }}
              tw="bg-transparent border dark:border-line-dark! focus:bg-line-dark! active:bg-line-dark! hover:bg-line-dark!"
            >
              <Icon
                name={!isOpen ? 'chevron-down' : 'chevron-up'}
                type="light"
                tw="bg-transparent! hover:bg-transparent!"
                size={16}
              />
            </Button>
          </FlexBox>
        </div>
        <CollapsePanel visible={isOpen} tw="bg-transparent">
          <div tw="flex-auto grid grid-cols-3 border-t border-neut-15 py-3">
            <GridItem labelWidth={40}>
              <span>密钥:</span>
              <span>{detail?.secret_key}</span>
            </GridItem>
            <GridItem labelWidth={60}>
              <span>创建时间:</span>
              <span>{formatDate(detail?.create_time)}</span>
            </GridItem>
          </div>
        </CollapsePanel>
      </Card>

      <HorizonTabs defaultActiveName="" tw="bg-transparent" activeName="api">
        <TabPanel label="已绑定API服务" name="api">
          <BindApiTable authKey={detail} />
        </TabPanel>
      </HorizonTabs>
      {(curOp === 'create' || curOp === 'update') && (
        <AuthKeyModal curOp={curOp} curAuthRow={detail} onCancel={handleCancel} />
      )}
      {curOp === 'bingKey' && !mutation.isLoading && (
        <SelectApiServiceModal curAuthRow={detail} infos={infos} onCancel={handleCancel} />
      )}
      {curOp === 'delete' && !mutation.isLoading && (
        <Confirm
          title={`${isDeleteKey ? '删除密钥：' : '不可删除密钥：'}密钥名称 ${detail?.name}`}
          visible
          css={css`
            .modal-card-head {
              ${tw`border-0`}
            }
          `}
          type="warn"
          width={400}
          maskClosable={false}
          appendToBody
          draggable
          onCancel={handleCancel}
          footer={
            <div tw="flex justify-end space-x-2">
              <Button onClick={() => handleCancel()} type={isDeleteKey ? 'default' : 'primary'}>
                {isDeleteKey ? '取消' : '确定'}
              </Button>
              {isDeleteKey && (
                <Button type="danger" onClick={handleConfirmOK}>
                  删除
                </Button>
              )}
            </div>
          }
        >
          <div>
            {isDeleteKey ? (
              `删除后不可恢复，确认删除密钥名称 ${detail?.name}?`
            ) : (
              <div>
                删除密钥 {detail?.name} 需先移除所有
                <span> 绑定的 API服务组</span>
              </div>
            )}
          </div>
        </Confirm>
      )}
    </Root>
  )
}

export default ApiServiceDetail
