import { useRef, useEffect } from 'react'
import { DargTable, ResizeModal, ModalContent } from 'components'
import { observer } from 'mobx-react-lite'
import { useStore, DataServiceManageDescribeApiConfig, useMutationUpdateApiConfig } from 'hooks'
import { Button, Input, Select } from '@QCFE/lego-ui'
import { useColumns } from 'hooks/useHooks/useColumns'
import { MappingKey } from 'utils/types'
import { useImmer } from 'use-immer'
import tw, { css } from 'twin.macro'
import { cloneDeep, get } from 'lodash-es'
import { RequestSettingColumns, serviceDevRequestSettingMapping } from '../constants'

type DataSourceProp = DataServiceManageDescribeApiConfig['request_params']
export interface JobModalData {
  id: string
  pid: string
  type: number
  isEdit: boolean
  pNode?: Record<string, any>
}
const dataServiceDataSettingKey = 'DATA_SERVICE_DATA__REQUEST'
const getName = (name: MappingKey<typeof serviceDevRequestSettingMapping>) =>
  serviceDevRequestSettingMapping.get(name)!.apiField

const styles = {
  table: css`
    .darg-table-body {
      .group {
        ${tw` bg-neut-17! hover:bg-neut-16!`}
      }
    }
  `
}

export const JobModal = observer(() => {
  const modal = useRef(null)

  const [dataSource, setDataSource] = useImmer<DataSourceProp>([])

  const {
    dtsDevStore: { apiConfigData },
    dtsDevStore
  } = useStore()

  const mutation = useMutationUpdateApiConfig()

  useEffect(() => {
    if (apiConfigData) {
      const data = cloneDeep(get(apiConfigData, 'request_params', []))
      setDataSource(data)
    }
  }, [apiConfigData, setDataSource])

  const onClose = () => {
    dtsDevStore.set({ showRequestSetting: false })
  }

  const handleOK = () => {
    mutation.mutate(
      {
        apiId: get(apiConfigData, 'api_id') as string,
        wizardDetails: {
          request_params: dataSource
        }
      },
      {
        onSuccess: () => {
          onClose()
        }
      }
    )
  }

  const renderColumns = {
    [getName('param_name')]: {
      width: 140,
      render: (text: string) => <Input value={text} />
    },
    [getName('is_required')]: {
      width: 50,
      title: '必填',
      checkbox: true,
      onSelect: (checked: boolean, record: any, index: number) => {
        setDataSource((draft) => {
          draft[index].is_required = checked
        })
      },
      onAllSelect: (checked: boolean) => {
        setDataSource((draft) => {
          draft.forEach((item) => {
            item.is_required = checked
          })
        })
      }
    },
    [getName('param_operator')]: {
      render: (text: string) => <Input value={text} />
    },
    [getName('param_position')]: {
      width: 100,
      render: (text: string) => <Select value={text} />
    },
    [getName('example_value')]: {
      render: (text: string) => <Input value={text} />
    },
    [getName('default_value')]: {
      render: (text: string) => <Input value={text} />
    },
    [getName('param_description')]: {
      render: (text: string) => <Input value={text} />
    }
  }

  const { columns } = useColumns(
    dataServiceDataSettingKey,
    RequestSettingColumns,
    renderColumns as any
  )

  return (
    <ResizeModal
      orient="fullright"
      ref={modal}
      visible
      maxWidth={1500}
      enableResizing={{ left: true }}
      title="请求参数设置"
      width={1200}
      onCancel={onClose}
      footer={
        <div tw="flex justify-end space-x-2">
          <Button onClick={onClose}>取消</Button>
          <Button type="primary" onClick={handleOK}>
            保存
          </Button>
        </div>
      }
    >
      <ModalContent css={styles.table}>
        <DargTable
          columns={columns as unknown as any}
          runDarg={false}
          dataSource={dataSource}
          rowKey="key"
        />
      </ModalContent>
    </ResizeModal>
  )
})

export default JobModal
