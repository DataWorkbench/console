import { Collapse, Icon, Tabs } from '@QCFE/lego-ui'
import { Card, Center, FlexBox, Tooltip } from 'components'
import tw, { css } from 'twin.macro'
import { Button, Loading } from '@QCFE/qingcloud-portal-ui'
import { useState } from 'react'
import { useQueryListApiServices } from 'hooks'
import { get } from 'lodash-es'
import { PbmodelApiServiceEntity } from 'types/types'
import { useLocation, useParams, useHistory } from 'react-router-dom'
import qs from 'qs'
import { formatDate } from 'utils'
import { HorizonTabs, GridItem, Circle, CopyTextWrapper, Root } from '../../styles'
import ApiRouterTable from '../../ApiRouters/ApiRoutersTable'
import AuthKeyTable from './AuthKeyTable'

const { CollapsePanel } = Collapse

const { TabPanel } = Tabs as any

const ApiServiceDetail = (props: { id: string }) => {
  const { id } = props

  const { spaceId } = useParams<{ spaceId: string }>()
  const history = useHistory()
  const { search } = useLocation()
  const { tab = 'api' } = qs.parse(search.slice(1))

  const [isOpen, setOpen] = useState(true)
  const [activeName, setActiveName] = useState<string>(tab as string)

  const { isLoading, data } = useQueryListApiServices({
    uri: { space_id: spaceId },
    params: { ids: [id] } as any
  })

  const detail: PbmodelApiServiceEntity = get(data, 'entities[0]')

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
        <CopyTextWrapper text={`${detail?.name}(ID: ${detail?.id})`} theme="light" />
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
                name="q-apps3Duotone"
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
              <div tw="text-neut-8">{detail?.id}</div>
            </div>
          </Center>
          <FlexBox tw="gap-4">
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
            <GridItem labelWidth={60}>
              <span>域名:</span>
              <span>{detail?.id}</span>
              <span>路径:</span>
              <span>{detail?.pre_path}</span>
            </GridItem>
            <GridItem labelWidth={100}>
              <span>最新更新时间:</span>
              <span>{formatDate(detail?.update_time)}</span>
              <span>描述:</span>
              <span>{detail?.desc}</span>
            </GridItem>
          </div>
        </CollapsePanel>
      </Card>

      <HorizonTabs
        defaultActiveName=""
        tw="bg-transparent"
        activeName={activeName}
        onChange={(acName: string) => {
          setActiveName(acName)
        }}
        css={css`
          .tab-content {
            ${tw`p-0`}
          }
        `}
      >
        <TabPanel label="已发布 API" name="api" tw="pt-5">
          <ApiRouterTable apiServiceId={detail?.id} />
        </TabPanel>
        <TabPanel label="已绑定密钥" name="authKey" tw="mt-5">
          <AuthKeyTable authKeyId={detail?.auth_key_id} apiServiceId={detail?.id} />
        </TabPanel>
      </HorizonTabs>
    </Root>
  )
}

export default ApiServiceDetail
