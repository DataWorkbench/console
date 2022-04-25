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

type MappingKey<T> = T extends Mapping<infer U> ? U : never
const getName = (name: MappingKey<typeof jobFieldMapping>) =>
  jobFieldMapping.get(name)!.apiField

const jobSelectModalSetting = 'JOB_SELECT_MODAL'

interface IJobSelectProps {
  onCancel: () => void
}

const datasource = [
  {
    id: '111',
    name: 'hahaha',
    isFileBox: Math.random() > 0.2,
    type: 1,
  },
  {
    id: '222',
    name: 'xxx',
    isFileBox: Math.random() > 0.1,
    type: 2,
  },
]
const JobSelectModal = (props: IJobSelectProps) => {
  const { onCancel } = props
  const columnsRender = {
    [getName('name')]: {
      render: (text: string, record: Record<string, any>) => {
        console.log(222, record)
        if (record.__level === 1 && record.type === 1) {
          return (
            <FlexBox tw="items-center gap-2">
              <Center tw="bg-blue-10 rounded-sm  w-4 h-4">
                <Icons name="EqualizerFill" size={12} />
              </Center>
              {text}
            </FlexBox>
          )
        }
        if (record.__level === 1 && record.type === 2) {
          return (
            <FlexBox tw="items-center gap-2">
              <Center tw="bg-green-11 rounded-sm  w-4 h-4">
                <Icons name="EventFill" size={12} />
              </Center>
              {text}
            </FlexBox>
          )
        }

        if (!record.isFileBox) {
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
            {dayjs(d * 1000).format('YYYY-MM-DD hh:ii:ss')}
          </span>
        ),
    },
  }

  const { columns } = useColumns(
    jobSelectModalSetting,
    jobColumns,
    columnsRender as any
  )
  return (
    <Modal
      visible
      width={1200}
      onOk={onCancel}
      onCancel={onCancel}
      title="绑定数据集成作业"
      appendToBody
    >
      <ModalContent>
        <SelectTreeTable
          columns={columns}
          dataSource={datasource}
          rowKey="id"
          selectedLevel={10}
          showItemCheckboxFn={(record) => {
            return !!record.isFileBox
          }}
          getChildren={async (key) => [
            {
              id: `${key}-child`,
              name: `${key}-child`,
              isFileBox: Math.random() > 0.5,
            },
            {
              id: `${key}-child2`,
              name: `${key}-child2`,
              isFileBox: Math.random() > 0.3,
            },
          ]}
        />
      </ModalContent>
    </Modal>
  )
}

export default JobSelectModal
