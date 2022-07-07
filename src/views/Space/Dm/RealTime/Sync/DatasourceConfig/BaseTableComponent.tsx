import { AffixLabel, HelpCenterLink, SelectWithRefresh } from 'components'
import tw, { css } from 'twin.macro'
import { get, isEmpty } from 'lodash-es'
import { useQuerySourceTables } from 'hooks'

const styles = {
  tableSelect: [
    tw`w-full flex-1`,
    css`
      .help {
        ${tw`w-full`}
      }
    `,
  ],
}

interface IBaseTableComponentProps {
  from: 'source' | 'target'
  sourceType: string
  sourceId: string
  tableName?: string
  onChange: (d: string) => void
}

const BaseTableComponent = (props: IBaseTableComponentProps) => {
  const { from, sourceType, sourceId, tableName, onChange } = props

  const sourceTablesRet = useQuerySourceTables(
    { sourceId },
    { enabled: !!sourceId && from === 'source' }
  )

  const targetTablesRet = useQuerySourceTables(
    { sourceId },
    { enabled: !!sourceId && from === 'target' }
  )

  const isSelected = !isEmpty(sourceId)
  const tablesRet = from === 'source' ? sourceTablesRet : targetTablesRet
  const tables = (get(tablesRet, 'data.items', []) || []) as string[]
  if (!isSelected) {
    return null
  }
  return (
    <SelectWithRefresh
      css={styles.tableSelect}
      name="table"
      label={<AffixLabel>数据源表</AffixLabel>}
      options={tables.map((tabName) => ({
        label: tabName,
        value: tabName,
      }))}
      onChange={onChange}
      isLoading={tablesRet.isFetching}
      clearable={false}
      onRefresh={() => {
        tablesRet.refetch()
      }}
      validateOnChange
      value={tableName}
      {...(!tables.length && !tablesRet.isFetching
        ? {
            validateStatus: 'error',
            validateHelp: (
              <div>
                当前数据源不可用，请前往{' '}
                <HelpCenterLink
                  hasIcon
                  isIframe={false}
                  href="/manual/source_data/add_data/"
                >
                  数据源管理
                </HelpCenterLink>{' '}
                页面配置
              </div>
            ) as any,
          }
        : {})}
      schemas={[
        {
          help: '请选择数据源表',
          status: 'error',
          rule: (v?: string) => !!v,
        },
        // todo:当前数据源不可用，请前往 [数据源管理] 页面配置
      ]}
      help={
        <HelpCenterLink
          href={`/manual/integration_job/cfg_source/
                    ${sourceType}
                  /`.toLowerCase()}
          hasIcon
          isIframe
        >
          {from === 'source' ? `${sourceType} Source ` : `${sourceType} Sink `}
          配置文档
        </HelpCenterLink>
      }
    />
  )
}

export default BaseTableComponent
