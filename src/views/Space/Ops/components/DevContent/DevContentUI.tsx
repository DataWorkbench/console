import tw, { css, styled } from 'twin.macro'
import { Collapse } from '@QCFE/lego-ui'
import DevContentDataSource from 'views/Space/Ops/components/DevContent/DevContentDataSource'
import { AffixLabel, FieldMappings } from 'components/index'
import { get } from 'lodash-es'
import { useImmer } from 'use-immer'
import { TMappingField } from 'components/FieldMappings/MappingItem'
import { useMemo } from 'react'
import { getDataSourceTypes } from 'views/Space/Dm/RealTime/Job/JobUtils'
import SyncDataSource from 'views/Space/Dm/RealTime/Sync/SyncDataSource'
import { nanoid } from 'nanoid'

const { CollapseItem } = Collapse

const Grid = styled('div')(() => [
  tw`grid gap-2 leading-[20px] place-content-start`,
  css`
    grid-template-columns: 140px 1fr;

    & > div:nth-of-type(2n + 1) {
      ${tw`text-neut-8`}
    }

    & > div:nth-of-type(2n) {
      ${tw`text-white`}
  `
])
const CollapseWrapper = styled('div')(() => [
  tw`flex-1 p-5 bg-neut-16`,
  css`
    li.collapse-item {
      ${tw`mb-2 rounded-[3px] overflow-hidden`}
      .collapse-transition {
        ${tw`transition-none`}
      }

      .collapse-item-label {
        ${tw`h-11 border-none `}
      }

      .collapse-item-content {
        ${tw`bg-neut-17`}
      }
      &:last-child {
        ${tw`mb-0`}
      }
    }
  `
])

const stepsData = [
  {
    key: 'p0',
    title: '选择数据源'
  },
  {
    key: 'p1',
    title: '字段映射',
    desc: null
  },

  {
    key: 'p2',
    title: '通道控制'
  }
]

const styles = {
  stepTag: tw`flex items-center text-left border border-green-11 rounded-r-2xl pr-4 mr-3 h-7 leading-5`,
  stepNum: tw`inline-block text-white bg-green-11 w-5 h-5 text-center rounded-full -ml-2.5`,
  stepText: tw`ml-2 inline-block border-green-11 text-green-11`
}

interface IProps {
  data?: Record<string, any>
  curJob?: Record<string, any>
}

const DevContentUI = (props: IProps) => {
  const { data: confData = {}, curJob = {} } = props
  const { channel_control: channel } = confData

  const [db, setDb] = useImmer<{
    source: Record<string, any>
    target: Record<string, any>
  }>({
    source: { id: get(confData, 'source_id') },
    target: { id: get(confData, 'target_id') }
  })

  const [sourceTypeName, targetTypeName] = useMemo(() => {
    const sourceType = curJob?.source_type
    const targetType = curJob?.target_type
    return [getDataSourceTypes(sourceType), getDataSourceTypes(targetType)]
  }, [curJob])

  const sourceColumn = useMemo(() => {
    if (confData && db.source.tableName && sourceTypeName) {
      const source = get(confData, `sync_resource.${sourceTypeName?.toLowerCase()}_source`)
      const table = get(source, 'table[0]')
      if (source && table === db.source.tableName) {
        return get(source, 'column')
      }
    }
    return []
  }, [confData, sourceTypeName, db.source.tableName])

  const targetColumn = useMemo(() => {
    if (confData && db.target.tableName && targetTypeName) {
      const source = get(confData, `sync_resource.${targetTypeName?.toLowerCase()}_target`)
      const table = get(source, 'table[0]')
      if (source && table === db.target.tableName) {
        return get(source, 'column')
      }
    }
    return []
  }, [confData, targetTypeName, db.target.tableName])
  return (
    <CollapseWrapper>
      <Collapse defaultActiveKey={stepsData.map((step) => step.key)}>
        {stepsData.map(({ key, title, desc }, index) => (
          <CollapseItem
            key={key}
            label={
              <>
                <div css={styles.stepTag}>
                  <span css={styles.stepNum}>{index + 1}</span>
                  <span css={styles.stepText}>{title}</span>
                </div>
                <div tw="text-neut-13">{desc}</div>
              </>
            }
          >
            {index === 0 && (
              <DevContentDataSource
                dbData={db}
                curJob={curJob}
                sourceTypeName={sourceTypeName}
                targetTypeName={targetTypeName}
              />
            )}
            {index === 1 && (
              <div tw="relative">
                <div tw="absolute invisible">
                  <SyncDataSource
                    curJob={curJob}
                    onSelectTable={(tp, tableName, data, table) => {
                      const fieldData = data.map((field) => ({
                        ...field,
                        uuid: nanoid()
                      })) as TMappingField[]
                      setDb((draft) => {
                        const sourceInfo = draft[tp]
                        sourceInfo.tableName = tableName
                        sourceInfo.fields = fieldData
                        sourceInfo.tableConfig = table
                      })
                    }}
                    onDbChange={(tp: 'source' | 'target', data) => {
                      setDb((draft) => {
                        draft[tp] = data
                      })
                    }}
                    conf={confData}
                  />
                </div>
                <div tw="absolute inset-0 z-50" />
                <FieldMappings
                  leftFields={db.source.fields || []}
                  rightFields={db.target.fields || []}
                  leftTypeName={sourceTypeName}
                  // rightTypeName={targetTypeName}
                  columns={[sourceColumn, targetColumn]}
                  readonly
                  hasHeader={false}
                />
              </div>
            )}
            {index === 2 && (
              <div>
                <Grid>
                  <div>
                    <AffixLabel theme="green" required={false}>
                      作业期望最大并行数
                    </AffixLabel>
                  </div>
                  <div>{channel.parallelism || ''}</div>
                  <div>
                    <AffixLabel theme="green" required={false}>
                      同步速率
                    </AffixLabel>
                  </div>
                  <div>{(channel.rate as 1) === 1 ? `限流 ${channel.bytes} Byte/s` : '不限流'}</div>
                  <div>
                    <AffixLabel theme="light" required={false}>
                      错误记录数超过
                    </AffixLabel>
                  </div>

                  <div>{channel.record_num ?? ''} 条，任务自动结束</div>
                </Grid>
              </div>
            )}
          </CollapseItem>
        ))}
      </Collapse>
    </CollapseWrapper>
  )
}

export default DevContentUI
