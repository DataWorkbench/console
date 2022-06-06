import tw, { css, styled } from 'twin.macro'
import { Center } from 'components/Center'
import { ArrowLine } from 'components/ArrowLine'
import { FlexBox } from 'components/Box'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import { Divider } from 'components/index'
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

enum WriteMode {
  Insert = 1,
  Replace = 2,
  Update = 3,
}

enum Semantic {
  'AtLeastOnce' = 1,
  'ExactlyOnce' = 2,
}

const DevContentDataSource = (props: Record<string, any>) => {
  const {
    dbData: { source, target },
    sourceTypeName,
    targetTypeName,
  } = props
  const [visible, setVisible] = useState(true)

  const renderSource = () => {
    return (
      <Grid tw="pt-6 px-3 pb-6">
        <div>数据源</div>
        <div>
          <FlexBox tw="items-center">
            <Icon name="blockchain" type="light" />
            <span>{source?.name}</span>
            <span tw="text-neut-8">(ID: {source?.id})</span>
          </FlexBox>
          {/* <div tw="text-neut-8">网络配置名称(ID: 12112)</div> */}
        </div>
        <div>数据源表</div>
        <div>{source?.tableName}</div>
        {Object.values(source?.tableConfig?.condition ?? {}).every(Boolean) && (
          <>
            <div>条件参数配置</div>
            <div>
              [{source?.tableConfig?.condition?.startValue || '开始条件'}] [
              {source?.tableConfig?.condition?.startCondition ?? '关系符号'}] [
              {source?.tableConfig?.condition?.column ?? '列名'}] [
              {source?.tableConfig?.condition?.endCondition ?? '关系符号'}] [
              {source?.tableConfig?.condition?.endValue || '结束条件'}]
            </div>
          </>
        )}
        {source?.tableConfig?.splitPk && (
          <>
            <div>切分键</div>
            <div>{source?.tableConfig?.splitPk ?? ''}</div>
          </>
        )}
        {source?.tableConfig?.where && (
          <>
            <div>过滤条件</div>
            <div>{source?.tableConfig?.where}</div>
          </>
        )}
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
              <span>{target?.name}</span>
              <span tw="text-neut-8">(ID: {target.id})</span>
            </FlexBox>
            {/* <div tw="text-neut-8">网络配置名称(ID: 12112)</div> */}
          </div>
          <div>数据源表</div>
          <div>{target.tableName}</div>
          <div>写入模式</div>
          <div>
            {
              [
                { label: 'insert 插入', value: WriteMode.Insert },
                { label: 'replace 替换', value: WriteMode.Replace },
                {
                  label: 'update 更新插入',
                  value: WriteMode.Update,
                },
              ].find((i) => i.value === target?.tableConfig?.writeMode)?.label
            }
          </div>
          <div>写入一致性语义</div>
          <div>
            {
              [
                {
                  label: 'exactly-once 正好一次',
                  value: Semantic.ExactlyOnce,
                },
                {
                  label: 'at-least-once 至少一次',
                  value: Semantic.AtLeastOnce,
                },
              ].find((i) => i.value === target?.tableConfig?.semantic)?.label
            }
          </div>
          <div>批量写入条数</div>
          <div>{target?.tableConfig?.batchSize}</div>
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
              {target?.tableConfig?.preSql
                ? target?.tableConfig?.preSql.map((i: string) => (
                    <div key={i}>{i}</div>
                  ))
                : '无'}
            </div>
            <div>写入后SQL语句组</div>
            <div>
              {target?.tableConfig?.postSql
                ? target?.tableConfig?.postSql.map((i: string) => (
                    <div key={i}>{i}</div>
                  ))
                : '无'}
            </div>
          </Grid>
        </CollapsePanel>
      </div>
    )
  }

  console.log(props)
  return (
    <FlexBox tw="flex-col">
      <Center tw="mb-[-15px]">
        <Center css={styles.arrowBox}>
          <Label>来源: {sourceTypeName}</Label>
          <ArrowLine />
          <Label>离线-增量</Label>
          <ArrowLine />
          <Label>目的: {targetTypeName}</Label>
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
