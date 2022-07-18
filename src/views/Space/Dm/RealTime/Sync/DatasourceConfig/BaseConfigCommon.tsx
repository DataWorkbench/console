import { isEmpty } from 'lodash-es'
import { ButtonWithClearField } from 'components/ButtonWithClear'
import { AffixLabel } from 'components/AffixLabel'
import { PopConfirm } from 'components/PopConfirm'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import { useLayoutEffect, useRef, useState } from 'react'
import { source$, syncJobOp$, target$ } from 'views/Space/Dm/RealTime/Sync/common/subjects'
import { css } from 'twin.macro'
import { Center } from 'components'
import { pairwise } from 'rxjs'
import { filter } from 'rxjs/operators'

interface IBaseConfigCommonProps {
  from: 'source' | 'target'
}

const BaseConfigCommon = (props: IBaseConfigCommonProps) => {
  const { from } = props

  const obRef = useRef(from === 'source' ? source$ : target$)

  const [dbInfo, setDbInfo] = useState<Record<string, any> | null>()

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
          if (next?.data?.id !== perv?.data?.id) {
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

  const isSelected = !isEmpty(dbInfo)
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
        help={isSelected && dbInfo?.networkId && <div>网络配置名称（ID：{dbInfo?.networkId}）</div>}
        popConfirm={
          <PopConfirm
            type="warning"
            content="移除数据源会清空所数据源表、条件参数配置、字段映射等所有信息，请确认是否移除？"
          />
        }
        icon={<Icon name="blockchain" size={16} color={{ secondary: 'rgba(255,255,255,0.4)' }} />}
        value={dbInfo?.id}
        validateOnChange
        clearable={isSelected}
        onClick={() => handleClick()}
        onClear={() => handleClear()}
        schemas={[
          {
            help: '请选择数据来源',
            status: 'error',
            rule: (v?: string) => !!v
          }
        ]}
      >
        <Center tw="space-x-1">
          <span tw="ml-1">{dbInfo?.name}</span>
          <span tw="text-neut-8">(ID:{dbInfo?.id})</span>
        </Center>
      </ButtonWithClearField>
    </>
  )
}

export default BaseConfigCommon
