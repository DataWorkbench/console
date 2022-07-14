/* eslint-disable no-underscore-dangle */
import {
  FlexBox,
  Icons,
  Modal,
  ModalContent,
  Center,
  SelectTreeTable,
} from 'components'
import { useColumns } from 'hooks/useHooks/useColumns'
import { jobColumns } from 'views/Space/Ops/Alert/common/constants'
import { jobFieldMapping, Mapping } from 'views/Space/Ops/Alert/common/mapping'
import dayjs from 'dayjs'

import { get, isEqual } from 'lodash-es'
import { memo, useEffect, useMemo, useState } from 'react'
import { useFetchJob } from 'hooks'
import { Icon } from '@QCFE/qingcloud-portal-ui'

type MappingKey<T> = T extends Mapping<infer U> ? U : never
const getName = (name: MappingKey<typeof jobFieldMapping>) =>
  jobFieldMapping.get(name)!.apiField

const jobSelectModalSetting = 'JOB_SELECT_MODAL'

interface IJobSelectProps {
  onCancel: () => void
  type: 1 | 2 // 1 实时计算 2 离线同步
  value: string[]
  onOk: (values: string[]) => void
}

const roots = {
  2: {
    id: 'root',
    name: '数据集成',
    key: 'root',
    pid: 'di-root',
    jobMode: 'DI',
    title: '数据集成',
    is_directory: true,
    children: [],
  },
  1: {
    id: 'root',
    name: '数据开发',
    key: 'root',
    pid: 'rt-root',
    jobMode: 'RT',
    title: '数据开发',
    is_directory: true,
    children: [],
  },
}

const Item = ({
  id,
  onDelete,
}: {
  id: string
  onDelete: (s: string) => void
}) => {
  return (
    <Center tw="gap-3 h-6 bg-neut-13 px-2">
      <span tw="text-white">{`ID: ${id}`}</span>
      <Icon
        clickable
        onClick={() => onDelete(id)}
        name="if-close"
        size={16}
        type="light"
      />
    </Center>
  )
}

const JobSelectModal = (props: IJobSelectProps) => {
  const { onCancel, type, value: valueProp, onOk } = props

  const [value, setValue] = useState<string[]>(valueProp ?? [])

  useEffect(() => {
    const v = valueProp ?? []
    if (!isEqual(value, v)) {
      setValue(v)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue, valueProp])

  const fetchJob = useFetchJob()

  const fetchJobTreeData = (key: string) => {
    let pid = key
    if (key === 'root') {
      pid = ''
    }
    return fetchJob(type === 2 ? 'sync' : 'stream', {
      pid,
    }).then((res) => {
      return (get(res, 'infos') || []).map((i: Record<string, any>) => {
        return {
          ...i,
          isSelected: value.includes(i.id),
        }
      })
    })
  }

  const root = useMemo(() => [roots[type]], [type])

  const columnsRender = {
    [getName('name')]: {
      render: (text: string, record: Record<string, any>) => {
        if (record.__level === 1 && type === 2) {
          return (
            <FlexBox tw="items-center gap-2">
              <Center tw="bg-blue-10 rounded-sm  w-4 h-4">
                <Icons name="EqualizerFill" size={12} />
              </Center>
              {text}
            </FlexBox>
          )
        }
        if (record.__level === 1 && type === 1) {
          return (
            <FlexBox tw="items-center gap-2">
              <Center tw="bg-green-11 rounded-sm  w-4 h-4">
                <Icons name="EventFill" size={12} />
              </Center>
              {text}
            </FlexBox>
          )
        }

        if (!record.is_directory) {
          return (
            <FlexBox tw="items-center gap-2 text-[#fffc]">
              <Center tw="bg-[#fff3] rounded-sm  w-4 h-4">
                <Icons name="DownloadBoxFill" tw="text-white" size={14} />
              </Center>
              {text}
            </FlexBox>
          )
        }
        return (
          <FlexBox tw="items-center gap-2">
            <Center tw="bg-[rgba(255, 209, 39, 0.2)] rounded-sm  w-4 h-4">
              <Icons name="FolderFill" size={12} tw="text-[#FFD127]" />
            </Center>
            {text}
          </FlexBox>
        )
      },
    },
    [getName('ID')]: {
      render: (text: string) => <span tw="text-neut-8">{text}</span>,
    },
    [getName('description')]: {
      render: (text: string) => <span tw="text-neut-8">{text}</span>,
    },
    [getName('last_update_time')]: {
      render: (d: number) =>
        d && (
          <span tw="text-neut-8">
            {dayjs(d * 1000).format('YYYY-MM-DD HH:mm:ss')}
          </span>
        ),
    },
  }

  const { columns } = useColumns(
    jobSelectModalSetting,
    jobColumns,
    columnsRender as any
  )

  const renderList = () => {
    if (!value.length) {
      return null
    }
    return (
      <FlexBox tw="gap-4 mb-2 ">
        <div tw="flex-none leading-6">已选作业: </div>
        <FlexBox tw="flex-wrap gap-1">
          {value.map((v) => (
            <Item
              key={v}
              id={v.toString()}
              onDelete={(id) => {
                setValue(value.filter((vv: string) => vv !== id))
              }}
            />
          ))}
        </FlexBox>
      </FlexBox>
    )
  }

  return (
    <Modal
      visible
      width={1200}
      onOk={() => {
        onOk(value)
      }}
      onCancel={onCancel}
      title="绑定数据集成作业"
      appendToBody
    >
      <ModalContent>
        <>
          {renderList()}
          <SelectTreeTable
            onChecked={(id, checked) => {
              setValue((v) => {
                if (checked) {
                  return [...v, id]
                }
                return v.filter((vv) => vv !== id)
              })
            }}
            checkedKeys={value}
            columns={columns}
            dataSource={root}
            rowKey="id"
            selectedLevel={10}
            showItemCheckboxFn={(record) => {
              return !record.is_directory
            }}
            showItemOpenFn={(record) => {
              return !!record.is_directory
            }}
            getChildren={fetchJobTreeData}
          />
        </>
      </ModalContent>
    </Modal>
  )
}

export default memo(JobSelectModal)
