import { get, isEmpty } from 'lodash-es'
import { ButtonWithClearField } from 'components/ButtonWithClear'
import { AffixLabel } from 'components/AffixLabel'
import { PopConfirm } from 'components/PopConfirm'
import { Icon } from '@QCFE/lego-ui'
import { useLayoutEffect, useRef, useState } from 'react'
import {
  baseSource$,
  baseTarget$,
  confColumns$,
  syncJobOp$,
} from 'views/Space/Dm/RealTime/Sync/common/subjects'
import tw, { css } from 'twin.macro'
import { useQuerySourceTables } from 'hooks'
import { Center, HelpCenterLink, SelectWithRefresh } from 'components'
import { pairwise } from 'rxjs'
import { filter } from 'rxjs/operators'

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

interface IBaseConfigCommonProps {
  from: 'source' | 'target'
  sourceType: string
}

const BaseConfigCommon = (props: IBaseConfigCommonProps) => {
  const { from, sourceType } = props

  const obRef = useRef(from === 'source' ? baseSource$ : baseTarget$)

  const [dbInfo, setDbInfo] = useState<Record<string, any> | null>()

  const sourceTablesRet = useQuerySourceTables(
    { sourceId: dbInfo?.id },
    { enabled: !!dbInfo?.id && from === 'source' }
  )

  const targetTablesRet = useQuerySourceTables(
    { sourceId: dbInfo?.id },
    { enabled: !!dbInfo?.id && from === 'target' }
  )

  const handleClick = () => {
    syncJobOp$.next({ op: from, visible: true })
  }

  const handleClear = () => {
    const data = obRef.current.getValue()
    obRef.current.next({ ...data, data: null })
  }

  useLayoutEffect(() => {
    const unSub = obRef.current
      .pipe(
        pairwise(),
        filter(([perv, next]) => {
          if (!perv || !next || !perv.data || !next.data) {
            return true
          }

          if (
            next &&
            next.data &&
            next.data.id &&
            next.data.tableName &&
            (next.data.id !== perv?.data.id ||
              next.data.tableName !== perv?.data.tableName)
          ) {
            return true
          }
          return false
        })
      )
      .subscribe(([, e]) => {
        setDbInfo(e?.data)
      })
    return () => {
      if (unSub) {
        unSub.unsubscribe()
      }
    }
  }, [])

  const handleTableChange = (e: string) => {
    const data = obRef.current.getValue()
    obRef.current.next({
      ...data,
      data: { ...(data?.data ?? {}), tableName: e },
    })
    confColumns$.next([])
  }

  const isSelected = !isEmpty(dbInfo)
  const tablesRet = from === 'source' ? sourceTablesRet : targetTablesRet
  const tables = (get(tablesRet, 'data.items', []) || []) as string[]
  return (
    <>
      <ButtonWithClearField
        name="source"
        placeholder="选择数据来源"
        css={css`
          .help {
            width: 100%;
          }
        `}
        label={<AffixLabel>数据源</AffixLabel>}
        help={
          isSelected &&
          dbInfo?.networkId && (
            <div>网络配置名称（ID：{dbInfo?.networkId}）</div>
          )
        }
        popConfirm={
          <PopConfirm
            type="warning"
            content="移除数据源会清空所数据源表、条件参数配置、字段映射等所有信息，请确认是否移除？"
          />
        }
        icon={
          <Icon
            name="blockchain"
            size={16}
            color={{ secondary: 'rgba(255,255,255,0.4)' }}
          />
        }
        value={dbInfo?.id}
        validateOnChange
        clearable={isSelected}
        onClick={() => handleClick()}
        onClear={() => handleClear()}
        schemas={[
          {
            help: '请选择数据来源',
            status: 'error',
            rule: (v?: string) => !!v,
          },
        ]}
      >
        <Center tw="space-x-1">
          <span tw="ml-1">{dbInfo?.name}</span>
          <span tw="text-neut-8">(ID:{dbInfo?.id})</span>
        </Center>
      </ButtonWithClearField>
      {isSelected && (
        <SelectWithRefresh
          css={styles.tableSelect}
          name="table"
          label={<AffixLabel>数据源表</AffixLabel>}
          options={tables.map((tabName) => ({
            label: tabName,
            value: tabName,
          }))}
          isLoading={tablesRet.isFetching}
          clearable={false}
          onRefresh={() => {
            tablesRet.refetch()
          }}
          onChange={(v: string) => {
            handleTableChange(v)
          }}
          validateOnChange
          value={dbInfo?.tableName}
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
              {from === 'source'
                ? `${sourceType} Source `
                : `${sourceType} Sink `}
              配置文档
            </HelpCenterLink>
          }
        />
      )}
    </>
  )
}

export default BaseConfigCommon
