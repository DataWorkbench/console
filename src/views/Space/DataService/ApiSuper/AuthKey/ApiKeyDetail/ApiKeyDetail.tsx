import { Collapse, Icon, Tabs } from '@QCFE/lego-ui'
import { Card, Center, FlexBox, MoreAction, Tooltip } from 'components'
import tw, { css } from 'twin.macro'
import { Button, Loading } from '@QCFE/qingcloud-portal-ui'
import { useState } from 'react'
import { useQueryListAuthKeys } from 'hooks'
import { get } from 'lodash-es'
import { PbmodelAuthKeyEntity } from 'types/types'

import dayjs from 'dayjs'
import { useParams } from 'react-router-dom'
import { ApiKeyDetailActions } from '../../constants'
import { HorizonTabs, GridItem, Circle, CopyTextWrapper, Root } from '../../styles'
import BindApiTable from './BindApiTable'

const { CollapsePanel } = Collapse

const { TabPanel } = Tabs as any

const ApiServiceDetail = (props: { id: string }) => {
  const { id } = props

  const { spaceId } = useParams<{ spaceId: string }>()

  const [isOpen, setOpen] = useState(true)

  const { isLoading, data } = useQueryListAuthKeys({
    uri: { space_id: spaceId },
    data: { ids: [id] } as any
  })

  const detail: PbmodelAuthKeyEntity = get(data, 'entities[0]')

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
          <div tw="inline-flex items-center justify-center w-6 h-6 rounded-full">
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
                name="q-downloadBoxFill"
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
                value: '2'
              }))}
              type="button"
              buttonText="更多操作"
              placement="bottom-start"
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
              <span>{dayjs(detail?.create_time).format('YYYY-MM-DD HH:mm:ss')}</span>
            </GridItem>
          </div>
        </CollapsePanel>
      </Card>

      <HorizonTabs defaultActiveName="" tw="bg-transparent" activeName="api">
        <TabPanel label="已绑定API服务" name="api">
          <BindApiTable authKey={detail} />
        </TabPanel>
      </HorizonTabs>
    </Root>
  )
}

export default ApiServiceDetail
