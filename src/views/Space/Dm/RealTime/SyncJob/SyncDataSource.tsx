import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Icon } from '@QCFE/lego-ui'
import { Button } from '@QCFE/qingcloud-portal-ui'
import { AffixLabel, FlexBox, Center, ArrowLine } from 'components'
import tw, { styled } from 'twin.macro'
import { findKey } from 'lodash-es'
import { useStore } from 'hooks'
import DataSourceSelectModal from 'views/Space/Upcloud/DataSourceList/DataSourceSelectModal'
import { dataSourceTypes } from '../JobUtils'

const styles = {
  arrowBox: tw`space-x-2 bg-neut-17 w-[70%] z-10`,
  item: tw`flex-1 items-center pl-3`,
  dashedBox: tw`border border-dashed rounded-md border-neut-13 pt-3 h-16`,
  dashedSplit: tw`border-neut-13 border-l border-dashed my-1`,
}

const Label = styled('div')(() => [
  tw`border border-white px-2 py-1 leading-none rounded-[3px]`,
])

const SmallButton = styled(Button)(() => [tw`h-7 ml-2`])

type OriginType = 'source' | 'target'

const SyncDataSource = observer(() => {
  const [visible, setVisible] = useState<boolean | null>(null)
  const [type, setType] = useState<OriginType>('source')
  const [source, setSource] = useState(null)
  const [target, setTarget] = useState(null)
  const {
    workFlowStore: { curJob },
  } = useStore()

  const handleClick = (tp: OriginType) => {
    setType(tp)
    setVisible(true)
  }

  return (
    <FlexBox tw="flex-col">
      <Center tw="mb-[-15px]">
        <Center css={styles.arrowBox}>
          <Label>
            来源: {findKey(dataSourceTypes, (v) => v === curJob?.source_type)}
          </Label>
          <ArrowLine />
          <Label>离线-增量</Label>
          <ArrowLine />
          <Label>
            目的: {findKey(dataSourceTypes, (v) => v === curJob?.target_type)}
          </Label>
        </Center>
      </Center>
      <FlexBox css={styles.dashedBox}>
        <FlexBox css={styles.item}>
          <AffixLabel>数据源</AffixLabel>
          <SmallButton
            type="black"
            tw="ml-8"
            onClick={() => handleClick('source')}
          >
            {source ? (
              <>
                <Icon name="blockchain" />
                {source.name}
                <span tw="text-neut-8">(ID:{source.id})</span>
              </>
            ) : (
              <>
                <Icon name="blockchain" size={16} type="light" />
                选择数据来源
              </>
            )}
          </SmallButton>
          <SmallButton type="black">
            <Icon name="close" type="light" />
          </SmallButton>
        </FlexBox>
        <div css={styles.dashedSplit} />
        <FlexBox css={styles.item}>
          <AffixLabel>数据源</AffixLabel>
          <SmallButton
            type="black"
            tw="ml-8"
            onClick={() => handleClick('target')}
          >
            {target ? (
              <>
                <Icon name="blockchain" />
                {target.name}
                <span tw="text-neut-8">(ID:{target.id})</span>
              </>
            ) : (
              <>
                <Icon name="blockchain" size={16} type="light" />
                选择数据目的
              </>
            )}
          </SmallButton>
        </FlexBox>
      </FlexBox>
      <DataSourceSelectModal
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={(v: any) => {
          setVisible(false)
          if (type === 'source') {
            setSource(v)
          } else {
            setTarget(v)
          }
        }}
      />
    </FlexBox>
  )
})

export default SyncDataSource
