import tw, { css, styled } from 'twin.macro'
import { Center } from 'components/Center'
import { ArrowLine } from 'components/ArrowLine'
import { FlexBox } from 'components/Box'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import { Divider } from 'components'
import { Collapse } from '@QCFE/lego-ui'
import { useState } from 'react'

const { CollapsePanel } = Collapse
const Label = styled('div')(() => [
  tw`border border-white px-2 py-1 leading-none rounded-[3px]`,
])

const DashedLine = styled('div')(() => [
  tw`border-neut-13 border-l border-dashed my-1`,
])

const styles = {
  arrowBox: tw`space-x-2 bg-neut-17 w-[70%] z-10`,
  dashedBox: [
    tw`border border-dashed rounded-md border-neut-13 py-0 grid`,
    css`
      grid-template-columns: 50% 2px 1fr;
    `,
  ],
  dashedSplit: tw`border-neut-13 border-l border-dashed my-1`,
}

const Grid = styled('div')(() => [
  tw`grid gap-2 leading-[20px] place-content-start`,
  css`
    grid-template-columns: 96px 1fr;

    & > div:nth-of-type(2n + 1) {
      ${tw`text-neut-8`}
    }

    & > div:nth-of-type(2n) {
      ${tw`text-white`}
  `,
])
const DevContentDataSource = () => {
  const [visible, setVisible] = useState(true)

  const renderSource = () => {
    return (
      <Grid tw="pt-6 px-3 pb-6">
        <div>数据源</div>
        <div>
          <FlexBox tw="items-center">
            <Icon name="blockchain" type="light" />
            <span>Mysql</span>
            <span tw="text-neut-8">(ID: 1231)</span>
          </FlexBox>
          <div tw="text-neut-8">网络配置名称(ID: 12112)</div>
        </div>
        <div>数据源表</div>
        <div>Mysql</div>
        <div>条件参数配置</div>
        <div>{'var1 < update < var2'}</div>
        <div>切分键</div>
        <div>what ?</div>
      </Grid>
    )
  }

  const renderTarget = () => {
    return (
      <div tw="pt-6 px-3 pb-6">
        <Grid>
          <div>数据源</div>
          <div>
            <FlexBox tw="items-center">
              <Icon name="blockchain" type="light" />
              <span>Mysql</span>
              <span tw="text-neut-8">(ID: 1231)</span>
            </FlexBox>
            <div tw="text-neut-8">网络配置名称(ID: 12112)</div>
          </div>
          <div>数据源表</div>
          <div>Mysql</div>
          <div>写入模式</div>
          <div>insert</div>
          <div>写入一致性语义</div>
          <div>at-least-once</div>
          <div>批量写入条数</div>
          <div>1024</div>
        </Grid>
        <Divider tw="my-3 border-line-dark text-white">
          <Center tw="cursor-pointer" onClick={() => setVisible(!visible)}>
            <Icon
              name={visible ? 'chevron-down' : 'chevron-up'}
              type="light"
              size={16}
              tw="mr-2"
            />
            高级配置
          </Center>
        </Divider>
        <CollapsePanel tw="bg-transparent" visible={visible}>
          <Grid>
            <div>写入前SQL语句组</div>
            <div>
              <div>what’s up? (一组语句填充示意，根据实际内容显示）</div>
              <div>what’s up? (一组语句填充示意，根据实际内容显示）</div>
            </div>
            <div>写入后SQL语句组</div>
            <div>what’s up? (一组语句填充示意，根据实际内容显示）</div>
          </Grid>
        </CollapsePanel>
      </div>
    )
  }

  return (
    <FlexBox tw="flex-col">
      <Center tw="mb-[-15px]">
        <Center css={styles.arrowBox}>
          <Label>来源: Mysql</Label>
          <ArrowLine />
          <Label>离线-增量</Label>
          <ArrowLine />
          <Label>目的: Mysql</Label>
        </Center>
      </Center>
      <div css={styles.dashedBox}>
        {renderSource()}
        <DashedLine />
        {renderTarget()}
      </div>
    </FlexBox>
  )
}

export default DevContentDataSource
